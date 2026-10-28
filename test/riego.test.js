const assert = require("node:assert/strict");
const test = require("node:test");
const { Types } = require("mongoose");
const Riego = require("../src/models/Riego");
const { validarRiego } = require("../src/dominio/riego");

const plantaId = new Types.ObjectId();

function datosValidos(extra = {}) {
  return {
    planta: plantaId,
    cantidadMl: 250,
    cuidador: "Leslie Knope",
    ...extra,
  };
}

test("validarRiego acepta un riego válido sin fecha", () => {
  assert.deepEqual(validarRiego(datosValidos()), []);
});

test("validarRiego rechaza un cuerpo que no es un objeto", () => {
  assert.ok(validarRiego(null).length > 0);
  assert.ok(validarRiego([]).length > 0);
});

test("validarRiego acepta una fecha pasada", () => {
  const fecha = new Date(Date.now() - 60 * 60 * 1000);
  assert.deepEqual(validarRiego(datosValidos({ fecha })), []);
});

test("validarRiego rechaza una fecha futura", () => {
  const fecha = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const errores = validarRiego(datosValidos({ fecha }));
  assert.ok(errores.some((error) => error.includes("futura")));
});

test("validarRiego rechaza una fecha inválida", () => {
  const errores = validarRiego(datosValidos({ fecha: "no-es-una-fecha" }));
  assert.ok(errores.some((error) => error.includes("no es válida")));
});

test("validarRiego rechaza cantidad 0 o negativa", () => {
  for (const cantidad of [0, -25]) {
    const errores = validarRiego(datosValidos({ cantidadMl: cantidad }));
    assert.ok(
      errores.some((error) => error.includes("mayor que 0")),
      `debía rechazar la cantidad ${cantidad}`,
    );
  }
});

test("validarRiego rechaza la falta de planta o de cuidador", () => {
  const sinPlanta = datosValidos();
  delete sinPlanta.planta;
  assert.ok(validarRiego(sinPlanta).length > 0);

  const sinCuidador = datosValidos();
  delete sinCuidador.cuidador;
  assert.ok(validarRiego(sinCuidador).length > 0);
});

test("el modelo Riego aplica la fecha actual por defecto", async () => {
  const antes = Date.now();
  const riego = new Riego(datosValidos());
  await riego.validate();

  assert.ok(riego.fecha instanceof Date);
  assert.ok(riego.fecha.getTime() >= antes);
  assert.ok(riego.fecha.getTime() <= Date.now());

  const json = riego.toJSON();
  assert.equal(typeof json.id, "string");
  assert.equal(typeof json.planta, "string");
});

test("el modelo Riego rechaza una fecha futura", async () => {
  const riego = new Riego(
    datosValidos({ fecha: new Date(Date.now() + 24 * 60 * 60 * 1000) }),
  );

  await assert.rejects(
    () => riego.validate(),
    (error) => {
      assert.equal(error.name, "ValidationError");
      assert.ok(error.errors.fecha);
      return true;
    },
  );
});

test("el modelo Riego rechaza cantidad 0 o negativa", async () => {
  for (const cantidad of [0, -25]) {
    const riego = new Riego(datosValidos({ cantidadMl: cantidad }));

    await assert.rejects(
      () => riego.validate(),
      (error) => {
        assert.equal(error.name, "ValidationError");
        assert.ok(error.errors.cantidadMl);
        return true;
      },
    );
  }
});

test("el modelo Riego rechaza la falta de planta o de cuidador", async () => {
  const sinPlanta = datosValidos();
  delete sinPlanta.planta;

  await assert.rejects(
    () => new Riego(sinPlanta).validate(),
    (error) => error.name === "ValidationError",
  );

  const sinCuidador = datosValidos();
  delete sinCuidador.cuidador;

  await assert.rejects(
    () => new Riego(sinCuidador).validate(),
    (error) => error.name === "ValidationError",
  );
});
