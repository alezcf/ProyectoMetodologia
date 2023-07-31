import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import '../css/LoginScreen.css';
import { FaSignInAlt, FaSignOutAlt, FaEye } from 'react-icons/fa';
import { makeStyles } from '@mui/styles';

const LoginScreen = ({ match }) => {
    const [employee, setEmployee] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [redirectToPendingAttendance, setRedirectToPendingAttendance] = useState(false);
    const rut = match.params.rut;
    const history = useHistory();

    const useStyles = makeStyles({
        userInfoContainer: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Centrar el contenido verticalmente
          textAlign: 'center', // Centrar el contenido horizontalmente
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px', // Ajusta el ancho máximo según tus necesidades
          margin: '0 auto', // Centrar el contenedor en la página
        }, heading: {
            textAlign: 'center', // Alinear el texto del h1 en el centro
          },
      });

      

      const UserInfoComponent = ({ employee }) => {
        const classes = useStyles();}

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
             <div className= ''> 
                     <h1 >Página de Información del Usuario</h1>
                    </div>
            <div className="inner-container">
                <div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}>
                        <FaSignOutAlt /> Cerrar sesión
                    </button>
                
                   
                </div>
                
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {employee && (
                    <div className={UserInfoComponent}>
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

