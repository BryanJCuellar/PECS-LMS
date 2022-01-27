// Creacion de aplicacion express
const app = require('./app');
const path = require('path');
const http = require('http');
const server = http.Server(app);

// Establecer la ruta de acuerdo a las rutas del app-routing module de angular
app.get('*', function (req, res) {
    res.sendFile(path.resolve('src/pecs-client/index.html'));
});

server.listen(app.get('port'), function () {
    console.log(`Servidor en el puerto ${app.get('port')}`)
})