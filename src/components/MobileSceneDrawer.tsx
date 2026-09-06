"use client";

import { ChevronDown, ChevronUp, Home, Info, List } from "lucide-react";
import { useState } from "react";
import type { Scene } from "@/types/scene";
import { SceneNarrative } from "./SceneNarrative";

type Props = {
  scene: Scene; scenes: Scene[]; currentIndex: number; total: number; open: boolean;
  onToggle: () => void; onSelect: (id: string) => void; onHome: () => void; onNext: () => void; onHelp: () => void; onSources: () => void;
};
export function MobileSceneDrawer({ scene, scenes, currentIndex, total, open, onToggle, onSelect, onHome, onNext, onHelp, onSources }: Props) {
  const [showViews, setShowViews] = useState(false);
  return <section className="drawer-shadow fixed inset-x-0 bottom-0 z-30 rounded-t-xl border border-paper/[0.15] bg-night/[0.95] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden" aria-label="Relato y navegación">
    <button type="button" onClick={onToggle} aria-expanded={open} aria-controls="mobile-story" className="flex min-h-[4.85rem] w-full items-center justify-between gap-3 px-4 py-3 text-left">
      <span className="min-w-0"><span className="block text-[11px] uppercase tracking-widest text-sepia">Vista {currentIndex + 1} de {total} · Recreación</span><span className="mt-1 block truncate text-base font-semibold">{scene.title}</span></span>
      {open ? <ChevronDown size={23} /> : <ChevronUp size={23} />}
    </button>
    {open && <div id="mobile-story" className="max-h-[65dvh] overflow-y-auto px-4 pb-5">
      <p className="mb-4 text-sm text-paper/[0.65]">{scene.subtitle}</p>
      <SceneNarrative scene={scene} onSources={onSources} />
      <button type="button" onClick={onNext} className="mt-5 min-h-12 w-full rounded-md bg-sepia text-sm font-semibold text-night">Siguiente vista</button>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <button type="button" onClick={onHome} className="viewer-button text-xs"><Home size={16} />Inicio</button>
        <button type="button" onClick={onHelp} className="viewer-button text-xs"><Info size={16} />Ayuda</button>
        <button type="button" onClick={() => setShowViews(value => !value)} aria-expanded={showViews} className="viewer-button text-xs"><List size={16} />Vistas</button>
      </div>
      {showViews && <nav aria-label="Vistas del recorrido" className="mt-3 grid grid-cols-2 gap-2">{scenes.map(item => <button key={item.id} type="button" aria-current={item.id === scene.id ? "step" : undefined} onClick={() => onSelect(item.id)} className={"min-h-16 rounded-md border p-3 text-left text-sm " + (item.id === scene.id ? "border-sepia bg-sepia/[0.15]" : "border-paper/[0.15]")}><span className="block text-xs text-sepia">{item.order}</span>{item.title}</button>)}</nav>}
    </div>}
  </section>;
}
