import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../css/AttendanceScreen.css';
import moment from 'moment';

const AttendanceScreen = () => {
    const [arrayAttendance, setArrayAttendance] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState('Todos');
    const [searchRut, setSearchRut] = useState('');
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [newDate, setNewDate] = useState(''); // Agregamos el nuevo estado para la fecha
    const history = useHistory();

    useEffect(() => {
        const getAttendance = async () => {
            try {
                let url;
                switch (selectedOption) {
                    case 'Diaria':
                        url = 'http://localhost:3001/asistencia/readDaily';
                        break;
                    case 'Semanal':
                        url = 'http://localhost:3001/asistencia/readWeekly';
                        break;
                    case 'Mensual':
                        url = 'http://localhost:3001/asistencia/readMonthly';
                        break;
                    default:
                        url = 'http://localhost:3001/asistencia/read';
                        break;
                }

                const res = await axios.get(url);
                const data = res.data;

                if (data.error) {
                    setErrorMessage(data.message);
                } else {
                    setArrayAttendance(data.arrayAttendance);
                }
            } catch (error) {
                console.log(error);
                setErrorMessage('Error al obtener las asistencias');
            }
        };

        getAttendance();
    }, [selectedOption]);

    const handleGoBack = () => {
        history.goBack();
    };

    const handleDownloadAttendance = async () => {
        try {
            let downloadUrl;
            switch (selectedOption) {
                case 'Diaria':
                    downloadUrl = 'http://localhost:3001/asistencia/downloadDailyAttendance';
                    break;
                case 'Semanal':
                    downloadUrl = 'http://localhost:3001/asistencia/downloadWeeklyAttendance';
                    break;
                case 'Mensual':
                    downloadUrl = 'http://localhost:3001/asistencia/downloadMonthlyAttendance';
                    break;
                default:
                    downloadUrl = 'http://localhost:3001/asistencia/downloadAllAttendance';
                    break;
            }

            const res = await axios.get(downloadUrl, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'asistencia.pdf');
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
            setErrorMessage('Error al descargar la asistencia');
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleSearchChange = (event) => {
        setSearchRut(event.target.value);
        handleSearchAttendance(event.target.value);
    };

    const handleSearchAttendance = (rut) => {
        if (rut.trim() === '') {
            setFilteredAttendance([]);
        } else {
            const filteredUsers = arrayAttendance.filter(
                (attendance) => attendance.idUser.includes(rut)
            );
            setFilteredAttendance(filteredUsers);
        }
    };

    const handleModifyAttendance = async (attendanceData, newDateValue) => {
        try {
            const { _id, idUser, date } = attendanceData; // Se incluye el _id en los datos de la asistencia
    
            // Enviamos tres datos al controller: _id (nuevo), rut, fecha actual y nueva fecha
            const response = await axios.post(`http://localhost:3001/asistencia/updateAttendance`, {
                _id: _id, // Se envía el _id como parte de la solicitud
                rut: idUser,
                fecha: date,
                nuevaFecha: newDateValue,
            });
    
            if (response.data.status === 200) {
                // Actualizamos la lista de asistencias directamente con los datos modificados
                const updatedAttendance = arrayAttendance.map((attendance) => {
                    if (attendance._id === _id) {
                        return {
                            ...attendance,
                            date: newDateValue, // Actualizamos la fecha con el nuevo valor
                        };
                    }
                    return attendance;
                });
    
                setArrayAttendance(updatedAttendance);
            } else {
                setErrorMessage('Error al modificar la asistencia');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('Error al modificar la asistencia');
        }
    };

    const handleDeleteAttendance = async (attendanceData) => {
        try {
            const { idUser, date } = attendanceData;
            const response = await axios.post(`http://localhost:3001/asistencia/deleteAttendance`, {
                rut: idUser,
                fecha: date,
                _id: attendanceData._id, // Se envía el _id como parte de la solicitud
            });
    
            if (response.data.status === 200) {
                // Update the attendance list to remove the deleted record
                const updatedAttendance = arrayAttendance.filter((attendance) => attendance._id !== attendanceData._id);
                setArrayAttendance(updatedAttendance);
            } else {
                setErrorMessage('Error al eliminar la asistencia');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('Error al eliminar la asistencia');
        }
    };

    return (
            <div className="attendance-container">
            <h1 className="attendance-title">Listado de Asistencias</h1>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="options-menu">
                <button
                className={selectedOption === 'Todos' ? 'selected' : ''}
                onClick={() => handleOptionChange('Todos')}
                >
                Todos
                </button>
                <button
                className={selectedOption === 'Diaria' ? 'selected' : ''}
                onClick={() => handleOptionChange('Diaria')}
                >
                Diaria
                </button>
                <button
                className={selectedOption === 'Semanal' ? 'selected' : ''}
                onClick={() => handleOptionChange('Semanal')}
                >
                Semanal
                </button>
                <button
                className={selectedOption === 'Mensual' ? 'selected' : ''}
                onClick={() => handleOptionChange('Mensual')}
                >
                Mensual
                </button>
            </div>
            <div className="search-container">
                <input
                type="text"
                placeholder="Buscar por RUT..."
                value={searchRut}
                onChange={handleSearchChange}
                />
            </div>
            <table className="attendance-table">
        <thead>
            <tr>
                <th>ID Usuario</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {(searchRut.trim() === '' ? arrayAttendance : filteredAttendance).map((attendance) => (
                <tr key={attendance.id}>
                <td className="centered-cell">{attendance.idUser}</td>
                <td className="centered-cell">{attendance.date}</td>
                <td className="centered-cell">
                    <div className="actions-container">
                    <button
                        className="button-edit"
                        onClick={() => {
                            const newDate = prompt('Ingrese la nueva fecha', 'DD/MM/YYYY');
                            if (newDate) {
                                const formattedDate = moment(newDate, 'DD-MM-YYYY').format('DD/MM/YYYY');
                                handleModifyAttendance({ _id: attendance._id, idUser: attendance.rut, date: attendance.fecha }, formattedDate);
                            }
                        }}
                    >
                        Modificar
                    </button>
                    <button
                        className="button-delete"
                        onClick={() => handleDeleteAttendance(attendance)}
                    >
                        Eliminar
                    </button>
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
                <button className="go-back-button" onClick={handleGoBack}>
                    Volver Atrás
                </button>
                <button className="download-button" onClick={handleDownloadAttendance}>
                    Descargar asistencia
                </button>
                </div>
            );
};

export default AttendanceScreen;