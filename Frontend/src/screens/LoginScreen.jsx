import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import '../css/LoginScreen.css';
import { FaSignInAlt, FaSignOutAlt, FaEye, FaBell } from 'react-icons/fa';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import sweetalert from 'sweetalert'; // npm i librería 'sweetalert'

const LoginScreen = ({ match }) => {
    const [employee, setEmployee] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [redirectToPendingAttendance, setRedirectToPendingAttendance] = useState(false);
    const rut = match.params.rut;
    const history = useHistory();

 
      const theme = createTheme({
        typography: {
          h1: {
            color: 'blue',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        },
      });

      

     
    const getEmployeeByRut = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/trabajador/${rut}`);
            const data = res.data;

            if (data.error) {
                setErrorMessage(data.message);
            } else {
                setEmployee(data);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('Error al obtener el trabajador');
        }
    };

    const handleViewPendingAttendance = () => {
        setRedirectToPendingAttendance(true);
    };

    const handleRegisterAttendance = () => {
        axios.post('http://localhost:3001/asistencia/create', {
            idUser: rut,
        })
            .then((response) => {
                console.log('Asistencia registrada con éxito:', response.data);

                if (response.status === 201) {
                    // Si el estatus es 201, mostramos un mensaje de éxito
                    alert('La asistencia fue registrada correctamente');
                } else if (response.status === 304) {
                    // Si el estatus es 409, mostramos un mensaje de asistencia ya registrada
                    alert('La asistencia ya fue registrada el dia de hoy');
                }
            })
            .catch((error) => {
                // Manejo de errores
                console.error('Error al registrar la asistencia:', error);
                // Mostrar un mensaje de error o realizar otras acciones en caso de error
                alert('Hubo un error al registrar la asistencia. Intente nuevamente más tarde.');
            });
    };

    // function handleViewNotification() {
    //     window.location.href = "/notificacion";
    // }

    const handleViewNotification = () => {
        axios.get('http://localhost:3001/grupo', {
            idUser: rut,
        })

        .then((response) => {

            if (response.status === 201) {
                
                sweetalert('Notificación','Fuiste agregado al grupo x un grupo por','info');
            }
        })
        .catch((error) => {
            console.error('Error al registrar la asistencia:', error);
            // Muestra un mensaje de advertencia por no poseer grupo asignado
            sweetalert('Aviso','Usted actualmente no posee grupo asigando' ,'warning');
        });
    };


    function handleViewGroups() {
        window.location.href = "/grupo";
    }

    const handleRolUser = () => {
        // Se añade la opción de ver los usuarios trabajadores
    history.push('/roltrabajador');
  }

    const handleLogout = () => {
        // Realizar aquí cualquier otra acción de cierre de sesión necesaria
        setIsLoggedOut(true); // Actualizamos el estado para activar la redirección
    };

    useEffect(() => {
        getEmployeeByRut(); // Solo se ejecutará una vez al montar el componente
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Redirigir a la página principal si el usuario ha cerrado sesión
    if (isLoggedOut) {
        return <Redirect to="/" />;
    }

    if (redirectToPendingAttendance) {
        return <Redirect to="/asistencia/readNotAccepted" />;
    }

    return (
        
        <div className="container">
            <ThemeProvider theme={theme}>
                 <h1 variant="h1">INICIO</h1>
            </ThemeProvider>
            <div className="inner-container">

            <button className="notifications" onClick={handleViewNotification}>
                        <FaBell />
                    </button>
                    
                <div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}>
                        <FaSignOutAlt /> Cerrar sesión
                    </button>
                
                   
                </div>
                
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {employee && (
                    <div >
                        <h3>Información del Usuario</h3>
                        <p>
                            <strong>Nombres:</strong> {employee.names}
                        </p>
                        <p>
                            <strong>Apellidos:</strong> {employee.lastName} {employee.secondLastName}
                        </p>
                        <p>
                            <strong>Cargo:</strong> {employee.jobTitle}
                        </p>
                        <p>
                            <strong>Rol:</strong> {employee.position}
                        </p>
                    </div>
                )}
                <div className="button-container">
                <Link to={{ pathname: '/asistencia/read', state: { user: employee } }} className="view-attendance-button">
                <FaEye /> Visualizar Asistencia
                </Link>
                    <button className="register-attendance-button" onClick={handleRegisterAttendance}>
                        <FaSignInAlt /> Registrar Asistencia
                    </button>
                    {employee && employee.jobTitle === 'Jefe de Brigada' && (
                        <button
                            className="view-pending-attendance-button"
                            onClick={handleViewPendingAttendance}
                        >
                            <FaEye /> Visualizar Asistencias Pendientes
                        </button>
                        
                    )}
                    {employee && employee.jobTitle === 'Jefe de Brigada' && (
                        <button
                            className="view-rol-user"
                            onClick={handleRolUser}
                        >
                            <FaEye /> Visualizar Roles de los Trabajadores
                        </button>
                        
                    )}

                    <button className="view-groups-button" onClick={handleViewGroups}>
                        <FaEye /> Ver grupos conformados
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;

