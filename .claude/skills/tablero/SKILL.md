---
name: tablero
description: Crea o actualiza en Trello (vía MCP) el tablero del Invernadero Encantado con sus listas y carga como tarjetas las specs e historias de docs/tablero/tarjetas.md. Úsala al preparar el tablero o al agregar specs nuevas.
disable-model-invocation: true
---

# Tablero de Trello

Sigue estos pasos en orden. No toques código.

1. Lee `docs/tablero/tarjetas.md`. Cada tarjeta empieza con un encabezado `## ` (su título), sigue con una línea `Lista: <nombre>` y después su descripción en markdown, hasta el siguiente `## `.
2. Con el MCP de Trello, busca un tablero llamado **Invernadero Encantado** en el espacio de trabajo autorizado. Si no existe, créalo.
3. Comprueba que el tablero tenga estas listas, en este orden: **Backlog**, **Por hacer**, **En curso**, **En revisión** y **Hecho**.
   - Si falta alguna y puedes crearla, créala.
   - Si el MCP no permite crear listas, detente y dile al usuario exactamente qué listas debe crear a mano en Trello y en qué orden. Después podrá ejecutar `/tablero` otra vez.
4. Para cada tarjeta del archivo:
   - Si ya hay una tarjeta con el mismo título en el tablero, no la dupliques: déjala donde está.
   - Si no existe, créala en su lista con la descripción tal cual, sin resumirla ni cambiarla.
   - Respeta el orden del archivo: en «Por hacer», la primera tarjeta es la de mayor prioridad.
5. Termina con una tabla: lista, tarjetas creadas y tarjetas que ya existían. Incluye el enlace al tablero.
