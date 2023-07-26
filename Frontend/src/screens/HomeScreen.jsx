import React, { useState } from 'react';
import axios from 'axios';

const HomeScreen = ({ history }) => {
    // eslint-disable-next-line no-unused-vars
    const [mensajeError, setMensajeError] = useState(''); // Aquí puedes asignar un mensaje de error si lo deseas.
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

        try {
            const res = await axios.post('http://localhost:3001/usuario/login', credentials);
            const rutDV = rut + dv;
            console.log("Estatus actual: " + res.status)
            if (res.status === 200) {
                // Redireccionar al usuario a la página principal (por ejemplo, '/home')
                history.push(`/trabajador/${rutDV}`);
            }
        }
        catch (err) {
            setMensajeError('Error en la solicitud');
        }
    };

    return (
        <div className="container">
        <div className="inner-container">
            <h1>Página de Inicio de Sesión</h1>
            {/* {mensajeError && <div className="error-message">{mensajeError}</div>} */}
            <div>
            <label htmlFor="rut">RUT:</label>
            <input id="rut" value={rut} onChange={rutChange} />
            </div>
            <div>
            <label htmlFor="dv">DV:</label>
            <input id="dv" value={dv} onChange={dvChange} />
            </div>
            <div>
            <label htmlFor="password">Contraseña:</label>
            <input id="password" type="password" value={password} onChange={passwordChange} />
            </div>
            <button onClick={handleSubmit}>Ingresar</button>
        </div>
        </div>
    );
};

export default HomeScreen;
