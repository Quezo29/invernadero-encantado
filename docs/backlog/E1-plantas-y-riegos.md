# E1 · Plantas y riegos — Historias, criterios y tickets

Épica: `docs/backlog/epicas.md` → E1.
Formato de historia: «Como \<rol\>, quiero \<acción\>, para \<beneficio\>».

## HU-1.1 · Registrar una planta

Como cuidador del invernadero, quiero registrar una planta con su nombre, especie, ubicación, intervalo de riego y estado de reposo, para llevar control de todas las plantas mágicas.

**Estado:** en el sprint.

### Criterios de aceptación

- **CA-1.1.1** DADO un cuidador, CUANDO registra una planta con nombre, especie, ubicación e intervalo entero de al menos 1 día, ENTONCES la planta queda registrada y disponible para consulta.
- **CA-1.1.2** DADO un cuidador, CUANDO intenta registrar una planta sin nombre, sin especie, sin ubicación o sin intervalo de riego, ENTONCES el registro se rechaza y se le indica qué dato obligatorio falta.
- **CA-1.1.3** DADO un cuidador, CUANDO indica un intervalo de riego de 0, negativo o con fracción de día, ENTONCES el registro se rechaza.
- **CA-1.1.4** DADO un cuidador que no indica el estado de reposo, CUANDO registra la planta, ENTONCES la planta queda como activa, es decir, no en reposo.
- **CA-1.1.5** DADO un cuidador que registra una planta, CUANDO el registro se completa, ENTONCES queda guardada la fecha en que se registró.

### Casos borde propuestos

- Intentar registrar dos plantas con el mismo nombre.
- Registrar una planta con cuidados especiales sin nota.
- Registrar una planta con un intervalo de riego extremadamente alto.

## HU-1.2 · Consultar las plantas

Como cuidador del invernadero, quiero consultar la lista de plantas registradas, para saber qué plantas tengo a mi cargo.

**Estado:** por refinar.

## HU-1.3 · Registrar un riego

Como cuidador del invernadero, quiero registrar un riego con su fecha, cantidad de agua y quién lo hizo, para llevar la cuenta de cuándo se regó cada planta.

**Estado:** en el sprint.

### Criterios de aceptación

- **CA-1.3.1** DADO un cuidador y una planta registrada, CUANDO registra un riego con una fecha no futura y una cantidad de agua mayor que 0, ENTONCES el riego queda registrado y asociado a esa planta.
- **CA-1.3.2** DADO un cuidador, CUANDO intenta registrar un riego para una planta que no existe, ENTONCES el registro se rechaza.
- **CA-1.3.3** DADO un cuidador, CUANDO registra un riego con fecha futura, ENTONCES el registro se rechaza.
- **CA-1.3.4** DADO un cuidador, CUANDO registra un riego con fecha pasada, ENTONCES el registro se acepta para dejar constancia de un riego olvidado.
- **CA-1.3.5** DADO un cuidador, CUANDO registra un riego con cantidad de agua igual a 0 o negativa, ENTONCES el registro se rechaza.
- **CA-1.3.6** DADO un cuidador, CUANDO registra un riego sin indicar quién lo hizo, ENTONCES el registro se rechaza.
- **CA-1.3.7** DADO un cuidador que no indica la fecha del riego, CUANDO registra el riego, ENTONCES se guarda con la fecha y hora del momento del registro.

### Casos borde propuestos

- Registrar un riego de una planta en reposo.
- Registrar un riego con una fecha exactamente igual al intervalo de riego.
- Registrar varios riegos para la misma planta y consultar cuál cuenta.

## HU-1.4 · Consultar el historial de riegos de una planta

Como cuidador del invernadero, quiero consultar los riegos de una planta, para revisar cuándo y cuánto se regó.

**Estado:** por refinar.

## Decisiones del cliente sobre los casos borde

- No se puede registrar un riego de una planta que no existe.
- La cantidad de agua de un riego debe ser mayor que 0.
- Nombre, especie, ubicación e intervalo son obligatorios al registrar una planta.
- Una planta en reposo no se riega; el comportamiento exacto se refina en E2 y queda como punto abierto del PRD.

## Tickets del sprint

### HU-1.1 · Registrar una planta

#### T-01 · Configuración del proyecto

- **Historia:** HU-1.1
- **Tipo:** Configuración
- **Descripción:** dejar listo el proyecto Node con Express, Mongoose, dotenv y los scripts de desarrollo y test. Incluye el archivo de ejemplo de variables de entorno, sin secretos.
- **Definition of Done:**
  - [ ] `package.json` existe con los scripts `dev` y `test`.
  - [ ] Las dependencias de ejecución y desarrollo están instaladas.
  - [ ] `.env.example` contiene las variables necesarias con valores vacíos o de ejemplo.
  - [ ] `.env` está ignorado por git.
- **Dependencias:** ninguna.
- **Estado:** pendiente.

#### T-02 · Modelo y dominio de Planta

