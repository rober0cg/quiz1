var express = require('express');
var router = express.Router();

// Importamos el controller para las quizes
// Contendrá los rutas a question y answer
var quizController = require ('../controllers/quiz_controller');

// Importamos el controller para los créditos
// Contendrá la ruta a los créditos
var authorController = require ('../controllers/author_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);

// GET /quizes a su controller para listar preguntas
router.get('/quizes', quizController.index);
// GET /quizes/:quizId a su controller para mostrar pregunta
router.get('/quizes/:quizId(\\d+)', quizController.show);
// GET /quizes/:quizId/answer a su controller para mostrar respuesta
router.get('/quizes/:quizId(\\d+)/answer',   quizController.answer  );
// GET /quizes/new para el formulario de creación de nuevas preguntas
router.get('/quizes/new', quizController.new);
// POST /quizes/create para realizar la acción de crear nueva pregunta
router.post('/quizes/create', quizController.create);


// GET /author hacia views/author.ejs
router.get('/author', authorController.author  );

module.exports = router;
