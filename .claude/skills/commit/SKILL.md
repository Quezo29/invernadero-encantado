---
name: commit
description: Crea un commit en formato Conventional Commits con los cambios que están en staging. Úsala cuando el usuario quiera guardar su trabajo en git.
disable-model-invocation: true
---
# Commit

1. Ejecuta `git diff --staged` y lee los cambios.
2. Si no hay nada en staging, avisa y detente. Nunca hagas `git add` por tu cuenta.
3. Si los cambios incluyen `.env` o algo que parezca una credencial, detente y avisa.
4. Escribe el mensaje en formato `tipo(ámbito): resumen`, en español y con máximo 72 caracteres.
   Tipos: feat, fix, docs, test, refactor, chore.
5. Muestra el mensaje y haz el commit. Nunca hagas push.
