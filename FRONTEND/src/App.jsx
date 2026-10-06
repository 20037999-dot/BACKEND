import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioConsulta from './components/FormularioConsulta'; 
import ListaConsultas from './components/ListaConsultas';   

const API_URL = 'https://veterinaria-6svw.onrender.com';

function App() {
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);

 
  const cargarConsultas = () => {
    axios.get(`${API_URL}/consultas`)
      .then(res => {
        setConsultas(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al cargar consultas:', err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>Sistema de Gestión Veterinaria</h1>
      
      {/* Pasamos la función cargarConsultas al formulario para que refresque la lista al guardar */}
      <FormularioConsulta onConsultaAgregada={cargarConsultas} />

      {cargando ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Cargando consultas médicas...</p>
      ) : (
      
        <ListaConsultas consultas={consultas} onUpdate={cargarConsultas} />
      )}
    </div>
  );
}

export default App;