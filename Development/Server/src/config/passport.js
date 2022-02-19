// Source: https://www.youtube.com/playlist?list=PLmGlSqRtRSPjL9MxaiaXQcfVxswKErJTq (Passport with Angular)
// Dependencies
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

module.exports = (pool, passport) => {
    // Serialize session user
    passport.serializeUser((user, done) => {
        done(null, user.idUsuario);
    });
    // Deserialize user
    passport.deserializeUser((id, done) => {
        let query = `SELECT u.idUsuario,u.nombre,u.apellido,u.nombreUsuario,u.urlImagenPerfil,u.estado,u.idCategoriaUsuario,c.descripcion AS correo FROM Usuario u
        INNER JOIN Correo c ON c.idUsuario = u.idUsuario
        WHERE u.idUsuario = ${id} AND c.correoSesion = 1`;
        pool.query(query, (err, result) => {
            done(err, result[0]);
        });
    });

    // Local Login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        let query = `SELECT * FROM Usuario u
        INNER JOIN Correo c ON c.idUsuario = u.idUsuario
        WHERE (u.nombreUsuario = "${username}" OR c.descripcion = "${username}") AND c.correoSesion = 1`;
        pool.query(query, (err, result) => {
            if (err) {
                return done(err);
            }
            // Si no encontro usuario o correo
            if (!result.length) {
                return done(null, false, {
                    message: 'Usuario/Correo no encontrado'
                });
            }
            // Si la contraseña es incorrecta
            if (!bcrypt.compareSync(password, result[0].clave)) {
                return done(null, false, {
                    message: 'Contraseña incorrecta'
                });
            }
            // Si datos son correctos
            return done(null, result[0]);
        });
    }));

}