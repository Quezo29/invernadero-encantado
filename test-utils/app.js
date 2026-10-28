const { once } = require("node:events");
const crearApp = require("../src/app");

function crearRepositoriosEnMemoria() {
  const plantas = [];
  const riegos = [];
  let secuencia = 0;

  const siguienteId = () => `id-${++secuencia}`;

  return {
    plantas: {
      async crear(datos) {
        const planta = {
          id: siguienteId(),
          nombre: datos.nombre,
          especie: datos.especie,
          ubicacion: datos.ubicacion,
          intervaloRiegoDias: datos.intervaloRiegoDias,
          enReposo: datos.enReposo ?? false,
          cuidadosEspeciales: datos.cuidadosEspeciales ?? [],
          createdAt: new Date().toISOString(),
        };
        plantas.push(planta);
        return planta;
      },
      async listar() {
        return [...plantas];
      },
      async existe(id) {
        return plantas.some((planta) => planta.id === id);
      },
    },
    riegos: {
      async crear(datos) {
        const riego = {
          id: siguienteId(),
          planta: datos.planta,
          fecha: datos.fecha ?? new Date().toISOString(),
          cantidadMl: datos.cantidadMl,
          cuidador: datos.cuidador,
        };
        riegos.push(riego);
        return riego;
      },
      async listarPorPlanta(plantaId) {
        return riegos.filter(
          (riego) => String(riego.planta) === String(plantaId),
        );
      },
    },
  };
}

async function levantarApp(repositorios = crearRepositoriosEnMemoria()) {
  const app = crearApp(repositorios);
  const servidor = app.listen(0);
  await once(servidor, "listening");
  const { port } = servidor.address();

  return {
    url: `http://127.0.0.1:${port}`,
    repositorios,
    cerrar: () =>
      new Promise((resolver, rechazar) => {
        servidor.close((error) => {
          if (error) {
            rechazar(error);
            return;
          }
          resolver();
        });
      }),
  };
}

function enviarJson(url, metodo, cuerpo) {
  return fetch(url, {
    method: metodo,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
}

function datosPlantaValidos(extra = {}) {
  return {
    nombre: "Rosa lunar",
    especie: "Rosa selenita",
    ubicacion: "Sector A",
    intervaloRiegoDias: 3,
    ...extra,
  };
}

module.exports = {
  crearRepositoriosEnMemoria,
  datosPlantaValidos,
  enviarJson,
  levantarApp,
};
