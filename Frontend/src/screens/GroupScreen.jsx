import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

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
            const response = await axios.post(`http://localhost:3001/grupo/Delete/`, { number: numeroGrupo });
        if (response.data.success) {
        fetchAllGroups(); // Actualiza la lista de grupos después de eliminar correctamente
            } else {
        console.error('Error al eliminar el grupo:', response.data.message);
        }
    } catch (error) {
        console.error('Error al eliminar el grupo:', error);
    }
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
      <button onClick={crearNuevoGrupo}>Crear Nuevo Grupo</button>
      {/* Mostrar la lista de grupos */}
      {groups.map((grupo) => (
        <div key={grupo._id}>
          <p>Número de Grupo: {grupo.group}</p>
          <p>Nombres: {grupo.names.join(', ')}</p>
          <p>Posiciones: {grupo.positions.join(', ')}</p>
          <button onClick={() => eliminarGrupo(grupo.group)}>Eliminar Grupo</button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default GroupScreen;
