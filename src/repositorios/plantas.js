const mongoose = require("mongoose");
const Planta = require("../models/Planta");

async function crear(datos) {
  const planta = await Planta.create({
    nombre: datos.nombre,
    especie: datos.especie,
    ubicacion: datos.ubicacion,
    intervaloRiegoDias: datos.intervaloRiegoDias,
    enReposo: datos.enReposo,
    cuidadosEspeciales: datos.cuidadosEspeciales,
  });
  return planta.toJSON();
}

async function listar() {
  const plantas = await Planta.find().sort({ createdAt: -1 });
  return plantas.map((planta) => planta.toJSON());
}

async function existe(id) {
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }

  const encontrada = await Planta.exists({ _id: id });
  return Boolean(encontrada);
}

module.exports = {
  crear,
  existe,
  listar,
};
