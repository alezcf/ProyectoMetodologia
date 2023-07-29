import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai'; // Importar los iconos de react-icons
import axios from 'axios';
import '../css/GroupScreen.css';
import { FaArrowLeft,  } from 'react-icons/fa'; 

const GroupScreen = () => {
  const [groups, setGroups] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Obtener todos los grupos desde la API del backend cuando el componente se monta
    fetchAllGroups();
  }, []);

  const fetchAllGroups = async () => {
    try {
      const response = await axios.get('http://localhost:3001/grupo/verGrupos'); // Ruta para obtener todos los grupos
      setGroups(response.data);
    } catch (error) {
      console.error('Error al obtener los grupos:', error);
    }
  };

  // Cambia axios.post a axios.delete para eliminar el grupo
  const eliminarGrupo = async (numeroGrupo) => {
    try {
      const response = await axios.post(`http://localhost:3001/grupo/Delete`, { number: numeroGrupo });
      if (response.data.success) {
        fetchAllGroups(); // Actualiza la lista de grupos después de eliminar correctamente
      } else {
        console.error('Error al eliminar el grupo:', response.data.message);
      }
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
    }
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const crearNuevoGrupo = async () => {
    try {
      // Llama a la API del backend para crear un nuevo grupo
      await axios.post('http://localhost:3001/grupo/create');

      // Actualiza la lista de grupos después de crear uno nuevo
      fetchAllGroups();
    } catch (error) {
      console.error('Error al crear el nuevo grupo:', error);
    }
  };

  return (
    <div>
      <h1>Pantalla de Grupos</h1>
      {/* Botón "Volver" se coloca antes del botón "Crear Nuevo Grupo" */}
      <button className='back-button'onClick={handleGoBack}> <FaArrowLeft/> Volver</button>
      <button className="button-create-group" onClick={crearNuevoGrupo}>
        <AiOutlinePlus /> Crear Nuevo Grupo
      </button>
      {/* Mostrar la lista de grupos */}
      <table className="group-table">
        <thead>
          <tr>
            <th className="small">Número del Grupo</th>
            <th>Miembros</th>
            <th>Roles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((grupo) => (
            <tr key={grupo._id}>
              <td className="small-font">{grupo.group}</td>
              <td>
                <ul>
                  {grupo.names.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {grupo.positions.map((position, index) => (
                    <li key={index}>{position}</li>
                  ))}
                </ul>
              </td>
              <td className='td-container'> 
              <button className="button-delete" onClick={() => eliminarGrupo(grupo.group)}>
                  <AiOutlineDelete /> Eliminar Grupo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default GroupScreen;
