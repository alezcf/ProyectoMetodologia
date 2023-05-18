/* eslint-disable no-console */
const express = require('express');
const router = express.Router();

const Asistencia = require('../models/asistencia');

// Ruta GET '/usuarios'
router.get('/', async (req, res) => {
  try {
    const arrayAsistenciaDB = await Asistencia.find();
    console.log(arrayAsistenciaDB);
    res.render("asistencias", {
      arrayAsistencia: arrayAsistenciaDB
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener los usuarios');
  }
});

module.exports = router;
