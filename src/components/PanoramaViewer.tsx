"use client";

import { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import type { Scene } from "@/types/scene";
import { hotspotTooltip } from "./SceneHotspot";

type PanoramaViewerProps = {
  scene: Scene;
  onNavigate: (sceneId: string) => void;
  onGyroscopeReady?: (controls: GyroscopeControls | null) => void;
};

type MarkersInstance = {
  setMarkers: (markers: unknown[]) => void;
  addEventListener: (event: string, callback: (event: { marker: { id: string } }) => void) => void;
};

type ViewerWithLoader = Viewer & {
  loader?: {
    hide: () => void;
  };
};

export type GyroscopeControls = {
  isSupported: () => Promise<boolean>;
  isEnabled: () => boolean;
  start: () => Promise<void>;
  stop: () => void;
  addEventListener?: (event: "gyroscope-updated", callback: (event: { gyroscopeEnabled: boolean }) => void) => void;
  removeEventListener?: (event: "gyroscope-updated", callback: (event: { gyroscopeEnabled: boolean }) => void) => void;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function placeholderPanorama(scene: Scene) {
  const subtitle = scene.order > 10 ? "Nodo bonus / futuro" : "Recorrido base";
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d");

  if (!context) {
    return Promise.resolve("");
  }

  const sky = context.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#4c5b5c");
  sky.addColorStop(0.48, "#b89a72");
  sky.addColorStop(1, "#3b3027");
  context.fillStyle = sky;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const ground = context.createLinearGradient(0, 0, canvas.width, 0);
  ground.addColorStop(0, "#6e5035");
  ground.addColorStop(0.45, "#a98255");
  ground.addColorStop(1, "#4e3a2b");
  context.fillStyle = ground;
  context.fillRect(0, 548, canvas.width, 476);

  context.fillStyle = "rgba(216, 195, 155, 0.34)";
  context.beginPath();
  context.moveTo(0, 548);
  context.bezierCurveTo(330, 500, 620, 530, 920, 495);
  context.bezierCurveTo(1260, 455, 1530, 535, 2048, 480);
  context.lineTo(2048, 580);
  context.bezierCurveTo(1500, 620, 1200, 585, 950, 610);
  context.bezierCurveTo(620, 640, 320, 600, 0, 650);
  context.closePath();
  context.fill();

  context.fillStyle = "rgba(215, 195, 160, 0.94)";
  context.beginPath();
  context.moveTo(720, 292);
  context.lineTo(1328, 292);
  context.lineTo(1408, 542);
  context.lineTo(640, 542);
  context.closePath();
  context.fill();

  context.fillStyle = "#7b5d3e";
  context.beginPath();
  context.moveTo(690, 270);
  context.lineTo(1360, 270);
  context.lineTo(1328, 305);
  context.lineTo(720, 305);
  context.closePath();
  context.fill();

  context.fillStyle = "#3a2d23";
  context.fillRect(866, 382, 156, 160);
  context.fillStyle = "rgba(95, 121, 111, 0.82)";
  context.fillRect(1054, 370, 138, 92);
  context.fillStyle = "rgba(95, 121, 111, 0.78)";
  context.fillRect(710, 372, 124, 90);

  context.fillStyle = "rgba(26, 23, 18, 0.2)";
  context.beginPath();
  context.arc(1870, 760, 180, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "rgba(243, 223, 182, 0.18)";
  context.beginPath();
  context.arc(170, 245, 110, 0, Math.PI * 2);
  context.fill();

  context.textAlign = "center";
  context.fillStyle = "#fff3dd";
  context.font = "700 64px Arial, sans-serif";
  context.fillText(scene.title, 1024, 420);
  context.fillStyle = "#f1e4cf";
  context.font = "28px Arial, sans-serif";
  context.fillText(subtitle, 1024, 470);
  context.fillStyle = "#fff3dd";
  context.font = "30px Arial, sans-serif";
  context.fillText("Placeholder panoramico 360", 1024, 760);
  context.fillStyle = "#f1e4cf";
  context.font = "22px Arial, sans-serif";
  context.fillText(scene.image, 1024, 800);
  context.fillStyle = "#d4b177";
  context.font = "18px Arial, sans-serif";
  context.fillText("Reemplaza este asset por una imagen WebP 2:1 en /public/scenes/1950/", 1024, 836);

  return new Promise<string>((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob ? URL.createObjectURL(blob) : "");
      },
      "image/jpeg",
      0.9
    );
  });
}

function resolvePanorama(scene: Scene) {
  return new Promise<string>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(scene.image);
    image.onerror = async () => resolve(await placeholderPanorama(scene));
    image.src = scene.image;
  });
}

function buildMarkers(scene: Scene) {
  return scene.hotspots.map((hotspot) => ({
    id: hotspot.id,
    position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
    html: `<button class="historical-hotspot ${hotspot.type}" aria-label="${escapeXml(hotspot.label)}"></button>`,
    anchor: "center center",
    tooltip: {
      content: hotspotTooltip(hotspot),
      position: "top center"
    },
    data: { targetSceneId: hotspot.targetSceneId }
  }));
}

