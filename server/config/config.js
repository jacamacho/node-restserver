//=========================================
//PUERTO
//=========================================
process.env.PORT = process.env.PORT || 3000;

//=========================================
//ENTORNO
//=========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================================
//BASE DE DATOS
//=========================================
process.env.urlDB = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'dev') {
    process.env.urlDB = 'mongodb://localhost:27017/cafe';
}