//#region Complementos necesarios del main
/* eslint-disable no-console */
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
//#endregion

//#region Configuración y conexion de la base de datos
const { URI } = require('./config/default');
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Base de datos conectada'))
  .catch(error => console.error('Error al conectar a la base de datos:', error));
//#endregion

// Configuración de Express
app.use(express.json())
app.use("/", require("./routes/index"));
app.set('view engine', 'ejs');
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('Hola, mi servidor en Express');
});

// Iniciar el servidor
app.listen(port, () => {  });
