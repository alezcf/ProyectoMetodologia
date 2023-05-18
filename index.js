/* eslint-disable no-console */
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
const asistenciasRouter = require('./routes/Asistencias');
const { URI } = require('./config/default');
// Conexión a la base de datos

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Base de datos conectada'))
  .catch(error => console.error('Error al conectar a la base de datos:', error));

// Configuración de Express
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/asistencias', asistenciasRouter);

// Rutas
app.get('/', (req, res) => {
  res.send('Hola, mi servidor en Express');
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
