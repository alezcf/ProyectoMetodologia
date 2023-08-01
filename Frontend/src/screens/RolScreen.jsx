import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/RolScreen.css'; // Import the CSS styles
import { useHistory } from 'react-router-dom';
import { Button, Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, Container, Typography } from '@mui/material'; // Import Material-UI components
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  formButton: {
    backgroundColor: '#3A789E',  // Set the background color to blue
    color: 'white',           // Set the text color to white
    padding: '10px 20px',       // Adjust the padding to make the button smaller
    fontSize: '14px',         // Adjust the font size to make the text smaller
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
    top: '10px',
    left: '-340px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
  customButtonContainer2: {
    position: 'relative', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '40px',
    left: '280px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },
  customButtonContainer3: {
    position: 'relative', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '-6px',
    left: '650px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
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

      <Box mt={-15} ml={32}> {/* Apply margin-top and margin-left */}
        <Typography variant="h3">Control de roles en la Brigada</Typography>
        <Box mt={10} ml={20}>
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
