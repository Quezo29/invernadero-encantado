# Wireframes · Spec 07 · Registrar un riego rápido desde la lista

Wireframes de baja fidelidad de HU-1.8, hechos a partir de sus criterios de aceptación ([backlog de E1](../../../backlog/E1-plantas-y-riegos.md)). Convenciones de `.claude/skills/wireframes/SKILL.md`: solo los seis grises, texto real en etiquetas y botones, y una banda superior con el estado y los criterios que cubre.

## Estados

| Estado | Archivos | Criterios que cubre |
|---|---|---|
| Lista con la acción en cada fila | `lista-movil.svg`, `lista-escritorio.svg` | CA-1.8.1 |
| Panel abierto | `panel-abierto-movil.svg`, `panel-abierto-escritorio.svg` | CA-1.8.1, CA-1.8.2, CA-1.8.7 |
| Guardando | `guardando-movil.svg` | CA-1.8.3 |
| Éxito | `exito-movil.svg` | CA-1.8.4 |
| Error de validación junto al campo | `error-validacion-movil.svg` | CA-1.8.5 |
| Error de conexión | `error-conexion-movil.svg` | CA-1.8.6 |

Los seis criterios aparecen al menos en un wireframe.

## Decisiones

Lo que el wireframe decide y los criterios no:

- **Dónde va la acción.** «Regar» es un botón secundario al final de cada fila: al pie de la tarjeta a la derecha en móvil y en una última columna de la tabla en escritorio. No es un enlace ni un icono, para que se vea como acción y mida 44 px de alto.
- **Un solo botón primario.** En la lista, el único botón primario es «Registrar planta»; los «Regar» de cada fila son secundarios. Al abrir el panel, el panel tapa la lista (hoja inferior en móvil, diálogo centrado en escritorio) y el único primario visible es «Guardar riego». Así se mantiene el principio de DESIGN.md sin esconder la acción en las filas.
- **Solo cantidad y fecha.** El panel no pide cuidador (decisión del cliente) y la planta no se puede cambiar desde el panel: su nombre va como subtítulo, «Mandrágora · Mesa 2».
- **Orden de los botones.** Primero la acción principal, «Guardar riego», y después «Cancelar». En móvil van apilados a todo el ancho; en escritorio, en la misma fila, el primario a la izquierda.
- **La cantidad sugerida se escribe en el campo.** 500 ml aparece como valor, no como ayuda, para poder guardar en un toque; se puede cambiar.
- **La fecha se lee como texto.** «18 nov 2026», el formato de DESIGN.md, con la ayuda «Déjala como está si la regaste hoy.».
- **Cada error en su sitio.** El de validación va debajo del campo que falla, con icono y borde de 2 px; el de conexión va arriba de los campos porque no pertenece a ninguno, y no se pierde lo escrito.
- **El éxito no cambia de pantalla.** El panel se cierra, la lista sigue a la vista y el mensaje aparece encima de las filas, para seguir regando otra planta.
- **Fuera del wireframe.** El historial y el detalle de la planta no cambian con esta historia, así que no se dibujan.
