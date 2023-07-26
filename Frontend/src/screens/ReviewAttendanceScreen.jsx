import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/ReviewAttendanceScreen.css'; // Asegúrate de que el nombre del archivo sea correcto

const ReviewAttendanceScreen = () => {
    const [attendanceNotAccepted, setAttendanceNotAccepted] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const getAttendanceNotAccepted = async () => {
        try {
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
            rut: attendanceNotAccepted.find((attendance) => attendance._id === attendanceId).idUser,
            fecha: attendanceNotAccepted.find((attendance) => attendance._id === attendanceId).date,
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

    return (
        <div className="container">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {attendanceNotAccepted.length > 0 ? (
            <React.Fragment>
            <Link to="/">Volver</Link>
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
            <Link to="/">Volver</Link>
            <p>No hay asistencias pendientes de aprobación</p>
            </React.Fragment>
        )}
        </div>
    );
};

export default ReviewAttendanceScreen;
