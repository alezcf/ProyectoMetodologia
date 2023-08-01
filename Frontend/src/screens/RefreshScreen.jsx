import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { Container, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';

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
      border: 'none',
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
  
  }));

const ExpirationRolComponent = () => {
  const [rut, setRut] = useState('');
  const [setJobTitle] = useState('');
  const [updatedEmployee, setUpdatedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const history = useHistory();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'rut') {
      setRut(value);
    } else if (name === 'jobTitle') {
      setJobTitle(value);
    }
  };
  const handleGoBack = () => {
    history.goBack();
  };

  const handleExpirationRol = async () => {
    setError(null);
    try {
      const response = await axios.post('/rol/expirationrol', { rut });
      setUpdatedEmployee(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };



return (
    <div > 
      <Container> 
       <Grid container justify="center" alignItems="center" className={classes.customButtonContainer}>
         <Button className={classes.formButton} onClick={handleGoBack}>Atrás</Button>
        </Grid>
    <Container className={classes.formContainer}>
      <Grid >
        <Grid container justify="center" item xs={5} sm={8} md={6} lg={4}>
          <div className={classes.formContent}>
            <Typography variant="h5" align="center" gutterBottom className={classes.title}>Nueva Temporada</Typography>
            <form onSubmit={handleExpirationRol}>
              <div className={classes.formField}>
              <TextField
                label="RUT"
                name="rut"
                value={rut}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
             />
              </div>
      <Button className={classes.formButton} fullWidth variant="contained" type="submit">Ingrese para continuar</Button>
            </form>
            {error && <p>{error}</p>}
             {updatedEmployee && <p>Empleado actualizado: {JSON.stringify(updatedEmployee)}</p>}
          </div>
        </Grid>
      </Grid>
    </Container>
    </Container>
    </div>
    
  );
};


export default ExpirationRolComponent;
