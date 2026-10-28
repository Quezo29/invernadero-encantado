# Auditoría — Spec 01 · Plantas y riegos

**Fecha:** 27 de octubre de 2026
**Spec:** `docs/specs/01-plantas-y-riegos.md`
**Comando ejecutado:** `npm test`
**Resultado:** 34 tests, 34 pasan, 0 fallan.

## Resumen

- Los 12 criterios de aceptación tienen cobertura automática.
- 12 de 12 criterios: **cumple**.
- La integración real con MongoDB se validó con una instancia efímera local: 9 de 9 casos HTTP pasaron.
- La validación contra Atlas y el `curl` manual quedan **sin verificar** porque no hay `.env` con `MONGODB_URI` en este entorno.
- Los tests de API usan repositorios en memoria; no requieren base de datos.

## Criterio → verificación

| Criterio | Cómo se verificó | Resultado | Evidencia |
| --- | --- | --- | --- |
| CA-1.1.1 · Registrar planta válida | Test de API | cumple | `test/plantas.api.test.js` → «POST /api/plantas registra una planta válida» |
| CA-1.1.2 · Rechazar datos obligatorios faltantes | Test de dominio, modelo y API | cumple | `test/planta.test.js` → «rechaza cada dato obligatorio faltante»; `test/plantas.api.test.js` → «rechaza cada dato obligatorio faltante» |
| CA-1.1.3 · Rechazar intervalo 0, negativo o fraccionario | Test de dominio, modelo y API | cumple | `test/planta.test.js` → «rechaza intervalo 0, negativo o con fracción»; «rechaza intervalos inválidos»; `test/plantas.api.test.js` → «rechaza intervalos 0, negativos o fraccionarios» |
| CA-1.1.4 · Reposo por defecto en falso | Test de modelo | cumple | `test/planta.test.js` → «aplica el reposo y la fecha de registro por defecto» |
| CA-1.1.5 · Guardar fecha de registro | Test de modelo y API | cumple | `test/planta.test.js` → «aplica el reposo y la fecha de registro por defecto»; respuesta de `POST /api/plantas` |
| CA-1.3.1 · Registrar riego válido y asociarlo | Test de API | cumple | `test/riegos.api.test.js` → «registra un riego válido y el historial lo devuelve» |
| CA-1.3.2 · Rechazar planta inexistente | Test de API | cumple | `test/riegos.api.test.js` → «rechaza una planta inexistente» |
| CA-1.3.3 · Rechazar fecha futura | Test de dominio, modelo y API | cumple | `test/riego.test.js` → «rechaza una fecha futura»; `test/riegos.api.test.js` → «rechaza una fecha futura» |
| CA-1.3.4 · Aceptar fecha pasada | Test de dominio, modelo y API | cumple | `test/riego.test.js` → «acepta una fecha pasada»; `test/riegos.api.test.js` → «acepta una fecha pasada» |
| CA-1.3.5 · Rechazar cantidad 0 o negativa | Test de dominio, modelo y API | cumple | `test/riego.test.js` → «rechaza cantidad 0 o negativa»; `test/riegos.api.test.js` → «rechaza cantidad 0 o negativa» |
| CA-1.3.6 · Rechazar riego sin cuidador | Test de dominio, modelo y API | cumple | `test/riego.test.js` → «rechaza la falta de planta o de cuidador»; `test/riegos.api.test.js` → «rechaza la falta de cuidador» |
| CA-1.3.7 · Usar la fecha actual si se omite | Test de modelo y API | cumple | `test/riego.test.js` → «aplica la fecha actual por defecto»; `test/riegos.api.test.js` → «usa la fecha actual cuando no se indica» |
| Integración real con MongoDB efímero y API HTTP | Validación de integración con 9 casos | cumple | MongoDB efímero local + `src/app.js`, `src/repositorios/` y modelos reales; 9 de 9 casos con el código esperado |
| Integración con Atlas y `curl` manual | Prueba manual | sin verificar | No hay `.env` con `MONGODB_URI` en el entorno de ejecución |

## Integración con MongoDB efímero

Se ejecutó un script temporal (no versionado) contra una instancia efímera de MongoDB, usando la app, los modelos y los repositorios reales. Después se retiró la dependencia auxiliar. Resultado: 9 de 9 casos correctos.

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

## Validación manual pendiente

Para completar la fila «sin verificar»:

1. Crear `.env` a partir de `.env.example` y escribir la cadena de Atlas en `MONGODB_URI` (nunca en el chat ni en el repositorio).
2. Ejecutar `npm run dev` en una terminal.
3. Ejecutar las pruebas de `curl` del paso 7c de la guía:
   - Registrar una planta válida y otra con intervalo 0.
   - Listar las plantas.
   - Registrar un riego válido, uno con fecha futura, uno con cantidad 0 y uno para una planta inexistente.
   - Consultar los riegos de la planta válida.

## Conclusión

La implementación cumple los criterios de la spec en las capas de dominio, modelo y API, y la integración con MongoDB se comprobó con una instancia efímera. La única verificación pendiente es la conexión a Atlas y la prueba manual con `curl`, que depende de las credenciales del estudiante.
