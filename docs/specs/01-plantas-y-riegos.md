# Spec 01 · Plantas y riegos

**Sprint:** registrar una planta (HU-1.1) y registrar un riego (HU-1.3).
**Fuente:** `docs/backlog/E1-plantas-y-riegos.md` y `docs/prd/invernadero-mvp.md`.
**Stack:** Node.js 20+, Express 5, Mongoose 8, CommonJS, `node --test`, Prettier.

## 1. Alcance técnico

Esta spec cubre:

- El modelo y las validaciones de `Planta`.
- El modelo y las validaciones de `Riego`.
- Los endpoints de registro y consulta de plantas.
- Los endpoints de registro de riegos y consulta del historial por planta.
- La verificación de cada criterio de aceptación.

No cubre: cálculo de plantas con sed, comportamiento del reposo, notificaciones, fotos, usuarios/roles, clima, sensores ni interfaz gráfica.

## 2. Modelos

### 2.1 Planta

| Campo | Tipo | Obligatorio | Regla |
| --- | --- | --- | --- |
| `nombre` | string | sí | no vacío, recortado |
| `especie` | string | sí | no vacío, recortado |
| `ubicacion` | string | sí | no vacío, recortado |
| `intervaloRiegoDias` | number | sí | entero, mínimo 1 |
| `enReposo` | boolean | no | por defecto `false` |
| `cuidadosEspeciales` | array embebido | no | por defecto `[]`; cada elemento tiene `tipo` (string obligatorio) y `nota` (string opcional); sin `_id` |
| `createdAt` | Date | automático | fecha de registro; por defecto ahora |

El modelo Mongoose se define en `src/models/Planta.js`. Las reglas reutilizables viven en `src/dominio/planta.js`.

### 2.2 Riego

| Campo | Tipo | Obligatorio | Regla |
| --- | --- | --- | --- |
| `planta` | ObjectId con referencia a `Planta` | sí | debe existir la planta |
| `fecha` | Date | no | por defecto ahora; no puede ser futura; puede ser pasada |
| `cantidadMl` | number | sí | mayor que 0 |
| `cuidador` | string | sí | no vacío, recortado |

El modelo Mongoose se define en `src/models/Riego.js`. Las reglas reutilizables viven en `src/dominio/riego.js`.

## 3. Endpoints

Prefijo común: `/api`. Todas las respuestas son JSON.

### 3.1 POST /api/plantas

**Cuerpo:**

```json
{
  "nombre": "Rosa lunar",
  "especie": "Rosa selenita",
  "ubicacion": "Sector A",
  "intervaloRiegoDias": 3,
  "enReposo": false,
  "cuidadosEspeciales": [{ "tipo": "luz", "nota": "Sombra por la tarde" }]
}
```

**Respuesta 201:**

```json
{
  "planta": {
    "id": "665f...",
    "nombre": "Rosa lunar",
    "especie": "Rosa selenita",
    "ubicacion": "Sector A",
    "intervaloRiegoDias": 3,
    "enReposo": false,
    "cuidadosEspeciales": [{ "tipo": "luz", "nota": "Sombra por la tarde" }],
    "createdAt": "2026-10-27T15:00:00.000Z"
  }
}
```

**Errores:**

- `400` si falta un dato obligatorio, si el intervalo no es un entero mayor o igual que 1, o si los cuidados especiales tienen un `tipo` vacío. Cuerpo: `{ "errores": ["..."] }`.
- `400` si el cuerpo no es JSON válido. Cuerpo: `{ "error": "El cuerpo de la solicitud no es JSON válido" }`.

### 3.2 GET /api/plantas

**Respuesta 200:**

```json
{ "plantas": [ { "id": "665f...", "nombre": "Rosa lunar", "especie": "...", "ubicacion": "...", "intervaloRiegoDias": 3, "enReposo": false, "cuidadosEspeciales": [], "createdAt": "..." } ] }
```

Las plantas se ordenan por `createdAt` descendente. Si no hay plantas, devuelve `{ "plantas": [] }`.

### 3.3 POST /api/riegos

**Cuerpo:**

```json
{
  "planta": "665f...",
  "fecha": "2026-10-26T10:00:00.000Z",
  "cantidadMl": 250,
  "cuidador": "Leslie Knope"
}
```

`fecha` es opcional; si se omite, se usa la fecha y hora actual.

**Respuesta 201:**

```json
{
  "riego": {
    "id": "6660...",
    "planta": "665f...",
    "fecha": "2026-10-26T10:00:00.000Z",
    "cantidadMl": 250,
    "cuidador": "Leslie Knope"
  }
}
```

**Errores:**

- `400` si la cantidad es menor o igual que 0, si la fecha es futura, si falta el cuidador o si el cuerpo no es válido. Cuerpo: `{ "errores": ["..."] }`.
- `404` si la planta indicada no existe. Cuerpo: `{ "error": "La planta indicada no existe" }`.

El orden de comprobación es: primero la forma del cuerpo (`400`), después la existencia de la planta (`404`).

### 3.4 GET /api/plantas/:id/riegos

**Respuesta 200:**

```json
{ "riegos": [ { "id": "6660...", "planta": "665f...", "fecha": "...", "cantidadMl": 250, "cuidador": "Leslie Knope" } ] }
```

Los riegos se ordenan por `fecha` descendente. Si la planta existe pero no tiene riegos, devuelve `{ "riegos": [] }`.

**Errores:**

- `404` si la planta no existe. Cuerpo: `{ "error": "La planta indicada no existe" }`.

## 4. Criterios de aceptación (DEBE / NO DEBE)

### HU-1.1 · Registrar una planta

