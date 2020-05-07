const express = require('express');
const Producto = require('../models/producto');
const { verificaToken, verificarRol } = require('../middlewares/authentication');
const app = express();

app.get('/producto', verificaToken, (req, res) => {
    let limite = Number(req.query.limite) || 5;
    let page = limite * (Number(req.query.page) || 0);
    Producto.find({ disponible: true })
        .skip(page)
        .limit(limite)
        .sort('nombre')
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombres email')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    message: err
                });
            }
            Producto.count((err, conteo) => {
                res.json({ error: false, count: conteo, productos });
            });
        });
});

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productos) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    message: err
                });
            }
            Producto.count((err, conteo) => {
                res.json({ error: false, count: conteo, productos });
            });
        })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombres email');
});

app.get('/producto/buscar/:texto', verificaToken, (req, res) => {
    let texto = req.params.texto;
    let regex = new RegExp(texto, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombres email')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    message: err
                });
            }
            Producto.count((err, conteo) => {
                res.json({ error: false, count: conteo, productos });
            });
        });
});

app.post('/producto', [verificaToken, verificarRol], (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precio: body.precio,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }

        res.json({ error: false, message: 'Producto creado con éxito', categoria: productoDB });
    });
});

app.put('/producto/:id', [verificaToken, verificarRol], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }
        res.json({ error: false, message: 'Producto editado con éxito', usuario: productoDB });

    });
});

app.delete('/producto/:id', [verificaToken, verificarRol], (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                error: true,
                message: err
            });
        }
        res.json({ error: false, message: 'Producto eliminado con éxito', usuario: productoDB });

    });
});
module.exports = app;