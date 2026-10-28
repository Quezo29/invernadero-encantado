# AGENTS.md
## Proyecto

API REST para registrar las plantas mágicas de un invernadero y sus riegos.

## Stack

- Node.js 20+
- Express 5
- Mongoose 8
- CommonJS (`require`)
- Tests con `node --test`
- Formato con Prettier

## Estructura prevista

- `src/app.js`, `src/index.js`
- `src/models/`
- `src/routes/`
- `src/dominio/` (funciones puras)
- `test/`, `src/repositorios/`
- `docs/prd/`, `docs/specs/`

## Comandos

- `npm run dev`
- `npm test`

## Convenciones

- Nombres del dominio en español.
- camelCase.
- Rutas REST bajo `/api`.

## Reglas

- Nunca leer ni modificar `.env`.
- Nunca escribir credenciales en el código.
- Ninguna funcionalidad se implementa sin una spec en `docs/specs/`.
- Ejecutar `npm test` antes de dar una tarea por terminada.
