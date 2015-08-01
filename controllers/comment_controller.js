// controller para los comment
var models = require('../models/models.js');

// incorporamos utilidades comunes a varios controllers
var utils = require('./_utils.js');


// GET /quizes/:quizId(\\d+)/comments/new
// para lanzar formulario de alta de comentario
exports.new = function(req, res) {
  var quizId = req.params.quizId; // recuperado en el load de quiz; aquí está el QuizId
  res.render('comments/new', {quizid: quizId, errors: []});
};

// POST /quizes/:quizId(\\d+)/comments
// realiza la creación del comentario en DB y redirige a la pregunta
exports.create = function(req, res) {
  var quizId = req.params.quizId ;
  var comment = models.Comment.build(
    { texto: req.body.comment.texto, QuizId: quizId }
  );
  console.log('quizId=' + quizId + ', comment='+ JSON.stringify(req.body));
  var cverr = comment.validate();
  if (cverr) {
    res.render('comments/new',
      { comment: comment, quizId: quizId, errors: utils.ValidateToErrors(cverr) }
    );
  }
  else {
    comment.save().then(function(){
      res.redirect('/quizes/'+quizId);
    });
  }
};
