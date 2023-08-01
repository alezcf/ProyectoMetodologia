import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Select from 'react-select';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

import '../css/GroupScreen.css';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    color: '#3A789E',
    textShadow: '2px 2px 3px rgba(0, 0, 0, 0.2)',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  formContent: {
    borderRadius: '2px',
    padding: theme.spacing(3),
    backgroundColor: 'white',
    boxShadow: '0px 2px 3px #236b98',
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  formButton: {
    padding: theme.spacing(1, 2),
    backgroundColor: '#3A789E',
    color: 'white',
    border: 'black', // Change this line to 'none' for no border
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#328ac1',
    },
  },
  customButtonContainer: {
    position: 'fixed', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '10px',
    left: '20px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
  letter: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(0),
    color: '#3789bd',
    textShadow: '2px 2px 3px rgba(0, 0, 0, 0.2)',
  },

}));
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
  const classes = useStyles();
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
       <Grid container justify="center" alignItems="center" className={classes.customButtonContainer}>
         <Button className={classes.formButton}  startIcon={<FaArrowLeft />}onClick={handleGoBack}>Volver</Button>
        </Grid>
        <Typography variant="h3" align="center" gutterBottom className={classes.letter} style={{ fontWeight: 'bold', color: '#3A789E', textShadow: '2px 2px 3px rgba(0, 0, 0, 0.2)', letterSpacing: '0.1em' }}>
  Pantalla de Grupos
</Typography>
      <Button style={{color: '#3A789E'}}className="button-create-group" onClick={crearNuevoGrupo} startIcon={<AiOutlinePlus />}>
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
