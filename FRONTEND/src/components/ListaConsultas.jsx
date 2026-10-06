import React, { useState } from 'react';
import axios from 'axios';
import EditarConsulta from './EditarConsulta';

function ListaConsultas({ consultas = [], onUpdate }) {
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);

  const manejarActualizacion = () => {
    setConsultaSeleccionada(null);
    onUpdate();
  };

  const eliminarConsulta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta consulta médica?')) {
      axios.delete(`https://veterinaria-6svw.onrender.com/consultas/${id}`)
        .then(res => {
          alert(res.data.message || 'Consulta eliminada con éxito');
          onUpdate(); 
        })
        .catch(err => console.error('Error al eliminar consulta:', err));
    }
  };

  const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined) return '0.00';
    const num = parseFloat(valor);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const strFecha = String(fecha);
    return strFecha.includes('T') ? strFecha.split('T')[0] : strFecha;
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
              {!consultas || consultas.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#a0aec0' }}>
                    No hay consultas registradas.
                  </td>
                </tr>
              ) : (
                consultas.map(c => {
               
                  const nombreVet = c.veterinario || c.nombre_veterinario || (c.veterinario_id ? `Vet ID: ${c.veterinario_id}` : '-');
                  const nombreMascota = c.mascota || c.nombre_mascota || (c.mascota_id ? `Mascota ID: ${c.mascota_id}` : '-');
                  const especieMascota = c.especie || c.especie_mascota || '-';
                  const diagnosticoMed = c.diagnostico || '-';

                  return (
                    <tr key={c.id}>
                      <td><strong>{nombreVet}</strong></td>
                      <td>{nombreMascota}</td>
                      <td>{especieMascota}</td>
                      <td>{diagnosticoMed}</td>
                      <td className="price-tag">${formatearPrecio(c.precio)}</td>
                      <td>{formatearFecha(c.fecha)}</td>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListaConsultas;