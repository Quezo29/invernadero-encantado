const express = require("express");
const { validarRiego } = require("../dominio/riego");

const MENSAJE_PLANTA_INEXISTENTE = "La planta indicada no existe";

function crearRutasRiegos({ plantas, riegos }) {
  const router = express.Router();

  router.post("/riegos", async (req, res, next) => {
    const errores = validarRiego(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    try {
      const plantaExiste = await plantas.existe(req.body.planta);
      if (!plantaExiste) {
        return res.status(404).json({ error: MENSAJE_PLANTA_INEXISTENTE });
      }

      const riego = await riegos.crear(req.body);
      return res.status(201).json({ riego });
    } catch (error) {
      return next(error);
    }
  });

  router.get("/plantas/:id/riegos", async (req, res, next) => {
    try {
      const plantaExiste = await plantas.existe(req.params.id);
      if (!plantaExiste) {
        return res.status(404).json({ error: MENSAJE_PLANTA_INEXISTENTE });
      }

      const lista = await riegos.listarPorPlanta(req.params.id);
      return res.json({ riegos: lista });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = crearRutasRiegos;
