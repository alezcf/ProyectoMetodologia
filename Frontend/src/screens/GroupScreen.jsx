import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import '../css/GroupScreen.css';

const GroupScreen = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedReplaceMembers, setSelectedReplaceMembers] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedMemberToReplace, setSelectedMemberToReplace] = useState('');
  const [showReplaceMembers, setShowReplaceMembers] = useState(false); // Agregamos el estado para controlar la visibilidad del recuadro
  const history = useHistory();

  useEffect(() => {
    fetchAllGroups();
    fetchAvailableEmployees();
  }, []);



  const handleOpenModifyForm = (grupo) => {
    setSelectedGroup(grupo);
    setSelectedMemberToReplace(null);
    setSelectedReplaceMembers([]);
    setShowReplaceMembers(true); // Mostramos el recuadro al hacer clic en "Modificar"
  };

  const handleCloseModifyForm = () => {
    setSelectedGroup(null);
    setShowReplaceMembers(false); // Ocultamos el recuadro al cerrar el formulario
  };

  const handleMemberReplaceSelection = (event) => {
    const memberId = event.target.value;
    setSelectedMemberToReplace(memberId);
    setSelectedReplaceMembers([]); // Limpia los miembros disponibles para reemplazar, ya que ahora solo se selecciona uno.
  };

  
  const handleGoBack = () => {
    history.goBack();
  };  
  
    const fetchAllGroups = async () => {
    try {
      const response = await axios.get('http://localhost:3001/grupo/verGrupos');
      setGroups(response.data);
    } catch (error) {
      console.error('Error al obtener los grupos:', error);
    }
  };


  const fetchAvailableEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3001/trabajador/Read');
      if (Array.isArray(response.data.arrayEmployee)) {
        setAvailableEmployees(response.data.arrayEmployee);
      } else {
        console.error('Los empleados disponibles no son un array:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener los empleados disponibles:', error);
    }
  };

    const eliminarGrupo = async (numeroGrupo) => {
    try {
      const response = await axios.post('http://localhost:3001/grupo/Delete', { number: numeroGrupo });
      if (response.data.success) {
        fetchAllGroups();
      } else {
        console.error('Error al eliminar el grupo:', response.data.message);
      }
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
    }
  };

  const handleModifyGroup = async () => {
    try {
      if (selectedReplaceMembers.length !== 1) {
        return alert('Debe seleccionar un único miembro para reemplazar');
      }

      await axios.post('http://localhost:3001/grupo/update', {
        selectedNewMember: selectedReplaceMembers[0], // Solo enviamos el ID del nuevo miembro seleccionado, no todo el arreglo.
        groupNumber: selectedGroup.group,
        selectedMemberToReplace: selectedMemberToReplace, // Solo enviamos el ID del miembro que se va a reemplazar, no todo el arreglo.
      });

      fetchAllGroups();
      handleCloseModifyForm();
    } catch (error) {
      console.error('Error al modificar el grupo:', error);
    }
  };

  const crearNuevoGrupo = async () => {
    try {
      await axios.post('http://localhost:3001/grupo/create');
      fetchAllGroups();
    } catch (error) {
      console.error('Error al crear el nuevo grupo:', error);
    }
  };

  return (
    <div>
      <h1>Pantalla de Grupos</h1>
      <button className='back-button' onClick={handleGoBack}>
        <FaArrowLeft /> Volver
      </button>
      <button className="button-create-group" onClick={crearNuevoGrupo}>
        <AiOutlinePlus /> Crear Nuevo Grupo
      </button>
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
                    <li key={index}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedMemberToReplace === grupo.idUser[index]}
                          onChange={handleMemberReplaceSelection}
                          value={grupo.idUser[index]}
                          disabled={!selectedGroup}
                        />
                        {name}
                      </label>
                    </li>
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
                <button className="button-modify" onClick={() => handleOpenModifyForm(grupo)}>
                  Modificar
                </button>
                <button className="button-delete" onClick={() => eliminarGrupo(grupo.group)}>
                  <AiOutlineDelete /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedGroup && (
        <div className="modify-form">
          <h2>Modificar Grupo</h2>
          {showReplaceMembers && ( // Agregamos una condición para mostrar el recuadro solo cuando showReplaceMembers sea true
            <div>
              <h3>Seleccionar miembro para reemplazar:</h3>
              <ul>
                {availableEmployees.map((employee) => (
                  <li key={employee._id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedReplaceMembers.includes(employee.rut)}
                        onChange={(event) =>
                          setSelectedReplaceMembers((prev) => {
                            if (event.target.checked) {
                              return [...prev, employee.rut];
                            } else {
                              return prev.filter((id) => id !== employee.rut);
                            }
                          })
                        }
                        value={employee.rut}
                        disabled={!selectedGroup}
                      />
                      {employee.names}
                    </label>
                  </li>
                ))}
              </ul>
              <button onClick={handleModifyGroup}>Guardar cambios</button>
              <button onClick={handleCloseModifyForm}>Cancelar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default GroupScreen;
