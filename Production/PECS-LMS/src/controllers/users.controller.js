// Produccion en Heroku
const frontendHost = 'https://pecsfcmunah.herokuapp.com';
// Functions
const currentDateTime = require('../functions/currentDateTime');
const dataIntoJSON = require('../functions/dataIntoJSON');
const extractFirstName = require('../functions/extractFirstName');
const generateRandomCode = require('../functions/generateRandomCode');
// Core Modules
const path = require('path');
const fs = require('fs');
// Dependencies
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

function usersController(pool) {
    let controllerMethods = {};
    // Registrar usuario
    controllerMethods.registerUser = async (req, res, next) => {
        // Encriptar clave
        let clave_hash = bcrypt.hashSync(req.body.clave, 11);
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
        // Procedimiento almacenado
        let sign_sp = "CALL SP_REGISTRAR_USUARIO(?,?,?,?,?,?,?,?,@output,@output2,@output3); SELECT @output AS idUsuario,@output2 AS codigo,@output3 AS message";
        await pool.query(
            sign_sp,
            [signData.idCategoriaUsuario, signData.nombre, signData.apellido, signData.numeroTelefono, signData.correo, signData.nombreUsuario, signData.clave, signData.codigoConfirmacion],
            (err, result) => {
                if (err) {
                    return res.status(500).send({
                        errorMessage: err
                    });
                }
                // Si no ocurrio error, sigue con el proceso
                let resultData = dataIntoJSON(result[1][0]);
                if (resultData.codigo === 0) {
                    // Si entra aqui, ya se ha registrado el usuario
                    req.body.idUsuario = resultData.idUsuario;
                    req.body.codigoConfirmacion = codigo_confirmacion;
                    // Prosigue con el metodo sendEmailRegister
                    next();
                } else {
                    // Si entra aqui, es que ocurrio un error de validacion en el procedimiento almacenado
                    res.send({
                        data: resultData
                    });
                    res.end();
                }
            }
        );
    };

    // Enviar email de registro para activacion de la cuenta
    controllerMethods.sendEmailRegister = (req, res) => {
        // Variable para leer el archivo HTML
        let readHTMLFile = function (path, callback) {
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
        // SMTP transport
        let transporter = nodemailer.createTransport({
            // Gmail
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'pecslmsunah@gmail.com',
                pass: 'hrI5w9Vc8yBj'
            }
        });
        readHTMLFile(path.join(__dirname, '..', 'views', 'verify-account.html'), (err, html) => {
            let template = handlebars.compile(html);
            // Reemplazar dinamicamente los datos del archivo HTML
            let replacements = {
                idUsuario: req.body.idUsuario,
                primerNombre: extractFirstName(req.body.nombre),
                nombreUsuario: req.body.nombreUsuario,
                codigoConfirmacion: req.body.codigoConfirmacion,
                anio: currentDateTime.getCurrentDate('year'),
                frontendHost: frontendHost
            };
            let htmlToSend = template(replacements);
            // Configuracion para el envio del email
            let mailOptions = {
                from: 'pecslmsunah@gmail.com',
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
            // Enviar el email
            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    return res.status(500).send({
                        errorMessage: err
                    });
                }
                // Si no ocurrio error, envia el siguiente response
                res.status(200).send({
                    data: {
                        idUsuario: req.body.idUsuario,
                        codigo: 0
                    },
                    codigoConfirmacion: req.body.codigoConfirmacion,
                    infoEmail: data
                });
                res.end();
            });
        });
    };

    // Habilitar enlace del email guardado mediante codigo confirmacion y idUsuario para activar cuenta
    controllerMethods.enableLinkEmail = async (req, res) => {
        let query = `SELECT u.idUsuario,u.nombre,u.nombreUsuario,u.codigoConfirmacion,c.descripcion AS correo FROM Usuario u
        INNER JOIN Correo c ON c.idUsuario = u.idUsuario
        WHERE u.idUsuario = ${req.params.idUsuario} AND u.codigoConfirmacion = "${req.params.codigoConfirmacion}" AND u.estado = 0 AND c.correoSesion = 1`;
        await pool.query(query, (err, result) => {
            if (err) {
                return res.status(500).send({
                    errorMessage: err
                });
            }
            if (result.length > 0) {
                // Si se encontraron datos con los parametros enviados
                let resultData = dataIntoJSON(result[0]);
                res.status(200).send({
                    data: resultData,
                    message: 'OK'
                });
                res.end();
            } else {
                // Cuenta activada o datos incorrectos
                res.send({
                    message: 'Cuenta ya activada'
                });
                res.end();
            }
        });
    };

    // Habilitar la activacion de la cuenta
    controllerMethods.enableVerifyAccount = async (req, res) => {
        let query = `SELECT COUNT(*) AS conteoUsuario FROM Usuario
        WHERE idUsuario = ${req.params.idUsuario} AND codigoConfirmacion = "${req.params.codigoConfirmacion}" AND estado = 0`;
        await pool.query(query, (err, result) => {
            if (err) {
                return res.status(500).send({
                    errorMessage: err
                });
            }
            let resultData = dataIntoJSON(result[0]);
            if (resultData.conteoUsuario == 1) {
                // Si se encontro el usuario pendiente de activar cuenta
                res.status(200).send({
                    message: 'OK'
                });
                res.end();
            } else {
                // No se encontro el usuario, quiere decir que la cuenta ya fue activada o datos incorrectos
                res.send({
                    message: 'Cuenta ya activada'
                });
                res.end();
            }
        });
    };

    // Validar email
    controllerMethods.validateEmail = async (req, res) => {
        let query = `SELECT COUNT(*) AS conteoCorreo FROM Correo 
        WHERE descripcion = "${req.body.correo}" AND correoSesion = 1`;
        await pool.query(query, (err, result) => {
            if (err) {
                return res.status(500).send({
                    errorMessage: err
                });
            }
            let resultData = dataIntoJSON(result[0]);
            if (resultData.conteoCorreo == 0) {
                // No hay email duplicado
                res.status(200).send({
                    message: 'OK'
                });
                res.end();
            } else {
                res.send({
                    message: 'Email ya registrado'
                });
                res.end();
            }
        });
    };

    // Validar username
    controllerMethods.validateUsername = async (req, res) => {
        let query = `SELECT COUNT(*) AS conteoNombreUsuario FROM Usuario 
        WHERE nombreUsuario = "${req.body.nombreUsuario}"`;
        await pool.query(query, (err, result) => {
            if (err) {
                return res.status(500).send({
                    errorMessage: err
                });
            }
            let resultData = dataIntoJSON(result[0]);
            if (resultData.conteoNombreUsuario == 0) {
                // No hay username duplicado
                res.status(200).send({
                    message: 'OK'
                });
                res.end();
            } else {
                res.send({
                    message: 'Nombre de usuario ya registrado'
                });
                res.end();
            }
        });
    };

    // Activar la cuenta de usuario, estado = 1 (Login required)
    controllerMethods.verifyAccount = async (req, res) => {
        let query = `UPDATE Usuario SET estado = 1 WHERE idUsuario = ${req.user.idUsuario}`;
        await pool.query(query, (err, result) => {
            if (err) {
                return res.status(500).send({
                    errorMessage: err
                });
            }
            console.log(result);
            res.status(200).send({
                message: 'Cuenta activada exitosamente'
            });
            res.end();
        });


    };
    return controllerMethods;
}

module.exports = usersController;