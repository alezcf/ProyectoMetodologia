import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/RolScreen.css'; // Importa el archivo de estilos CSS
import { useHistory } from 'react-router-dom';

const RolScreen = () => { 
  const [employees, setEmployees] = useState([]); 
  const history = useHistory();

  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3001/rol/trabajadores');
      setEmployees(response.data.arrayEmployee);
    } catch (error) {
      console.error('Error al obtener los trabajadores:', error);
    }
  };
  const handleButtonClick = () => {
    history.push('/actualizando');
  };
  const handleButtonClickAdd = () => {
    history.push('/registrando');
  };
  const handleGoBack = () => {
    history.goBack();
  };  

  return (

    <div> <button className='back-button' onClick={handleGoBack}>Atrás</button> 
    <div className="button-container">
    <button className='buttonUp' onClick={handleButtonClick}>Actualizar un cargo</button>
    <button className='buttonUp2' onClick={handleButtonClickAdd}>Registrar Trabajador</button>
  
       <div  className="space">
        <span>
          <h1>Control de roles en la Brigada</h1>
          <div style={{  marginLeft: '55px'}}><h4>Lista de Bomberos registrados</h4> </div>
          
           </span>
       </div> 
       
      <div className = 'container'>
          <div className="employee-table-container">
            
            <table className="employee-table">
                <thead>
                  <tr>
                    <th>Rut</th>
                    <th>Nombre</th>
                    <th>Cargo</th>
                    <th>Posición</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.rut}</td>
                      <td>{`${employee.names} ${employee.lastName} ${employee.secondLastName}`}</td>
                      <td>{employee.jobTitle}</td>
                      <td>{employee.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        <div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RolScreen;