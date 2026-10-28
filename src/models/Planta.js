const mongoose = require("mongoose");
const { esIntervaloValido, esTextoNoVacio } = require("../dominio/planta");

const cuidadoEspecialSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: [true, "El tipo de cuidado especial es obligatorio"],
      trim: true,
      validate: {
        validator: esTextoNoVacio,
        message: "El tipo de cuidado especial es obligatorio",
      },
    },
    nota: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const plantaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      validate: {
        validator: esTextoNoVacio,
        message: "El nombre es obligatorio",
      },
    },
    especie: {
      type: String,
      required: [true, "La especie es obligatoria"],
      trim: true,
      validate: {
        validator: esTextoNoVacio,
        message: "La especie es obligatoria",
      },
    },
    ubicacion: {
      type: String,
      required: [true, "La ubicación es obligatoria"],
      trim: true,
      validate: {
        validator: esTextoNoVacio,
        message: "La ubicación es obligatoria",
      },
    },
    intervaloRiegoDias: {
      type: Number,
      required: [true, "El intervalo de riego es obligatorio"],
      validate: {
        validator: esIntervaloValido,
        message: "El intervalo de riego debe ser un entero mayor o igual que 1",
      },
    },
    enReposo: {
      type: Boolean,
      default: false,
    },
    cuidadosEspeciales: {
      type: [cuidadoEspecialSchema],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_documento, respuesta) {
        respuesta.id = respuesta._id.toString();
        delete respuesta._id;
        return respuesta;
      },
    },
  },
);

module.exports =
  mongoose.models.Planta || mongoose.model("Planta", plantaSchema);
