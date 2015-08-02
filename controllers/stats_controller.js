// controller para los operaciones sobre los quiz
var models = require('../models/models.js');
var sequelize = require('sequelize');

// GET /quizes/statistics para mostrar cifras de la DB
exports.show = function (req, res) {
  var stats = {
    nPreguntas: -1,             //  El número de preguntas
    nComentarios: -1,           //  El número de comentarios totales
    nMediaComentPregunta:-1,    //  El número medio de comentarios por pregunta
    nPreguntasSinComentario:-1, //  El número de preguntas sin comentarios
    nPreguntasConComentario:-1  //  El número de preguntas con comentarios
  };

  models.Quiz.count().success(function(count){
//    console.log('count.nPreguntas='+count);
    stats.nPreguntas=count ;

    models.Comment.findAndCountAll().success(function(result){
//      console.log('Comment.findAndCountAll.count='+JSON.stringify(result.count));
//      console.log('Comment.findAndCountAll.rows='+JSON.stringify(result.rows));

//      console.log('count.nComentarios='+result.count);
      stats.nComentarios=result.count ;

      stats.nMediaComentPregunta = (stats.nPreguntas>0) ?
        stats.nComentarios/stats.nPreguntas : 0 ;

    // recorremos rows para identificar los distintos quizId
      var q={} ;
      for ( var r in result.rows ) {
//        console.log('rows['+r+']='+JSON.stringify(result.rows[r]));
        var qId = result.rows[r].QuizId;
        if ( qId ) {
          q[qId] = q[qId] || 0 ;
          q[qId]++ ;
        }
      }
//      console.log('q='+JSON.stringify(q));

    // recorremos los distintos para contarlos
      var c=0;
      for (i in q) {
        c++;
      }

      stats.nPreguntasConComentario=c;
      stats.nPreguntasSinComentario=stats.nPreguntas-c;

// preguntas con comentario
// select count(distinct quizId) from comments;

      console.log('stats.nPreguntas='+stats.nPreguntas);
      console.log('stats.nComentarios='+stats.nComentarios);
      console.log('stats.nMediaComentPregunta='+stats.nMediaComentPregunta);
      console.log('stats.nPreguntasSinComentario='+stats.nPreguntasSinComentario);
      console.log('stats.nPreguntasConComentario='+stats.nPreguntasConComentario);

      res.render('quizes/stats', { stats: stats, errors:[]});

// Explorar la opción de DISTINCT QuizId
//      var opts = {distinct: ['QuizId']} ;
//      var opts = {distinct: true, fields: ['QuizId']};
//      var opts = {distinct: true, include: [{ model: 'Comments'}] } ;
//      models.Comment.count(opts).success(function(count){
//      }); // FIN Comments.count distinct QuizId

    }); // FIN Comments.count
  }); // FIN Quiz.count
};
