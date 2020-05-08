const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const app = express();
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            error: true,
            message: 'No se ha seleccionado ningún archivo.'
        });
    }

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            error: true,
            message: 'Los tipos válidos son ' + tiposValidos.join(' ,')
        });
    }

    let archivo = req.files.archivo;
    let arrayExt = archivo.name.split('.');
    let extension = arrayExt[arrayExt.length - 1];
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            error: true,
            message: 'Las extensiones permitidas son ' + extensionesValidas.join(' ,')
        });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err
            });
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findByIdAndUpdate(id, { img: nombreArchivo }, { new: false }, (err, usuarioDB) => {
        if (err) {
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(400).json({
                error: true,
                message: err
            });
        }

        borrarImagen(usuarioDB.img, 'usuarios');
        res.json({ error: false, message: 'La imagen del usuario ha sido editada con éxito', imagen: nombreArchivo });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findByIdAndUpdate(id, { img: nombreArchivo }, { new: false }, (err, productoDB) => {
        if (err) {
            borrarImagen(nombreArchivo, 'productos');
            return res.status(400).json({
                error: true,
                message: err
            });
        }

        borrarImagen(productoDB.img, 'productos');
        res.json({ error: false, message: 'La imagen del producto ha sido editada con éxito', imagen: nombreArchivo });
    });
}

function borrarImagen(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;