
var users = {
  admin: {id:1, username:"admin", password:"1234"},
  pepe: {id:2, username:"pepe", password:"5678"}
};

exports.autenticar = function(login, password, callback){
  if (users[login]){
    if (password===users[login].password){ // Éxito
      callback(null,users[login]);
    }
    else { // Contraseña errónea
      callback(new Error('Contraseña errónea'));
    }
  }
  else { // Usuario inexistente
    callback(new Error('Usuario inexistente'));
  }
};
