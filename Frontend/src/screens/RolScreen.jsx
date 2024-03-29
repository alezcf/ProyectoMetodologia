import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/RolScreen.css'; // Import the CSS styles
import { useHistory } from 'react-router-dom';
import { Button, Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, Container, Typography } from '@mui/material'; // Import Material-UI components
import { makeStyles } from '@mui/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const useStyles = makeStyles((theme) => ({
  title: {
    
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
    color: '#dae0e2', // Blue-grey color code
    textShadow: '1px 1px 2px rgba(232, 179, 179, 0.1)',
    background: `linear-gradient(45deg, #363639, ${theme.palette.secondary.main})`,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  },
  letter: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    color: '#3789bd',
    textShadow: '2px 2px 3px rgba(0, 0, 0, 0.2)',
  },
  formButton: {
    
    backgroundColor: '#3A789E',  // Set the background color to blue
    color: 'white',           // Set the text color to white
    padding: theme.spacing(1, 2),      // Adjust the padding to make the button smaller
    fontSize: '14px',    
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',     // Adjust the font size to make the text smaller
    fontFamily: 'Arial', 
    '&:hover': {
      backgroundColor: '#328ac1',
    },
  },
  formButton2: {
   
    backgroundColor: '#3A789E',
    color: 'white',           // Set the text color to white
    padding: '10px 20px',       // Adjust the padding to make the button smaller
    fontSize: '14px',         // Adjust the font size to make the text smaller
    fontFamily: 'Arial',
    '&:hover': {
      backgroundColor: '#328ac1',
    },
  },
  formButton3: {
    backgroundColor: '#3A789E',  // Set the background color to blue
    color: 'white',           // Set the text color to white
    padding: '10px 20px',       // Adjust the padding to make the button smaller
    fontSize: '14px',         // Adjust the font size to make the text smaller
    fontFamily: 'Arial', 
    '&:hover': {
      backgroundColor: '#328ac1',
    },
  },
  
  customButtonContainer: {
    position: 'relative', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '24px',
    left: '-310px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
  customButtonContainer2: {
    position: 'relative', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '200px',
    left: '125px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
  customButtonContainer3: {
    position: 'relative', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '80px',
    left: '790px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
  customButtonContainer4: {
    position: 'relative', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '160px',
    left: '350px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
  customButtonContainer5: {
    position: 'relative', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '120px',
    left: '570px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
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
  
  const handleButtonRefresh = () => {
    history.push('/refresh');
  };
  const handleButtonDelete = () => {
    history.push('/eliminando');
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <Container >
      
      <Grid container justify="center" alignItems="center"className={classes.customButtonContainer}>
        <Button startIcon={<ArrowBackIcon />} className={classes.formButton} onClick={handleGoBack}>Volver</Button>
      </Grid>
        <div className="button-container"></div>
      <div >
      <Grid container justify="center" alignItems="center" className={classes.customButtonContainer2}>
        <Button startIcon={<HowToRegIcon/>} className={classes.formButton} onClick={handleButtonClick}>Actualizar un Rol</Button>
      </Grid>
      <Grid container justify="center" alignItems="center" className={classes.customButtonContainer4}>
        <Button startIcon={<HowToRegIcon/>} className={classes.formButton} onClick={handleButtonRefresh}>Nueva Temporada</Button>
      </Grid>
      <Grid container justify="center" alignItems="center" className={classes.customButtonContainer5}>
        <Button startIcon={<HowToRegIcon/>} className={classes.formButton} onClick={handleButtonDelete}>Eliminar Bombero</Button>
      </Grid>
      <Grid  container justify="center" alignItems="center" className={classes.customButtonContainer3}>
        <Button  startIcon={<AppRegistrationIcon />} className={classes.formButton} onClick={handleButtonClickAdd}>Registrar Trabajador</Button>
      </Grid>
      </div>
      

      <Box  mt={-15} ml={10}> {/* Apply margin-top and margin-left */}
      <Typography style={{ padding: '40px', backgroundColor: '#e1e1e1', textAlign: 'center' }} ml={-13} variant="h2" align="center" gutterBottom className={classes.letter}> 
      Control de roles en la Brigada</Typography>
      <Box mt={10} ml={20}>

          <Typography gutterBottom className={classes.title} ml={20} variant="h5">Lista de Bomberos registrados</Typography>
        </Box>
      </Box>

      <div className='container'>
        <div className="employee-table-container">
          <Table className="employee-table">
            <TableHead>
              <TableRow>
                <TableCell>Rut</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Rol</TableCell>
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
