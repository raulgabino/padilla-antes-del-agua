"use client";

import { ChevronDown, ChevronUp, Home, Info, List } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import type { Scene } from "@/types/scene";

type MobileSceneDrawerProps = {
  scene: Scene;
  scenes: Scene[];
  currentIndex: number;
  total: number;
  open: boolean;
  onToggle: () => void;
  onSelect: (sceneId: string) => void;
  onHome: () => void;
  onNext: () => void;
  onHelp: () => void;
};

export function MobileSceneDrawer({
  scene,
  scenes,
  currentIndex,
  total,
  open,
  onToggle,
  onSelect,
  onHome,
  onNext,
  onHelp
}: MobileSceneDrawerProps) {
  const [showNodes, setShowNodes] = useState(false);

  return (
    <section
      className={clsx(
        "drawer-shadow fixed inset-x-0 bottom-0 z-30 rounded-t-xl border border-paper/14 bg-night/88 backdrop-blur-xl transition-transform duration-300 md:hidden",
        open ? "translate-y-0" : "translate-y-[calc(100%-4.85rem)]"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-[4.85rem] w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-sepia">Nodo {currentIndex + 1} de {total}</p>
          <h1 className="mt-1 truncate text-lg font-semibold leading-tight text-paper">{scene.title}</h1>
          {!open && <p className="mt-1 truncate text-xs text-paper/62">{scene.subtitle}</p>}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/15 bg-paper/[0.055] text-paper/72">
          {open ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
        </span>
      </button>

      <div className="max-h-[68vh] overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <p className="text-sm leading-relaxed text-paper/74">{scene.subtitle}</p>
        <p className="mt-4 text-sm leading-relaxed text-paper/82">{scene.description}</p>
        <div className="mt-4 rounded-md border border-paper/12 bg-paper/[0.055] p-3 text-sm leading-relaxed text-paper/76">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-sepia">Nota histórica</span>
          {scene.historicalNote}
        </div>

        <button type="button" onClick={onNext} className="mt-4 min-h-12 w-full rounded-md bg-sepia px-4 py-3 text-sm font-semibold text-night">
          Siguiente punto
        </button>

        <div className="mt-2 grid grid-cols-3 gap-2">
          <button type="button" onClick={onHome} className="min-h-12 rounded-md border border-paper/15 px-2 py-3 text-sm text-paper/80">
            <Home className="mx-auto mb-1" size={16} />
            Inicio
          </button>
          <button type="button" onClick={onHelp} className="min-h-12 rounded-md border border-paper/15 px-2 py-3 text-sm text-paper/80">
            <Info className="mx-auto mb-1" size={16} />
            Ayuda
          </button>
          <button
            type="button"
            onClick={() => setShowNodes((value) => !value)}
            className="min-h-12 rounded-md border border-paper/15 px-2 py-3 text-sm text-paper/80"
            aria-expanded={showNodes}
          >
            <List className="mx-auto mb-1" size={16} />
            Nodos
          </button>
        </div>

        {showNodes && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {scenes.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={clsx(
                  "min-h-[4.25rem] min-w-[132px] rounded-md border px-3 py-2 text-left",
                  item.id === scene.id
                    ? "border-sepia bg-sepia/20 text-paper"
                    : "border-paper/12 bg-paper/[0.045] text-paper/68"
                )}
              >
                <span className="block text-[11px] uppercase tracking-[0.14em] text-sepia">
                  {item.order > 13 ? "Bonus" : `Nodo ${item.order}`}
                </span>
                <span className="mt-1 line-clamp-2 block text-sm leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
