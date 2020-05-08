const jwt = require('jsonwebtoken');
//=========================================
//Verificar Token
//=========================================
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                error: true,
                message: 'El Authorization Token no es válido'
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

//=========================================
//Verificar ADMIN_ROL
//=========================================
let verificarRol = (req, res, next) => {
    if (req.usuario.rol !== 'ADMIN_ROL') {
        return res.status(400).json({
            error: true,
            message: 'Permisos no concendidos'
        });
    }

    next();
};

//=========================================
//Verificar token para imagen
//=========================================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                error: true,
                message: 'El Authorization Token no es válido'
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    verificarRol,
    verificaTokenImg
};