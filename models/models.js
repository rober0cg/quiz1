var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
//console.log ( "DATABASE_URL = " + process.env.DATABASE_URL);
//console.log ( "DATABASE_STORAGE = " + process.env.DATABASE_STORAGE);
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var protocol = (url[1]||null);
var dialect  = protocol;
var user     = (url[2]||null);
var passwd   = (url[3]||null);
var host     = (url[4]||null);
var port     = (url[5]||null);
var DB_name  = (url[6]||null);
var storage  = process.env.DATABASE_STORAGE;


// Carga modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(
                      DB_name, user, passwd,
                      { dialect:  dialect,
                        protocol: protocol,
                        host:     host,
                        port:     port,
                        storage:  storage, // sólo SQLite (en .env)
                        omitNull: true // sólo Postgres
                      }
                    );

// Importar definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// para exportarla
exports.Quiz = Quiz;

// Crear e Inicializar la tabla de preguntas en DB
sequelize.sync().success(function(){
  // success(..) se ejecuta una vez creada la tabla
  Quiz.count().success(function(count){
    if(count===0){ // tabla vacía, recién creada
      Quiz.create({ pregunta: 'Capital de Italia?',
                    respuesta: 'Roma',
                    tema: 'humanidades' });
      Quiz.create({ pregunta: 'Capital de España?',
                    respuesta: 'Madrid',
                    tema: 'humanidades' });
      Quiz.create({ pregunta: 'Capital de Portugal?',
                    respuesta: 'Lisboa',
                    tema: 'humanidades' }).then(function(){
                      console.log('BBDD creada e inicializada')
                    });
    }
    else {
      console.log('BBDD abierta e inicializada');
    }
  });
});
