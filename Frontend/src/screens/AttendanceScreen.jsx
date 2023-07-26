import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../css/AttendanceScreen.css'; // Importamos el archivo de estilos CSS

const AttendanceScreen = () => {
    const [arrayAttendance, setArrayAttendance] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState('Todos'); // Estado para controlar la opción seleccionada
    const [searchRut, setSearchRut] = useState(''); // Estado para almacenar el RUT ingresado en el buscador
    const [filteredAttendance, setFilteredAttendance] = useState([]); // Estado para almacenar los usuarios filtrados por RUT
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
    }, [selectedOption]); // Dependencia para volver a cargar los datos cuando cambie la opción seleccionada

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
                    break; // Si no se seleccionó ninguna opción válida, simplemente retornamos
            }
    
            const res = await axios.get(downloadUrl, {
                responseType: 'blob', // Indicamos que esperamos una respuesta en formato blob (archivo)
            });
    
            // Crea un enlace temporal para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'asistencia.pdf'); // Nombre del archivo a descargar
            document.body.appendChild(link);
            link.click();
    
            // Libera el enlace temporal después de la descarga
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
            setErrorMessage('Error al descargar la asistencia');
        }
    };


    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    // Función para manejar el cambio en el campo de búsqueda
    const handleSearchChange = (event) => {
        setSearchRut(event.target.value);
        handleSearchAttendance(event.target.value);
    };

    // Función para manejar la búsqueda por RUT
    const handleSearchAttendance = (rut) => {
        if (rut.trim() === '') {
        // Si el campo de búsqueda está vacío, mostramos todas las asistencias
        setFilteredAttendance([]);
        } else {
        // Filtrar los usuarios según el RUT ingresado
        const filteredUsers = arrayAttendance.filter(
            (attendance) => attendance.idUser.includes(rut)
        );
        setFilteredAttendance(filteredUsers);
        }
    };

    return (
        <div className="attendance-container">
        <h1 className="attendance-title">Listado de Asistencias</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="options-menu">
            <button className={selectedOption === 'Todos' ? 'selected' : ''} onClick={() => handleOptionChange('Todos')}>Todos</button>
            <button className={selectedOption === 'Diaria' ? 'selected' : ''} onClick={() => handleOptionChange('Diaria')}>Diaria</button>
            <button className={selectedOption === 'Semanal' ? 'selected' : ''} onClick={() => handleOptionChange('Semanal')}>Semanal</button>
            <button className={selectedOption === 'Mensual' ? 'selected' : ''} onClick={() => handleOptionChange('Mensual')}>Mensual</button>
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
            </tr>
            </thead>
            <tbody>
            {(searchRut.trim() === '' ? arrayAttendance : filteredAttendance).map((attendance) => (
                <tr key={attendance.id}>
                <td className="centered-cell">{attendance.idUser}</td>
                <td className="centered-cell">{attendance.date}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <button className="go-back-button" onClick={handleGoBack}>Volver Atrás</button>
        <button className="download-button" onClick={handleDownloadAttendance}>Descargar asistencia</button>
        </div>
    );
};

export default AttendanceScreen;

