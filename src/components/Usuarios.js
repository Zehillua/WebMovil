import React, { useState } from 'react';
import axios from 'axios';

function Usuarios() {
  const [texto, setTexto] = useState('');

  const manejarCambio = (event) => {
    setTexto(event.target.value);
  };

  const manejarEnvio = async () => {
    try {
      const respuesta = await axios.post('http://localhost:3000/test', { mensaje: texto });
      alert('Mensaje enviado correctamente: ' + JSON.stringify(respuesta.data));
      setTexto('');
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un error al enviar el mensaje.');
    }
  };

  return (
    <div>
      <h2>Sección de Usuarios</h2>
      <input
        type="text"
        placeholder="Ingresa tu texto aquí"
        value={texto}
        onChange={manejarCambio}
        style={{ padding: '10px', margin: '10px' }}
      />
      <button onClick={manejarEnvio} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Ingresar
      </button>
    </div>
  );
}

export default Usuarios;