const assert = require("node:assert/strict");
const test = require("node:test");
const {
  datosPlantaValidos,
  enviarJson,
  levantarApp,
} = require("../test-utils/app");

test("POST /api/plantas registra una planta válida", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const respuesta = await enviarJson(
    `${url}/api/plantas`,
    "POST",
    datosPlantaValidos({
      cuidadosEspeciales: [{ tipo: "luz", nota: "Sombra por la tarde" }],
    }),
  );

  assert.equal(respuesta.status, 201);
  const { planta } = await respuesta.json();
  assert.ok(planta.id);
  assert.equal(planta.nombre, "Rosa lunar");
  assert.equal(planta.enReposo, false);
  assert.equal(planta.cuidadosEspeciales.length, 1);
  assert.ok(planta.createdAt);
});

test("POST /api/plantas rechaza cada dato obligatorio faltante", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  for (const campo of [
    "nombre",
    "especie",
    "ubicacion",
    "intervaloRiegoDias",
  ]) {
    const datos = datosPlantaValidos();
    delete datos[campo];

    const respuesta = await enviarJson(`${url}/api/plantas`, "POST", datos);
    assert.equal(respuesta.status, 400, `debía rechazar la falta de ${campo}`);

    const cuerpo = await respuesta.json();
    assert.ok(Array.isArray(cuerpo.errores));
    assert.ok(cuerpo.errores.length > 0);
  }
});

test("POST /api/plantas rechaza intervalos 0, negativos o fraccionarios", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  for (const intervalo of [0, -1, 1.5]) {
    const respuesta = await enviarJson(
      `${url}/api/plantas`,
      "POST",
      datosPlantaValidos({ intervaloRiegoDias: intervalo }),
    );
    assert.equal(respuesta.status, 400);
  }
});

test("GET /api/plantas devuelve la lista de plantas", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const vacia = await fetch(`${url}/api/plantas`);
  assert.equal(vacia.status, 200);
  assert.deepEqual(await vacia.json(), { plantas: [] });

  await enviarJson(
    `${url}/api/plantas`,
    "POST",
    datosPlantaValidos({ nombre: "Rosa lunar" }),
  );
  await enviarJson(
    `${url}/api/plantas`,
    "POST",
    datosPlantaValidos({ nombre: "Helecho susurrante" }),
  );

  const respuesta = await fetch(`${url}/api/plantas`);
  assert.equal(respuesta.status, 200);
  const { plantas } = await respuesta.json();
  assert.equal(plantas.length, 2);
  assert.deepEqual(
    plantas.map((planta) => planta.nombre),
    ["Rosa lunar", "Helecho susurrante"],
  );
});

test("POST /api/plantas rechaza un cuerpo que no es JSON válido", async (t) => {
  const { url, cerrar } = await levantarApp();
  t.after(cerrar);

  const respuesta = await fetch(`${url}/api/plantas`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });

  assert.equal(respuesta.status, 400);
  const cuerpo = await respuesta.json();
  assert.equal(cuerpo.error, "El cuerpo de la solicitud no es JSON válido");
});
