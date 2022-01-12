var express = require('express');
var router = express.Router();
// Controlador
var usersController = require('../controllers/users.controller');

// Registrar Usuario
router.post('/signup', usersController.registerUser, usersController.sendEmailRegister);

// Validar email
router.post('/signup/validateEmail', function (req, res) {
    res.status(200).send({
        mensaje: 'Email no duplicado'
    });
    res.end();
});

// Validar username
router.post('/signup/validateUsername', function (req, res) {
    res.status(200).send({
        mensaje: 'Nombre de usuario no duplicado'
    });
    res.end();
});

// Enviar email para activacion de la cuenta
router.post('/signup/send-email/verify-account', usersController.sendEmailRegister);

// Habilitar enlace email guardado mediante codigo confirmacion y idUsuario para activar cuenta
router.get('/:idUsuario/email', usersController.enableLinkEmail);

module.exports = router