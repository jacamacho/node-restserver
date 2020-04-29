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
process.env.urlDB = 'mongodb+srv://jacamacho:agosto27@cluster0-yt8zu.mongodb.net/cafe?retryWrites=true&w=majority';

if (process.env.NODE_ENV === 'dev') {
    process.env.urlDB = 'mongodb://localhost:27017/cafe';
}