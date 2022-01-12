var pool = require('../database/connection');
// External functions
var dataIntoJSON = require('../functions/dataIntoJSON');

exports.connect = async (req, res) => {
    pool.query('SELECT 1 + 1 AS solution', (err, result) => {
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