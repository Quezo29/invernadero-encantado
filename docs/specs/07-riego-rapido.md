# Spec 07 · Registrar un riego rápido desde la lista

- **Historia:** HU-1.8 · Registrar un riego rápido desde la lista. **Alcance:** PRD §4.2, anotado desde la lista. Criterios en el [backlog de E1](../backlog/E1-plantas-y-riegos.md#hu-18--registrar-un-riego-rápido-desde-la-lista).
- **Objetivo:** anotar un riego de una planta desde la lista, sin abrir su detalle, en un panel que sugiere 500 ml y la fecha de hoy.
- **Diseño:** [DESIGN.md](../../DESIGN.md).
- **Wireframes:** [wireframes/README.md](07-riego-rapido/wireframes/README.md).

## Reglas

- **DEBE** agregar en cada fila de la lista «Plantas» un botón secundario «Regar» (nombre accesible «Regar <nombre de la planta>») que abra el panel «Registrar un riego» de esa planta sin salir de la lista.
- **DEBE** mostrar en el panel el nombre de la planta, «Cantidad (ml)» con 500 por defecto, «Fecha» con hoy, un botón primario «Guardar riego» y uno secundario «Cancelar».
- **DEBE** enviar `POST /api/riegos` con `planta`, `cantidadMl` y `fecha`, sin `cuidador`.
- **DEBE** desactivar «Guardar riego» mientras guarda y mostrar «Guardando…».
- **DEBE** cerrar el panel y mostrar «Riego guardado para <nombre>.» encima de la lista cuando la API responde 201.
- **DEBE** mostrar los errores de validación (400) debajo de su campo, con icono y borde de 2 px, y el error de conexión arriba del panel; en los dos casos el panel sigue abierto con lo escrito.
- **DEBE** respetar DESIGN.md: un solo botón primario visible, zonas táctiles de 44 px y textos en español.
- **NO DEBE** cambiar el backend ni el formulario «Registrar una planta».
- **NO DEBE** pedir cuidador ni permitir cambiar de planta desde el panel.

## Criterios de aceptación

- **CA-07.1:** DADO la lista de plantas, CUANDO se pulsa «Regar Mandrágora», ENTONCES se abre el panel de esa planta con 500 ml y la fecha de hoy, sin abrir el detalle (CA-1.8.1).
- **CA-07.2:** DADO el panel abierto, CUANDO se mira, ENTONCES tiene el nombre de la planta, «Cantidad (ml)» con 500, «Fecha» con hoy, «Guardar riego» como único botón primario y «Cancelar» (CA-1.8.2).
- **CA-07.3:** DADO el panel con 500 ml, CUANDO se pulsa «Guardar riego», ENTONCES el botón dice «Guardando…» y queda desactivado hasta la respuesta (CA-1.8.3).
- **CA-07.4:** DADO el panel con 500 ml y la fecha de hoy, CUANDO la API responde 201, ENTONCES el panel se cierra y aparece «Riego guardado para Mandrágora.» encima de la lista (CA-1.8.4).
- **CA-07.5:** DADO el panel abierto, CUANDO se indica 0 ml y se pulsa «Guardar riego», ENTONCES el mensaje de la API aparece debajo de «Cantidad (ml)», el panel sigue abierto y no se registra el riego (CA-1.8.5).
- **CA-07.6:** DADO la API apagada, CUANDO se pulsa «Guardar riego», ENTONCES aparece el mensaje de conexión arriba del panel y se conserva lo escrito (CA-1.8.6).
- **CA-07.7:** DADO un ancho de 390 px, CUANDO se abre el panel, ENTONCES ocupa el ancho de la pantalla, no hay desplazamiento horizontal, los controles miden al menos 44 px y hay un solo botón primario visible (CA-1.8.7).

## Pantallas

| Estado | Wireframe |
| --- | --- |
| Lista con la acción en cada fila | `wireframes/lista-movil.svg` · `wireframes/lista-escritorio.svg` |
| Panel abierto | `wireframes/panel-abierto-movil.svg` · `wireframes/panel-abierto-escritorio.svg` |
| Guardando | `wireframes/guardando-movil.svg` |
| Éxito | `wireframes/exito-movil.svg` |
| Error de validación | `wireframes/error-validacion-movil.svg` |
| Error de conexión | `wireframes/error-conexion-movil.svg` |

La estructura sale del wireframe, el estilo de DESIGN.md y el comportamiento de los criterios. Las decisiones de los wireframes están en [wireframes/README.md](07-riego-rapido/wireframes/README.md).

## Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-07.1 a CA-07.7 | Capturas a 390 px y 1280 px con `npm run captura`, comparadas con su wireframe, y en el navegador |

El frontend no tiene tests automáticos (spec 02). `npm test` debe seguir pasando.

## Archivos

`client/src/pantallas/Plantas.jsx` · `client/src/componentes/PanelRiego.jsx` (nuevo) · `client/src/styles/app.css`
