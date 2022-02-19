var mysql = require('mysql');
var keys = require('./keys');
// Declarar datos de la base a conectar
const pool = mysql.createPool(keys.database);
// Conexion a la base
pool.getConnection((err, connection) => {
    if (err) {
        console.log('Database connection error: ', err);
        return;
    }
    if (connection) {
        connection.release();
        console.log('Database Call Successful');
    }
});

module.exports = pool;