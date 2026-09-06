"use client";

import Image from "next/image";
import { ArrowRight, BookOpen, MapPin } from "lucide-react";

export function IntroOverlay({ onEnter, onSources }: { onEnter: () => void; onSources: () => void }) {
  return <section className="fixed inset-0 z-40 overflow-y-auto bg-night text-paper">
    <Image src="/intro/padilla-portada.webp" alt="Recreación de la antigua escuela de Padilla con su acceso de tres arcos." fill priority sizes="100vw" className="object-cover object-[48%_center]" />
    <div className="absolute inset-0 bg-gradient-to-r from-night/[0.9] via-night/[0.55] to-night/[0.1]" />
    <div className="absolute inset-0 bg-gradient-to-t from-night/[0.85] via-transparent to-transparent" />
    <div className="relative flex min-h-[100dvh] items-end px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-12 md:items-center md:px-12">
      <div className="max-w-xl">
        <p className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-sepia"><MapPin size={15} />Villa de Padilla, Tamaulipas</p>
        <p className="mb-3 text-sm text-paper/[0.75]">Hacia 1950 · Recorrido 360°</p>
        <h1 className="text-5xl font-semibold leading-[1.03] tracking-tight md:text-7xl">Padilla antes del agua</h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-paper/[0.9] md:text-lg">Una escuela, sus habitantes y la vida cotidiana del pueblo antes de la presa Vicente Guerrero.</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/[0.65]">Recorrido interpretativo con imágenes recreadas a partir de referencias del edificio y del contexto histórico.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={onEnter} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-sepia px-5 py-3 text-sm font-semibold text-night hover:bg-paper">Entrar al recorrido <ArrowRight size={17} /></button>
          <button type="button" onClick={onSources} className="viewer-button text-sm"><BookOpen size={16} />Fuentes y contexto</button>
        </div>
      </div>
    </div>
  </section>;
}
