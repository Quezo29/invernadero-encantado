const express = require("express");
const crearRutasPlantas = require("./routes/plantas");
const crearRutasRiegos = require("./routes/riegos");

function crearApp({ plantas, riegos }) {
  const app = express();

  app.use(express.json());

  app.use("/api/plantas", crearRutasPlantas({ plantas }));
  app.use("/api", crearRutasRiegos({ plantas, riegos }));

  app.use((_req, res) => {
    return res.status(404).json({ error: "Ruta no encontrada" });
  });

  app.use((error, _req, res, _next) => {
    if (error.type === "entity.parse.failed") {
      return res
        .status(400)
        .json({ error: "El cuerpo de la solicitud no es JSON válido" });
    }

    if (error.name === "ValidationError") {
      const errores = Object.values(error.errors).map(
        (errorDeCampo) => errorDeCampo.message,
      );
      return res.status(400).json({ errores });
    }

    if (error.name === "CastError") {
      return res.status(400).json({ errores: ["Dato inválido"] });
    }

    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  });

  return app;
}

module.exports = crearApp;
