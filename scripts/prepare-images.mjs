import { inspectAssets, prepareImages } from "./image-pipeline.mjs";

async function main() {
  const [mode = "--audit", ...flags] = process.argv.slice(2);
  const root = process.cwd();
  if (mode === "--audit" || mode === "--check") {
    const rows = await inspectAssets(root);
    console.table(rows.map(row => ({
      archivo: row.archivo, dimensiones: row.dimensiones, kb: row.kb,
      estado: row.errors.length ? "ERROR" : "OK", observaciones: [...row.errors, ...row.notes].join(" ")
    })));
    const errors = rows.flatMap(row => row.errors);
    console.log(rows.length + " imágenes activas únicas; " + errors.length + " errores.");
    if (errors.length) process.exitCode = 1;
    return;
  }
  if (mode === "--prepare") {
    const result = await prepareImages(root, { overwrite: flags.includes("--overwrite") });
    console.log(JSON.stringify(result, null, 2));
    if (result.errors.length) process.exitCode = 1;
    return;
  }
  throw new Error("Usa --audit, --check o --prepare [--overwrite].");
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
