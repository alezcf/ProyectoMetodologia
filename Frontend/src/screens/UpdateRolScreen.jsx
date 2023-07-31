import React, { useState } from 'react';
import axios from 'axios';

const UpdateRolScreen = () => {
  const [rut, setRut] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRutChange = (event) => {
    setRut(event.target.value);
  };

  const handlePositionChange = (event) => {
    setJobTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.patch('http://localhost:3001/rol/cambiarposicion', {
        rut: rut,
        jobTitle: jobTitle,
      });

      if (response.data.error) {
        setError(response.data.message);
        setSuccess(null);
      } else {
        setSuccess('Posición actualizada exitosamente');
        setError(null);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error en la solicitud');
      setSuccess(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rut">Rut:</label>
          <input type="text" id="rut" value={rut} onChange={handleRutChange} />
        </div>

        <div>
          <label htmlFor="position">Nueva posición:</label>
          <input type="text" id="position" value={jobTitle} onChange={handlePositionChange} />
        </div>

        <button type="submit">Actualizar posición</button>
      </form>

      {error && <p>{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default UpdateRolScreen;
