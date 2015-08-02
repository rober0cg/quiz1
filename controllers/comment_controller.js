// controller para los comment
var models = require('../models/models.js');

// incorporamos utilidades comunes a varios controllers
var utils = require('./_utils.js');

// Autoload - factoriza código cuando la ruta incluye param :commentId
exports.load = function(req, res, next, commentId) {
  console.log('comment.load commentId='+commentId);
  models.Comment.find({
    where: { id: Number(commentId)}
  }).then(function(comment){
    if (comment) {
      req.comment = comment;
      next();
    }
    else {
      next(new Error('No existe commentId='+commentId));
    }
  }).catch(function(error) { next(error); });
};

// GET /quizes/:quizId(\\d+)/comments/new
// para lanzar formulario de alta de comentario
exports.new = function(req, res) {
  var quizId = req.params.quizId; // recuperado en el load de quiz; aquí está el QuizId
  res.render('comments/new', {quizid: quizId, errors: []});
};

// POST /quizes/:quizId(\\d+)/comments
// realiza la creación del comentario en DB y redirige a la pregunta
exports.create = function(req, res) {
  console.log('req.body='+JSON.stringify(req.body));
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

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  console.log('comment.publis req.comment='+JSON.stringify(req.comment));
  req.comment.publicado = true;
  req.comment.save({fields: ["publicado"]})
    .then(function() { res.redirect('/quizes/'+req.params.quizId);})
    .catch(function(error){next(error)});
};
