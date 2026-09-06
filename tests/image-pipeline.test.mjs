import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { collectAssets, inspectAssets, prepareImages } from "../scripts/image-pipeline.mjs";

const image = { image: "/scenes/1950/example.webp", imageWidth: 100, imageHeight: 50, projection: "equirectangular" };

async function fixture(t, manifest = { first: image }) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "padilla-images-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  for (const folder of ["src/data", "public/scenes/1950", "assets-originales", "scripts"]) await fs.mkdir(path.join(root, folder), { recursive: true });
  await fs.writeFile(path.join(root, "src/data/scene-assets.json"), JSON.stringify(manifest));
  return root;
}

test("shared images are checked once and contradictory projection metadata is rejected", () => {
  assert.equal(collectAssets({ first: image, last: image }).length, 1);
  assert.throws(() => collectAssets({ first: image, last: { ...image, projection: "rectilinear" } }), /contradictorios/);
  assert.throws(() => collectAssets({ first: { ...image, image: "/scenes/1950/../../private.webp" } }), /Ruta/);
});

test("a missing or incorrectly sized deployed asset fails the audit", async t => {
  const root = await fixture(t);
  assert.equal((await inspectAssets(root))[0].errors.length, 1);
  await sharp({ create: { width: 90, height: 50, channels: 3, background: "#aa8844" } }).webp().toFile(path.join(root, "public/scenes/1950/example.webp"));
  const errors = (await inspectAssets(root))[0].errors;
  assert.ok(errors.some(error => error.includes("dimensiones")));
  assert.ok(errors.some(error => error.includes("2:1")));
});

test("new active filenames are accepted without a second hard-coded list; originals keep their dimensions", async t => {
  const asset = { ...image, image: "/scenes/1950/new-classroom.webp", projection: "rectilinear" };
  const root = await fixture(t, { room: asset });
  await fs.writeFile(path.join(root, "scripts/image-map.json"), JSON.stringify({ "room.png": "new-classroom.webp" }));
  await sharp({ create: { width: 120, height: 80, channels: 3, background: "#aa8844" } }).png().toFile(path.join(root, "assets-originales/room.png"));
  const result = await prepareImages(root);
  assert.deepEqual(result.converted, ["new-classroom.webp"]);
  assert.deepEqual(result.errors, []);
  const manifest = JSON.parse(await fs.readFile(path.join(root, "src/data/scene-assets.json"), "utf8"));
  assert.equal(manifest.room.imageWidth, 120);
  assert.equal(manifest.room.imageHeight, 80);
  assert.deepEqual((await inspectAssets(root))[0].errors, []);
  assert.equal((await prepareImages(root)).skipped.length, 1);
});

test("preparation rejects a flat original for a full-sphere panorama and never stretches it", async t => {
  const root = await fixture(t);
  await fs.writeFile(path.join(root, "scripts/image-map.json"), JSON.stringify({ "flat.png": "example.webp" }));
  await sharp({ create: { width: 100, height: 80, channels: 3, background: "#aa8844" } }).png().toFile(path.join(root, "assets-originales/flat.png"));
  const result = await prepareImages(root);
  assert.equal(result.converted.length, 0);
  assert.equal(result.errors.length, 1);
  await assert.rejects(fs.stat(path.join(root, "public/scenes/1950/example.webp")));
});
