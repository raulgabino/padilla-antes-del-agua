"use client";

import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, RefreshCw, Rotate3D } from "lucide-react";
import type { Viewer } from "@photo-sphere-viewer/core";
import type { MarkersPlugin as MarkersInstance } from "@photo-sphere-viewer/markers-plugin";
import type { Scene } from "@/types/scene";
import type { MotionControls } from "@/lib/motion";
import { panoramaOptions } from "@/lib/panorama-options";
import { FlatImageView } from "./FlatImageView";

export type GyroscopeControls = MotionControls;
type Runtime = { viewer: Viewer; markers: MarkersInstance; gyroscope: MotionControls; disposed: boolean };
type Props = {
  scene: Scene;
  panelOpen?: boolean;
  onNavigate: (sceneId: string) => void;
  onGyroscopeReady?: (controls: MotionControls | null) => void;
  onLoadingChange?: (loading: boolean) => void;
};

function supportsWebGL2() {
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch { return false; }
}
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
}

export function PanoramaViewer({ scene, panelOpen = false, onNavigate, onGyroscopeReady, onLoadingChange }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const currentScene = useRef(scene);
  const callbacks = useRef({ onNavigate, onGyroscopeReady, onLoadingChange });
  const [runtime, setRuntime] = useState<Runtime | null>(null);
  const [restart, setRestart] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"graphics" | "image" | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    currentScene.current = scene;
    callbacks.current = { onNavigate, onGyroscopeReady, onLoadingChange };
  }, [scene, onNavigate, onGyroscopeReady, onLoadingChange]);

  // One viewer and one sensor plugin per visit. Scene changes replace only
  // the texture so orientation control is not destroyed between panoramas.
  useEffect(() => {
    let cancelled = false;
    let failed = false;
    let active: Runtime | null = null;
    let instance: Viewer | null = null;
    let canvas: HTMLCanvasElement | null = null;
    const fail = () => {
      if (cancelled || failed) return;
      failed = true;
      if (active) active.disposed = true;
      if (instance) { try { instance.destroy(); } catch { /* The renderer may be partially initialized. */ } instance = null; }
      setError("graphics");
      setLoading(false);
      setRuntime(null);
      callbacks.current.onGyroscopeReady?.(null);
      callbacks.current.onLoadingChange?.(false);
    };
    const onContextLoss = (event: Event) => { event.preventDefault(); fail(); };
    setLoading(true);
    setError(null);
    setRuntime(null);
    callbacks.current.onLoadingChange?.(true);
    const timer = setTimeout(fail, 20000);
    async function boot() {
      try {
        if (!supportsWebGL2()) { clearTimeout(timer); fail(); return; }
        const [{ Viewer, EquirectangularAdapter }, { MarkersPlugin }, { GyroscopePlugin }] = await Promise.all([
          import("@photo-sphere-viewer/core"),
          import("@photo-sphere-viewer/markers-plugin"),
          import("@photo-sphere-viewer/gyroscope-plugin")
        ]);
        if (cancelled || failed || !container.current) return;
        instance = new Viewer({
          container: container.current,
          adapter: [EquirectangularAdapter, { useXmpData: false, resolution: 64 }],
          navbar: false,
          defaultYaw: currentScene.current.initialView.yaw,
          defaultPitch: currentScene.current.initialView.pitch,
          defaultZoomLvl: currentScene.current.initialView.zoom,
          minFov: 72,
          maxFov: 90,
          keyboard: "fullscreen",
          mousewheel: true,
          touchmoveTwoFingers: false,
          plugins: [[MarkersPlugin, { markers: [] }], [GyroscopePlugin, { touchmove: true, roll: false, moveMode: "smooth" }]]
        });
        canvas = container.current.querySelector("canvas");
        canvas?.addEventListener("webglcontextlost", onContextLoss);
        const markers = instance.getPlugin<MarkersInstance>(MarkersPlugin)!;
        const gyroscope = instance.getPlugin(GyroscopePlugin) as unknown as MotionControls;
        markers.addEventListener("select-marker", event => {
          if (cancelled) return;
          const hotspot = currentScene.current.hotspots.find(item => item.id === event.marker.id);
          if (hotspot) callbacks.current.onNavigate(hotspot.targetSceneId);
        });
        clearTimeout(timer);
        active = { viewer: instance, markers, gyroscope, disposed: false };
        setRuntime(active);
        callbacks.current.onGyroscopeReady?.(gyroscope);
      } catch { clearTimeout(timer); fail(); }
    }
    void boot();
    return () => {
      cancelled = true;
      if (active) active.disposed = true;
      clearTimeout(timer);
      canvas?.removeEventListener("webglcontextlost", onContextLoss);
      callbacks.current.onGyroscopeReady?.(null);
      if (instance) { try { instance.destroy(); } catch { /* A failed renderer can be partially initialized. */ } }
    };
  }, [restart]);

  useEffect(() => {
    if (!runtime || runtime.disposed) return;
    const session = runtime;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setShowFallback(false);
    callbacks.current.onLoadingChange?.(true);
    runtime.markers.clearMarkers();
    const fail = () => {
      if (cancelled || session.disposed) return;
      setError("image");
      setLoading(false);
      callbacks.current.onLoadingChange?.(false);
    };
    const timer = setTimeout(() => { fail(); cancelled = true; }, 20000);
    async function load() {
      try {
        const loaded = await session.viewer.setPanorama(scene.image, panoramaOptions(scene, window.matchMedia("(prefers-reduced-motion: reduce)").matches));
        if (cancelled || session.disposed || !loaded) return;
        clearTimeout(timer);
        // Keep the physical viewing direction when motion is active. Without
        // motion, begin at the intended front of the new scene.
        if (!session.gyroscope.isEnabled()) {
          session.viewer.rotate({ yaw: scene.initialView.yaw, pitch: scene.initialView.pitch });
          session.viewer.zoom(scene.initialView.zoom);
        }
        session.viewer.setOption("minFov", scene.imageWidth < 4096 ? 72 : 45);
        session.markers.setMarkers(scene.hotspots.map(hotspot => ({
          id: hotspot.id,
          position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
          html: '<button class="historical-hotspot ' + hotspot.type + '" aria-label="' + escapeHtml(hotspot.label) + '"></button>',
          tooltip: { content: escapeHtml(hotspot.label), position: "top center" },
          anchor: "center center"
        })));
        setLoading(false);
        callbacks.current.onLoadingChange?.(false);
      } catch { clearTimeout(timer); fail(); }
    }
    void load();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [scene, runtime]);

  const retry = () => { setShowFallback(false); setError(null); setRestart(value => value + 1); };
  return (
    <div className={"absolute inset-0 bg-night transition-[left] md:duration-300 " + (panelOpen ? "md:left-[412px]" : "")}>
      <div ref={container} className={"h-full w-full touch-none " + (showFallback || error ? "invisible" : "")} role="region" aria-label={"Vista 360°: " + scene.title} />
      {showFallback && <FlatImageView key={scene.id} scene={scene} />}
      {!showFallback && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-night/[0.7] to-transparent" />}
      <div className="absolute right-4 top-16 z-10">
        {showFallback ? <button type="button" className="viewer-button text-xs" onClick={retry}><Rotate3D size={16} />Volver a 360°</button> : !error && <span className="rounded-full border border-paper/[0.15] bg-night/[0.8] px-3 py-2 text-xs text-paper/[0.8]">Vista 360°</span>}
      </div>
      {loading && !error && <p role="status" className="pointer-events-none absolute inset-0 grid place-items-center text-sm">Abriendo la vista 360°…</p>}
      {error && !showFallback && <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <h2 className="text-xl font-semibold">{error === "graphics" ? "La vista 360° no está disponible en este navegador" : "No se pudo cargar esta vista 360°"}</h2>
        <p className="max-w-sm text-sm leading-relaxed text-paper/[0.75]">{error === "graphics" ? "En el iPhone, abre el recorrido en Safari para explorar con el dedo y el movimiento del teléfono." : "Comprueba tu conexión y vuelve a intentarlo. También puedes continuar a otra vista."}</p>
        <button type="button" className="viewer-button" onClick={retry}><RefreshCw size={17} />Reintentar 360°</button>
        <button type="button" className="viewer-button text-xs" onClick={() => { runtime?.gyroscope.stop(); setShowFallback(true); }}><ImageIcon size={15} />Consultar imagen de respaldo</button>
      </div>}
    </div>
  );
}
