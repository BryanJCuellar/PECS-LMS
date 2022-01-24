// Creacion de aplicacion Express
const express = require('express');
const app = express();
// Conexion a la BD
const pool = require('./database/connection');
// Gestion de las sesiones
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
// Core Modules
const path = require('path');
// Para ver el log de los requests que recibe el servidor
const morgan = require('morgan');
// Modulo cors para prevenir problemas de dominios cruzados
const cors = require('cors');
// Para cargar variables de entorno del archivo .env
const dotenv = require('dotenv');
dotenv.config({
    path: path.join(__dirname, '..', '.env')
});
// Para autenticar peticiones
const passport = require('passport');
// Configuracion de passport
require('./config/passport')(pool, passport);
// Hora en milisegundos
const ONE_HOUR = 1000 * 60 * 60;
// Configuracion de sesion
var sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: ONE_HOUR / 4, // 15 minutes
    expiration: 60000, // 1 Minute
    createDatabaseTable: true,
    schema: {
        tableName: 'Sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, pool);
var sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: ONE_HOUR * 5, // 30 minutes
        httpOnly: false,
        secure: false
    }
};
// Si el entorno es de produccion
if (app.get('env') === 'production') {
    // app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
}

/***Middlewares***/
app.use(morgan('dev'));
app.use(cors({
    origin: "http://localhost:4200", // Cambiar ruta ya puesto en produccion
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Probar conexion cuando ocurre error 503
var testConnectionController = require('./controllers/test-connection.controller')(pool);
app.get('/testConn', testConnectionController.connect);

// Rutas
require('./routes/users-routes')(app, pool, passport);
require('./routes/programs-routes')(app, pool);

// process.env.PORT: variable de entorno para escuchar el puerto brindado por plataforma para produccion
app.set('port', process.env.PORT || 8888);

module.exports = app;