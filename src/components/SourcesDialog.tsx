"use client";

import Image from "next/image";
import { BookOpen, ExternalLink, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { historicalSources, historicalTimeline, reconstructionNote } from "@/data/history";
import type { Scene } from "@/types/scene";

export function SourcesDialog({ scene, onClose }: { scene: Scene; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, []);
  const relevant = historicalSources.filter(source => scene.sourceIds.includes(source.id));
  return (
    <dialog ref={ref} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="sources-title" className="sources-dialog">
      <div className="relative rounded-xl border border-paper/[0.15] bg-night text-paper">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-paper/[0.15] bg-night px-5 py-4">
          <h2 id="sources-title" className="flex items-center gap-2 text-xl font-semibold"><BookOpen size={20} className="text-sepia" /> Fuentes y contexto</h2>
          <button type="button" className="viewer-button" aria-label="Cerrar fuentes" onClick={onClose}><X size={19} /></button>
        </div>
        <div className="space-y-7 p-5 text-sm leading-relaxed md:p-7">
          <p className="text-paper/[0.8]">{reconstructionNote}</p>
          <section aria-label="Esta vista">
            <p className="text-xs uppercase tracking-widest text-sepia">Sobre esta vista</p>
            <h3 className="mt-2 text-xl font-semibold">{scene.title}</h3>
            <p className="mt-2">{scene.visualNote}</p>
          </section>
          <section aria-label="Cronología">
            <h3 className="text-lg font-semibold">El tiempo del recorrido</h3>
            <ol className="mt-4 space-y-4 border-l border-sepia/[0.35] pl-4">
              {historicalTimeline.map(item => {
                const source = historicalSources.find(value => value.id === item.sourceId);
                return <li key={item.year}><p className="font-semibold text-sepia">{item.year}</p><p>{item.text}</p>{source && <a className="source-link" href={source.url} target="_blank" rel="noopener noreferrer">Consultar fuente <ExternalLink size={12} /></a>}</li>;
              })}
            </ol>
          </section>
          <figure>
            <Image src="/intro/padilla-referencia.webp" alt="Fotografía del edificio conservado: acceso central de tres arcos y galerías laterales." width={2204} height={1112} sizes="(max-width: 767px) 90vw, 660px" className="h-auto w-full rounded-lg" />
            <figcaption className="mt-2 text-xs text-paper/[0.65]">Referencia del edificio conservado, incorporada al proyecto. Autor y fecha por identificar. Esta fotografía está fuera de la ambientación de 1950.</figcaption>
          </figure>
          <section aria-label="Referencias de esta vista">
            <h3 className="text-lg font-semibold">Referencias y alcance</h3>
            <ul className="mt-3 space-y-5">
              {relevant.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer" className="source-link font-semibold">{source.title}<ExternalLink size={14} /></a><p className="mt-1 text-xs text-paper/[0.65]">{source.publisher}</p><p className="mt-1 text-paper/[0.8]">{source.scope}</p></li>)}
            </ul>
          </section>
        </div>
      </div>
    </dialog>
  );
}
