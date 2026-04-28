import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = process.cwd();
const ORIGINALS_DIR = path.join(ROOT, "assets-originales");
const OUTPUT_DIR = path.join(ROOT, "public", "scenes", "1950");
const MAP_PATH = path.join(ROOT, "scripts", "image-map.json");
const WEBP_QUALITY = 88;
const RATIO_TARGET = 2;
const RATIO_TOLERANCE = 0.04;

const expectedOutputs = [
  "n01-llegada-calle-centro.webp",
  "n02-fachada-frontal.webp",
  "n03-escalinata-arco.webp",
  "n04-zaguan-acceso-interior.webp",
  "n05-corredor-principal.webp",
  "n06-aula-clases.webp",
  "n07-patio-escolar.webp",
  "n08-direccion-escolar.webp",
  "n09-vista-lateral-contexto.webp",
  "n10-salida-escuela.webp",
  "n11-salon-vacio.webp",
  "n12-ventana-aula-exterior.webp",
  "n13-alumnos-formados.webp",
  "n14-primer-cuadro-viejo-padilla.webp",
  "n15-nodo-memoria.webp"
];

async function ensureFolders() {
  await fs.mkdir(ORIGINALS_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(MAP_PATH), { recursive: true });
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readImageMap() {
  if (!(await pathExists(MAP_PATH))) {
    const starter = {
      "__instrucciones": "Mapea cada PNG original al nombre WebP final. El script ignora claves que empiezan con __."
    };
    await fs.writeFile(MAP_PATH, `${JSON.stringify(starter, null, 2)}\n`);
  }

  const raw = await fs.readFile(MAP_PATH, "utf8");
  const parsed = JSON.parse(raw);
  return Object.fromEntries(Object.entries(parsed).filter(([key]) => !key.startsWith("__")));
}

async function listPngs() {
  const files = await fs.readdir(ORIGINALS_DIR);
  return files.filter((file) => file.toLowerCase().endsWith(".png")).sort((a, b) => a.localeCompare(b, "es"));
}

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function ratioLabel(width, height) {
  if (!width || !height) return "sin datos";
  return (width / height).toFixed(3);
}

function isApproxTwoToOne(width, height) {
  if (!width || !height) return false;
  return Math.abs(width / height - RATIO_TARGET) <= RATIO_TOLERANCE;
}

function recommendation(file, index, imageMap) {
  const mapped = imageMap[file];
  if (mapped) return `mapeado: ${mapped}`;
  const byOrder = expectedOutputs[index];
  return byOrder ? `posible por orden: ${byOrder} (confirmar)` : "sin recomendacion";
}

async function auditImages() {
  await ensureFolders();
  const imageMap = await readImageMap();
  const pngs = await listPngs();

  if (pngs.length === 0) {
    console.log("No se encontraron PNG en /assets-originales/.");
    console.log("Coloca ahi las imagenes originales y edita /scripts/image-map.json antes de convertir.");
    return [];
  }

  const rows = [];
  for (const [index, file] of pngs.entries()) {
    const filePath = path.join(ORIGINALS_DIR, file);
    const [metadata, stats] = await Promise.all([sharp(filePath).metadata(), fs.stat(filePath)]);
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    rows.push({
      "nombre original": file,
      dimensiones: width && height ? `${width}x${height}` : "sin datos",
      proporcion: ratioLabel(width, height),
      "2:1 aprox": isApproxTwoToOne(width, height) ? "si" : "requiere revision",
      tamano: formatMb(stats.size),
      recomendacion: recommendation(file, index, imageMap)
    });
  }

  console.table(rows);
  return rows;
}

function validateTargetName(targetName) {
  if (!targetName || typeof targetName !== "string") return "destino vacio";
  if (!targetName.endsWith(".webp")) return "el destino debe terminar en .webp";
  if (path.basename(targetName) !== targetName) return "usa solo el nombre del archivo, no una ruta";
  if (!expectedOutputs.includes(targetName)) return "el destino no esta en la lista de nombres finales esperados";
  return null;
}

async function prepareImages() {
  await ensureFolders();
  const imageMap = await readImageMap();
  const pngs = await listPngs();
  const summary = { converted: [], skipped: [], errors: [] };

  if (pngs.length === 0) {
    console.log("No se encontraron PNG en /assets-originales/.");
    return summary;
  }

  for (const file of pngs) {
    const sourcePath = path.join(ORIGINALS_DIR, file);
    const targetName = imageMap[file];
    const validationError = validateTargetName(targetName);

    if (validationError) {
      summary.skipped.push(`${file}: ${validationError}`);
      continue;
    }

    const targetPath = path.join(OUTPUT_DIR, targetName);

    if (await pathExists(targetPath)) {
      summary.skipped.push(`${file}: omitido, ya existe ${targetName}`);
      console.warn(`Aviso: ${targetName} ya existe. No se sobrescribe.`);
      continue;
    }

    try {
      const metadata = await sharp(sourcePath).metadata();
      if (!isApproxTwoToOne(metadata.width, metadata.height)) {
        summary.skipped.push(`${file}: requiere revision de proporcion (${ratioLabel(metadata.width, metadata.height)})`);
        continue;
      }

      await sharp(sourcePath).webp({ quality: WEBP_QUALITY }).toFile(targetPath);
      summary.converted.push(`${file} -> ${targetName}`);
    } catch (error) {
      summary.errors.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log("\nResumen de preparacion");
  console.log(`Convertidas: ${summary.converted.length}`);
  summary.converted.forEach((item) => console.log(`  - ${item}`));
  console.log(`Omitidas: ${summary.skipped.length}`);
  summary.skipped.forEach((item) => console.log(`  - ${item}`));
  console.log(`Con error: ${summary.errors.length}`);
  summary.errors.forEach((item) => console.log(`  - ${item}`));

  return summary;
}

async function main() {
  const mode = process.argv[2] ?? "--audit";
  if (mode === "--audit") return auditImages();
  if (mode === "--prepare") return prepareImages();

  console.error(`Modo no reconocido: ${mode}`);
  console.error("Usa --audit o --prepare.");
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
