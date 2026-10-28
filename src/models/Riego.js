const mongoose = require("mongoose");
const {
  esCantidadValida,
  esFechaNoFutura,
  esTextoNoVacio,
} = require("../dominio/riego");

const riegoSchema = new mongoose.Schema(
  {
    planta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Planta",
      required: [true, "La planta es obligatoria"],
    },
    fecha: {
      type: Date,
      default: Date.now,
      validate: {
        validator: (valor) => esFechaNoFutura(valor),
        message: "La fecha del riego no puede ser futura",
      },
    },
    cantidadMl: {
      type: Number,
      required: [true, "La cantidad de agua es obligatoria"],
      validate: {
        validator: esCantidadValida,
        message: "La cantidad de agua debe ser mayor que 0",
      },
    },
    cuidador: {
      type: String,
      required: [true, "El cuidador es obligatorio"],
      trim: true,
      validate: {
        validator: esTextoNoVacio,
        message: "El cuidador es obligatorio",
      },
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_documento, respuesta) {
        respuesta.id = respuesta._id.toString();
        delete respuesta._id;
        if (respuesta.planta) {
          respuesta.planta = respuesta.planta.toString();
        }
        return respuesta;
      },
    },
  },
);

module.exports = mongoose.models.Riego || mongoose.model("Riego", riegoSchema);
