// controller para los quiz question y anbswer
var models = require('../models/models.js');

// Autoload - factoriza código cuando la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(function(quiz) {
    if (quiz) {
      req.quiz = quiz;
      next();
    } else {
      next(new Error('No existe quizId='+quizId));
    }
  }).catch(function(error) { next(error); });
};

// GET /quizes para mostrar lisa de preguntas
// GET /quizes?search=patron para lista ordenada de coincidencias
exports.index = function(req, res) {
  var query ;
// en función de la existencia del parámetro preparamos query
  if (req.query.search) {
    query = {
      where: ["pregunta like ?", '%' + req.query.search + '%'],
      order: ["pregunta"]
    };
  }
  else {
    query = {} ;
  }
  console.log('query = ' + JSON.stringify(query));
  models.Quiz.findAll(query).then(function(quizes) {
    res.render('quizes/index.ejs', {quizes: quizes});
  });
};

// GET /quizes/:quizId para mostrar pregunta
exports.show = function( req, res) {
  res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
//  console.log("quiz_controller.answer quiz.id = " + req.quiz.id ) ;
  var resultado = (req.query.respuesta === req.quiz.respuesta) ? 'Correcto' : 'Incorrecto' ;
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
