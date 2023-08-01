import React, {useState } from 'react';
import axios from 'axios'; // Importa el archivo de estilos CSS
import { useHistory } from 'react-router-dom';
import '../css/RegisterScreen.css'; 
const RegisterScreen = () => {
    const [employee, setEmployee] = useState({
        rut: '',
        names: '',
        lastName: '',
        secondLastName: '',
        jobTitle: '',
        position: '',
      });
      const [success, setSuccess] = useState(null);
      const [error, setError] = useState(null);
      const history = useHistory();
      const handleGoBack = () => {
        history.goBack();
      };  
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEmployee({ ...employee, [name]: value });
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          // Send the POST request to the backend API
          const response = await axios.post('http://localhost:3001/rol/registro', employee);
          console.log(response.data); // Assuming the backend sends back a response with the saved employee data
        
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
    <div>  <button className='back-button' onClick={handleGoBack}> Atrás </button>
        <div>
          <h2>Agregar Bombero</h2>
          <form onSubmit={handleSubmit}>
          <div>
              <label htmlFor="rut">Rut:</label>
              <input
              placeholder='123456789' 
              type="text" id="rut" name="rut" value={employee.rut}
               onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="names">Nombres:</label>
              <input
              placeholder='Miguel Angelo'
               type="text" id="names" name="names" value={employee.names}
               onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="lastName">Apellido Paterno:</label>
              <input
                placeholder='Figueroa'
                type="text"
                id="lastName"
                name="lastName"
                value={employee.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="secondLastName">Apellido Materno:</label>
              <input
              placeholder='Salas'
                type="text"
                id="secondLastName"
                name="secondLastName"
                value={employee.secondLastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber">Número:</label>
              <input
              placeholder='56911223344'
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={employee.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                placeholder='aaa@gmail.com'
                type="text"
                id="email"
                name="email"
                value={employee.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="birthDate">Fecha de nacimiento:</label>
              <input
              placeholder='0000-12-31'
                type="text"
                id="birthDate"
                name="birthDate"
                value={employee.birthDate}
                onChange={handleInputChange}
              />
            </div>
                
              <label htmlFor="jobTitle">Cargo:</label>
              <input
              placeholder='Brigada'
               type="text" id="jobTitle" name="jobTitle" value={employee.jobTitle} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="position">Posición:</label>
              <input
              placeholder='Conductor'
               type="text" id="position" name="position" value={employee.position} onChange={handleInputChange} />
            </div>
            <button type="submit">Agregar Usuario</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    </div>
      );
};

export default RegisterScreen;
