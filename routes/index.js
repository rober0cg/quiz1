var express = require('express');
var router = express.Router();

// Importamos el controller para las quizes
// Contendrá los rutas a las operaciones sobre los quiz
var quizCtlr = require('../controllers/quiz_controller');

// Importamos el controller para los comments
// Contiene las rutas a las operaciones sobre éstos
var commentCtlr = require('../controllers/comment_controller');

// Importamos el controller para la gestión de la sesión
// Contiene las rutas a estas operacines
var sessionCtlr = require('../controllers/session_controller');

// Importamos el controller para los créditos
// Contendrá la ruta a los créditos
var authorCtlr = require('../controllers/author_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId o con :commentId
router.param('quizId', quizCtlr.load);
router.param('commentId', commentCtlr.load);

//Rutas de Sesión
// GET /login
router.get('/login', sessionCtlr.new);
// POST /login
router.post('/login', sessionCtlr.create);
// GET /logout (aunque debía der DELETE /login)
router.get('/logout', sessionCtlr.destroy);

// Rutas Quizes
// GET /quizes a su controller para listar preguntas
// Incorporamos loginRequired en las rutas crear, editar y borrar preguntas
router.get('/quizes', quizCtlr.index);
// GET /quizes/:quizId a su controller para mostrar pregunta
router.get('/quizes/:quizId(\\d+)', quizCtlr.show);
// GET /quizes/:quizId/answer a su controller para mostrar respuesta
router.get('/quizes/:quizId(\\d+)/answer', quizCtlr.answer);
// GET /quizes/new para el formulario de creación de nuevas preguntas
router.get('/quizes/new', sessionCtlr.loginRequired, quizCtlr.new);
// POST /quizes/create para realizar la acción de crear nueva pregunta
router.post('/quizes/create', sessionCtlr.loginRequired, quizCtlr.create);
// GET /quizes/:quizId/edit pare el formulario de edicioón de una pregunta
router.get('/quizes/:quizId(\\d+)/edit', sessionCtlr.loginRequired, quizCtlr.edit);
// PUT /quizes/:quizId pare modificar una pregunta ya editada
router.put('/quizes/:quizId(\\d+)', sessionCtlr.loginRequired, quizCtlr.update);
// DELETE /quizes/:quizID(\\d+) para ejecutar el borrado de una pregunta
router.delete('/quizes/:quizId(\\d+)', sessionCtlr.loginRequired, quizCtlr.destroy);

// Rutas Comentarios
// GET /quizes/:quizId(\\d+)/comments/new para el formulario de alta
router.get('/quizes/:quizId(\\d+)/comments/new', commentCtlr.new);
// POST /quizes/:quizId(\\d+)/comments para ejecuar el alta del comentario
router.post('/quizes/:quizId(\\d+)/comments', commentCtlr.create);
// GET /quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish para validar comentario
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
              sessionCtlr.loginRequired, commentCtlr.publish);

// GET /author hacia views/author.ejs
router.get('/author', authorCtlr.author);

module.exports = router;
