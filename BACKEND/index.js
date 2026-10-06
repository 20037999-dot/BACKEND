require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Permite llamadas HTTP desde el frontend (React / Vercel)
// Endpoint en el backend (Node.js / Express)
app.get('/consultas', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id,
        v.nombre AS veterinario,
        m.nombre AS mascota,
        m.especie AS especie,
        c.diagnostico AS diagnostico,
        c.precio AS precio,
        DATE_FORMAT(c.fecha, '%Y-%m-%d') AS fecha
      FROM consultas c
      INNER JOIN veterinarios v ON c.veterinario_id = v.id
      INNER JOIN mascotas m ON c.mascota_id = m.id
      ORDER BY c.fecha DESC
    `;

    const [rows] = await db.query(query); // O mysqlPool.query(query)
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener consultas:", error);
    res.status(500).json({ error: "Error al obtener consultas" });
  }
});
// Pool de conexión con soporte SSL para Aiven Cloud
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
// GET /consultas (JOIN de consultas con veterinarios y mascotas)
app.get('/consultas', (req, res) => {
  const sql = `
    SELECT c.id, 
           v.nombre AS veterinario, 
           m.nombre AS mascota, 
           m.especie, 
           c.diagnostico, 
           c.precio, 
           c.fecha,
           c.veterinario_id,
           c.mascota_id
    FROM consultas c
    INNER JOIN veterinarios v ON c.veterinario_id = v.id
    INNER JOIN mascotas m ON c.mascota_id = m.id
  `;
  conexion.query(sql, (err, resultados) => {
    if (err) return res.status(500).send(err);
    res.json(resultados);
  });
});

// GET /veterinarios y GET /mascotas
app.get('/veterinarios', (req, res) => {
  conexion.query('SELECT * FROM veterinarios', (err, r) => 
    err ? res.status(500).send(err) : res.json(r)
  );
});

app.get('/mascotas', (req, res) => {
  conexion.query('SELECT * FROM mascotas', (err, r) => 
    err ? res.status(500).send(err) : res.json(r)
  );
});

// POST /consultas (Registrar nueva consulta médica)
app.post('/consultas', (req, res) => {
  const { veterinario_id, mascota_id, diagnostico, precio, fecha } = req.body;
  conexion.query(
    'INSERT INTO consultas (veterinario_id, mascota_id, diagnostico, precio, fecha) VALUES (?, ?, ?, ?, ?)',
    [veterinario_id, mascota_id, diagnostico, precio, fecha],
    (err) => err ? res.status(500).send(err) : res.send({ message: 'Consulta registrada correctamente' })
  );
});

// PUT /consultas/:id (Actualizar consulta)
app.put('/consultas/:id', (req, res) => {
  const id = req.params.id;
  const { veterinario_id, mascota_id, diagnostico, precio, fecha } = req.body;
  conexion.query(
    'UPDATE consultas SET veterinario_id=?, mascota_id=?, diagnostico=?, precio=?, fecha=? WHERE id=?',
    [veterinario_id, mascota_id, diagnostico, precio, fecha, id],
    (err) => err ? res.status(500).send(err) : res.send({ message: `Consulta con ID ${id} actualizada` })
  );
});

// DELETE /consultas/:id (Eliminar consulta)
app.delete('/consultas/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('DELETE FROM consultas WHERE id=?', [id], (err) =>
    err ? res.status(500).send(err) : res.send({ message: `Consulta con ID ${id} eliminada` })
  );
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});