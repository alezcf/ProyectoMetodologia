const express = require('express');
const router = express.Router();

const Asistencia = require('./models/asistencia');

// Get: Leer
router.get('/', async (req, res) => {

    try{
        const arrayAsistenciaDB = await Asistencia.find();
        console.log(arrayAsistenciaDB)
        res.render("asistencias", {
          arrayAsistencia: arrayAsistenciaDB
      });
    } catch (error) {
        console.log(error);
    }


});

module.exports = router;
