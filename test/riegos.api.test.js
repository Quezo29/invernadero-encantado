const assert = require("node:assert/strict");
const test = require("node:test");
const {
  datosPlantaValidos,
  enviarJson,
  levantarApp,
} = require("../test-utils/app");

async function registrarPlanta(url) {
  const respuesta = await enviarJson(
    `${url}/api/plantas`,
    "POST",
    datosPlantaValidos(),
  );
  assert.equal(respuesta.status, 201);
  const { planta } = await respuesta.json();
  return planta.id;
}

function datosRiegoValidos(planta, extra = {}) {
  return {
    planta,
    cantidadMl: 250,
    cuidador: "Leslie Knope",
    ...extra,
  };
}

test("POST /api/riegos registra un riego válido y el historial lo devuelve", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const plantaId = await registrarPlanta(url);
  const fecha = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const respuesta = await enviarJson(
    `${url}/api/riegos`,
    "POST",
    datosRiegoValidos(plantaId, { fecha }),
  );

  assert.equal(respuesta.status, 201);
  const { riego } = await respuesta.json();
  assert.ok(riego.id);
  assert.equal(riego.planta, plantaId);
  assert.equal(riego.cantidadMl, 250);
  assert.equal(riego.fecha, fecha);

  const historial = await fetch(`${url}/api/plantas/${plantaId}/riegos`);
  assert.equal(historial.status, 200);
  const { riegos } = await historial.json();
  assert.equal(riegos.length, 1);
  assert.equal(riegos[0].id, riego.id);
});

test("POST /api/riegos rechaza una planta inexistente", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const respuesta = await enviarJson(
    `${url}/api/riegos`,
    "POST",
    datosRiegoValidos("planta-inexistente"),
  );

  assert.equal(respuesta.status, 404);
  assert.deepEqual(await respuesta.json(), {
    error: "La planta indicada no existe",
  });
});

test("POST /api/riegos rechaza una fecha futura", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const plantaId = await registrarPlanta(url);
  const fecha = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const respuesta = await enviarJson(
    `${url}/api/riegos`,
    "POST",
    datosRiegoValidos(plantaId, { fecha }),
  );

  assert.equal(respuesta.status, 400);
  const { errores } = await respuesta.json();
  assert.ok(errores.some((error) => error.includes("futura")));
});

test("POST /api/riegos acepta una fecha pasada", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const plantaId = await registrarPlanta(url);
  const fecha = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const respuesta = await enviarJson(
    `${url}/api/riegos`,
    "POST",
    datosRiegoValidos(plantaId, { fecha }),
  );

  assert.equal(respuesta.status, 201);
});

test("POST /api/riegos rechaza cantidad 0 o negativa", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const plantaId = await registrarPlanta(url);

  for (const cantidad of [0, -25]) {
    const respuesta = await enviarJson(
      `${url}/api/riegos`,
      "POST",
      datosRiegoValidos(plantaId, { cantidadMl: cantidad }),
    );
    assert.equal(respuesta.status, 400);
  }
});

test("POST /api/riegos rechaza la falta de cuidador", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const plantaId = await registrarPlanta(url);
  const datos = datosRiegoValidos(plantaId);
  delete datos.cuidador;

  const respuesta = await enviarJson(`${url}/api/riegos`, "POST", datos);
  assert.equal(respuesta.status, 400);
});

test("POST /api/riegos usa la fecha actual cuando no se indica", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const plantaId = await registrarPlanta(url);
  const respuesta = await enviarJson(
    `${url}/api/riegos`,
    "POST",
    datosRiegoValidos(plantaId),
  );

  assert.equal(respuesta.status, 201);
  const { riego } = await respuesta.json();
  assert.ok(!Number.isNaN(Date.parse(riego.fecha)));
});

test("GET /api/plantas/:id/riegos devuelve una lista vacía para una planta sin riegos", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const plantaId = await registrarPlanta(url);
  const respuesta = await fetch(`${url}/api/plantas/${plantaId}/riegos`);

  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), { riegos: [] });
});

test("GET /api/plantas/:id/riegos rechaza una planta inexistente", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const respuesta = await fetch(`${url}/api/plantas/planta-inexistente/riegos`);

  assert.equal(respuesta.status, 404);
  assert.deepEqual(await respuesta.json(), {
    error: "La planta indicada no existe",
  });
});
