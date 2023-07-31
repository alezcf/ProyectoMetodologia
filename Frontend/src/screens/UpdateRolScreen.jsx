import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../css/UpdateRolScreen.css'; 

  
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

  const handleJobTitleChange = (event) => {
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
   
    <div> <button className='back-button' onClick={handleGoBack}>Atrás</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
                style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                }}
            >
                <h2>Actualizar Posición</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                <div style={{ textAlign: 'center' }}>
                    <label htmlFor="rut">Rut:</label>
                    <input placeholder="Ingresar sin punto y guión" style={{  marginLeft: '62px' ,textAlign: 'center' }} type="text" id="rut" value={rut} onChange={handleRutChange} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <label htmlFor="jobTitle">Nuevo Cargo:</label>
                    <input placeholder="Ingresar el nuevo cargo" style={{textAlign: 'center' }} type="text" id="jobTitle" value={jobTitle} onChange={handleJobTitleChange} />
                </div>

                <button type="submit">Actualizar posición</button>
                </form>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </div>
        </div>
    </div>
 
  );
};

export default UpdateRolScreen;
 