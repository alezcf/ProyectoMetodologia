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

app.get('/nueva-ruta', (req, res) => {
  res.send('Estamos generando una ruta alternativa.');
});

app.get('/nuevo-usuario', (req, res) => {
  res.json([
    {
      nombre: 'Alexander',
      edad: 21,
    },
    {
      nombre: 'Julian',
      edad: 25,
    }
  ]);
});

app.get('/users', (req, res) => {
  const { limit, offset } = req.query;
  if (limit && offset) {
    res.json({
      limit,
      offset
    });
  } else {
    res.send('No existen parámetros');
  }
});

app.get('/nuevo-usuario/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    nombre: 'Alexander',
    edad: 21,
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
