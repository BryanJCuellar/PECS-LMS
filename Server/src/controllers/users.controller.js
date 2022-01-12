var pool = require('../database/connection');
const frontendHost = 'http://localhost:4200';
// Functions
var currentDateTime = require('../functions/currentDateTime');
var dataIntoJSON = require('../functions/dataIntoJSON');
var extractFirstName = require('../functions/extractFirstName');
var generateRandomCode = require('../functions/generateRandomCode');
// Core Modules
var path = require('path');
var fs = require('fs');
// Dependencies
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');

// Registrar Usuario
exports.registerUser = async (req, res, next) => {
    let clave_hash = bcrypt.hashSync(req.body.clave, 10);
    let codigo_confirmacion = generateRandomCode(25);
    const signData = {
        idCategoriaUsuario: req.body.idCategoriaUsuario,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        numeroTelefono: req.body.numeroTelefono,
        correo: req.body.correo,
        nombreUsuario: req.body.nombreUsuario,
        clave: clave_hash,
        codigoConfirmacion: codigo_confirmacion
    };
    let sign_sp = "CALL SP_REGISTRAR_USUARIO(?,?,?,?,?,?,?,?,@output,@output2,@output3); SELECT @output AS idUsuario,@output2 AS codigo,@output3 AS mensaje";
    await pool.query(
        sign_sp,
        [signData.idCategoriaUsuario, signData.nombre, signData.apellido, signData.numeroTelefono, signData.correo, signData.nombreUsuario, signData.clave, signData.codigoConfirmacion],
        (err, rows) => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            }
            resultData = dataIntoJSON(rows);
            if (resultData[1][0].codigo === 0) {
                req.body.idUsuario = resultData[1][0].idUsuario;
                req.body.codigoConfirmacion = codigo_confirmacion;
                next();
            } else {
                res.send({
                    resultData: resultData[1][0],
                    codigoConfirmacion: codigo_confirmacion
                });
                res.end();
            }
        }
    );
};

// Email para activacion de la cuenta
exports.sendEmailRegister = (req, res) => {
    var readHTMLFile = function (path, callback) {
        fs.readFile(path, {
            encoding: 'utf-8'
        }, function (err, html) {
            if (err) {
                callback(err);
                throw err;
            } else {
                callback(null, html);
            }
        });
    };
    var transporter = nodemailer.createTransport({
        // Gmail
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS
        }
    });
    readHTMLFile(path.join(__dirname, '..', 'views', 'verify-account.html'), (err, html) => {
        var template = handlebars.compile(html);
        var replacements = {
            idUsuario: req.body.idUsuario,
            primerNombre: extractFirstName(req.body.nombre),
            nombreUsuario: req.body.nombreUsuario,
            codigoConfirmacion: req.body.codigoConfirmacion,
            anio: currentDateTime.getCurrentDate('year'),
            frontendHost: frontendHost
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: process.env.AUTH_USER,
            to: req.body.correo,
            subject: "Bienvenido a PECS LMS",
            attachments: [{
                filename: 'Logo-PECS.png',
                path: path.join(__dirname, '..', 'views', 'img', 'Logo-PECS.png'),
                cid: 'logopecs'
            }, {
                filename: 'Logo-FUNDAUNAH.png',
                path: path.join(__dirname, '..', 'views', 'img', 'Logo-FUNDAUNAH.png'),
                cid: 'logofundaunah'
            }, {
                filename: 'Logo-FCM.png',
                path: path.join(__dirname, '..', 'views', 'img', 'Logo-FCM.png'),
                cid: 'logofcm'
            }, {
                filename: 'Logo-UNAH.png',
                path: path.join(__dirname, '..', 'views', 'img', 'Logo-UNAH.png'),
                cid: 'logounah'
            }],
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            } else {
                res.status(200).send({
                    dataResult: {
                        idUsuario: req.body.idUsuario,
                        codigo: 0
                    },
                    codigoConfirmacion: req.body.codigoConfirmacion,
                    dataEmail: data
                });
            }
        });
    });
};

// Habilitar enlace email guardado mediante codigo confirmacion y idUsuario para activar cuenta
exports.enableLinkEmail = async (req, res) => {
    let query = `SELECT u.idUsuario,u.nombreUsuario,u.codigoConfirmacion,c.descripcion AS correo FROM Usuario u
    INNER JOIN Correo c ON c.idUsuario = u.idUsuario
    WHERE u.idUsuario = ${req.params.idUsuario} AND u.estado = 0 AND c.correoSesion = 1`;
    await pool.query(query, (err, result) => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }
        // Si hay datos
        if (result.length > 0) {
            resultData = dataIntoJSON(result);
            res.status(200).send({
                data: resultData[0],
                message: 'Encontrado'
            });
            res.end();
        } else {
            res.send({
                message: 'Cuenta ya activada'
            });
            res.end();
        }
    });
};

// Validar email
exports.validateEmail = async (req, res, next) => {
    let query = `SELECT COUNT(*) AS conteoCorreo FROM Correo 
    WHERE descripcion = "${req.body.correo}" AND correoSesion = 1`;
    await pool.query(query, (err, result) => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }
        resultData = dataIntoJSON(result);
        if (resultData[0].conteoCorreo == 0) {
            next();
        } else {
            res.send({
                mensaje: 'Email ya registrado'
            });
            res.end();
        }
    });
};

// Validar username
exports.validateUsername = async (req, res, next) => {
    let query = `SELECT COUNT(*) AS conteoNombreUsuario FROM Usuario 
    WHERE nombreUsuario = "${req.body.nombreUsuario}"`;
    await pool.query(query, (err, result) => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }
        resultData = dataIntoJSON(result);
        if (resultData[0].conteoNombreUsuario == 0) {
            next();
        } else {
            res.send({
                mensaje: 'Nombre de usuario ya registrado'
            });
            res.end();
        }
    });
};