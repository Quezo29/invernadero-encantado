function esTextoNoVacio(valor) {
  return typeof valor === "string" && valor.trim().length > 0;
}

function esCantidadValida(valor) {
  return typeof valor === "number" && Number.isFinite(valor) && valor > 0;
}

function esFechaValida(valor) {
  return valor instanceof Date && !Number.isNaN(valor.getTime());
}

function esFechaNoFutura(valor, ahora = new Date()) {
  return esFechaValida(valor) && valor.getTime() <= ahora.getTime();
}

function validarRiego(datos = {}, ahora = new Date()) {
  const errores = [];

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return ["El cuerpo de la solicitud debe ser un objeto"];
  }

  if (!datos.planta) {
    errores.push("La planta es obligatoria");
  }

  if (datos.cantidadMl === undefined || datos.cantidadMl === null) {
    errores.push("La cantidad de agua es obligatoria");
  } else if (!esCantidadValida(datos.cantidadMl)) {
    errores.push("La cantidad de agua debe ser mayor que 0");
  }

  if (!esTextoNoVacio(datos.cuidador)) {
    errores.push("El cuidador es obligatorio");
  }

  if (datos.fecha !== undefined && datos.fecha !== null && datos.fecha !== "") {
    const fecha =
      datos.fecha instanceof Date ? datos.fecha : new Date(datos.fecha);
    if (!esFechaValida(fecha)) {
      errores.push("La fecha del riego no es válida");
    } else if (!esFechaNoFutura(fecha, ahora)) {
      errores.push("La fecha del riego no puede ser futura");
    }
  }

  return errores;
}

module.exports = {
  esCantidadValida,
  esFechaNoFutura,
  esFechaValida,
  esTextoNoVacio,
  validarRiego,
};
