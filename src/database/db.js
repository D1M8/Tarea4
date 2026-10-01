const knex = require('knex');
const knexfile = require('../../knexfile');

//Sleccionamos el entorno (desarrollo)
const environment = process.env.NODE_ENV || 'development';
const configOptions = knexfile [environment];

//Creamos la instancia
const db = knex(configOptions);

//Exportarlo para poder utilizarlo en otro entorno 
module.exports = db;