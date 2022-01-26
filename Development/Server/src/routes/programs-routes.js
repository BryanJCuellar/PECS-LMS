module.exports = (app, pool) => {
    app.get('/programs', (req, res) => {
        res.send('Si entra a Programs')
    });
}