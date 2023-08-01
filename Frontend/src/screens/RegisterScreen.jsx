import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../css/RegisterScreen.css';
import { Button, Container, Grid, TextField, Typography} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    color: '#3A789E',
    textShadow: '3px 4px 5px rgba(0, 0, 0, 0.2)',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  formContent: {
    borderRadius: '5px',
    padding: theme.spacing(4.5),
    backgroundColor: 'white',
    boxShadow: '0px 6px 9px rgba(0, 0, 0, 0.2)',
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
const RegisterScreen = () => {
  const classes = useStyles();
  const [employee, setEmployee] = useState({
    rut: '',
    names: '',
    lastName: '',
    secondLastName: '',
    jobTitle: '',
    position: '',
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleCloseSuccessAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setShowSuccessAlert(false);
    };

   const handleInputChange = (event) => {
    const { name, value } = event.target;
    
      if (name === 'rut' && !/^\d*$/.test(value)) {
        return; 
      }
      if (name === 'phoneNumber' && !/^\d*$/.test(value)) {
        return; 
      }
      if (name === 'names' && !/^[A-Za-z\s]*$/.test(value)) {
        return;
      }
      if (name === 'lastName' && !/^[A-Za-z\s]*$/.test(value)) {
        return;
      }
      if (name === 'secondLastName' && !/^[A-Za-z\s]*$/.test(value)) {
        return;
      }
      if (name === 'jobTitle' && !/^[A-Za-z\s]*$/.test(value)) {
        return;
      }
      if (name === 'position' && !/^[A-Za-z\s]*$/.test(value)) {
        return;
      }


      setEmployee({ ...employee, [name]: value });

      if (name === 'birthDate') {
        let formattedValue = value;
      
        // Remove any non-numeric characters from the value
        formattedValue = formattedValue.replace(/\D/g, '');
      
        if (formattedValue.length > 4) {
          formattedValue = formattedValue.replace(/^(\d{4})/, '$1-');
        }
      
        if (formattedValue.length > 7) {
          formattedValue = formattedValue.replace(/-(\d{2})/, '-$1-');
        }
      
        formattedValue = formattedValue.slice(0, 10);
      
        setEmployee({ ...employee, [name]: formattedValue });
      } else {
        setEmployee({ ...employee, [name]: value });
      }
      
    };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send the POST request to the backend API
      const response = await axios.post('http://localhost:3001/rol/registro', employee);
      console.log(response.data); // Assuming the backend sends back a response with the saved employee data

      if (response.data.error) {
        setError(response.data.message);
        setSuccess(null);
      } else {
        setSuccess('Se ha agreado el usuario');
        setError(null);
        setShowSuccessAlert(true); // Set the showSuccessAlert state to true when the form is successfully submitted
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
      <Grid container justify="center" item xs={10} sm={10} md={10} lg={4.5}>
        <Grid  item xs={10} sm={10} md={10} lg={11.5}> 
          <div className={classes.formContent}>
            <Typography variant="h5" align="center" gutterBottom className={classes.title}>Registro</Typography>
           
            <form  onSubmit={handleSubmit}>
              <div >
                <TextField 
                  fullWidth
                  inputProps={{ maxLength: 9 }}
                  label="Rut"
                  placeholder='123456789'
                  type="text"
                  id="rut"
                  name="rut"
                  value={employee.rut}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Nombres"
                  placeholder='Miguel Angelo'
                  type="text"
                  id="names"
                  name="names"
                  value={employee.names}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Apellido Paterno"
                  placeholder='Figueroa'
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={employee.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Apellido Materno"
                  placeholder='Salas'
                  type="text"
                  id="secondLastName"
                  name="secondLastName"
                  value={employee.secondLastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  inputProps={{maxLength:11}}
                  label="Número"
                  placeholder='56911223344'
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={employee.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Email"
                  placeholder='aaa@gmail.com'
                  type="text"
                  id="email"
                  name="email"
                  value={employee.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  label="Fecha de nacimiento"
                  placeholder='0000-12-31'
                  type="text"
                  id="birthDate"
                  name="birthDate"
                  value={employee.birthDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Cargo"
                  placeholder='Brigada'
                  type="text" 
                  id="jobTitle" 
                  name="jobTitle" 
                  value={employee.jobTitle} 
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Rol"
                  placeholder='Conductor'
                  type="text" 
                  id="position" 
                  name="position" 
                  value={employee.position} 
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Button className={classes.formButton} type="submit" variant="contained" color="primary">
                  Agregar Usuario
                </Button>
              </div>
            </form>
          
          </div>
        </Grid>
      </Grid>
      
    </Container>
    <Grid container direction="column" justifyContent="center" style={{ minHeight: '0vh', marginTop: '-1000px' }}>
      <Grid item>
        <div style={{ padding: '45px', backgroundColor: '#bcbcbc', textAlign: 'center' }}>
        </div>
        
        <Snackbar style={{ minHeight: '0vh', marginTop: '-500px' }}
          open={showSuccessAlert}
          autoHideDuration={6000}
          onClose={handleCloseSuccessAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={handleCloseSuccessAlert} severity="success" elevation={6} variant="filled">
            {success}
          </MuiAlert>
        </Snackbar>
      </Grid>
    </Grid>
    <div>

    </div>
    </div>
    
  );
};

export default RegisterScreen;
