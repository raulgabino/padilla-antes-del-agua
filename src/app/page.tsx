"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { BottomSceneNav } from "@/components/BottomSceneNav";
import { GyroscopeControl } from "@/components/GyroscopeControl";
import { IntroOverlay } from "@/components/IntroOverlay";
import { MobileSceneDrawer } from "@/components/MobileSceneDrawer";
import { GyroscopeControls, PanoramaViewer } from "@/components/PanoramaViewer";
import { FloatingPanelToggle, ScenePanel } from "@/components/ScenePanel";
import { getSceneById, scenes } from "@/data/scenes";

export default function Home() {
  const [sceneId, setSceneId] = useState(scenes[0].id);
  const [panelHidden, setPanelHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [gyroscopeControls, setGyroscopeControls] = useState<GyroscopeControls | null>(null);
  const scene = getSceneById(sceneId);
  const currentIndex = useMemo(() => scenes.findIndex((item) => item.id === scene.id), [scene.id]);

  const goToScene = (targetSceneId: string) => {
    setSceneId(targetSceneId);
    setMobileOpen(false);
  };

  const goNext = () => {
    const target = scene.suggestedNext ?? scenes[(currentIndex + 1) % scenes.length].id;
    goToScene(target);
  };

  const enterTour = () => {
    setSceneId(scenes[0].id);
    setMobileOpen(false);
    setPanelHidden(false);
    setShowIntro(false);
  };

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-night text-paper">
      {showIntro ? (
        <IntroOverlay onEnter={enterTour} />
      ) : (
        <>
          <PanoramaViewer scene={scene} onNavigate={goToScene} onGyroscopeReady={setGyroscopeControls} />
          <GyroscopeControl controls={gyroscopeControls} />

          <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex items-start justify-between md:left-auto">
            <div className="md:hidden">
              <p className="text-xs uppercase tracking-[0.22em] text-sepia drop-shadow">Padilla antes del agua</p>
              <p className="mt-1 text-sm text-paper/80 drop-shadow">1950</p>
            </div>
            <div className="ml-auto rounded-full border border-paper/15 bg-night/58 px-3 py-2 text-xs text-paper/76 backdrop-blur-md">
              Nodo {currentIndex + 1} de {scenes.length}
            </div>
          </div>

          <ScenePanel
            scene={scene}
            currentIndex={currentIndex}
            total={scenes.length}
            hidden={panelHidden}
            onToggle={() => setPanelHidden(true)}
            onHome={() => goToScene(scenes[0].id)}
            onNext={goNext}
            onHelp={() => setHelpOpen(true)}
          />
          <FloatingPanelToggle hidden={panelHidden} onToggle={() => setPanelHidden(false)} />
          <BottomSceneNav scenes={scenes} currentSceneId={scene.id} onSelect={goToScene} />
          <MobileSceneDrawer
            scene={scene}
            scenes={scenes}
            currentIndex={currentIndex}
            total={scenes.length}
            open={mobileOpen}
            onToggle={() => setMobileOpen((value) => !value)}
            onSelect={goToScene}
            onHome={() => goToScene(scenes[0].id)}
            onNext={goNext}
            onHelp={() => setHelpOpen(true)}
          />
        </>
      )}

      {helpOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/58 p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sepia">Cómo explorar</p>
                <h2 className="mt-2 text-2xl font-semibold text-paper">Recorrido 1950</h2>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="rounded-md border border-paper/15 p-2 text-paper/76 transition hover:border-sepia/60 hover:text-paper"
                aria-label="Cerrar ayuda"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-paper/78">
              <p>Arrastra el panorama para mirar alrededor. Toca los puntos dentro de la imagen para avanzar, volver o abrir nodos relacionados.</p>
              <p>Usa “Siguiente punto” para seguir el recorrido sugerido, o elige un nodo desde la lista inferior. En celular, abre el panel inferior para leer la información sin perder el panorama.</p>
              <p>Todo el recorrido ocurre en 1950: no hay modo actual ni comparación contemporánea.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
