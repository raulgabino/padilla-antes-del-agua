import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ASSET_PATH = /^\/scenes\/1950\/[a-z0-9][a-z0-9.-]*\.webp$/i;

export function collectAssets(manifest) {
  const assets = new Map();
  for (const [id, asset] of Object.entries(manifest)) {
    if (!ASSET_PATH.test(asset.image ?? "")) throw new Error("Ruta de imagen no válida: " + id);
    if (!["rectilinear", "equirectangular"].includes(asset.projection)) throw new Error("Proyección no válida: " + id);
    if (![asset.imageWidth, asset.imageHeight].every(value => Number.isInteger(value) && value > 0)) throw new Error("Dimensiones no válidas: " + id);
    const previous = assets.get(asset.image);
    if (previous && (previous.projection !== asset.projection || previous.imageWidth !== asset.imageWidth || previous.imageHeight !== asset.imageHeight)) throw new Error("Metadatos contradictorios para " + asset.image);
    assets.set(asset.image, { ...asset, sceneIds: [...(previous?.sceneIds ?? []), id] });
  }
  return [...assets.values()];
}

export async function inspectAssets(root) {
  const manifest = JSON.parse(await fs.readFile(path.join(root, "src/data/scene-assets.json"), "utf8"));
  const rows = [];
  for (const asset of collectAssets(manifest)) {
    const file = path.join(root, "public", asset.image.slice(1));
    const row = { archivo: path.basename(asset.image), vistas: asset.sceneIds.join(", "), dimensiones: "", kb: 0, errors: [], notes: [] };
    try {
      const metadata = await sharp(file).metadata();
      row.dimensiones = metadata.width + "x" + metadata.height;
      row.kb = Math.round((await fs.stat(file)).size / 1024);
      if (metadata.format !== "webp") row.errors.push("El formato real no es WebP.");
      if (metadata.width !== asset.imageWidth || metadata.height !== asset.imageHeight) row.errors.push("Las dimensiones no coinciden con el manifiesto.");
      if (asset.projection === "equirectangular" && metadata.width !== metadata.height * 2) row.errors.push("El panorama completo debe tener proporción exacta 2:1.");
      if (asset.projection === "equirectangular" && metadata.width < 4096) row.notes.push("Resolución limitada para 360°; el visor restringe el acercamiento.");
      if (asset.projection === "rectilinear" && metadata.width < 2048) row.notes.push("Conservar el encuadre completo; buscar un original mayor para ampliar el detalle.");
    } catch (error) {
      row.errors.push("No se pudo leer la imagen: " + error.message);
    }
    rows.push(row);
  }
  return rows;
}

export async function prepareImages(root, { overwrite = false } = {}) {
  const manifestPath = path.join(root, "src/data/scene-assets.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const assets = collectAssets(manifest);
  const allowed = new Map(assets.map(asset => [path.basename(asset.image), asset]));
  const mapping = JSON.parse(await fs.readFile(path.join(root, "scripts/image-map.json"), "utf8"));
  const seen = new Set();
  const jobs = Object.entries(mapping).filter(([name]) => !name.startsWith("__")).map(([source, target]) => {
    if (path.basename(source) !== source || source.includes("\\") || !/\.(png|jpe?g|webp)$/i.test(source)) throw new Error("Nombre de origen no válido: " + source);
    if (typeof target !== "string" || !allowed.has(target)) throw new Error("El destino no pertenece al recorrido: " + target);
    if (seen.has(target)) throw new Error("Dos originales apuntan al mismo destino: " + target);
    seen.add(target);
    return { source, target, asset: allowed.get(target) };
  });
  const result = { converted: [], skipped: [], errors: [] };
  for (const job of jobs) {
    const input = path.join(root, "assets-originales", job.source);
    const output = path.join(root, "public", job.asset.image.slice(1));
    try {
      if (!overwrite && await fs.stat(output).then(() => true, () => false)) {
        result.skipped.push(job.target + ": ya existe (usar --overwrite para reemplazar).");
        continue;
      }
      const metadata = await sharp(input).metadata();
      const rotated = [5, 6, 7, 8].includes(metadata.orientation);
      const width = rotated ? metadata.height : metadata.width;
      const height = rotated ? metadata.width : metadata.height;
      if (job.asset.projection === "equirectangular" && width !== height * 2) throw new Error("El original no tiene proporción 2:1; no se recorta ni se estira automáticamente.");
      await fs.mkdir(path.dirname(output), { recursive: true });
      const temp = output + ".tmp";
      try {
        await sharp(input).rotate().webp({ quality: 92 }).toFile(temp);
        await fs.rename(temp, output);
      } finally {
        await fs.rm(temp, { force: true });
      }
      for (const id of job.asset.sceneIds) {
        manifest[id].imageWidth = width;
        manifest[id].imageHeight = height;
      }
      result.converted.push(job.target);
    } catch (error) {
      result.errors.push(job.source + ": " + error.message);
    }
  }
  if (result.converted.length) await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  return result;
}
