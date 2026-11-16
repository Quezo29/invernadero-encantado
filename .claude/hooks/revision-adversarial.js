// Hook Stop: revisión adversarial de la spec en curso y PR automático.
//
// Solo actúa cuando /siguiente-spec dejó .claude/estado/spec-en-curso.json,
// la rama tiene commits por delante de la base y no hay cambios sin commit.
// Si el revisor rechaza, devuelve los hallazgos al agente (máximo 2 intentos).
// Si aprueba, hace push, abre el PR con gh y le pide al agente actualizar Trello.

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const MAX_INTENTOS = 2;
const dir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const rutaEstado = path.join(dir, ".claude", "estado", "spec-en-curso.json");

// El revisor corre como otra sesión de Claude Code: sin esto, su propio Stop
// volvería a disparar este hook.
if (process.env.REVISION_ADVERSARIAL === "1") process.exit(0);
if (!fs.existsSync(rutaEstado)) process.exit(0);

const estado = JSON.parse(fs.readFileSync(rutaEstado, "utf8"));
if (estado.pr) process.exit(0); // PR ya abierto: falta solo actualizar Trello.

// En Windows, claude y gh son scripts .cmd: necesitan shell y argumentos entre comillas.
const enWindows = process.platform === "win32";
const citar = (a) =>
  enWindows && /[\s()&|<>^"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a;

function ejecutar(comando, args, opciones = {}) {
  const r = spawnSync(comando, args.map(citar), {
    cwd: dir,
    encoding: "utf8",
    shell: enWindows,
    maxBuffer: 20 * 1024 * 1024,
    ...opciones,
  });
  return {
    ok: r.status === 0,
    salida: (r.stdout || "").trim(),
    error: (r.stderr || r.error?.message || "").trim(),
  };
}
const git = (...args) => ejecutar("git", args);

function responder(objeto) {
  process.stdout.write(JSON.stringify(objeto));
  process.exit(0);
}
function guardarEstado() {
  fs.writeFileSync(rutaEstado, JSON.stringify(estado, null, 2) + "\n");
}

const base = estado.base || "main";
const rama = git("rev-parse", "--abbrev-ref", "HEAD").salida;
if (!rama || rama === base) process.exit(0);

// Cambios sin commit (fuera de la carpeta de estado): el agente sigue trabajando.
const pendientes = git("status", "--porcelain")
  .salida.split("\n")
  .filter((l) => l.trim() && !l.includes(".claude/estado/"));
if (pendientes.length > 0) process.exit(0);

const adelante = Number(
  git("rev-list", "--count", `${base}..HEAD`).salida || 0,
);
if (adelante === 0) process.exit(0);

const intentos = estado.intentos || 0;
if (intentos >= MAX_INTENTOS) {
  responder({
    systemMessage: `La revisión adversarial rechazó la spec ${MAX_INTENTOS} veces. Revisa los hallazgos tú: el PR no se abrió.`,
  });
}

// 1. Revisión adversarial con el subagente, en una sesión aparte y de solo lectura.
const rutaSpec = path.join(dir, estado.spec);
const spec = fs.existsSync(rutaSpec)
  ? fs.readFileSync(rutaSpec, "utf8")
  : "(no se encontró la spec)";
const diff = git("diff", `${base}...HEAD`).salida.slice(0, 60000);

const prompt = `Revisa la implementación de esta spec. Puedes leer el repositorio y ejecutar npm test.

## Spec (${estado.spec})
${spec}

## Diff de la rama ${rama} contra ${base}
${diff}

Responde SOLO con un objeto JSON, sin texto antes ni después:
{"aprobado": true|false, "resumen": "una o dos frases", "hallazgos": [{"severidad": "alta|media|baja", "archivo": "ruta", "descripcion": "qué falla", "sugerencia": "cómo corregirlo"}]}
"aprobado" es false si hay al menos un hallazgo de severidad alta.`;

const revision = ejecutar(
  "claude",
  [
    "-p",
    "--agent",
    "adversarial-reviewer",
    "--output-format",
    "json",
    "--allowedTools",
    "Read",
    "Grep",
    "Glob",
    "Bash(git diff:*)",
    "Bash(git log:*)",
    "Bash(git show:*)",
    "Bash(npm test:*)",
  ],
  {
    input: prompt, // el prompt va por stdin: es largo y tiene saltos de línea
    env: { ...process.env, REVISION_ADVERSARIAL: "1" },
    timeout: 8 * 60 * 1000,
  },
);

let veredicto;
try {
  const texto = JSON.parse(revision.salida).result ?? revision.salida;
  veredicto = JSON.parse(
    texto.slice(texto.indexOf("{"), texto.lastIndexOf("}") + 1),
  );
} catch {
  responder({
    systemMessage: `No se pudo completar la revisión adversarial (${revision.error.slice(0, 200) || "respuesta no válida"}). El PR no se abrió.`,
  });
}

const hallazgos = veredicto.hallazgos || [];
const lista = (hs) =>
  hs
    .map(
      (h) =>
        `- [${h.severidad}] ${h.archivo}: ${h.descripcion} → ${h.sugerencia}`,
    )
    .join("\n") || "- (ninguno)";

// 2a. Rechazada: el agente corrige y vuelve a terminar.
if (!veredicto.aprobado) {
  estado.intentos = intentos + 1;
  guardarEstado();
  responder({
    decision: "block",
    reason: `Revisión adversarial: RECHAZADA (intento ${estado.intentos} de ${MAX_INTENTOS}).
${veredicto.resumen || ""}

Hallazgos:
${lista(hallazgos)}

Corrige los hallazgos de severidad alta sin salirte de la spec ${estado.spec}, ejecuta npm test, haz commit y termina. Los de severidad media o baja anótalos en la sección "Pendientes" de la spec.`,
  });
}

// 2b. Aprobada: push y PR.
const push = git("push", "-u", "origin", "HEAD");
if (!push.ok) {
  responder({
    decision: "block",
    reason: `La revisión aprobó, pero git push falló:\n${push.error}\nExplícale el error al usuario y detente.`,
  });
}

const cuerpo = `## Spec
[${estado.spec}](${estado.spec}) · Tarjeta de Trello: ${estado.tarjeta || "(sin enlace)"}

## Revisión adversarial
**Aprobada.** ${veredicto.resumen || ""}

Hallazgos que no bloquean:
${lista(hallazgos)}

---
PR abierto automáticamente por el hook \`revision-adversarial\` después de la revisión.`;
const rutaCuerpo = path.join(dir, ".claude", "estado", "cuerpo-pr.md");
fs.writeFileSync(rutaCuerpo, cuerpo);

const pr = ejecutar("gh", [
  "pr",
  "create",
  "--base",
  base,
  "--head",
  rama,
  "--title",
  estado.titulo || rama,
  "--body-file",
  rutaCuerpo,
]);
if (!pr.ok) {
  responder({
    decision: "block",
    reason: `La revisión aprobó, pero gh pr create falló:\n${pr.error}\nExplícale el error al usuario y detente.`,
  });
}

const url =
  pr.salida
    .split("\n")
    .filter((l) => l.startsWith("http"))
    .pop() || pr.salida;
estado.pr = url;
guardarEstado();
responder({
  decision: "block",
  reason: `Revisión adversarial: APROBADA. PR abierto: ${url}
Ahora, sin hacer nada más: mueve la tarjeta "${estado.titulo}" a la lista "En revisión" de Trello, agrega en la tarjeta un comentario con el enlace del PR, borra la carpeta .claude/estado y responde solo con la URL del PR.`,
});
