// Protocolo HTTP
// Get: Obtener
// Put: Modificar/Actualizar
// Patch: Modificar/Actualizar
// Post: Crear
// Delete: Eliminar
const Asistencia = require('./Asistencias');
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');



const username = encodeURIComponent('probandoMongo');
const password = encodeURIComponent('VqAFtT6QbTkpj4sX');
const cluster = 'cluster0.kllcv5b.mongodb.net';
const authSource = 'admin';
const authMechanism = 'SCRAM-SHA-1';

const uri = `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`;
mongoose.connect(uri,
    {useNewUrlParser: true, useUnifiedTopology: true}
)
  .then(() => console.log('Base de datos conectada'))
  .catch(e => console.log(e));
// const Asistencia = require('/router/Asistencias');

// app.use('/asistencias', Asistencia);
app.use('/asistencias', Asistencia);
app.get('/', (req, res) =>{
  res.send('Hola mi server en express');
})

app.listen(port, () => {
  console.log('El puerto ' + port + ' esta funcionando');
});

app.get('/nueva-ruta', (req, res) =>{
  res.send('Estamos generando una ruta alternativa.');
})


// Tenemos cada usuario dentro de un arreglo.
app.get('/nuevo-usuario', (req, res) =>{
  res.json([
  {
    'nombre': 'Alexander',
    'edad': 21,
  },
  {
    'nombre': 'Julian',
    'edad': 25,
  }]);
})

app.get('/users', (req, res) =>{
  const { limit, offset } = req.query;
    if(limit && offset){
      res.json({
        limit,
        offset
      });
    }
    else
      res.send('No existen parametros');
  });
// Damos los parametros para localizar un usuario especifico
// mediante su ID.
app.get('/nuevo-usuario/:id', (req, res) =>{
  const { id } = req.params;
  res.json({
    id,
    'nombre': 'Alexander',
    'edad': 21,
  });
})
