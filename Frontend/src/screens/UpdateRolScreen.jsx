import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


  
const UpdateRolScreen = () => {
  const [rut, setRut] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const history = useHistory();
  const handleRutChange = (event) => {
    setRut(event.target.value);
  };
  
  const handleGoBack = () => {
    history.goBack();
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
    <div> <button className='back-button' onClick={handleGoBack}> Atrás </button> 
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Actualizar Posición</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    </div>
  );
};

export default UpdateRolScreen;
