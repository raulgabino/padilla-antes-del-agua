import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Viewer } from '@photo-sphere-viewer/core';
import { loadTs } from './load-ts.mjs';
const { panoramaOptions } = loadTs('src/lib/panorama-options.ts');
const assets = JSON.parse(fs.readFileSync('src/data/scene-assets.json', 'utf8'));

// Execute the installed library's actual setPanorama method while replacing
// only browser/GPU services. A position/zoom regression triggers stopAll here.
test('Photo Sphere Viewer keeps motion active across the three new panoramas', async () => {
  let motionEnabled = true;
  const textures = [];
  const viewer = {
    state: { ready: true }, config: { lang: { loading: 'Loading', loadError: 'Error' } },
    textureLoader: { abortLoading() {} },
    dataHelper: {
      getTransitionOptions: options => options.transition,
      // These textures have explicit uncropped dimensions and no XMP camera
      // metadata; normalization does not supply a position or zoom.
      cleanPanoramaOptions: options => options
    },
    adapter: { loadTexture: async (image, _, data) => ({ panorama: image, panoData: { ...data, isEquirectangular: true } }) },
    navbar: { setCaption() {} }, loader: { show() {}, hide() {} },
    renderer: { show() {}, setTexture: texture => textures.push(texture.panorama), setPanoramaPose() {}, setSphereCorrection() {} },
    hideError() {}, resetIdleTimer() {}, dispatchEvent() {},
    stopAll: () => { motionEnabled = false; }
  };
  for (const id of ['plaza-vista-escuela', 'fachada', 'aula']) {
    const scene = { ...assets[id], title: id };
    assert.equal(await Viewer.prototype.setPanorama.call(viewer, scene.image, panoramaOptions(scene, true)), true);
    assert.equal(motionEnabled, true, id + ' stopped motion');
  }
  assert.equal(textures.length, 3);
  assert.equal(new Set(textures).size, 3);
});

test('flat images and incomplete sphere dimensions cannot enter the 360 route', () => {
  assert.throws(() => panoramaOptions({ projection: 'rectilinear', imageWidth: 1774, imageHeight: 887 }), /panorama/);
  assert.throws(() => panoramaOptions({ projection: 'equirectangular', imageWidth: 1774, imageHeight: 1000 }), /panorama/);
  for (const [id, asset] of Object.entries(assets)) {
    assert.equal(asset.projection, 'equirectangular', id);
    assert.equal(asset.imageWidth, 2 * asset.imageHeight, id);
  }
});
