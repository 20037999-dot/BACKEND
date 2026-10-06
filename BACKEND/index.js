require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


const conexion = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false }, // Permite la conexión cifrada requerida por Aiven
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/', (req, res) => {
  res.send('API de la Veterinaria funcionando correctamente en Render 🚀');
});

app.get('/consultas', (req, res) => {
  const sql = `
    SELECT 
      c.id, 
      v.nombre AS veterinario, 
      m.nombre AS mascota, 
      m.especie, 
      c.diagnostico, 
      c.precio, 
      DATE_FORMAT(c.fecha, '%Y-%m-%d') AS fecha,
      c.veterinario_id,
      c.mascota_id
    FROM consultas c
    LEFT JOIN veterinarios v ON c.veterinario_id = v.id
    LEFT JOIN mascotas m ON c.mascota_id = m.id
    ORDER BY c.id DESC
  `;

  conexion.query(sql, (err, resultados) => {
    if (err) {
      console.error('Error SQL en /consultas:', err);
      return res.status(500).json({ error: 'Error al obtener consultas', detalle: err.message });
    }
    res.json(resultados);
  });
});

// GET /veterinarios y GET /mascotas
app.get('/veterinarios', (req, res) => {
  conexion.query('SELECT * FROM veterinarios', (err, r) => {
    if (err) {
      console.error('Error SQL en /veterinarios:', err);
      return res.status(500).json({ error: 'Error al obtener veterinarios', detalle: err.message });
    }
    res.json(r);
  });
});

app.get('/mascotas', (req, res) => {
  conexion.query('SELECT * FROM mascotas', (err, r) => {
    if (err) {
      console.error('Error SQL en /mascotas:', err);
      return res.status(500).json({ error: 'Error al obtener mascotas', detalle: err.message });
    }
    res.json(r);
  });
});

// POST /consultas
app.post('/consultas', (req, res) => {
  const { veterinario_id, mascota_id, diagnostico, precio, fecha } = req.body;
  
  conexion.query(
    'INSERT INTO consultas (veterinario_id, mascota_id, diagnostico, precio, fecha) VALUES (?, ?, ?, ?, ?)',
    [veterinario_id, mascota_id, diagnostico, precio, fecha],
    (err, result) => {
      if (err) {
        console.error('Error SQL al registrar consulta:', err);
        return res.status(500).json({ error: 'Error al registrar consulta', detalle: err.message });
      }
      res.status(201).json({ message: 'Consulta registrada correctamente', id: result.insertId });
    }
  );
});

// PUT /consultas/:id (Actualizar consulta)
app.put('/consultas/:id', (req, res) => {
  const id = req.params.id;
  const { veterinario_id, mascota_id, diagnostico, precio, fecha } = req.body;

  conexion.query(
    'UPDATE consultas SET veterinario_id=?, mascota_id=?, diagnostico=?, precio=?, fecha=? WHERE id=?',
    [veterinario_id, mascota_id, diagnostico, precio, fecha, id],
    (err) => {
      if (err) {
        console.error('Error SQL al actualizar consulta:', err);
        return res.status(500).json({ error: 'Error al actualizar consulta', detalle: err.message });
      }
      res.json({ message: `Consulta con ID ${id} actualizada` });
    }
  );
});

// DELETE /consultas/:id (Eliminar consulta)
app.delete('/consultas/:id', (req, res) => {
  const id = req.params.id;

  conexion.query('DELETE FROM consultas WHERE id=?', [id], (err) => {
    if (err) {
      console.error('Error SQL al eliminar consulta:', err);
      return res.status(500).json({ error: 'Error al eliminar consulta', detalle: err.message });
    }
    res.json({ message: `Consulta con ID ${id} eliminada` });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});