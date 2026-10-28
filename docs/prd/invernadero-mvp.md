# Mini-PRD — Invernadero Encantado (MVP)

**Cliente:** Departamento de Parques de Pawnee
**Producto:** Invernadero Encantado
**Fecha:** 27 de octubre de 2026

## 1. Problema

Las plantas mágicas del invernadero se marchitan porque nadie recuerda cuándo se regó cada una. Hoy los cuidadores usan una libreta, pero no pueden consultar de forma rápida el estado de todas las plantas ni saber cuáles necesitan agua.

## 2. Usuarios

De 3 a 5 cuidadores voluntarios del invernadero. Todos tienen el mismo permiso y realizan las mismas tareas.

## 3. Objetivo y métrica de éxito

Que los cuidadores registren cada planta y cada riego, y puedan consultar en cualquier momento qué plantas necesitan agua.

**Métrica de éxito:** en un mes, cero plantas marchitas por olvido.

## 4. Alcance del MVP

1. Registrar plantas con sus datos básicos, su intervalo propio de riego y su estado de reposo.
2. Registrar cada riego con su fecha, cantidad de agua y cuidador.
3. Consultar las plantas registradas y saber cuáles necesitan agua.
4. Consultar el historial de riegos de una planta.

## 5. No-alcance

Notificaciones, fotos, usuarios y roles, clima, sensores IoT, interfaz web o app móvil.

## 6. Reglas de negocio

- Cada planta tiene su propio intervalo de riego en días.
- El intervalo es un número entero de días, mínimo 1.
- Una planta tiene sed si pasó más tiempo que su intervalo desde el último riego.
- Si una planta nunca se ha regado, el tiempo se cuenta desde su fecha de registro.
- Si hay varios riegos, para calcular la sed cuenta el más reciente.
- Una planta en reposo no debe regarse mientras dure ese estado.
- Un riego no puede tener fecha futura; sí puede tener fecha pasada, para registrar un riego olvidado.
- La cantidad de agua de un riego debe ser mayor que 0.
- No se puede registrar un riego de una planta que no existe.
- Al registrar una planta, nombre, especie, ubicación e intervalo de riego son obligatorios.
- Todos los cuidadores tienen el mismo permiso.

## 7. Supuestos

- [SUPUESTO] La cantidad de agua se expresa en mililitros.
- [SUPUESTO] El cuidador se identifica con su nombre.
- [SUPUESTO] Una planta puede tener el mismo nombre que otra; no se exige que sea único.
- [SUPUESTO] El MVP no permite editar ni eliminar plantas o riegos ya registrados.

## 8. Puntos abiertos

- ¿Qué debe pasar si se intenta registrar un riego de una planta en reposo: rechazarlo o solo advertir? Se refina en la épica de cuidado.
- ¿Cómo se marca que una planta salió del reposo? Se refina en la épica de cuidado.
- ¿Se necesitará editar o eliminar registros en una versión posterior?
