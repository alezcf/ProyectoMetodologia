import React, { useState } from 'react';
import axios from 'axios';

const HomeScreen = () => {
    const [mensajeError, setMensajeError] = useState(Error); // Aquí puedes asignar un mensaje de error si lo deseas.
    const [rut, setRut] = useState('');
    const [dv, setDv] = useState('');
    const [password, setPassword] = useState('');

    const rutChange = (e) => {
        setRut(e.target.value);
    };
    
    const dvChange = (e) => {
        setDv(e.target.value);
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

        console.log(credentials);

        try {
            const res = await axios.post('http://localhost:3001/usuario/login', credentials);
            console.log(res.data);
            window.location.href = '/';
        } catch (err) {
            console.log(err);
            setMensajeError('Error en la solicitud');
        }
    };

    return (
        <div className="container">
            <div className="inner-container">
                <h1>Página de Inicio de Sesión</h1>
                {mensajeError && <div className="error-message">{mensajeError}</div>}
                <input value={rut} onChange={rutChange}></input>
                <input value={dv} onChange={dvChange}></input>
                <input value={password} onChange={passwordChange}></input>
                <button onClick={handleSubmit}>Ingresar</button>
            </div>
        </div>
    );
};

export default HomeScreen;
