"use client";

import { useEffect, useRef } from "react";
import type { Scene } from "@/types/scene";

export function BottomSceneNav({ scenes, currentSceneId, onSelect }: { scenes: Scene[]; currentSceneId: string; onSelect: (id: string) => void }) {
  const active = useRef<HTMLButtonElement>(null);
  useEffect(() => { active.current?.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [currentSceneId]);
  return <nav aria-label="Vistas del recorrido" className="absolute bottom-4 left-1/2 z-20 hidden w-[min(1100px,calc(100vw-2rem))] -translate-x-1/2 md:block">
    <div className="glass flex gap-2 overflow-x-auto rounded-xl p-3">
      {scenes.map(scene => <button ref={scene.id === currentSceneId ? active : undefined} key={scene.id} type="button" aria-current={scene.id === currentSceneId ? "step" : undefined} onClick={() => onSelect(scene.id)} className={"min-h-16 min-w-[140px] flex-1 rounded-md border px-3 py-2 text-left " + (scene.id === currentSceneId ? "border-sepia bg-sepia/[0.15] text-paper" : "border-paper/[0.15] text-paper/[0.7] hover:border-sepia/[0.5]")}><span className="block text-[11px] uppercase tracking-widest text-sepia">Vista {scene.order}</span><span className="mt-1 block text-xs leading-relaxed">{scene.title}</span></button>)}
    </div>
  </nav>;
}
