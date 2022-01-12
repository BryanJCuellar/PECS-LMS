// Creación de aplicación Express
var express = require('express');
const app = express();

var morgan = require('morgan');
// Modulo cors para prevenir problemas de dominios cruzados
var cors = require('cors');
// Para cargar variables de entorno del archivo .env
var dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Rutas Express
var usersRouter = require('./routes/users-router');

// Probar conexion cuando ocurre error 503
var testConnectionController = require('./controllers/test-connection.controller');
app.get('/testConn', testConnectionController.connect );

app.use('/users', usersRouter);

// process.env.PORT: variable de entorno para escuchar el puerto brindado por plataforma para produccion
app.set('port', process.env.PORT || 8888);

module.exports = app;