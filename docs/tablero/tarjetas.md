# Tarjetas del tablero «Invernadero Encantado»

Archivo de carga para la skill `/tablero`. Cada tarjeta empieza con `## ` y una línea `Lista:`. En «Por hacer», el orden es la prioridad.

## Spec 04 · Validar la planta en el dominio
Lista: Por hacer

- **Historia:** HU-1.1 · Registrar una planta. **Deuda:** T-02 (backlog de E1, sección «Deuda técnica»).
- **Objetivo:** las reglas de una planta nueva se comprueban en una función pura de `src/dominio/`, que la ruta usa antes de tocar la base de datos.

### Reglas

- **DEBE** crear `src/dominio/validaciones.js` con `validarPlanta(datos)`, que devuelve una lista de `{ campo, mensaje }`, vacía si la planta es válida.
- **DEBE** usar los mismos mensajes que el modelo `Planta` y devolverlos en el orden nombre, especie, ubicación e intervalo.
- **DEBE** tratar como vacío un texto con solo espacios.
- **DEBE** aceptar como intervalo solo números enteros mayores o iguales a 1.
- **DEBE** hacer que `POST /api/plantas` responda 400 con `{ "error": "Datos no válidos", "detalles": [...] }` si `validarPlanta` devuelve algo, sin llamar a `Planta.create`.
- **NO DEBE** quitar las validaciones del modelo: siguen como segunda barrera.
- **NO DEBE** cambiar los mensajes ni tocar `client/`.

### Criterios de aceptación

- **CA-04.1:** DADO nombre, especie, ubicación e intervalo 3, CUANDO se valida, ENTONCES la lista está vacía.
- **CA-04.2:** DADO una planta sin especie y con intervalo 0, CUANDO se valida, ENTONCES hay dos detalles: «La especie es obligatoria» y «El intervalo de riego debe ser de al menos 1 día», en ese orden.
- **CA-04.3:** DADO un nombre con solo espacios, CUANDO se valida, ENTONCES aparece «El nombre es obligatorio».
- **CA-04.4:** DADO un intervalo de 2.5 o «tres», CUANDO se valida, ENTONCES aparece «El intervalo de riego debe ser un número entero de días».
- **CA-04.5:** DADO un cuerpo sin especie, CUANDO se envía a `POST /api/plantas`, ENTONCES responde 400 con el detalle y no se crea ninguna planta.

### Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-04.1 a CA-04.4 | Tests en `test/dominio/validaciones.test.js` |
| CA-04.5 | curl a la API y revisión del diff: la ruta llama a `validarPlanta` antes de `Planta.create` |

### Archivos

`src/dominio/validaciones.js` (nuevo) · `test/dominio/validaciones.test.js` (nuevo) · `src/routes/plantas.js`

## Spec 05 · Validar el riego en el dominio
Lista: Por hacer

- **Historia:** HU-1.2 · Registrar un riego. **Deuda:** T-05.
- **Objetivo:** las reglas de formato de un riego se comprueban en una función pura de `src/dominio/`, antes de buscar la planta en la base de datos.

### Reglas

- **DEBE** agregar a `src/dominio/validaciones.js` la función `validarRiego(datos, ahora)`, que devuelve una lista de `{ campo, mensaje }`.
- **DEBE** exigir `planta` con un identificador de 24 caracteres hexadecimales: «La planta es obligatoria» o «La planta no tiene un identificador válido».
- **DEBE** exigir `cantidadMl` entera y mayor que 0, con los mensajes del modelo `Riego`.
- **DEBE** aceptar `fecha` vacía (será hoy). Si viene, debe ser una fecha válida y no futura, usando `interpretarFecha` y `esFechaFutura` de `src/dominio/fechas.js`.
- **DEBE** hacer que `POST /api/riegos` responda 400 con el formato de error de la API si `validarRiego` devuelve algo, antes de buscar la planta.
- **NO DEBE** mover a esta función la regla de «no anterior al registro de la planta»: necesita la base de datos y sigue en la ruta.
- **NO DEBE** importar Mongoose en `src/dominio/`.

### Criterios de aceptación

