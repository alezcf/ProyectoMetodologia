import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/RolScreen.css'; // Import the CSS styles
import { useHistory } from 'react-router-dom';
import { Button, Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, Container, Typography } from '@mui/material'; // Import Material-UI components
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  formButton: {
    padding: theme.spacing(1, 2),
    backgroundColor: '#405fe9',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#264bf2',
    },
  },
  formButton2: {
    padding: theme.spacing(1, 2),
    backgroundColor: '#405fe9',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#264bf2',
    },
  },
  formButton3: {
    padding: theme.spacing(1, 2),
    backgroundColor: '#405fe9',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#264bf2',
    },
  },
  customButtonContainer: {
    position: 'fixed', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '10px',
    left: '20px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
  customButtonContainer2: {
    position: 'fixed', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '10px',
    left: '150px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
  customButtonContainer3: {
    position: 'fixed', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '10px',
    left: '360px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
 

}));

const RolScreen = () => {
  const [employees, setEmployees] = useState([]);
  const history = useHistory();
  const classes = useStyles();
  
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
    <Container>
      <Grid container justify="center" alignItems="center" className={classes.customButtonContainer}>
        <Button className={classes.formButton} onClick={handleGoBack}>Atrás</Button>
      </Grid>
        <div className="button-container"></div>

      <div>
      <Grid container justify="center" alignItems="center" className={classes.customButtonContainer2}>
        <Button className={classes.formButton2} onClick={handleButtonClick}>Actualizar un cargo</Button>
      </Grid>

      <Grid  container justify="center" alignItems="center" className={classes.customButtonContainer3}>
        <Button className={classes.formButton3} onClick={handleButtonClickAdd}>Registrar Trabajador</Button>
      </Grid>
      </div>

      <Box mt={10} ml={32}> {/* Apply margin-top and margin-left */}
        <Typography variant="h3">Control de roles en la Brigada</Typography>
        <Box mt={5} ml={20}>
          <Typography variant="h5">Lista de Bomberos registrados</Typography>
        </Box>
      </Box>

      <div className='container'>
        <div className="employee-table-container">
          <Table className="employee-table">
            <TableHead>
              <TableRow>
                <TableCell>Rut</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Posición</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.rut}</TableCell>
                  <TableCell>{`${employee.names} ${employee.lastName} ${employee.secondLastName}`}</TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default RolScreen;
