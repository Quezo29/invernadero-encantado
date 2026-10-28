# Auditoría — Spec 01 · Plantas y riegos

**Fecha:** 28 de octubre de 2026
**Spec:** `docs/specs/01-plantas-y-riegos.md`
**Comando de tests:** `npm test`
**Resultado de tests:** 34 tests, 34 pasan, 0 fallan.
**Validación con `curl` contra Atlas:** 12 de 12 casos correctos.

## Resumen

- Los 12 criterios de aceptación tienen cobertura automática.
- 12 de 12 criterios: **cumple**.
- La API se validó contra MongoDB Atlas con `curl`: 12 de 12 casos con el resultado esperado.
- La integración con MongoDB también se comprobó con una instancia efímera local: 9 de 9 casos.
- No quedan criterios sin verificar.

## Criterio → verificación

| Criterio | Cómo se verificó | Resultado | Evidencia |
| --- | --- | --- | --- |
| CA-1.1.1 · Registrar planta válida | Tests de API y modelo + `curl` | cumple | `test/plantas.api.test.js` → «POST /api/plantas registra una planta válida»; `curl` → 201 con `id` |
| CA-1.1.2 · Rechazar datos obligatorios faltantes | Tests de dominio, modelo y API + `curl` | cumple | `test/planta.test.js` y `test/plantas.api.test.js` → «rechaza cada dato obligatorio faltante»; `curl` sin nombre → 400 |
| CA-1.1.3 · Rechazar intervalo 0, negativo o fraccionario | Tests de dominio, modelo y API + `curl` | cumple | `test/planta.test.js` → «rechaza intervalo 0, negativo o con fracción»; `curl` con intervalo 0 → 400 |
| CA-1.1.4 · Reposo por defecto en falso | Test de modelo + `curl` | cumple | `test/planta.test.js` → «aplica el reposo y la fecha de registro por defecto»; respuesta de Atlas con `enReposo: false` |
| CA-1.1.5 · Guardar fecha de registro | Test de modelo + `curl` | cumple | `test/planta.test.js` → «aplica el reposo y la fecha de registro por defecto»; respuesta de Atlas con `createdAt` |
| CA-1.3.1 · Registrar riego válido y asociarlo | Test de API + `curl` | cumple | `test/riegos.api.test.js` → «registra un riego válido y el historial lo devuelve»; `curl` → 201 con `id` |
| CA-1.3.2 · Rechazar planta inexistente | Test de API + `curl` | cumple | `test/riegos.api.test.js` → «rechaza una planta inexistente»; `curl` → 404 |
| CA-1.3.3 · Rechazar fecha futura | Tests de dominio, modelo y API + `curl` | cumple | `test/riego.test.js` y `test/riegos.api.test.js` → «rechaza una fecha futura»; `curl` → 400 |
| CA-1.3.4 · Aceptar fecha pasada | Tests de dominio, modelo y API + `curl` | cumple | `test/riego.test.js` → «acepta una fecha pasada»; `curl` con fecha de hace 2 horas → 201 |
| CA-1.3.5 · Rechazar cantidad 0 o negativa | Tests de dominio, modelo y API + `curl` | cumple | `test/riego.test.js` → «rechaza cantidad 0 o negativa»; `curl` con cantidad 0 → 400 |
| CA-1.3.6 · Rechazar riego sin cuidador | Tests de dominio, modelo y API + `curl` | cumple | `test/riego.test.js` → «rechaza la falta de planta o de cuidador»; `curl` sin cuidador → 400 |
| CA-1.3.7 · Usar la fecha actual si se omite | Test de modelo y API + `curl` | cumple | `test/riego.test.js` → «aplica la fecha actual por defecto»; `curl` sin fecha → 201 con `fecha` |

## Validación con `curl` contra Atlas

| Caso | Comando | Esperado | Obtenido |
| --- | --- | --- | --- |
| Registrar planta válida | `curl -X POST /api/plantas` | 201 | 201 |
| Registrar planta sin nombre | `curl -X POST /api/plantas` | 400 | 400 |
| Registrar planta con intervalo 0 | `curl -X POST /api/plantas` | 400 | 400 |
| Listar plantas | `curl /api/plantas` | 200 | 200 |
| Registrar riego válido con fecha pasada | `curl -X POST /api/riegos` | 201 | 201 |
| Registrar riego con fecha futura | `curl -X POST /api/riegos` | 400 | 400 |
| Registrar riego con cantidad 0 | `curl -X POST /api/riegos` | 400 | 400 |
| Registrar riego sin cuidador | `curl -X POST /api/riegos` | 400 | 400 |
| Registrar riego de planta inexistente | `curl -X POST /api/riegos` | 404 | 404 |
| Registrar riego sin fecha | `curl -X POST /api/riegos` | 201 | 201 |
| Consultar riegos de planta existente | `curl /api/plantas/:id/riegos` | 200 | 200 |
| Consultar riegos de planta inexistente | `curl /api/plantas/:id/riegos` | 404 | 404 |

Comprobaciones adicionales de la respuesta real de Atlas:

- `enReposo` por defecto: `false`.
- `createdAt` presente en la planta creada.
- `fecha` presente en el riego registrado sin fecha.
- El historial de la planta válida devolvió los 2 riegos registrados.

## Integración con MongoDB efímero

También se ejecutó un script temporal contra una instancia efímera de MongoDB, usando la app, los modelos y los repositorios reales. Resultado: 9 de 9 casos correctos.

| Caso | Esperado | Obtenido |
| --- | --- | --- |
| Registrar planta válida | 201 | 201 |
| Registrar planta con intervalo 0 | 400 | 400 |
| Listar plantas | 200 | 200 |
| Registrar riego válido | 201 | 201 |
| Registrar riego con fecha futura | 400 | 400 |
| Registrar riego con cantidad 0 | 400 | 400 |
| Registrar riego de planta inexistente | 404 | 404 |
| Consultar riegos de planta existente | 200 | 200 |
| Consultar riegos de planta inexistente | 404 | 404 |

## Seguridad

- `.env` existe en el proyecto y está ignorado por git.
- `.env.example` se restauró a su versión segura, sin credenciales.
- No hay cadenas de conexión en archivos versionados.

## Conclusión

La implementación cumple los 12 criterios de la spec en las capas de dominio, modelo y API. La conexión real con MongoDB Atlas y la validación con `curl` también quedaron verificadas. No quedan criterios pendientes.
