var mysql = require('mysql');
var keys = require('./keys');

const pool = mysql.createPool(keys.database);

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