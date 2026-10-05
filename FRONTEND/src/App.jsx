import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioConsulta from './components/FormularioConsulta';
import ListaConsultas from './components/ListaConsultas';
import './App.css';

function App() {
  const [consultas, setConsultas] = useState([]);

  const cargarConsultas = () => {
    axios.get('http://localhost:3000/consultas')
      .then(res => setConsultas(res.data))
      .catch(err => console.error('Error al obtener consultas:', err));
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Clínica Veterinaria</h1>
      </header>

      <FormularioConsulta onConsultaAgregada={cargarConsultas} />
      <ListaConsultas consultas={consultas} onUpdate={cargarConsultas} />
    </div>
  );
}

export default App;