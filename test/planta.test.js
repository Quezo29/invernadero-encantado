const assert = require("node:assert/strict");
const test = require("node:test");
const Planta = require("../src/models/Planta");
const { validarPlanta } = require("../src/dominio/planta");

function datosValidos(extra = {}) {
  return {
    nombre: "Rosa lunar",
    especie: "Rosa selenita",
    ubicacion: "Sector A",
    intervaloRiegoDias: 3,
    ...extra,
  };
}

test("validarPlanta acepta una planta completa", () => {
  assert.deepEqual(validarPlanta(datosValidos()), []);
});

test("validarPlanta rechaza cada dato obligatorio faltante", () => {
  for (const campo of [
    "nombre",
    "especie",
    "ubicacion",
    "intervaloRiegoDias",
  ]) {
    const datos = datosValidos();
    delete datos[campo];
    const errores = validarPlanta(datos);
    assert.ok(errores.length > 0, `debía rechazar la falta de ${campo}`);
  }
});

test("validarPlanta rechaza intervalo 0, negativo o con fracción", () => {
  for (const intervalo of [0, -1, 1.5]) {
    const errores = validarPlanta(
      datosValidos({ intervaloRiegoDias: intervalo }),
    );
    assert.ok(errores.length > 0, `debía rechazar el intervalo ${intervalo}`);
  }
});

test("validarPlanta rechaza un cuerpo que no es un objeto", () => {
  assert.ok(validarPlanta(null).length > 0);
  assert.ok(validarPlanta([]).length > 0);
});

test("validarPlanta acepta un intervalo mínimo de 1 día", () => {
  assert.deepEqual(validarPlanta(datosValidos({ intervaloRiegoDias: 1 })), []);
});

test("el modelo Planta aplica el reposo y la fecha de registro por defecto", async () => {
  const planta = new Planta(datosValidos());
  await planta.validate();

  assert.equal(planta.enReposo, false);
  assert.equal(planta.cuidadosEspeciales.length, 0);
  assert.ok(planta.createdAt instanceof Date);

  const json = planta.toJSON();
  assert.equal(typeof json.id, "string");
  assert.equal(json._id, undefined);
});

test("el modelo Planta rechaza datos obligatorios vacíos", async () => {
  const planta = new Planta(datosValidos({ nombre: "   " }));

  await assert.rejects(
    () => planta.validate(),
    (error) => {
      assert.equal(error.name, "ValidationError");
      assert.ok(error.errors.nombre);
      return true;
    },
  );
});

test("el modelo Planta rechaza intervalos inválidos", async () => {
  for (const intervalo of [0, -1, 1.5]) {
    const planta = new Planta(datosValidos({ intervaloRiegoDias: intervalo }));

    await assert.rejects(
      () => planta.validate(),
      (error) => {
        assert.equal(error.name, "ValidationError");
        assert.ok(error.errors.intervaloRiegoDias);
        return true;
      },
    );
  }
});

test("el modelo Planta rechaza un cuidado especial sin tipo", async () => {
  const planta = new Planta(
    datosValidos({ cuidadosEspeciales: [{ nota: "Sombra por la tarde" }] }),
  );

  await assert.rejects(
    () => planta.validate(),
    (error) => error.name === "ValidationError",
  );
});
