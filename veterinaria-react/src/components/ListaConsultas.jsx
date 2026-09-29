import React, { useState } from 'react';
import axios from 'axios';
import EditarConsulta from './EditarConsulta';

function ListaConsultas({ consultas, onUpdate }) {
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);

  const manejarActualizacion = () => {
    setConsultaSeleccionada(null);
    onUpdate();
  };

  const eliminarConsulta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta consulta médica?')) {
      axios.delete(`http://localhost:3000/consultas/${id}`)
        .then(res => {
          alert(res.data.message);
          onUpdate(); // Refresca la lista desde la base de datos
        })
        .catch(err => console.error('Error al eliminar consulta:', err));
    }
  };

  return (
    <div>
      {consultaSeleccionada && (
        <EditarConsulta 
          consulta={consultaSeleccionada} 
          onUpdate={manejarActualizacion} 
          onCancel={() => setConsultaSeleccionada(null)} 
        />
      )}

      <div className="card">
        <h2>Historial de Consultas Médicas</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Veterinario</th>
                <th>Mascota</th>
                <th>Especie</th>
                <th>Diagnóstico</th>
                <th>Precio</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultas.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#a0aec0' }}>
                    No hay consultas registradas.
                  </td>
                </tr>
              ) : (
                consultas.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.veterinario}</strong></td>
                    <td>{c.mascota}</td>
                    <td>{c.especie}</td>
                    <td>{c.diagnostico}</td>
                    <td className="price-tag">${parseFloat(c.precio).toFixed(2)}</td>
                    <td>{c.fecha ? c.fecha.split('T')[0] : ''}</td>
                    <td style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => setConsultaSeleccionada(c)}
                        style={{
                          backgroundColor: '#3182ce',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => eliminarConsulta(c.id)}
                        style={{
                          backgroundColor: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListaConsultas;