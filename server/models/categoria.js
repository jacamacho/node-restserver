const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoría es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Un usuario debe ser responsable de esta creación']
    }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Categoria', categoriaSchema);