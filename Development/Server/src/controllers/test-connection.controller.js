// External functions
const dataIntoJSON = require('../functions/dataIntoJSON');

function testConnectionController(pool) {
    let controllerMethods = {};

    controllerMethods.connect = async (req, res) => {
        await pool.query('SELECT 1 + 1 AS solution', (err, result) => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            }
            resultData = dataIntoJSON(result);
            res.send({
                data: resultData[0],
                message: 'consulta exitosa'
            });
            res.end();
        });
    };

    return controllerMethods;
}

module.exports = testConnectionController;