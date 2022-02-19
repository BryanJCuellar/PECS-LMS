module.exports = (app, pool) => {
    app.get('/programs', (req, res) => {
        res.send('Entra a Programs')
    });
}