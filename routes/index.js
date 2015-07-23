var express = require('express');
var router = express.Router();

// Importamos el controller para las quizes
// Contendrá los rutas a question y answer
var quizController = require ('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// GET quizes/question a su controller
router.get('/quizes/question', quizController.question);
// GET quizes/answer a su controller
router.get('/quizes/answer',   quizController.answer  );

module.exports = router;
