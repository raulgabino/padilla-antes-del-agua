"use client";

import { Home, Info, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { Scene } from "@/types/scene";
import { SceneNarrative } from "./SceneNarrative";

type Props = {
  scene: Scene; currentIndex: number; total: number; hidden: boolean;
  onToggle: () => void; onHome: () => void; onNext: () => void; onHelp: () => void; onSources: () => void;
};
export function ScenePanel({ scene, currentIndex, total, hidden, onToggle, onHome, onNext, onHelp, onSources }: Props) {
  if (hidden) return null;
  return <aside className="glass absolute bottom-32 left-4 top-4 z-20 hidden w-[380px] flex-col overflow-hidden rounded-xl md:flex" aria-label="Relato de la vista">
    <div className="flex items-center justify-between gap-2 border-b border-paper/[0.15] px-5 py-4">
      <div><p className="text-xs uppercase tracking-[0.18em] text-sepia">Padilla antes del agua</p><p className="mt-1 text-xs text-paper/[0.65]">Vista {currentIndex + 1} de {total}</p></div>
      <button type="button" className="viewer-button" onClick={onToggle} aria-label="Ocultar panel"><PanelLeftClose size={18} /></button>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
      <p className="mb-3 text-xs uppercase tracking-widest text-sepia">Recreación de época</p>
      <h1 className="text-3xl font-semibold leading-tight">{scene.title}</h1>
      <p className="mb-6 mt-2 text-sm text-paper/[0.65]">{scene.subtitle}</p>
      <SceneNarrative scene={scene} onSources={onSources} />
    </div>
    <div className="grid grid-cols-3 gap-2 border-t border-paper/[0.15] p-4">
      <button type="button" className="viewer-button text-sm" onClick={onHome}><Home size={16} />Inicio</button>
      <button type="button" className="viewer-button text-sm" onClick={onHelp}><Info size={16} />Ayuda</button>
      <button type="button" className="min-h-11 rounded-md bg-sepia px-3 text-sm font-semibold text-night" onClick={onNext}>Siguiente</button>
    </div>
  </aside>;
}
export function FloatingPanelToggle({ hidden, onToggle }: { hidden: boolean; onToggle: () => void }) {
  return hidden ? <button type="button" className="viewer-button absolute left-4 top-4 z-30 hidden md:inline-flex" onClick={onToggle} aria-label="Mostrar panel"><PanelLeftOpen size={20} /><span className="text-xs">Leer la historia</span></button> : null;
}
