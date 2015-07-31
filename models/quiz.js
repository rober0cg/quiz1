// Definicion del modelo de datos de Quiz
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Quiz',
    { pregunta: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "-> Falta Pregunta"},
          not: { args:/Pregunta/i, msg: "-> No válido"}
        }
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "-> Falta Respuesta"},
          not: { args: /Respuesta/i, msg: "-> No válido"}
        }
      },
      tema:{
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "-> Falta Tema"},
          isIn: { args: [['otro','humanidades','ocio','ciencia','tecnologia']], msg: "-> No válido"}
        }
      }
    }
  );
};
