// External functions
const dataIntoJSON = require('../functions/dataIntoJSON');

function testConnectionController(pool) {
    let controllerMethods = {};
    // Probar conexion con la base
    controllerMethods.connect = async (req, res) => {
        await pool.query('SELECT 1 + 1 AS solution', (err, result) => {
            if (err) {
                return res.status(500).send({
                    errorMessage: err
                });
            }
            resultData = dataIntoJSON(result[0]);
            res.send({
                data: resultData,
                message: 'consulta exitosa'
            });
            res.end();
        });
    };

    return controllerMethods;
}

module.exports = testConnectionController;