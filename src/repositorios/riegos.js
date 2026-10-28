const Riego = require("../models/Riego");

async function crear(datos) {
  const riego = await Riego.create({
    planta: datos.planta,
    fecha: datos.fecha,
    cantidadMl: datos.cantidadMl,
    cuidador: datos.cuidador,
  });
  return riego.toJSON();
}

async function listarPorPlanta(plantaId) {
  const riegos = await Riego.find({ planta: plantaId }).sort({ fecha: -1 });
  return riegos.map((riego) => riego.toJSON());
}

module.exports = {
  crear,
  listarPorPlanta,
};
