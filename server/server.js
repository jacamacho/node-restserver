require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.json('getusuarios');
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({ ok: false, mensaje: 'El nombre es necesario' });
    } else {
        res.json({ persona: body });
    }
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario/', (req, res) => {
    let id = req.params.id;
    res.json('deleteusuarios');
});

app.listen(process.env.PORT, () => {
    console.log('Esucuchando Puerto: ' + process.env.PORT);
});