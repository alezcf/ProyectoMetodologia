/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ReviewAttendanceScreen.css'; // Asegúrate de que el nombre del archivo sea correcto
import { useHistory, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ReviewAttendanceScreen = () => {
    const [attendanceNotAccepted, setAttendanceNotAccepted] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const rut = params.get('rut');

    const getAttendanceNotAccepted = async () => {
        try {
        console.log("Rut recibido = " + rut)
        const res = await axios.get('http://localhost:3001/asistencia/readNotAccepted');
        const data = res.data;

        if (data.status === 200) {
            setAttendanceNotAccepted(data.arrayAttendance);
        } else {
            setErrorMessage('Error al obtener las asistencias');
        }
        } catch (error) {
        console.log(error);
        setErrorMessage('Error al obtener las asistencias');
        }
    };

    useEffect(() => {
        getAttendanceNotAccepted();
    }, []);

    const handleAcceptAttendance = async (attendanceId) => {
        try {
        const response = await axios.post(`http://localhost:3001/asistencia/acceptAttendance`, {
            rut: attendanceNotAccepted.find((attendance) => attendance._id === attendanceId).idUser,
            fecha: attendanceNotAccepted.find((attendance) => attendance._id === attendanceId).date,
        });

        if (response.status === 200) {
            // Actualizar la lista de asistencias después de aceptar una
            getAttendanceNotAccepted();
        } else {
            setErrorMessage('Error al aceptar la asistencia');
        }
        } catch (error) {
        console.log(error);
        setErrorMessage('Error al aceptar la asistencia');
        }
    };

    const handleRejectAttendance = async (attendanceId) => {
        try {
            const response = await axios.post(`http://localhost:3001/asistencia/deleteAttendance`, {
                _id: attendanceId,
            });

            if (response.status === 200) {
                // Actualizar la lista de asistencias después de rechazar una
                getAttendanceNotAccepted();
            } else {
                setErrorMessage('Error al rechazar la asistencia');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('Error al rechazar la asistencia');
        }
    };

    const handleGoBack = () => {
      // Redireccionar a la siguiente URL con el valor de "rut"
      history.push(`/trabajador/${rut}`);
    };

    const backButtonContainerStyle = {
      position: 'relative', // Set the container position to relative
      marginBottom: '20px', // Ajusta el margen inferior para separar el botón de la tabla
    };

      const buttonStyleGoBack = {
        backgroundColor: '#3A789E', // Set the background color to blue
        color: 'white', // Set the text color to white
        padding: '10px 20px', // Adjust the padding to make the button smaller
        fontSize: '14px', // Adjust the font size to make the text smaller
        fontFamily: 'Arial',
        top: "-150px",
        right: "690px"
      };


    return (
        <div className="container">
          <div style={backButtonContainerStyle}>
          <Button
            variant="contained"
            style={buttonStyleGoBack}
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Volver
          </Button>
        </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {attendanceNotAccepted.length > 0 ? (
            <React.Fragment>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th colSpan="3" className="table-title">
                      Revisión Pendiente
                    </th>
                  </tr>
                  <tr>
                    <th>ID de Usuario</th>
                    <th>Fecha</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceNotAccepted.map((attendance) => (
                    <tr key={attendance._id}>
                      <td>{attendance.idUser}</td>
                      <td>{attendance.date}</td>
                      <td>
                        <button className="accept-button" onClick={() => handleAcceptAttendance(attendance._id)}>
                          Aceptar
                        </button>
                        <button className="reject-button" onClick={() => handleRejectAttendance(attendance._id)}>
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>No hay asistencias pendientes de aprobación</p>
            </React.Fragment>
          )}
        </div>
    );
};

export default ReviewAttendanceScreen;
