module.exports = (app, pool, passport) => {
    // Controladores
    const usersController = require('../controllers/users.controller')(pool);
    const authController = require('../controllers/auth.controller')(passport);

    // GET
    // Habilitar enlace del email guardado mediante codigo confirmacion y idUsuario para activar cuenta
    app.get('/users/:idUsuario/:codigoConfirmacion/enableLinkEmail', usersController.enableLinkEmail);

    // Habilitar la activacion de la cuenta
    app.get('/users/:idUsuario/:codigoConfirmacion/enableVerifyAccount', usersController.enableVerifyAccount);

    // Informacion de usuario en sesion
    app.get('/users/sessionUser', authController.isLoggedIn, (req, res) => {
        res.send({
            data: req.user
        });
        res.end();
    });

    // Logout usuario
    app.get('/users/logout', authController.isLoggedIn, authController.logoutUser);

    // POST
    // Registrar usuario y enviar email de registro
    app.post('/users/signup', usersController.registerUser, usersController.sendEmailRegister);

    // Validar email para registro
    app.post('/users/signup/validateEmail', usersController.validateEmail);

    // Validar username para registro
    app.post('/users/signup/validateUsername', usersController.validateUsername);

    // Enviar email de registro para activacion de la cuenta
    app.post('/users/sendEmail/verifyAccount', usersController.sendEmailRegister);

    // Login usuario
    app.post('/users/login', authController.loginUser, (req, res) => {
        res.status(200).send({
            message: 'Login exitoso'
        });
        res.end();
    });

    // PUT
    // Login usuario y activar cuenta (Actualizar estado = 1)
    app.put('/users/login/verifyAccount', authController.loginUser, 
    authController.isLoggedIn, usersController.verifyAccount);

}