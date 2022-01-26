// Creacion de aplicacion Express
const express = require('express');
const app = express();
// Conexion a la BD
const pool = require('./database/connection');
// Gestion de las sesiones
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
// Para ver el log de los requests que recibe el servidor
const morgan = require('morgan');
// Modulo cors para prevenir problemas de dominios cruzados
const cors = require('cors');
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
    secret: ['ZShVeQceVMulgGVOhiC8xVberKyeRx','kN0kDMbGXUWUaWOEDBtkBUXzIqZO36','hl0DAMBnIPRFAhX3IbadHiOs9S8GYb'],
    resave: true,
    rolling: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: ONE_HOUR / 2, // 30 minutes
        httpOnly: false,
        secure: false
    }
};

// Si el entorno es de produccion
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
} else {
    // Para cargar variables de entorno del archivo .env (solo en desarrollo)
    require('dotenv').config();
}

/***Middlewares***/
app.use(morgan('dev'));
app.use(cors({
    origin: 'https://pecsfcmunah.herokuapp.com',
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

// Archivos cliente generados con el comando npm run build en Angular
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