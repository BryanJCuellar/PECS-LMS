// Valores para conexion a la BD (Cambiar en produccion)
module.exports = {
    database: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'pecs_lms',
        port: 3306,
        multipleStatements: true // Para procedimientos almacenados con parametros de salida
        /*connectionLimit: 100*/
    }
}