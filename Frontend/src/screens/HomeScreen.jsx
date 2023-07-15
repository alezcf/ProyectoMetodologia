import React, { useState } from 'react';
import axios from 'axios';

const HomeScreen = () => {
    const mensajeError = null; // Aquí puedes asignar un mensaje de error si lo prefieres.
    const [rut, setRut] = useState("");
    const [dv, setDv] = useState("");
    const [password, setPassword] = useState("");

    const rutChange = (e) => {
        setRut(e.target.value);
    }   
    const dvChange = (e) => {
        setDv(e.target.value);
    }   
    const passwordChange = (e) => {
        setPassword(e.target.value);
    }   

    const handleSubmit = async () => {
        const credentials ={
            rut: rut,
            password : password,
            dv: dv
        } 
        console.log(credentials)
        await axios.post("http://localhost:3001/usuario/login", credentials)
        .then(res => {
            console.log(res.data);
            window.location.href = "/";
          }) 
          .catch(err =>{
          console.log(err);

          }  )
    };



    // const styles = {
    //     background: {
    //         backgroundColor: "#fff",
    //     },
    //     button: {
    //         backgroundColor: "#d9ba52",
    //         borderColor: "#000",
    //     },
    // };

    

    return (
        <div className="container">
            <div className="inner-container">
            <h1>Página de Inicio de Sesión</h1>
            {mensajeError && (
                <div className="error-message">
                {mensajeError}
                </div>
            )}
            {/* <form id="login-form" action="/usuario/logIn" method="POST">
                <label htmlFor="rut">RUT:</label>
                <input type="text" id="rut" name="rut" placeholder='123456789' maxLength="8" required />
                <span>-</span>
                <input type="text" id="dv" name="dv" placeholder='K' maxLength="1" required />
                <br/><br/>
                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" name="password" maxLength="20" required />
                <br/><br/>
                <input type="submit" style={styles.button} value="Ingresar" />
            </form> */}
            <input value = {rut} onChange = {rutChange} />
            <input value = {dv} onChange = {dvChange} />
            <input value = {password} onChange = {passwordChange} />
            <button onClick={handleSubmit}>Ingresar</button> 
            </div>
        </div>
    );
};

export default HomeScreen;
