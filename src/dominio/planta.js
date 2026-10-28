const CAMPOS_TEXTO_OBLIGATORIOS = [
  ["nombre", "El nombre es obligatorio"],
  ["especie", "La especie es obligatoria"],
  ["ubicacion", "La ubicación es obligatoria"],
];

function esTextoNoVacio(valor) {
  return typeof valor === "string" && valor.trim().length > 0;
}

function esIntervaloValido(valor) {
  return Number.isInteger(valor) && valor >= 1;
}

function validarPlanta(datos = {}) {
  const errores = [];

  for (const [campo, mensaje] of CAMPOS_TEXTO_OBLIGATORIOS) {
    if (!esTextoNoVacio(datos[campo])) {
      errores.push(mensaje);
    }
  }

  if (
    datos.intervaloRiegoDias === undefined ||
    datos.intervaloRiegoDias === null
  ) {
    errores.push("El intervalo de riego es obligatorio");
  } else if (!esIntervaloValido(datos.intervaloRiegoDias)) {
    errores.push(
      "El intervalo de riego debe ser un entero mayor o igual que 1",
    );
  }

  if (datos.enReposo !== undefined && typeof datos.enReposo !== "boolean") {
    errores.push("El estado de reposo debe ser verdadero o falso");
  }

  if (datos.cuidadosEspeciales !== undefined) {
    if (!Array.isArray(datos.cuidadosEspeciales)) {
      errores.push("Los cuidados especiales deben ser una lista");
    } else {
      datos.cuidadosEspeciales.forEach((cuidado, indice) => {
        if (!cuidado || !esTextoNoVacio(cuidado.tipo)) {
          errores.push(`El cuidado especial ${indice + 1} debe tener un tipo`);
        }
      });
    }
  }

  return errores;
}

module.exports = {
  esIntervaloValido,
  esTextoNoVacio,
  validarPlanta,
};
