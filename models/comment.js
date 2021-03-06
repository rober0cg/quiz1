// Definicion del modelo de datos de Comment
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Comment',
    { texto: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "-> Falta Comentario"},
          not: { args:/comentario/i, msg: "-> No válido"}
        }
      },
      publicado: {
        type: DataTypes.BOOLEAN,
        dafultValue: false
      }
    }
  );
};
