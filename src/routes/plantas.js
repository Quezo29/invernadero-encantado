const express = require("express");
const { validarPlanta } = require("../dominio/planta");

function crearRutasPlantas({ plantas }) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    const errores = validarPlanta(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    try {
      const planta = await plantas.crear(req.body);
      return res.status(201).json({ planta });
    } catch (error) {
      return next(error);
    }
  });

  router.get("/", async (_req, res, next) => {
    try {
      const lista = await plantas.listar();
      return res.json({ plantas: lista });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = crearRutasPlantas;