- **Historia:** HU-1.1
- **Tipo:** Modelo/Dominio
- **Descripción:** representar una planta con sus datos, su intervalo de riego y su estado de reposo, y concentrar en funciones puras las reglas de validación de esos datos.
- **Definition of Done:**
  - [ ] El modelo guarda nombre, especie, ubicación, intervalo de riego, estado de reposo, cuidados especiales y fecha de registro.
  - [ ] El estado de reposo vale «no» cuando no se indica.
  - [ ] Se rechazan intervalos que no sean enteros o menores que 1.
  - [ ] Se rechazan plantas sin nombre, especie, ubicación o intervalo.
  - [ ] Las reglas de validación pueden probarse sin base de datos.
- **Dependencias:** T-01.
- **Estado:** pendiente.

#### T-03 · Endpoints de plantas

- **Historia:** HU-1.1
- **Tipo:** Endpoint/API
- **Descripción:** exponer el registro y la consulta de plantas en la capa HTTP, traduciendo las validaciones del dominio a respuestas claras para el cuidador.
- **Definition of Done:**
  - [ ] Se puede registrar una planta válida y la respuesta la devuelve con su identificador.
  - [ ] Se puede consultar la lista de plantas registradas.
  - [ ] Los datos inválidos producen una respuesta de error comprensible.
  - [ ] Las rutas quedan publicadas bajo `/api`.
- **Dependencias:** T-02.
- **Estado:** pendiente.

#### T-04 · Tests de planta

- **Historia:** HU-1.1
- **Tipo:** Test
- **Descripción:** cubrir con tests automáticos las validaciones del modelo y del dominio de planta, y el comportamiento de los endpoints de registro y consulta.
- **Definition of Done:**
  - [ ] Hay tests para el registro válido y para cada dato obligatorio faltante.
  - [ ] Hay tests para intervalo 0, negativo y con fracción.
  - [ ] Hay tests para el estado de reposo por defecto y la fecha de registro.
  - [ ] Los tests de endpoints usan dobles de los repositorios, sin base de datos.
  - [ ] `npm test` pasa.
- **Dependencias:** T-03.
- **Estado:** pendiente.

### HU-1.3 · Registrar un riego

#### T-05 · Modelo y dominio de Riego

- **Historia:** HU-1.3
- **Tipo:** Modelo/Dominio
- **Descripción:** representar un riego asociado a una planta, con fecha, cantidad y cuidador, y concentrar en funciones puras las reglas de validación.
- **Definition of Done:**
  - [ ] El modelo guarda la planta asociada, la fecha, la cantidad de agua y el cuidador.
  - [ ] La fecha vale «ahora» cuando no se indica.
  - [ ] Se rechazan fechas futuras y cantidades menores o iguales a 0.
  - [ ] Se rechaza un riego sin planta o sin cuidador.
  - [ ] Las reglas de validación pueden probarse sin base de datos.
- **Dependencias:** T-01, T-02.
- **Estado:** pendiente.

#### T-06 · Endpoints de riegos

- **Historia:** HU-1.3
- **Tipo:** Endpoint/API
- **Descripción:** exponer el registro de riegos y la consulta del historial de una planta, verificando que la planta exista.
- **Definition of Done:**
  - [ ] Se puede registrar un riego válido y la respuesta lo devuelve con su identificador.
  - [ ] Un riego para una planta inexistente se rechaza como no encontrado.
  - [ ] Se puede consultar el historial de riegos de una planta existente.
  - [ ] Los datos inválidos producen una respuesta de error comprensible.
- **Dependencias:** T-03, T-05.
- **Estado:** pendiente.

#### T-07 · Tests de riego

- **Historia:** HU-1.3
- **Tipo:** Test
- **Descripción:** cubrir con tests automáticos las validaciones del modelo y del dominio de riego, y el comportamiento de los endpoints de registro e historial.
- **Definition of Done:**
  - [ ] Hay tests para riego válido, fecha futura, fecha pasada, cantidad 0 y cantidad negativa.
  - [ ] Hay tests para planta inexistente y para historial de una planta existente.
  - [ ] Los tests de endpoints usan dobles de los repositorios, sin base de datos.
  - [ ] `npm test` pasa.
- **Dependencias:** T-06.
- **Estado:** pendiente.

## Orden de ejecución sugerido

1. T-01 · Configuración.
2. T-02 · Modelo y dominio de Planta.
3. T-03 · Endpoints de plantas.
4. T-04 · Tests de planta.
5. T-05 · Modelo y dominio de Riego.
6. T-06 · Endpoints de riegos.
7. T-07 · Tests de riego.

## Validación contra el alcance del PRD

- HU-1.1 cubre el punto 1 del alcance.
- HU-1.2 cubre la parte de consulta del punto 3.
- HU-1.3 cubre el punto 2 del alcance.
- HU-1.4 cubre el punto 4 del alcance.
- Ninguna historia se sale del MVP. No hay historias fuera de alcance.
