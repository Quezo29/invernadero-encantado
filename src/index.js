const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const crearApp = require("./app");
const repositorioPlantas = require("./repositorios/plantas");
const repositorioRiegos = require("./repositorios/riegos");

const PUERTO = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function iniciar() {
  if (!MONGODB_URI) {
    console.error("Falta MONGODB_URI en el archivo .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);

    const app = crearApp({
      plantas: repositorioPlantas,
      riegos: repositorioRiegos,
    });

    app.listen(PUERTO, () => {
      console.log(
        `API del Invernadero Encantado en http://localhost:${PUERTO}`,
      );
    });
  } catch (error) {
    console.error("No se pudo iniciar la API:", error.message);
    process.exit(1);
  }
}

iniciar();
