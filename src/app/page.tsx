"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { BottomSceneNav } from "@/components/BottomSceneNav";
import { GyroscopeControl } from "@/components/GyroscopeControl";
import { IntroOverlay } from "@/components/IntroOverlay";
import { MobileSceneDrawer } from "@/components/MobileSceneDrawer";
import { GyroscopeControls, PanoramaViewer } from "@/components/PanoramaViewer";
import { FloatingPanelToggle, ScenePanel } from "@/components/ScenePanel";
import { SourcesDialog } from "@/components/SourcesDialog";
import { getSceneById, scenes } from "@/data/scenes";

function HelpDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => { if (element?.open) element.close(); };
  }, []);
  return <dialog ref={dialog} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="help-title" className="sources-dialog">
    <div className="rounded-xl border border-paper/[0.15] bg-night p-6">
      <div className="flex items-center justify-between"><h2 id="help-title" className="text-2xl font-semibold">Cómo explorar</h2><button type="button" className="viewer-button" onClick={onClose} aria-label="Cerrar ayuda"><X size={19} /></button></div>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-paper/[0.85]">
        <p>En las imágenes, usa + para acercarte y arrastra para recorrer el detalle. “Ver completa” recupera el encuadre. También puedes usar +, −, 0 y las flechas del teclado.</p>
        <p>En las vistas 360°, arrastra para mirar alrededor. “Ver imagen” permite consultar la ilustración completa. En un celular compatible puedes activar el movimiento del dispositivo.</p>
        <p>“Siguiente” sigue la secuencia del relato. Los puntos enlazan escenas; no indican un itinerario medido dentro del edificio.</p>
        <p>En el celular, toca el título inferior para leer la historia. En computadora, oculta el panel para ampliar el espacio de la imagen.</p>
        <p>La ambientación permanece hacia 1950. “Fuentes y contexto” reúne las referencias y explica el alcance de las recreaciones.</p>
      </div>
    </div>
  </dialog>;
}

export default function Home() {
  const [sceneId, setSceneId] = useState(scenes[0].id);
  const [panelHidden, setPanelHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [gyroscopeControls, setGyroscopeControls] = useState<GyroscopeControls | null>(null);
  const scene = getSceneById(sceneId);
  const currentIndex = scenes.findIndex(item => item.id === scene.id);

  useEffect(() => {
    function readLocation() {
      let id = "";
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { /* Ignore a malformed bookmark. */ }
      if (id) {
        setSceneId(getSceneById(id).id);
        setShowIntro(false);
      } else {
        setShowIntro(true);
      }
      setMobileOpen(false);
    }
    readLocation();
    window.addEventListener("popstate", readLocation);
    window.addEventListener("hashchange", readLocation);
    return () => { window.removeEventListener("popstate", readLocation); window.removeEventListener("hashchange", readLocation); };
  }, []);

  const goToScene = (id: string) => {
    const target = getSceneById(id);
    if (window.location.hash !== "#" + target.id) window.history.pushState(null, "", "#" + target.id);
    setSceneId(target.id);
    setMobileOpen(false);
    setShowIntro(false);
  };
  const goHome = () => {
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    setShowIntro(true);
    setMobileOpen(false);
  };
  const goNext = () => goToScene(scene.suggestedNext ?? scenes[0].id);
  const shared = { scene, currentIndex, total: scenes.length, onHome: goHome, onNext: goNext, onHelp: () => setHelpOpen(true), onSources: () => setSourcesOpen(true) };

  return <main className="relative h-[100dvh] w-screen overflow-hidden bg-night text-paper">
    {showIntro ? <IntroOverlay onEnter={() => goToScene(scenes[0].id)} onSources={() => setSourcesOpen(true)} /> : <>
      <PanoramaViewer scene={scene} panelOpen={!panelHidden} onNavigate={goToScene} onGyroscopeReady={setGyroscopeControls} />
      {gyroscopeControls && <GyroscopeControl controls={gyroscopeControls} />}
      <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex items-start justify-between md:left-auto">
        <div className="md:hidden"><p className="text-[10px] uppercase tracking-[0.18em] text-sepia">Padilla antes del agua</p><p className="mt-1 text-xs text-paper/[0.75]">Hacia 1950</p></div>
        <p className="rounded-full border border-paper/[0.15] bg-night/[0.8] px-3 py-2 text-xs">Vista {currentIndex + 1} de {scenes.length}</p>
      </div>
      <ScenePanel {...shared} hidden={panelHidden} onToggle={() => setPanelHidden(true)} />
      <FloatingPanelToggle hidden={panelHidden} onToggle={() => setPanelHidden(false)} />
      <BottomSceneNav scenes={scenes} currentSceneId={scene.id} onSelect={goToScene} />
      <MobileSceneDrawer {...shared} scenes={scenes} open={mobileOpen} onToggle={() => setMobileOpen(value => !value)} onSelect={goToScene} />
    </>}
    {helpOpen && <HelpDialog onClose={() => setHelpOpen(false)} />}
    {sourcesOpen && <SourcesDialog scene={showIntro ? scenes[0] : scene} onClose={() => setSourcesOpen(false)} />}
  </main>;
}
