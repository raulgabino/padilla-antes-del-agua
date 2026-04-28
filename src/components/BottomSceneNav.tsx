"use client";

import clsx from "clsx";
import type { Scene } from "@/types/scene";

type BottomSceneNavProps = {
  scenes: Scene[];
  currentSceneId: string;
  onSelect: (sceneId: string) => void;
};

export function BottomSceneNav({ scenes, currentSceneId, onSelect }: BottomSceneNavProps) {
  return (
    <nav className="absolute bottom-4 left-1/2 z-20 hidden w-[min(960px,calc(100vw-2rem))] -translate-x-1/2 md:block">
      <div className="glass rounded-lg px-3 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {scenes.map((scene) => {
            const active = scene.id === currentSceneId;

            return (
              <button
                type="button"
                key={scene.id}
                onClick={() => onSelect(scene.id)}
                className={clsx(
                  "min-w-[140px] rounded-md border px-3 py-2 text-left transition",
                  active
                    ? "border-sepia bg-sepia/20 text-paper"
                    : "border-paper/12 bg-paper/[0.045] text-paper/68 hover:border-paper/28 hover:text-paper"
                )}
              >
                <span className="block text-[11px] uppercase tracking-[0.16em] text-sepia">
                  {scene.order > 13 ? "Bonus" : `Nodo ${scene.order}`}
                </span>
                <span className="mt-1 line-clamp-2 block text-sm leading-tight">{scene.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
