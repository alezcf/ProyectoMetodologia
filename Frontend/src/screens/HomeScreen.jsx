import React from 'react';
import axios from 'axios';

const HomeScreen = () => {
    const mensajeError = null; // Aquí puedes asignar un mensaje de error solo si hay algun error

    const styles = {
        background: {
            backgroundColor: "#fff",
        },
        button: {
            backgroundColor: "#d9ba52",
            borderColor: "#000",
        },
    };

    

    return (
        <html>
        <head>
            <title>Página de Inicio de Sesión</title>
            <link rel="stylesheet" type="text/css" href="/css/login.css" />
            <script src="/js/functions.js" defer></script>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            </head>
            <body>
            <div className="container">
                <div className="inner-container">
                <h1>Página de Inicio de Sesión</h1>
                {mensajeError && (
                    <div className="error-message">
                    {mensajeError}
                    </div>
                )}
                <form id="login-form" action="/usuario/logIn" method="POST">
                    <label htmlFor="rut">RUT:</label>
                    <input type="text" id="rut" name="rut" placeholder='123456789' maxLength="8" required />
                    <span>-</span>
                    <input type="text" id="dv" name="dv" placeholder='K' maxLength="1" required />
                    <br/><br/>
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" maxLength="20" required />
                    <br/><br/>
                    <input type="submit" style={styles.button} value="Ingresar" />
                </form>
                </div>
            </div>
            </body>
        </html>
    );
};

export default HomeScreen;