// controller para los operaciones sobre los quiz
var models = require('../models/models.js');

// incorporamos utilidades comunes a varios controllers
var utils = require('./_utils.js');

// Autoload - factoriza código cuando la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
    where: { id: Number(quizId) },
    include: [{ model: models.Comment }] // para leer también los comentarios
  }).then(function(quiz) {
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
  var _search = req.query.search ;
  var _tema = req.query.tema ;
  if (_search==='Buscar') { _search = ''; }
// en función de la existencia del parámetro preparamos query
  if (_search || _tema) {
    if (_tema==='void') { // buscamos sólo por search
      query = {
        where: ["pregunta like ?", '%' + _search.replace(/ /g,'%') + '%'],
        order: ["pregunta"]
      };
    }
    else { // buscamos por _search y por _tema
      query = {
        where: ["pregunta like ? and tema=?", '%' + _search.replace(/ /g,'%') + '%', _tema],
        order: ["pregunta"]
      };

    }
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
exports.show = function(req, res) {
  var quiz = req.quiz; // recuperada en load
  console.log('quiz:' + JSON.stringify(quiz));
  res.render('quizes/show', {quiz: quiz, errors: []});
};

// GET /quizes/:quizId/answer para analizar la respuesta
// y devolver el resultado
exports.answer = function(req, res) {
//  console.log("quiz_controller.answer quiz.id = " + req.quiz.id ) ;
  var quiz = req.quiz; // recuperada en load
  var resultado = (req.query.respuesta === quiz.respuesta) ? 'Correcto' : 'Incorrecto' ;
  res.render('quizes/answer', {quiz: quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new para el formulario de alta de nueva pregunta
exports.new = function(req,res) {
  // creamos objeto quiz no persistente para pasarlo al formulario de alta
  var quiz = models.Quiz.build(
    { pregunta: "Pregunta", respuesta: "Respuesta", tema: "Otro"}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create para realizar el alta de la pregunta
// y redirigir a la lista de preguntas
exports.create = function(req,res) {
  // creamo objeto quiz no persistente recuperando el del formulario de alta
  var quiz = models.Quiz.build(req.body.quiz) ;
//  console.log("req.body=" + JSON.stringify(req.body));
  var qverrs = quiz.validate();
  if (qverrs) {// si error, volvemos a /quizes/new con los mensajes
    res.render('quizes/new',
      {quiz: quiz, errors: utils.ValidateToErrors(qverrs)});
  }
  else {
    // guardar en DB los datos recogidos del formulario en quiz
    quiz.save({fields: ["pregunta", "respuesta","tema"]}).then(function(){
      res.redirect('/quizes');
    });
  }
};

// GET /quizes/:quizId/edit para el formulario de editar preguntas
exports.edit = function(req, res) {
  var quiz = req.quiz; // recuperada en load
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:quizId para la modificación en DB de la pregunta
// y redirigir a la lista de preguntas
exports.update = function(req, res) {
  var quiz = req.quiz; // recuperada en load
  quiz.pregunta = req.body.quiz.pregunta;
  quiz.respuesta = req.body.quiz.respuesta;
  quiz.tema = req.body.quiz.tema;
//  console.log("req.body=" + JSON.stringify(req.body));
  var qverrs = quiz.validate();
  if (qverrs) {// si error, volvemos a /quizes/edit con los mensajes
    res.render('quizes/edit',
      {quiz: quiz, errors: utils.ValidateToErrors(qverrs)});
  }
  else {
    // guardar en DB los datos recogidos del formulario en quiz
    quiz.save({fields: ["pregunta", "respuesta","tema"]}).then(function(){
      res.redirect('/quizes');
    });
  }
};

// DELETE /quizes/:quizId para el realizar el borrado en DB de la pregunta
exports.destroy = function(req, res) {
  var quiz = req.quiz; // recuperada en load
  console.log("req.body=" + JSON.stringify(req.body));
  // realizamos el borrado en la tabla de DB
  quiz.destroy().then(function(){
    res.redirect('/quizes');
  });
};
