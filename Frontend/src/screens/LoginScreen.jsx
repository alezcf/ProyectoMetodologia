import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import '../css/LoginScreen.css';
import { FaSignInAlt, FaSignOutAlt, FaEye } from 'react-icons/fa';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import sweetalert from 'sweetalert'; // npm i librería 'sweetalert'
import NotificationsIcon from '@mui/icons-material/Notifications';

const LoginScreen = ({ match }) => {
    const [employee, setEmployee] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [redirectToPendingAttendance ] = useState(false);
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
        // Redireccionar a la siguiente URL y pasar el objeto "employee" como query params
        history.push({
            pathname: '/asistencia/readNotAccepted',
            search: `?rut=${employee.rut}`,
        });
    };

    const handleRegisterAttendance = () => {
        axios.post('http://localhost:3001/asistencia/create', {
            idUser: rut,
        })
            .then((response) => {
                console.log('Asistencia registrada con éxito:', response.data);

                if (response.status === 201) {
                    // Si el estatus es 201, mostramos un mensaje de éxito
                    alert('Aceptado','La asistencia fue registrada correctamente','success');
                } else if (response.status === 304) {
                    // Si el estatus es 409, mostramos un mensaje de asistencia ya registrada
                    sweetalert('Advertencia','La asistencia ya fue registrada el dia de hoy','warning');
                }
            })
            .catch((error) => {
                // Manejo de errores
                console.error('Error al registrar la asistencia:', error);
                // Mostrar un mensaje de error o realizar otras acciones en caso de error
                sweetalert('Error','Hubo un error al registrar la asistencia','error');
            });
    };

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

    const iconStyle = {
        color: '#F0E928',      // Establece el color del icono en gris
        backgroundColor: '#da2133', // Establece el fondo del icono en rojo
        padding: '10px',
        borderRadius: '50%', // Aplica una forma circular al fondo
        position: 'relative', // Establece la posición del icono como relativa
        right: '-330px',      // Desplaza el icono 20px hacia la derecha
        top: "-210px",
        
    };

    const buttonContainerStyle = {
        marginTop: '-80px', // Ajusta el margen superior para acercar los botones al contenido del usuario
      };

    const buttonStyle = {
        backgroundColor: 'transparent', // Establece el fondo del botón como transparente
        border: 'none', // Elimina el borde del botón
        cursor: 'pointer', // Establece el cursor como un puntero al pasar sobre el botón
        boxShadow: 'none', // Elimina la sombra del botón
      };

    return (
        
        <div className="container">
            <ThemeProvider theme={theme}>
                    <h1 variant="h1">INICIO</h1>
            </ThemeProvider>
            <div className="inner-container">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
                {employee && (
                    <div>
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
                <button className="notifications" style={buttonStyle} onClick={handleViewNotification}>
                    <NotificationsIcon style={iconStyle} />
                </button>
                <div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}>
                        <FaSignOutAlt /> Cerrar sesión
                    </button>
                </div>
                <div className="button-container" style={buttonContainerStyle}>
                <Link to={{ pathname: '/asistencia/read', state: { user: employee } }} className="view-attendance-button">
                <FaEye /> Visualizar asistencia
                </Link>
                    <button className="register-attendance-button" onClick={handleRegisterAttendance}>
                        <FaSignInAlt /> Registrar asistencia
                    </button>
                    {employee && employee.jobTitle === 'Jefe de Brigada' && (
                        <button
                            className="view-pending-attendance-button"
                            onClick={handleViewPendingAttendance}
                        >
                            <FaEye /> Visualizar asistencias pendientes
                        </button>
                        
                    )}
                    {employee && employee.jobTitle === 'Jefe de Brigada' && (
                        <button
                            className="view-rol-user"
                            onClick={handleRolUser}
                        >
                            <FaEye /> Visualizar rol de los trabajadores
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

