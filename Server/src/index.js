// Creacion de aplicacion express
var app = require('./app');

var http = require('http');

const server = http.Server(app);

app.get('/', function(req, res){
    res.send('Ruta principal de servidor de PECS LMS activa');
});

server.listen(app.get('port'), function () {
    console.log(`Servidor en el puerto ${app.get('port')}`)
})