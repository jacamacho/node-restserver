const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', (req, res) => {
    let limite = Number(req.query.limite) || 5;
    let page = limite * (Number(req.query.page) || 0);

    Usuario.find({ estado: true /** SE PUEDEN UBICAR CONDICIONES PARA LA BUSQUEDA */ }, 'nombre email rol google estado img')
        .skip(page)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    message: err
                });
            }
            Usuario.count({ estado: true /** SE PUEDEN UBICAR CONDICIONES PARA EL CONTEO */ }, (err, conteo) => {
                res.json({ error: false, count: conteo, usuarios });
            });
        });
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 15),
        rol: body.rol
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }
        // usuarioDB.password = null;
        res.json({ error: false, message: 'Usuario creado con éxito', usuario: usuarioDB });
    });
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }
        res.json({ error: false, message: 'Usuario editado con éxito', usuario: usuarioDB });
    });
});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    /** PARA BORRAR UN USUARIO DEFINITIVO */
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: true,
    //             message: err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             error: true,
    //             message: 'Usuario no encontrado'
    //         });
    //     }

    //     res.json({ error: false, message: 'Usuario eliminado con éxito', usuario: usuarioBorrado });
    // });

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }
        res.json({ error: false, message: 'Usuario eliminado con éxito', usuario: usuarioDB });
    });
});

module.exports = app;