// Creacion de aplicacion Express
const express = require('express');
const app = express();
// Conexion a la BD
const pool = require('./database/connection');
// Gestion de las sesiones
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
// Para ver el log de los requests que recibe el servidor (Solo en desarrollo)
const morgan = require('morgan');
// Modulo cors para prevenir problemas de dominios cruzados
const cors = require('cors');
// Si el entorno es de desarrollo
if (app.get('env') === 'development') {
    // Modulo dotenv para cargar variables de entorno del archivo .env (solo en desarrollo)
    require('dotenv').config();
}
// Modulo passport para autenticar usuarios
const passport = require('passport');
// Configuracion de passport
require('./config/passport')(pool, passport);
// Hora en milisegundos
const ONE_HOUR = 1000 * 60 * 60;
// Configuracion de sesion en MySQLStore
var sessionStore = new MySQLStore({
    clearExpired: true, // Limpiar las sesiones expiradas de la base
    checkExpirationInterval: ONE_HOUR / 4, // Revisar expiracion cada 15 minutos
    expiration: 60000, // 1 minuto de expiracion (Esto ocurre una vez que cookie.maxAge ha expirado)
    createDatabaseTable: true, // Crear una tabla de sesiones en caso de no existir
    schema: {
        tableName: 'Sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, pool);
// Configuracion de sesion con express-session
var sessionOptions = {
    secret: process.env.SESSION_SECRET, // Secreto para el cookie del session ID
    resave: true, // Guarda o actualiza la sesion en store, aun cuando esta no ha sido modificada durante una peticion
    rolling: true, // Reestablece la cuenta regresiva de la expiracion de maxAge durante una peticion
    saveUninitialized: false, // Guarda sesiones no inicializadas en store, lo declaramos false para solo guardar sesiones con login
    store: sessionStore, // Session store con MySQL
    cookie: {
        maxAge: ONE_HOUR / 2, // Duracion de cookie - 30 minutos de inactividad
        httpOnly: false,
        secure: false
    }
};
// Si el entorno es de produccion
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
}

/***Middlewares***/
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:8888', // Cambiar ruta ya puesto en produccion
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Client Files
app.use('/', express.static('src/pecs-client'));

// Probar conexion cuando ocurre error 503
var testConnectionController = require('./controllers/test-connection.controller')(pool);
app.get('/testConn', testConnectionController.connect);

// Rutas
require('./routes/users-routes')(app, pool, passport);
require('./routes/programs-routes')(app, pool);

// process.env.PORT: variable de entorno para escuchar el puerto brindado por plataforma para produccion
app.set('port', process.env.PORT || 8888);

module.exports = app;