- **CA-1.1.1** El sistema DEBE registrar una planta con nombre, especie, ubicación e intervalo entero de al menos 1 día, y DEBE devolverla con su identificador. NO DEBE perder ninguno de los datos recibidos.
- **CA-1.1.2** El sistema DEBE rechazar el registro si falta nombre, especie, ubicación o intervalo, y DEBE indicar qué dato obligatorio falta. NO DEBE crear la planta.
- **CA-1.1.3** El sistema DEBE rechazar un intervalo de 0, negativo o con fracción. NO DEBE aceptar valores menores que 1 ni no enteros.
- **CA-1.1.4** Si no se indica el estado de reposo, el sistema DEBE guardar `enReposo: false`. NO DEBE exigir ese dato para registrar la planta.
- **CA-1.1.5** El sistema DEBE guardar la fecha de registro en `createdAt`. NO DEBE dejarla vacía.

### HU-1.3 · Registrar un riego

- **CA-1.3.1** DADO una planta existente, el sistema DEBE registrar un riego con fecha no futura y cantidad mayor que 0, y DEBE asociarlo a esa planta. NO DEBE aceptar la operación sin devolver el identificador del riego.
- **CA-1.3.2** El sistema NO DEBE registrar un riego para una planta inexistente y DEBE responder que la planta no existe.
- **CA-1.3.3** El sistema NO DEBE aceptar una fecha futura. DEBE rechazar el registro.
- **CA-1.3.4** El sistema DEBE aceptar una fecha pasada para permitir registrar un riego olvidado.
- **CA-1.3.5** El sistema NO DEBE aceptar una cantidad de agua igual a 0 o negativa. DEBE rechazar el registro.
- **CA-1.3.6** El sistema NO DEBE aceptar un riego sin cuidador. DEBE rechazar el registro.
- **CA-1.3.7** Si no se indica la fecha, el sistema DEBE guardar la fecha y hora del momento del registro.

## 5. Verificación criterio → prueba

| Criterio | Verificación automática | Verificación manual |
| --- | --- | --- |
| CA-1.1.1 | `test/plantas.api.test.js`: POST válido devuelve 201 y la planta con `id` | `curl -X POST /api/plantas` con cuerpo válido |
| CA-1.1.2 | `test/planta.test.js`: el modelo y el dominio rechazan cada dato faltante; `test/plantas.api.test.js`: POST inválido devuelve 400 | `curl -X POST /api/plantas` sin `nombre` |
| CA-1.1.3 | `test/planta.test.js` y `test/plantas.api.test.js`: intervalo 0, negativo y fraccionario se rechazan | `curl` con `intervaloRiegoDias: 0` |
| CA-1.1.4 | `test/planta.test.js`: valor por defecto `false` | `curl` sin `enReposo` y revisar la respuesta |
| CA-1.1.5 | `test/planta.test.js`: `createdAt` existe y es una fecha | Revisar `createdAt` en la respuesta del POST |
| CA-1.3.1 | `test/riegos.api.test.js`: POST válido devuelve 201 y el riego asociado | `curl -X POST /api/riegos` con cuerpo válido |
| CA-1.3.2 | `test/riegos.api.test.js`: planta inexistente devuelve 404 | `curl` con un identificador inexistente |
| CA-1.3.3 | `test/riego.test.js` y `test/riegos.api.test.js`: fecha futura se rechaza | `curl` con fecha futura |
| CA-1.3.4 | `test/riego.test.js`: fecha pasada es válida | `curl` con fecha pasada |
| CA-1.3.5 | `test/riego.test.js` y `test/riegos.api.test.js`: cantidad 0 y negativa se rechazan | `curl` con `cantidadMl: 0` |
| CA-1.3.6 | `test/riego.test.js`: cuidador faltante se rechaza | `curl` sin `cuidador` |
| CA-1.3.7 | `test/riego.test.js`: la fecha por defecto es cercana a ahora | `curl` sin `fecha` y revisar la respuesta |

Los tests de API usan repositorios en memoria, por lo que no requieren MongoDB. La verificación manual con `curl` requiere MongoDB y el servidor en `http://localhost:3000`.

## 6. Tickets → archivos

| Ticket | Archivos que crea o modifica |
| --- | --- |
| T-01 · Configuración | `package.json`, `package-lock.json`, `.env.example`, `src/app.js`, `src/index.js` |
| T-02 · Modelo y dominio de Planta | `src/models/Planta.js`, `src/dominio/planta.js` |
| T-03 · Endpoints de plantas | `src/routes/plantas.js`, `src/repositorios/plantas.js`, `src/app.js` |
| T-04 · Tests de planta | `test/planta.test.js`, `test/plantas.api.test.js`, `test-utils/app.js` |
| T-05 · Modelo y dominio de Riego | `src/models/Riego.js`, `src/dominio/riego.js` |
| T-06 · Endpoints de riegos | `src/routes/riegos.js`, `src/repositorios/riegos.js`, `src/app.js` |
| T-07 · Tests de riego | `test/riego.test.js`, `test/riegos.api.test.js` |

## 7. Decisiones de implementación

- Los routers reciben sus repositorios como dependencia; así los tests pueden usar dobles en memoria y no necesitan base de datos.
- Los repositorios reales usan Mongoose y se conectan en `src/index.js`.
- Las validaciones de dominio se ejecutan antes de llamar al repositorio y devuelven una lista de mensajes en español, sin filtrar detalles internos.
- Los documentos se serializan con `id` (string) en lugar de `_id`.
- Un identificador de planta mal formado se trata como planta inexistente (`404`), porque no puede corresponder a ninguna planta registrada.
- No se implementa el bloqueo de riegos para plantas en reposo: el PRD lo deja como punto abierto y pertenece a E2.
