//=========================================
//PUERTO
//=========================================
process.env.PORT = process.env.PORT || 3000;

//=========================================
//ENTORNO
//=========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================================
//VENCIMIENTO DEL TOKEN
//=========================================
// 60 SEGUNDOS * 60 MINUTOS * 24 HORAS * 30 DÍAS
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=========================================
//SEED DEL TOKEN
//=========================================

process.env.SEED = process.env.SEED | 'este-es-el-seed-desarrollo';

//=========================================
//BASE DE DATOS
//=========================================
process.env.urlDB = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'dev') {
    process.env.urlDB = 'mongodb://localhost:27017/cafe';
}

//=========================================
//GOOGLE CLIENT ID
//=========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '298687264714-2uj04m7osikhlls2gl7v177du3buq2nm.apps.googleusercontent.com';