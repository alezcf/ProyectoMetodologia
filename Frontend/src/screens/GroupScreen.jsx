import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Select from 'react-select';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

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
      <Button className='back-button' onClick={handleGoBack} startIcon={<FaArrowLeft />}>
        Volver
      </Button>
      <Button className="button-create-group" onClick={crearNuevoGrupo} startIcon={<AiOutlinePlus />}>
        Crear Nuevo Grupo
      </Button>
      <TableContainer component={Paper}>
        <Table className="group-table">
          <TableHead>
            <TableRow>
              <TableCell className="small">Número del Grupo</TableCell>
              <TableCell>Miembros</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((grupo) => (
              <TableRow key={grupo._id}>
                <TableCell className="small-font">{grupo.group}</TableCell>
                <TableCell>
                  {grupo.names.map((name, index) => (
                    <React.Fragment key={index}>
                      {selectedGroup ? (
                        <Button onClick={() => handleMemberReplaceSelection(grupo.idUser[index], name)}>
                          {name}
                        </Button>
                      ) : (
                        <span>{name}</span>
                      )}
                      {selectedMembers.currentMember === grupo.idUser[index] && selectedGroup && (
                        <Select
                          options={availableEmployees.map((employee) => ({
                            value: employee.rut,
                            label: employee.names,
                          }))}
                          value={
                            selectedMembers.newMember
                              ? {
                                  value: selectedMembers.newMember,
                                  label: selectedMembers.newMemberName,
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            setSelectedMembers({
                              ...selectedMembers,
                              newMember: selectedOption.value,
                              newMemberName: selectedOption.label,
                            })
                          }
                          placeholder="Seleccionar miembro a reemplazar"
                        />
                      )}
                      <br />
                    </React.Fragment>
                  ))}
                </TableCell>
                <TableCell>
                  {grupo.positions.map((position, index) => (
                    <React.Fragment key={index}>
                      {position}
                      <br />
                    </React.Fragment>
                  ))}
                </TableCell>
                <TableCell className='td-container'>
                  {selectedGroup === grupo ? (
                    <div>
                      <Button variant="contained" color="primary" onClick={handleModifyGroup}>
                        Guardar cambios
                      </Button>
                      <Button variant="contained" color="secondary" onClick={handleCloseModifyForm}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outlined" onClick={() => handleOpenModifyForm(grupo)} startIcon={<EditIcon />}>
                      Modificar
                    </Button>
                  )}
                  <IconButton color="error" onClick={() => eliminarGrupo(grupo.group)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GroupScreen;
