"use client";

import { ArrowRight, Eye, MapPin } from "lucide-react";

type IntroOverlayProps = {
  onEnter: () => void;
  onSkipToFirstNode?: () => void;
};

export function IntroOverlay({ onEnter, onSkipToFirstNode }: IntroOverlayProps) {
  return (
    <section className="fixed inset-0 z-[9999] overflow-hidden bg-night text-paper">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/intro/padilla-entrada.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-night/30 via-night/50 to-night/92" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0%,rgba(17,16,13,0.28)_58%,rgba(17,16,13,0.7)_100%)]" />

      <div className="relative z-10 flex min-h-[100dvh] items-end px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-8 md:items-center md:px-12 md:pb-10">
        <div className="w-full max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-paper/78">
            <span className="inline-flex items-center gap-2 rounded-full border border-paper/18 bg-night/45 px-3 py-2 backdrop-blur-md">
              <MapPin size={14} className="text-sepia" />
              Viejo Padilla, Tamaulipas
            </span>
            <span className="rounded-full border border-paper/18 bg-night/45 px-3 py-2 text-sepia backdrop-blur-md">1950</span>
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold leading-none text-paper drop-shadow md:text-6xl">
            Padilla antes del agua
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-paper/84 drop-shadow md:text-lg">
            Una exploración histórica interpretativa de la antigua escuela de Viejo Padilla antes de la construcción de la presa Vicente Guerrero.
          </p>

          <div className="mt-6 max-w-2xl rounded-lg border border-paper/14 bg-night/58 p-4 text-sm leading-relaxed text-paper/78 shadow-soft backdrop-blur-md md:p-5">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-sepia">
              <Eye size={15} />
              Punto de partida
            </div>
            <p>
              Esta imagen funciona como umbral visual. A partir de los rastros del edificio, el recorrido reconstruye de forma sobria cómo pudo sentirse la escuela en una jornada de 1950.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onEnter}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-sepia px-5 py-3 text-sm font-semibold text-night transition hover:bg-paper"
            >
              Entrar al recorrido
              <ArrowRight size={17} />
            </button>
            <button
              type="button"
              onClick={onSkipToFirstNode ?? onEnter}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-paper/18 bg-night/38 px-5 py-3 text-sm font-medium text-paper/84 backdrop-blur-md transition hover:border-sepia/60 hover:text-paper"
            >
              Ir directo al nodo 1
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
