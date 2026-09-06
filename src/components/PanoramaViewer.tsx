"use client";

import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Rotate3D } from "lucide-react";
import type { Viewer } from "@photo-sphere-viewer/core";
import type { MarkersPlugin as MarkersInstance } from "@photo-sphere-viewer/markers-plugin";
import type { Scene } from "@/types/scene";
import { FlatImageView } from "./FlatImageView";

export type GyroscopeControls = {
  isSupported: () => Promise<boolean>;
  isEnabled: () => boolean;
  start: () => Promise<void>;
  stop: () => void;
  addEventListener?: (event: "gyroscope-updated", callback: (event: { gyroscopeEnabled: boolean }) => void) => void;
  removeEventListener?: (event: "gyroscope-updated", callback: (event: { gyroscopeEnabled: boolean }) => void) => void;
};

type Props = {
  scene: Scene;
  panelOpen?: boolean;
  onNavigate: (sceneId: string) => void;
  onGyroscopeReady?: (controls: GyroscopeControls | null) => void;
};

function supportsWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
}

export function PanoramaViewer({ scene, panelOpen = false, onNavigate, onGyroscopeReady }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onNavigate, onGyroscopeReady });
  const [manualFlat, setManualFlat] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const flat = scene.projection === "rectilinear" || manualFlat || fallback;

  useEffect(() => { callbacks.current = { onNavigate, onGyroscopeReady }; }, [onNavigate, onGyroscopeReady]);

  useEffect(() => {
    callbacks.current.onGyroscopeReady?.(null);
    if (flat) { setLoading(false); return; }
    let cancelled = false;
    let failed = false;
    let viewer: Viewer | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const dispose = () => {
      if (timer) clearTimeout(timer);
      canvas?.removeEventListener("webglcontextlost", handleContextLoss);
      const current = viewer;
      viewer = null;
      if (current) {
        try { current.destroy(); } catch { /* The failed renderer may be partially initialized. */ }
      }
    };
    const showImage = () => {
      if (cancelled || failed) return;
      failed = true;
      dispose();
      callbacks.current.onGyroscopeReady?.(null);
      setLoading(false);
      setFallback(true);
    };
    function handleContextLoss(event: Event) { event.preventDefault(); showImage(); }

    async function boot() {
      setLoading(true);
      if (!supportsWebGL2()) { showImage(); return; }
      timer = setTimeout(showImage, 15000);
      try {
        const [{ Viewer }, { MarkersPlugin }, { GyroscopePlugin }] = await Promise.all([
          import("@photo-sphere-viewer/core"),
          import("@photo-sphere-viewer/markers-plugin"),
          import("@photo-sphere-viewer/gyroscope-plugin")
        ]);
        if (cancelled || failed || !container.current) return;
        const instance = new Viewer({
          container: container.current,
          navbar: false,
          caption: scene.title,
          defaultYaw: scene.initialView.yaw,
          defaultPitch: scene.initialView.pitch,
          defaultZoomLvl: scene.initialView.zoom,
          minFov: scene.imageWidth < 4096 ? 72 : 45,
          maxFov: 90,
          keyboard: "fullscreen",
          mousewheel: true,
          touchmoveTwoFingers: false,
          plugins: [[MarkersPlugin, { markers: [] }], [GyroscopePlugin, { touchmove: true, roll: false, moveMode: "smooth" }]]
        });
        viewer = instance;
        canvas = container.current.querySelector("canvas");
        canvas?.addEventListener("webglcontextlost", handleContextLoss);
        const loaded = await instance.setPanorama(scene.image, { showLoader: false, transition: false });
        if (cancelled || viewer !== instance || !loaded) return;
        clearTimeout(timer);
        const markers = instance.getPlugin<MarkersInstance>(MarkersPlugin)!;
        markers.setMarkers(scene.hotspots.map(hotspot => ({
          id: hotspot.id,
          position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
          html: '<button class="historical-hotspot ' + hotspot.type + '" aria-label="' + escapeHtml(hotspot.label) + '"></button>',
          tooltip: { content: escapeHtml(hotspot.label), position: "top center" },
          anchor: "center center"
        })));
        markers.addEventListener("select-marker", event => {
          if (cancelled) return;
          const hotspot = scene.hotspots.find(item => item.id === event.marker.id);
          if (hotspot) callbacks.current.onNavigate(hotspot.targetSceneId);
        });
        callbacks.current.onGyroscopeReady?.(instance.getPlugin(GyroscopePlugin) as unknown as GyroscopeControls);
        setLoading(false);
      } catch {
        showImage();
      }
    }
    void boot();
    return () => {
      cancelled = true;
      dispose();
      callbacks.current.onGyroscopeReady?.(null);
    };
  }, [scene, flat]);

  return (
    <div className={"absolute inset-0 bg-night transition-[left] md:duration-300 " + (panelOpen ? "md:left-[412px]" : "")}>
      {flat ? <FlatImageView key={scene.id} scene={scene} /> : <div ref={container} className="h-full w-full touch-none" aria-label={"Panorama: " + scene.title} />}
      {!flat && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-night/[0.7] to-transparent" />}
      <div className="absolute right-4 top-16 z-10 flex items-center gap-2 md:top-16">
        {scene.projection === "equirectangular" && !fallback && (
          <button type="button" className="viewer-button text-xs" onClick={() => setManualFlat(value => !value)}>
            {flat ? <Rotate3D size={15} /> : <ImageIcon size={15} />}
            {flat ? "Explorar 360°" : "Ver imagen"}
          </button>
        )}
        {fallback && scene.projection === "equirectangular" && <span className="rounded-full bg-night/[0.8] px-3 py-2 text-xs text-paper/[0.75]">Vista de imagen</span>}
      </div>
      {loading && !flat && <p role="status" className="pointer-events-none absolute inset-0 grid place-items-center text-sm">Abriendo el panorama…</p>}
    </div>
  );
}
