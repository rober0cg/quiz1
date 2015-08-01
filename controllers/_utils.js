// utilidades comunes a varios controllers

module.exports = {

// utilidad para convertir la estructura que devuelve validate()
// en el array errors que espera layout
// validate() -> { f1: [ f1e1, f1e2, ...], f2: [f2e1, f2e2, ...], ... }
  ValidateToErrors: function (verr) {
    var i=0 ;
    var Errors = new Array();
    // recorremos los distintos campos en la estructura
    for ( var fld in verr ) {
      console.log("fld=" + fld);
      // y para cada campo, su array de mensajes
      for ( var err=0; err<verr[fld].length; err++) {
        console.log("\terr=" + verr[fld][err]);
        Errors[i++] = { message: verr[fld][err] };
      }
    }
    return Errors;
  }

};
