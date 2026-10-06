import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormularioConsulta({ onConsultaAgregada }) {
  const [formData, setFormData] = useState({
    veterinario_id: '',
    mascota_id: '',
    diagnostico: '',
    precio: '',
    fecha: ''
  });

  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    axios.get('https://veterinaria-6svw.onrender.com/veterinarios')
      .then(res => setVeterinarios(res.data))
      .catch(err => console.error(err));

    axios.get('https://veterinaria-6svw.onrender.com/mascotas')
      .then(res => setMascotas(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://veterinaria-6svw.onrender.com/consultas', formData)
      .then(res => {
        alert(res.data.message);
        setFormData({ veterinario_id: '', mascota_id: '', diagnostico: '', precio: '', fecha: '' });
        if (onConsultaAgregada) onConsultaAgregada(); // Actualiza la lista si se pasa la prop
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="card">
      <h2>Registrar Nueva Consulta Médica</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        
        <div className="form-group">
          <select name="veterinario_id" value={formData.veterinario_id} onChange={handleChange} required>
            <option value="">Seleccione Veterinario</option>
            {veterinarios.map(v => (
              <option key={v.id} value={v.id}>{v.nombre} - {v.especialidad}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select name="mascota_id" value={formData.mascota_id} onChange={handleChange} required>
            <option value="">Seleccione Mascota</option>
            {mascotas.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <input 
            type="number" 
            step="0.01" 
            name="precio" 
            placeholder="Costo ($)" 
            value={formData.precio} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <input 
            type="date" 
            name="fecha" 
            value={formData.fecha} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group full-width">
          <input 
            type="text" 
            name="diagnostico" 
            placeholder="Diagnóstico médico" 
            value={formData.diagnostico} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group full-width">
          <button type="submit" className="btn-submit">Registrar Consulta</button>
        </div>

      </form>
    </div>
  );
}

export default FormularioConsulta;