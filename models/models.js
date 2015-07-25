var path = require('path');

// Carga modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(
                      null,
                      null,
                      null,
                      {dialect: "sqlite", storage: "quiz.sqlite"}
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
                    respuesta: 'Roma'
                  }).success(function(){
                    console.log('BBDD creada e inicializada')
                  });
    }
    else {
      console.log('BBDD abierta e inicializada');
    }
  });
});
