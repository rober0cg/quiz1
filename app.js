var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // comentado {extended: false} para manejar objetos en GET y POST
app.use(cookieParser('Quiz 2015 rober_cg')); // semilla para cifrado
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next){
  // guardar path en session.redir para después de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;

  next();
});

// Helper para el control de inactividad tras logarse
app.use(function(req, res, next){
  var ahora = new Date(); // la hora del acceso actual
  req.session.lastAccess = new Date( req.session.lastAccess || ahora );
// control tiempo inactividad sólo si logado
  if (req.session.user) {
    var lapso = ahora.getTime() - req.session.lastAccess.getTime() ;
    if ( lapso > 120000 ) { // diffs de getTime en milisegundos
      console.log('auto-logout 120secs => LOGOUT');
      delete req.session.user; // para realizar la desconexión
// si se quiere forzar volver a logarse
// lo comento porque las acciones protegidas ya tienen loginRequired
//      res.redirect('/login');
    }
  }
  req.session.lastAccess = ahora;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env')==='development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
