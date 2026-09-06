import { BookOpen } from "lucide-react";
import type { Scene } from "@/types/scene";

export function SceneNarrative({ scene, onSources }: { scene: Scene; onSources: () => void }) {
  return <div className="space-y-5 text-sm leading-relaxed text-paper/[0.85]">
    <p>{scene.description}</p>
    <div className="rounded-lg border border-paper/[0.15] bg-paper/[0.05] p-4">
      <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-sepia"><BookOpen size={15} /> Contexto histórico</p>
      <p>{scene.historicalNote}</p>
    </div>
    <button type="button" className="source-link text-left text-xs" onClick={onSources}>Fuentes y alcance de esta recreación <span aria-hidden="true">↗</span></button>
  </div>;
}