export function PanoramaViewer({ scene, onNavigate, onGyroscopeReady }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const markersRef = useRef<MarkersInstance | null>(null);
  const gyroscopeRef = useRef<GyroscopeControls | null>(null);
  const targetByMarkerIdRef = useRef(new Map<string, string>());
  const onNavigateRef = useRef(onNavigate);
  const onGyroscopeReadyRef = useRef(onGyroscopeReady);
  const initialSceneRef = useRef(scene);
  const loadedSceneIdRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

  useEffect(() => {
    onGyroscopeReadyRef.current = onGyroscopeReady;
  }, [onGyroscopeReady]);

  useEffect(() => {
    targetByMarkerIdRef.current = new Map(scene.hotspots.map((hotspot) => [hotspot.id, hotspot.targetSceneId]));
  }, [scene]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!containerRef.current || viewerRef.current) return;

      const initialScene = initialSceneRef.current;
      const panorama = await resolvePanorama(initialScene);
      if (cancelled || !containerRef.current) return;

      setIsFallback(panorama.startsWith("data:") || panorama.startsWith("blob:"));
      const viewer = new Viewer({
        container: containerRef.current,
        panorama,
        caption: initialScene.title,
        navbar: false,
        defaultZoomLvl: 34,
        minFov: 42,
        maxFov: 86,
        mousewheel: true,
        mousemove: true,
        touchmoveTwoFingers: false,
        keyboard: "always",
        moveSpeed: 1.1,
        zoomSpeed: 1,
        plugins: [
          [MarkersPlugin, { markers: [] }],
          [GyroscopePlugin, { touchmove: true, roll: false, moveMode: "smooth" }]
        ]
      });

      const markers = viewer.getPlugin(MarkersPlugin) as unknown as MarkersInstance;
      const gyroscope = viewer.getPlugin(GyroscopePlugin) as unknown as GyroscopeControls;
      let finished = false;
      const finishInitialLoad = () => {
        if (finished || cancelled) return;
        finished = true;
        loadedSceneIdRef.current = initialScene.id;
        markers.setMarkers(buildMarkers(initialScene));
        (viewer as ViewerWithLoader).loader?.hide();
        setLoading(false);
      };

      viewer.addEventListener("ready", finishInitialLoad);
      viewer.addEventListener("panorama-loaded", finishInitialLoad);
      viewer.addEventListener("panorama-error", finishInitialLoad);
      markers.addEventListener("select-marker", (event) => {
        const target = targetByMarkerIdRef.current.get(event.marker.id);
        if (target) onNavigateRef.current(target);
      });

      viewerRef.current = viewer;
      markersRef.current = markers;
      gyroscopeRef.current = gyroscope;
      onGyroscopeReadyRef.current?.(gyroscope);
      window.setTimeout(finishInitialLoad, 2500);
    }

    boot();

    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
      markersRef.current = null;
      gyroscopeRef.current = null;
      onGyroscopeReadyRef.current?.(null);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function updateScene() {
      if (!viewerRef.current) return;

      if (scene.id === loadedSceneIdRef.current) {
        markersRef.current?.setMarkers(buildMarkers(scene));
        viewerRef.current?.autoSize();
        viewerRef.current?.needsUpdate();
        (viewerRef.current as ViewerWithLoader | null)?.loader?.hide();
        setLoading(false);
        return;
      }

      setLoading(true);
      const panorama = await resolvePanorama(scene);
      if (cancelled) return;

      setIsFallback(panorama.startsWith("data:") || panorama.startsWith("blob:"));
      const viewer = viewerRef.current;
      if (viewer) {
        const gyroscopeEnabled = gyroscopeRef.current?.isEnabled() ?? false;
        const finishUpdateLoad = () => {
          if (cancelled) return;
          loadedSceneIdRef.current = scene.id;
          (viewer as ViewerWithLoader).loader?.hide();
          setLoading(false);
        };

        window.setTimeout(finishUpdateLoad, 3000);

        try {
          await viewer.setPanorama(panorama, {
            transition: { speed: 700, effect: "fade" },
            showLoader: false
          });
          if (!gyroscopeEnabled) {
            viewer.animate({ yaw: 0, pitch: -0.03, zoom: 34, speed: "4rpm" });
          }
        } finally {
          finishUpdateLoad();
        }
      }

      markersRef.current?.setMarkers(buildMarkers(scene));
      if (!viewer) {
        loadedSceneIdRef.current = scene.id;
        setLoading(false);
      }
    }

    updateScene();

    return () => {
      cancelled = true;
    };
  }, [scene]);

  useEffect(() => {
    const markers = markersRef.current;
    if (!markers) return;

    markers.setMarkers(buildMarkers(scene));
  }, [scene]);

  return (
    <div className="absolute inset-0 bg-night">
      <div ref={containerRef} className="h-full w-full touch-none" aria-label={`Panorama: ${scene.title}`} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(17,16,13,0.42)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/65 to-transparent" />
      {(loading || isFallback) && (
        <div className="pointer-events-none absolute right-4 top-20 rounded-md border border-paper/15 bg-night/70 px-3 py-2 text-xs text-paper/78 backdrop-blur-md md:top-4">
          {loading ? "Cargando panorama..." : "Placeholder activo"}
        </div>
      )}
    </div>
  );
}
