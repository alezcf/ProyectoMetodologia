import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Select from 'react-select';
import '../css/GroupScreen.css';

const GroupScreen = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({
    currentMember: null,
    newMember: null,
    newMemberName: null, // Nueva propiedad para almacenar el nombre del miembro seleccionado
  });
  const history = useHistory();

  useEffect(() => {
    fetchAllGroups();
    fetchAvailableEmployees();
  }, []);

  const handleOpenModifyForm = (grupo) => {
    setSelectedGroup(grupo);
    setSelectedMembers({
      currentMember: null,
      newMember: null,
      newMemberName: null, // Restablecer el nuevo miembro y su nombre cuando se abre el formulario de modificación
    });
  };

  const handleCloseModifyForm = () => {
    setSelectedGroup(null);
    setSelectedMembers({
      currentMember: null,
      newMember: null,
      newMemberName: null,
    });
  };

  const handleMemberReplaceSelection = (memberId, memberName) => {
    if (selectedGroup) {
      setSelectedMembers({
        ...selectedMembers,
        currentMember: memberId,
      });
    }
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
      if (!selectedMembers.newMember || !selectedMembers.currentMember) {
        return alert('Debe seleccionar una persona para reemplazar y la persona actual');
      }

      console.log('selectedMembers:', selectedMembers);

      await axios.post('http://localhost:3001/grupo/update', {
        selectedNewMember: selectedMembers.newMember,
        groupNumber: selectedGroup.group,
        selectedMemberToReplace: selectedMembers.currentMember,
      });

      fetchAllGroups();
      handleCloseModifyForm();
      setSelectedMembers({
        currentMember: null,
        newMember: null,
        newMemberName: null, // Restablecer el estado después de guardar los cambios
      });
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
                    <li key={index} className={selectedMembers.currentMember === grupo.idUser[index] ? 'selected' : ''}>
                      {selectedGroup ? (
                        <button onClick={() => handleMemberReplaceSelection(grupo.idUser[index], name)}>
                          {name}
                        </button>
                      ) : (
                        <span>{name}</span>
                      )}
                      {selectedMembers.currentMember === grupo.idUser[index] && selectedGroup && (
                        <Select
                          options={availableEmployees.map((employee) => ({
                            value: employee.rut, // Usar el rut como value
                            label: employee.names, // Usar el nombre como label
                          }))}
                          value={
                            selectedMembers.newMember
                              ? {
                                value: selectedMembers.newMember,
                                label: selectedMembers.newMemberName, // Mostrar el nombre en lugar del rut
                              }
                              : null
                          }
                          onChange={(selectedOption) => setSelectedMembers({
                            ...selectedMembers,
                            newMember: selectedOption.value,
                            newMemberName: selectedOption.label, // Guardar el nombre en selectedMembers.newMemberName
                          })}
                          placeholder="Seleccionar miembro a reemplazar"
                        />
                      )}
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
                {selectedGroup === grupo ? (
                  <div>
                    <button onClick={handleModifyGroup}>Guardar cambios</button>
                    <button onClick={handleCloseModifyForm}>Cancelar</button>
                  </div>
                ) : (
                  <button className="button-modify" onClick={() => handleOpenModifyForm(grupo)}>
                    Modificar
                  </button>
                )}
                <button className="button-delete" onClick={() => eliminarGrupo(grupo.group)}>
                  <AiOutlineDelete /> Eliminar
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
