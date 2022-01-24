function authController(passport) {
    let controllerMethods = {};
    // Login Usuario
    controllerMethods.loginUser = (req, res, next) => {
        passport.authenticate('local-login', (err, usuario, info) => {
            if (err) {
                return res.status(500).send({
                    errorMessage: err
                });
            }
            if (!usuario) {
                // No se encontro usuario con los datos enviados
                return res.status(400).send('Usuario/Correo u Contraseña no válidos');
            }
            // Si datos son validos, intentar iniciar sesion
            req.logIn(usuario, (err) => {
                if (err) {
                    return res.status(500).send({
                        errorMessage: err
                    });
                }
                /*En este punto, el usuario ya se encuentra logueado, por lo que el siguiente paso
                seria enviar el response o activar la cuenta dependiendo de cual sea la peticion*/
                next();
            });
        })(req, res, next);
    };

    // Logout Usuario
    controllerMethods.logoutUser = (req, res) => {
        req.logout();
        req.session.destroy(function (err) {
            if (err) {
                return res.status(500).send({
                    errorMessage: err
                });
            }
            return res.status(200).clearCookie('connect.sid', {
                path: '/'
            }).send({
                message: 'Logout exitoso'
            });
        });
    };

    // Verificar si existe un usuario en sesion antes de que acceda a un recurso en el que se requiera estar logueado
    controllerMethods.isLoggedIn = (req, res, next) => {
        if (req.isAuthenticated()) {
            // Si hay usuario en sesion, prosigue con el recurso solicitado
            next();
        } else {
            return res.status(401).send('Inicia sesión para acceder a este recurso');
        }
    };

    return controllerMethods;
}

module.exports = authController;