- **CA-05.1:** DADO una planta válida y 500 ml sin fecha, CUANDO se valida, ENTONCES la lista está vacía.
- **CA-05.2:** DADO una cantidad de 0, -5 o 2.5, CUANDO se valida, ENTONCES aparece el mensaje de cantidad que corresponde.
- **CA-05.3:** DADO la fecha de mañana, CUANDO se valida, ENTONCES aparece «Un riego no puede tener fecha futura».
- **CA-05.4:** DADO hoy a las 23:59 con `ahora` a las 00:01 del mismo día, CUANDO se valida, ENTONCES no hay error de fecha.
- **CA-05.5:** DADO `planta: "123"`, CUANDO se valida, ENTONCES aparece «La planta no tiene un identificador válido».

### Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-05.1 a CA-05.5 | Tests en `test/dominio/validaciones.test.js`, con `ahora` fijo |
| Uso en la ruta | Revisión del diff: `validarRiego` va antes de `Planta.findById` |

### Archivos

`src/dominio/validaciones.js` · `test/dominio/validaciones.test.js` · `src/routes/riegos.js`

## Spec 06 · Consultar una planta por su identificador
Lista: Por hacer

- **Historia:** HU-1.4 · Historial de riegos (apoyo). Hoy el frontend recibe los datos de la planta desde la lista; con este endpoint, el detalle puede pedirlos solo.
- **Objetivo:** `GET /api/plantas/:id` devuelve una planta, con los mismos errores que el historial de riegos.

### Reglas

- **DEBE** agregar `esIdValido(valor)` a `src/dominio/validaciones.js`: verdadero solo para 24 caracteres hexadecimales.
- **DEBE** crear `GET /api/plantas/:id`: 400 con `{ campo: "id", mensaje: "La planta no tiene un identificador válido" }` si el id no es válido, 404 con `{ "error": "Planta no encontrada" }` si no existe y 200 con la planta si existe.
- **DEBE** usar `esIdValido` también en `GET /api/plantas/:id/riegos`, en lugar de la comprobación actual.
- **NO DEBE** cambiar el frontend en esta spec.

### Criterios de aceptación

- **CA-06.1:** DADO `"665f1c2a9b1e8a0012345678"`, CUANDO se comprueba, ENTONCES `esIdValido` es verdadero; con `"123"`, `""` o `null`, falso.
- **CA-06.2:** DADO una planta registrada, CUANDO se pide por su id, ENTONCES responde 200 con sus datos.
- **CA-06.3:** DADO un id con formato válido que no existe, CUANDO se pide, ENTONCES responde 404.
- **CA-06.4:** DADO el id `abc`, CUANDO se pide la planta o su historial, ENTONCES los dos responden 400 con el mismo detalle.

### Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-06.1 | Tests en `test/dominio/validaciones.test.js` |
| CA-06.2 a CA-06.4 | curl a la API |

### Archivos

`src/dominio/validaciones.js` · `test/dominio/validaciones.test.js` · `src/routes/plantas.js`

## HU-2.1 · Ver las plantas que necesitan agua
Lista: Backlog

Como cuidador, quiero ver qué plantas necesitan agua hoy, para regarlas sin revisar el historial de cada una.

- **Alcance:** PRD §4.3, épica E2.
- **Estado:** sin spec. Falta definir la regla de «sedienta» con el cliente y escribir sus criterios. **No se implementa hasta tener spec.**

## HU-2.2 · Poner una planta en reposo
Lista: Backlog

Como cuidador, quiero marcar una planta en reposo, para que no aparezca como sedienta mientras no necesita riego.

- **Alcance:** épica E2.
- **Estado:** sin spec. El PRD todavía no define qué es el reposo ni cuánto dura (pregunta abierta). **No se implementa hasta tener spec.**

## Spec 01 · Registrar plantas y riegos
Lista: Hecho

Backend de la épica E1. Ver `docs/specs/01-plantas-y-riegos.md`.

## Spec 02 · Frontend de la épica E1
Lista: Hecho

Pantallas «Plantas» y «Detalle de planta». Ver `docs/specs/02-frontend-e1.md` y `docs/AUDITORIA-frontend.md`.

## Spec 07 · Registrar un riego rápido desde la lista
Lista: Por hacer

