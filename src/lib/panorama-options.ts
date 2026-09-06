import type { PanoramaOptions } from "@photo-sphere-viewer/core";
import type { Scene } from "@/types/scene";

export function panoramaOptions(scene: Scene, reducedMotion = false): PanoramaOptions {
  if (scene.projection !== "equirectangular" || scene.imageWidth !== scene.imageHeight * 2) {
    throw new Error("La vista requiere un panorama esférico completo 2:1.");
  }
  return {
    caption: scene.title,
    showLoader: false,
    transition: reducedMotion ? false : { speed: 350, rotation: false, effect: "fade" },
    panoData: {
      fullWidth: scene.imageWidth,
      fullHeight: scene.imageHeight,
      croppedWidth: scene.imageWidth,
      croppedHeight: scene.imageHeight,
      croppedX: 0,
      croppedY: 0
    }
    // Do not pass position or zoom: setPanorama would stop the gyroscope.
  };
}
