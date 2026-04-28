"use client";

import { BookOpen, Home, Info, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import clsx from "clsx";
import type { Scene } from "@/types/scene";

type ScenePanelProps = {
  scene: Scene;
  currentIndex: number;
  total: number;
  hidden: boolean;
  onToggle: () => void;
  onHome: () => void;
  onNext: () => void;
  onHelp: () => void;
};

const certaintyLabel: Record<Scene["certainty"], string> = {
  documentado: "Documentado",
  inferido: "Inferido",
  interpretativo: "Interpretativo"
};

export function ScenePanel({
  scene,
  currentIndex,
  total,
  hidden,
  onToggle,
  onHome,
  onNext,
  onHelp
}: ScenePanelProps) {
  return (
    <aside
      className={clsx(
        "glass absolute left-4 top-4 z-20 hidden h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg transition-transform duration-300 md:flex",
        hidden && "-translate-x-[calc(100%+1rem)]"
      )}
    >
      <div className="flex items-center justify-between border-b border-paper/12 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-sepia">Padilla antes del agua</p>
          <p className="mt-1 text-sm text-paper/70">Nodo {currentIndex + 1} de {total}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md border border-paper/15 p-2 text-paper/78 transition hover:border-sepia/60 hover:text-paper"
          aria-label="Ocultar panel"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sepia/35 bg-sepia/12 px-3 py-1 text-xs font-medium text-sepia">
          {certaintyLabel[scene.certainty]}
          {scene.order > 13 ? " / Bonus" : ""}
        </div>
        <h1 className="text-3xl font-semibold leading-tight text-paper">{scene.title}</h1>
        <p className="mt-2 text-base leading-relaxed text-paper/76">{scene.subtitle}</p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-paper/82">
          <p>{scene.description}</p>
          <div className="rounded-md border border-paper/12 bg-paper/[0.055] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-sepia">
              <BookOpen size={15} />
              Nota histórica
            </div>
            <p>{scene.historicalNote}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-paper/12 p-4">
        <button
          type="button"
          onClick={onHome}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-paper/15 px-3 py-3 text-sm text-paper/82 transition hover:border-sepia/60 hover:text-paper"
        >
          <Home size={16} />
          Inicio
        </button>
        <button
          type="button"
          onClick={onHelp}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-paper/15 px-3 py-3 text-sm text-paper/82 transition hover:border-sepia/60 hover:text-paper"
        >
          <Info size={16} />
          Ayuda
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-sepia px-3 py-3 text-sm font-semibold text-night transition hover:bg-paper"
        >
          Siguiente
        </button>
      </div>
    </aside>
  );
}

export function FloatingPanelToggle({ hidden, onToggle }: { hidden: boolean; onToggle: () => void }) {
  if (!hidden) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="glass absolute left-4 top-4 z-30 hidden rounded-md p-3 text-paper transition hover:border-sepia/60 md:inline-flex"
      aria-label="Mostrar panel"
    >
      <PanelLeftOpen size={20} />
    </button>
  );
}
