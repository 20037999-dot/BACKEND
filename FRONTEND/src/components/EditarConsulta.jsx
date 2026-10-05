import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditarConsulta({ consulta, onUpdate, onCancel }) {
  // Ajustar fecha para el formato YYYY-MM-DD del input type="date"
  const fechaFormateada = consulta.fecha ? consulta.fecha.split('T')[0] : '';

  const [formData, setFormData] = useState({
    veterinario_id: consulta.veterinario_id || '',
    mascota_id: consulta.mascota_id || '',
    diagnostico: consulta.diagnostico || '',
    precio: consulta.precio || '',
    fecha: fechaFormateada
  });

  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/veterinarios')
      .then(res => setVeterinarios(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:3000/mascotas')
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
    axios.put(`http://localhost:3000/consultas/${consulta.id}`, formData)
      .then(res => {
        alert(res.data.message || 'Consulta actualizada correctamente');
        onUpdate(); // Refresca la lista y cierra el modal/formulario de edición
      })
      .catch(err => console.error('Error al actualizar consulta:', err));
  };

  return (
    <div className="card" style={{ borderColor: 'var(--primary)', borderWidth: '2px' }}>
      <h2>Editar Consulta médica (ID: {consulta.id})</h2>
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
            value={formData.diagnostico} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group full-width" style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-submit" style={{ flex: 1 }}>Guardar Cambios</button>
          <button type="button" onClick={onCancel} className="btn-submit" style={{ backgroundColor: '#e53e3e', flex: 1 }}>Cancelar</button>
        </div>

      </form>
    </div>
  );
}

export default EditarConsulta;