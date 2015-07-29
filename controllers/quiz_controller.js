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
      where: ["pregunta like ?", '%' + req.query.search.replace(/ /g,'%') + '%'],
      order: ["pregunta"]
    };
  }
  else {
    query = {} ;
  }
//  console.log('query = ' + JSON.stringify(query));
  models.Quiz.findAll(query).then(function(quizes) {
    res.render('quizes/index.ejs', {quizes: quizes, errors: []});
  }).catch(function(error){new Error(error);});
};

// GET /quizes/:quizId para mostrar pregunta
exports.show = function( req, res) {
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:quizId/answer para analizar la respuesta
// y devolver el resultado
exports.answer = function(req, res) {
//  console.log("quiz_controller.answer quiz.id = " + req.quiz.id ) ;
  var resultado = (req.query.respuesta === req.quiz.respuesta) ? 'Correcto' : 'Incorrecto' ;
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new para el formulario de alta de nueva pregunta
exports.new = function(req,res) {
  // creamos objeto quiz no persistente para pasarlo al formulario de alta
  var quiz = models.Quiz.build(
    { pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create para realizar el alta de la pregunta
// y redirigir a la lista de preguntas
exports.create = function(req,res) {
  // creamo objeto quiz no persistente recuperando el del formulario de alta
  var quiz = models.Quiz.build(req.body.quiz) ;
  console.log("req.body.quiz=" + JSON.stringify(req.body));

  var qverrs = quiz.validate();
  if(qverrs) {
    // si hay errores volvemos a /quizes/new con los mensajes
    res.render('quizes/new',
      {quiz: quiz, errors: utilValidateToErrors(qverrs)});
  }
  else {
    // guardar en DB los datos recogidos del formulario en quiz
    quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
      res.redirect('/quizes');
    });
  }
};

// utilidad para convertir la estructura que devuelve validate()
// en el array errors que espera layout
// validate() -> { f1: [ f1e1, f1e2, ...], f2: [f2e1, f2e2, ...], ... }
function utilValidateToErrors(verr) {
  var i=0 ;
  var Errors = new Array();
  // recorremos los distintos campos en la estructura
  for ( var fld in verr ) {
    console.log("fld=" + fld);
    // y para cada campo, su array de mensajes
    for ( var err=0; err<verr[fld].length; err++) {
      console.log("\terr=" + verr[fld][err]);
      Errors[i++] = { message: verr[fld][err] };
    }
  }
  return Errors;
}
