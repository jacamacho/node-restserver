const express = require('express');
const _ = require('underscore');
const Categoria = require('../models/categoria');
const { verificaToken, verificarRol } = require('../middlewares/authentication');
const app = express();

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, 'nombre usuario')
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    message: err
                });
            }
            Categoria.count((err, conteo) => {
                res.json({ error: false, count: conteo, categorias });
            });
        });
});

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    message: err
                });
            }

            res.json({ error: false, categoria });
        })
        .populate('usuario');
});

app.post('/categoria', [verificaToken, verificarRol], (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }

        res.json({ error: false, message: 'Categoría creado con éxito', categoria: categoriaDB });
    });
});

app.put('/categoria/:id', [verificaToken, verificarRol], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }
        res.json({ error: false, message: 'Categoría editada con éxito', usuario: categoriaDB });
    });
});

app.delete('/categoria/:id', [verificaToken, verificarRol], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                error: true,
                message: 'Categoría no encontrada'
            });
        }

        res.json({ error: false, message: 'Categoría eliminada con éxito', usuario: categoriaBorrada });
    });
});

module.exports = app;