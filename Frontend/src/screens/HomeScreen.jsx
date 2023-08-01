import React, { useState } from 'react';
import axios from 'axios';
import '../css/HomeScreen.css';
import { FaSignInAlt } from 'react-icons/fa';
import {Typography} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({

    letter: {
      fontWeight: 'bold',
      marginBottom: theme.spacing(4),
      color: '#3789bd',
      textShadow: '3px 3px 3px rgba(0, 0, 0, 0.2)',
    },
  
  }));

const HomeScreen = ({ history }) => {
    const [mensajeError, setMensajeError] = useState('');
    const [rut, setRut] = useState('');
    const [dv, setDv] = useState('');
    const [password, setPassword] = useState('');
    const classes = useStyles();
    const rutChange = (e) => {
        const value = e.target.value;
        // Validar que el RUT solo contenga números del 1 al 9
        if (/^[0-9]*$/.test(value) && value.length <= 8) {
        setRut(value);
        }
    };

    const dvChange = (e) => {
        const value = e.target.value;
        // Validar que el DV sea un número del 1 al 9 o 'K' o 'k'
        if (/^[0-9Kk]*$/.test(value) && value.length <= 1) {
        setDv(value.toUpperCase());
        }
    };

    const passwordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async () => {
        const credentials = {
        rut: rut,
        password: password,
        dv: dv
        };

        try {
        const res = await axios.post('http://localhost:3001/usuario/login', credentials);
        const rutDV = rut + dv;
        if (res.status === 200) {
            history.push(`/trabajador/${rutDV}`);
        }
        } catch (err) {
        setMensajeError('Datos incorrectos');
        }
    };

    return (
        <div className="container">
        <div className="inner-container">
        <Typography variant="h3" align="center" gutterBottom className={classes.letter} style={{ fontWeight: 'bold', color: '#3A789E', textShadow: '2px 2px 3px rgba(0, 0, 0, 0.2)', letterSpacing: '0.1em' }}>
  Login
</Typography>
            {mensajeError && <div className="error-message">{mensajeError}</div>}
            <div className="input-container">
            <label htmlFor="rut">RUT:</label>
            <input
                id="rut"
                value={rut}
                onChange={rutChange}
                type="text"
                maxLength={8}
            />
            </div>
            <div className="input-container">
            <label htmlFor="dv">DV:</label>
            <input
                id="dv"
                value={dv}
                onChange={dvChange}
                type="text"
                maxLength={1}
            />
            </div>
            <div className="input-container">
            <label htmlFor="password">Contraseña:</label>
            <input
                id="password"
                value={password}
                onChange={passwordChange}
                type="password"
            />
            </div>
            <button  className="login-button" onClick={handleSubmit}>
            <FaSignInAlt /> Ingresar
            </button>
        </div>
        </div>
    );
};

export default HomeScreen;