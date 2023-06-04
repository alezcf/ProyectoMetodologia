//#region Complementos necesarios del main
/* eslint-disable no-console */
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
require('dotenv').config();
//#endregion

//#region Configuración y conexion de la base de datos
const { URI } = require('./config/default');
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Base de datos conectada'))
  .catch(error => console.error('Error al conectar a la base de datos:', error));
//#endregion

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de Express
app.use(express.json())
app.use("/", require("./routes/index"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Rutas
app.get('/', (req, res) => {
  res.render('login', { mensajeError: '' });
});


// Iniciar el servidor
app.listen(port, () => {  });
