//#region Complementos necesarios del main
/* eslint-disable no-console */
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();


//#endregion
//
//#region Configuración y conexion de la base de datos
const { URI } = require('./config/default');

const app = express();
const port = 3000;

//#endregion

//#region Configuración y conexion de la base de datos
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Base de datos conectada'))
  .catch(error => console.error('Error al conectar a la base de datos:', error));
//#endregion

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "SesionSecreta",
  resave: false,
  saveUninitialized: false
}));

// Configuración de Express
app.use(express.json());
app.use("/", require("./routes/index"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', (req, res) => {
  res.render('login', { mensajeError: '' });
});

// Configuracion uso del MIME type para archivos .js
/*app.use(express.static('js', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
*/

// Ruta para cerrar sesión
app.post('/logIn', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/'); // Redirige a la página de inicio de sesión
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
