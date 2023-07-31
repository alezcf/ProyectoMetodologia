import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import '../css/AttendanceScreen.css';
import moment from 'moment';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; // Importar el icono LibraryBooks
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { makeStyles } from '@mui/styles';

const AttendanceScreen = () => {
  
  const [arrayAttendance, setArrayAttendance] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState('Todos');
  const [searchRut, setSearchRut] = useState('');
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const user = location?.state?.user;

  useEffect(() => {
    const getAttendance = async () => {
      try {
        let url;
        // Verifica si el usuario tiene el jobTitle adecuado para ver todas las asistencias
        if (user && user.jobTitle === 'Jefe de Brigada') {
          console.log("El usuario es jefe de brigada");
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
        } else {
          console.log("El usuario NO ES jefe de brigada");
          switch (selectedOption) {
            case 'Diaria':
              url = `http://localhost:3001/asistencia/readDailyAttendanceForRUT?rut=${user.rut}`;
              break;
            case 'Semanal':
              url = `http://localhost:3001/asistencia/readWeeklyAttendanceForRUT?rut=${user.rut}`;
              break;
            case 'Mensual':
              url = `http://localhost:3001/asistencia/readMonthlyAttendanceForRUT?rut=${user.rut}`;
              break;
            default:
              url = `http://localhost:3001/asistencia/readAttendanceForRUT?rut=${user.rut}`;
              break;
          }
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
  }, [selectedOption, user]);

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

  const handleDateModification = (attendanceData) => {
    const newDate = prompt('Ingrese la nueva fecha', 'DD/MM/YYYY');
    if (newDate) {
      const formattedDate = moment(newDate, 'DD-MM-YYYY').format('DD/MM/YYYY');
      handleModifyAttendance(
        { _id: attendanceData._id, idUser: attendanceData.rut, date: attendanceData.fecha },
        formattedDate
      );
    }
  };

  const buttonStyle = {
    backgroundColor: '#3A789E',  // Set the background color to blue
    color: 'white',           // Set the text color to white
    padding: '5px 8px',     // Adjust the padding to make the button smaller
    fontSize: '14px',
    font: 'Arial'         // Adjust the font size to make the text smaller
  };

  const buttonStyleMenu = {
    backgroundColor: '#3A789E',  // Set the background color to blue
    color: 'white',           // Set the text color to white
    padding: '8px 15px',     // Adjust the padding to make the button smaller
    fontSize: '14px',
    font: 'Arial'         // Adjust the font size to make the text smaller
  };

  const buttonStyleDelete = {
    backgroundColor: '#C90040',  // Set the background color to red
    color: 'white',          // Set the text color to white
    padding: '5px 8px',     // Adjust the padding to make the button smaller
    fontSize: '14px',
    font: 'Arial'        // Set the text color to white
  };

  const buttonStyleGoBack = {
    backgroundColor: '#3A789E',  // Set the background color to blue
    color: 'white',           // Set the text color to white
    padding: '10px 20px',       // Adjust the padding to make the button smaller
    fontSize: '14px',         // Adjust the font size to make the text smaller
    fontFamily: 'Arial',      // Set the font family
  };

  const buttonStyleDownload = {
    backgroundColor: '#00AD45',
    color: 'white',
    padding: '10px 20px',
    fontSize: '14px',
    fontFamily: 'Arial',
    position: 'absolute', // Set the position to absolute
    top: '60px',          // Set the top position to create a margin of 60px from the top
    right: '20px',        // Set the right position to move the button to the right
  };



  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px', // Add a gap of 10px between the buttons
  };

  const backButtonContainerStyle = {
    position: 'relative',     // Set the container position to relative
    top: '-10px',              // Set the top position to create a margin of 30px from the top
    right: '700px',                // Set the left position to align the button to the left
  };
  
  const renderAttendanceRows = () => {
    const attendanceData = searchRut.trim() === '' ? arrayAttendance : filteredAttendance;

    return attendanceData.map((attendance) => (
      <tr key={attendance._id}>
        <td className="centered-cell">{attendance.idUser}</td>
        <td className="centered-cell">{attendance.date}</td>
        {user?.jobTitle === 'Jefe de Brigada' && (
          <td className="centered-cell">
            <div className="actions-container">
            <div style={buttonContainerStyle}>
        <Button
          variant="contained"
          style={buttonStyle}
          startIcon={<EditIcon />}
          onClick={() => handleDateModification(attendance)}
        >
          Modificar
        </Button>
        <Button
          variant="contained"
          style={buttonStyleDelete}
          startIcon={<DeleteIcon />}
          onClick={() => handleDeleteAttendance(attendance)}
        >
          Eliminar
        </Button>
      </div>
            </div>
          </td>
        )}
      </tr>
    ));
  };

  const useStyles = makeStyles((theme) => ({
    searchContainer: {
      display: 'flex',
      justifyContent: 'center',
      margin: '10px 0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Agrega la sombra al campo de búsqueda
    },
    searchInput: {
      width: 250, // Ajusta el ancho a tu preferencia
    }, 
    searchIcon: {
      color: '#6A7A7A', // Cambia el color del icono a rojo
    },
  }));

  const classes = useStyles();

  return (
    <div>

      
      <div className="user-bar">
        <p className="user-name">{user?.names + ' ' + user?.lastName}</p>
      </div>


      
      
      <div className="attendance-container">
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
        <h1 className="attendance-title">Listado de Asistencias</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="options-menu">
        <Button
            variant="contained"
            color="secondary"
            className={`black-button ${selectedOption === 'Todos' ? 'selected' : ''}`}
            style={buttonStyleMenu}
            onClick={() => handleOptionChange('Todos')}
            title="Todos los registros"
          >
            <LibraryBooksIcon />
            Todos
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={`black-button ${selectedOption === 'Diaria' ? 'selected' : ''}`}
            style={buttonStyleMenu}
            onClick={() => handleOptionChange('Diaria')}
            title="Registros diarios"
          >
            <LibraryBooksIcon />
            Diaria
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={`black-button ${selectedOption === 'Semanal' ? 'selected' : ''}`}
            style={buttonStyleMenu}
            onClick={() => handleOptionChange('Semanal')}
            title="Registros semanales"
          >
            <LibraryBooksIcon /> 
            Semanal
          </Button>
          <Button
            variant="outlined"
            className={`black-button ${selectedOption === 'Mensual' ? 'selected' : ''}`}
            style={buttonStyleMenu}
            onClick={() => handleOptionChange('Mensual')}
            title="Registros mensuales"
          >
            <LibraryBooksIcon /> 
            Mensual
          </Button>
        </div>
</div>
        <div className="search-container">
        <TextField
            type="text"
            label="Búsqueda por RUT..."
            placeholder="Ejemplo: 12.345.678-9"
            value={searchRut}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon className={classes.searchIcon} />, // Aplica los estilos al icono
              className: classes.searchInput, // Aplica los estilos al campo de entrada
            }}
            variant="outlined"
          />
        </div>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>RUT Usuario</th>
              <th>Fecha</th>
              {user?.jobTitle === 'Jefe de Brigada' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>{renderAttendanceRows()}</tbody>
        </table>

        {user?.jobTitle === 'Jefe de Brigada' && (
          <Button
            variant="contained"
            style={buttonStyleDownload}
            startIcon={<CloudDownloadIcon />}
            onClick={handleDownloadAttendance}
          >
            Descargar asistencia
          </Button>
        )}
      </div>

  );
};

export default AttendanceScreen;