- **Historia:** HU-1.8 · Registrar un riego rápido desde la lista. **Alcance:** PRD §4.2, anotado desde la lista. Criterios en el [backlog de E1](../backlog/E1-plantas-y-riegos.md#hu-18--registrar-un-riego-rápido-desde-la-lista).
- **Objetivo:** anotar un riego de una planta desde la lista, sin abrir su detalle, en un panel que sugiere 500 ml y la fecha de hoy.

### Reglas

- **DEBE** agregar en cada fila de la lista «Plantas» un botón secundario «Regar» (nombre accesible «Regar <nombre de la planta>») que abra el panel «Registrar un riego» de esa planta sin salir de la lista.
- **DEBE** mostrar en el panel el nombre de la planta, «Cantidad (ml)» con 500 por defecto, «Fecha» con hoy, un botón primario «Guardar riego» y uno secundario «Cancelar».
- **DEBE** enviar `POST /api/riegos` con `planta`, `cantidadMl` y `fecha`, sin `cuidador`.
- **DEBE** desactivar «Guardar riego» mientras guarda y mostrar «Guardando…».
- **DEBE** cerrar el panel y mostrar «Riego guardado para <nombre>.» encima de la lista cuando la API responde 201.
- **DEBE** mostrar los errores de validación (400) debajo de su campo, con icono y borde de 2 px, y el error de conexión arriba del panel; en los dos casos el panel sigue abierto con lo escrito.
- **DEBE** respetar DESIGN.md: un solo botón primario visible, zonas táctiles de 44 px y textos en español.
- **NO DEBE** cambiar el backend ni el formulario «Registrar una planta».
- **NO DEBE** pedir cuidador ni permitir cambiar de planta desde el panel.

### Criterios de aceptación

- **CA-07.1:** DADO la lista de plantas, CUANDO se pulsa «Regar Mandrágora», ENTONCES se abre el panel de esa planta con 500 ml y la fecha de hoy, sin abrir el detalle (CA-1.8.1).
- **CA-07.2:** DADO el panel abierto, CUANDO se mira, ENTONCES tiene el nombre de la planta, «Cantidad (ml)» con 500, «Fecha» con hoy, «Guardar riego» como único botón primario y «Cancelar» (CA-1.8.2).
- **CA-07.3:** DADO el panel con 500 ml, CUANDO se pulsa «Guardar riego», ENTONCES el botón dice «Guardando…» y queda desactivado hasta la respuesta (CA-1.8.3).
- **CA-07.4:** DADO el panel con 500 ml y la fecha de hoy, CUANDO la API responde 201, ENTONCES el panel se cierra y aparece «Riego guardado para Mandrágora.» encima de la lista (CA-1.8.4).
- **CA-07.5:** DADO el panel abierto, CUANDO se indica 0 ml y se pulsa «Guardar riego», ENTONCES el mensaje de la API aparece debajo de «Cantidad (ml)», el panel sigue abierto y no se registra el riego (CA-1.8.5).
- **CA-07.6:** DADO la API apagada, CUANDO se pulsa «Guardar riego», ENTONCES aparece el mensaje de conexión arriba del panel y se conserva lo escrito (CA-1.8.6).
- **CA-07.7:** DADO un ancho de 390 px, CUANDO se abre el panel, ENTONCES ocupa el ancho de la pantalla, no hay desplazamiento horizontal, los controles miden al menos 44 px y hay un solo botón primario visible (CA-1.8.7).

### Pantallas

| Estado | Wireframe |
| --- | --- |
| Lista con la acción en cada fila | `docs/specs/07-riego-rapido/wireframes/lista-movil.svg` · `lista-escritorio.svg` |
| Panel abierto | `docs/specs/07-riego-rapido/wireframes/panel-abierto-movil.svg` · `panel-abierto-escritorio.svg` |
| Guardando | `docs/specs/07-riego-rapido/wireframes/guardando-movil.svg` |
| Éxito | `docs/specs/07-riego-rapido/wireframes/exito-movil.svg` |
| Error de validación | `docs/specs/07-riego-rapido/wireframes/error-validacion-movil.svg` |
| Error de conexión | `docs/specs/07-riego-rapido/wireframes/error-conexion-movil.svg` |

La estructura sale del wireframe, el estilo de DESIGN.md y el comportamiento de los criterios. Las decisiones de los wireframes están en `docs/specs/07-riego-rapido/wireframes/README.md`.

### Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-07.1 a CA-07.7 | Capturas a 390 px y 1280 px con `npm run captura`, comparadas con su wireframe, y en el navegador |

El frontend no tiene tests automáticos (spec 02). `npm test` debe seguir pasando.

### Archivos

`client/src/pantallas/Plantas.jsx` · `client/src/componentes/PanelRiego.jsx` (nuevo) · `client/src/styles/app.css`
