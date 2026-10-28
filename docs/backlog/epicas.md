# Épicas del MVP — Invernadero Encantado

Fuente: `docs/prd/invernadero-mvp.md`.

## E1 · Plantas y riegos

**Objetivo:** que los cuidadores registren y consulten las plantas del invernadero y sus riegos.

**Alcance del PRD que cubre:**

- Punto 1: registrar plantas con sus datos básicos, intervalo propio y estado de reposo.
- Punto 2: registrar cada riego con fecha, cantidad de agua y cuidador.
- Punto 4: consultar el historial de riegos de una planta.

**Reglas de negocio que le aplican:**

- El intervalo de riego es un número entero de días, mínimo 1.
- Al registrar una planta, nombre, especie, ubicación e intervalo son obligatorios.
- Un riego no puede tener fecha futura; sí puede tener fecha pasada.
- La cantidad de agua de un riego debe ser mayor que 0.
- No se puede registrar un riego de una planta que no existe.
- Todos los cuidadores tienen el mismo permiso.

## E2 · Cuidado

**Objetivo:** que los cuidadores sepan qué plantas necesitan agua y cómo tratar las plantas en reposo.

**Alcance del PRD que cubre:**

- Punto 3: consultar las plantas registradas y saber cuáles necesitan agua.
- Parte del punto 1: mantener el estado de reposo de cada planta.

**Reglas de negocio que le aplican:**

- Una planta tiene sed si pasó más tiempo que su intervalo desde el último riego.
- Si una planta nunca se ha regado, el tiempo se cuenta desde su fecha de registro.
- Si hay varios riegos, para calcular la sed cuenta el más reciente.
- Una planta en reposo no debe regarse mientras dure ese estado.

## Cobertura del alcance

| Punto del alcance | Épica |
| --- | --- |
| 1. Registrar plantas | E1 y E2 |
| 2. Registrar riegos | E1 |
| 3. Consultar plantas y saber cuáles necesitan agua | E2 (listado base en E1) |
| 4. Consultar historial de riegos | E1 |

Ningún punto del alcance quedó fuera de ambas épicas. No se incluyó ningún elemento del no-alcance.
