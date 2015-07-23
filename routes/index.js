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

// GET quizes/question a su controller
router.get('/quizes/question', quizController.question);
// GET quizes/answer a su controller
router.get('/quizes/answer',   quizController.answer  );

// GET /author hacia views/author.ejs
router.get('/author', authorController.author  );

module.exports = router;
