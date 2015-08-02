
// GET /login -> formulario de login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};
  // vamos a la página que recoge usuario y contraseña
  res.render('sessions/new', {errors: errors});
};

// POST /login -> desde el formulario de login, crear la sesión
exports.create = function(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user){
    if(error) { //retornamos mensajes de error de sesión
      req.session.errors = [{"message": "Se ha producido un error: "+error}];
      res.redirect('/login');
    }
    else {
      // Creamos la sesión guardando id y username
      // La sesión está definida porque existe req.session.user
      req.session.user = {id: user.id, username: user.username};
      res.redirect(req.session.redir.toString()); // Al path anterior a login
    }
  });
};

// GET /logout (aunque debía der DELETE /login)
exports.destroy = function(req, res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString()); // Al path anterior a login
};
