// Claude Code envía por stdin un JSON con la herramienta usada y sus parámetros.
const fs = require("node:fs");
const prettier = require("prettier");

let entrada = "";
process.stdin.on("data", (trozo) => (entrada += trozo));
process.stdin.on("end", async () => {
  try {
    const archivo = JSON.parse(entrada).tool_input?.file_path;
    if (!archivo || !/\.(js|json)$/.test(archivo)) return;
    const codigo = fs.readFileSync(archivo, "utf8");
    const opciones = (await prettier.resolveConfig(archivo)) ?? {};
    const formateado = await prettier.format(codigo, { ...opciones, filepath: archivo });
    if (formateado !== codigo) fs.writeFileSync(archivo, formateado);
  } catch {
    // Si algo falla, no bloqueamos el trabajo del agente.
  }
});
