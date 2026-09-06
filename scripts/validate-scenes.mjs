import fs from "node:fs";
import path from "node:path";
import Module from "node:module";
import ts from "typescript";

export function loadDataModule(file) {
  const absolute = path.resolve(file);
  const module = new Module(absolute);
  module.filename = absolute;
  module.paths = Module._nodeModulePaths(path.dirname(absolute));
  const compiled = ts.transpileModule(fs.readFileSync(absolute, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } });
  module._compile(compiled.outputText, absolute);
  return module.exports;
}

const { scenes, getSceneById } = loadDataModule("src/data/scenes.ts");
const { historicalSources } = loadDataModule("src/data/history.ts");
const manifest = JSON.parse(fs.readFileSync("src/data/scene-assets.json", "utf8"));
const ids = new Set(scenes.map(scene => scene.id));
const sourceIds = new Set(historicalSources.map(source => source.id));
const errors = [];
if (ids.size !== scenes.length) errors.push("Hay identificadores repetidos.");
if (scenes.length !== Object.keys(manifest).length) errors.push("Las escenas y el manifiesto no coinciden.");
for (const [index, scene] of scenes.entries()) {
  if (scene.projection !== "equirectangular") errors.push("El recorrido debe conservar el modo 360°: " + scene.id);
  if (scene.order !== index + 1) errors.push("Orden inconsistente: " + scene.id);
  if (!ids.has(scene.suggestedNext)) errors.push("Siguiente vista inexistente: " + scene.id);
  if (!scene.visualNote || !scene.sourceIds.length) errors.push("Falta el alcance o las fuentes: " + scene.id);
  if (scene.certainty === "documentado") errors.push("Una imagen generada no puede etiquetarse como documento: " + scene.id);
  for (const id of scene.sourceIds) if (!sourceIds.has(id)) errors.push("Fuente inexistente: " + id);
  for (const hotspot of scene.hotspots) if (!ids.has(hotspot.targetSceneId)) errors.push("Enlace roto: " + hotspot.id);
}
const visited = new Set();
let current = scenes[0];
while (current && !visited.has(current.id)) {
  visited.add(current.id);
  current = scenes.find(scene => scene.id === current.suggestedNext);
}
if (visited.size !== scenes.length || current?.id !== scenes[0].id) errors.push("El recorrido no cierra una secuencia completa.");
for (const alias of ["llegada", "escalinata-arco", "corredor", "patio", "primer-cuadro"]) if (!ids.has(getSceneById(alias).id)) errors.push("Enlace anterior sin destino: " + alias);
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(scenes.length + " vistas: referencias, secuencia y enlaces válidos.");
