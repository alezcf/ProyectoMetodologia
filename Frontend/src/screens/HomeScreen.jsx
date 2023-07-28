import React, { useState } from 'react';
import axios from 'axios';
import '../css/HomeScreen.css';
import { FaSignInAlt } from 'react-icons/fa';

const HomeScreen = ({ history }) => {
    const [mensajeError, setMensajeError] = useState('');
    const [rut, setRut] = useState('');
    const [dv, setDv] = useState('');
    const [password, setPassword] = useState('');

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
            <h1>Inicio de Sesión</h1>
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
            <button className="login-button" onClick={handleSubmit}>
            <FaSignInAlt /> Ingresar
            </button>
        </div>
        </div>
    );
};

export default HomeScreen;