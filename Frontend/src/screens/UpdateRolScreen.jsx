import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  formContent: {
    borderRadius: '5px',
    padding: theme.spacing(4),
    backgroundColor: 'white',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
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
      backgroundColor: '#0d00ff',
    },
  },
  customButtonContainer: {
    position: 'fixed', // Asegura que el contenedor tenga una posición para posicionar el botón dentro de él
    top: '10px',
    left: '20px', // Cambia el valor según la posición que desees (puedes usar top, bottom, left, right)
  },

}));

const UpdateRolScreen = () => {
  const [rut, setRut] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const history = useHistory();
  const classes = useStyles();

  const handleRutChange = (event) => {
    setRut(event.target.value);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.patch('http://localhost:3001/rol/cambiarposicion', {
        rut: rut,
        position: position,
      });

      if (response.data.error) {
        setError(response.data.message);
        setSuccess(null);
      } else {
        setSuccess('Posición actualizada exitosamente');
        setError(null);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error en la solicitud');
      setSuccess(null);
    }
  };

  return (
    <div > 
       <Grid container justify="center" alignItems="center" className={classes.customButtonContainer}>
      <Button className={classes.formButton} onClick={handleGoBack}>Atrás</Button>
    </Grid>
    <Container className={classes.formContainer}>
      <Grid >
        <Grid container justify="center" item xs={12} sm={8} md={6} lg={4}>
          <div className={classes.formContent}>
            <Typography variant="h4" align="center" gutterBottom>Actualizar Posición</Typography>
            <form onSubmit={handleSubmit}>
              <div className={classes.formField}>
                <TextField 
                  fullWidth
                  label="Rut"
                  placeholder="Ingrese sin puntos ni guión"
                  value={rut}
                  onChange={handleRutChange}
                  variant="outlined"
                />
              </div>
              <div className={classes.formField}>
                <TextField
                  fullWidth
                  label="Nuevo Rol"
                  placeholder="Ingresar el nuevo rol"
                  value={position}
                  onChange={handlePositionChange}
                  variant="outlined"
                />
              </div>
              <Button className={classes.formButton} fullWidth variant="contained" type="submit">Actualizar Rol</Button>
            </form>
            {error && <Typography color="error" align="center">{error}</Typography>}
            {success && <Typography color="success" align="center">{success}</Typography>}
          </div>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
};

export default UpdateRolScreen;

// <Button className={classes.formButton} fullWidth onClick={handleGoBack}>Atrás</Button>
//<button className='back-button' onClick={handleGoBack}> Atrás </button>