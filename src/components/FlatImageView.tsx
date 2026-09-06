"use client";

import Image from "next/image";
import { Minus, Plus, RotateCcw, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Scene } from "@/types/scene";

export function FlatImageView({ scene }: { scene: Scene }) {
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const fitted = Math.min(size.width / scene.imageWidth, size.height / scene.imageHeight);
  const imageWidth = scene.imageWidth * fitted * scale;
  const imageHeight = scene.imageHeight * fitted * scale;
  const limitX = Math.max(0, (imageWidth - size.width) / 2);
  const limitY = Math.max(0, (imageHeight - size.height) / 2);
  const x = Math.max(-limitX, Math.min(limitX, offset.x));
  const y = Math.max(-limitY, Math.min(limitY, offset.y));

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const zoom = (next: number) => {
    setScale(Math.min(2.5, Math.max(1, next)));
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => setStatus("error"), 15000);
    return () => clearTimeout(timer);
  }, [status, attempt]);

  return (
    <div className="absolute inset-0 flex flex-col px-3 pb-24 pt-28 md:px-5 md:pb-32 md:pt-20">
      <div
        ref={frame}
        role="region"
        aria-label={"Imagen ampliable: " + scene.title}
        tabIndex={0}
        className="relative min-h-0 flex-1 overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sepia"
        style={{ touchAction: "none", cursor: scale > 1 ? "grab" : "default" }}
        onPointerDown={event => {
          if (scale === 1 || !event.isPrimary) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: x, top: y };
        }}
        onPointerMove={event => {
          const start = drag.current;
          if (!start || event.pointerId !== start.id) return;
          setOffset({
            x: Math.max(-limitX, Math.min(limitX, start.left + event.clientX - start.x)),
            y: Math.max(-limitY, Math.min(limitY, start.top + event.clientY - start.y))
          });
        }}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        onLostPointerCapture={() => { drag.current = null; }}
        onKeyDown={event => {
          if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(scale + 0.5); }
          if (event.key === "-") { event.preventDefault(); zoom(scale - 0.5); }
          if (event.key === "0") { event.preventDefault(); zoom(1); }
          const directions: Record<string, [number, number]> = {
            ArrowLeft: [50, 0], ArrowRight: [-50, 0], ArrowUp: [0, 50], ArrowDown: [0, -50]
          };
          const delta = directions[event.key];
          if (delta) {
            event.preventDefault();
            setOffset({ x: Math.max(-limitX, Math.min(limitX, x + delta[0])), y: Math.max(-limitY, Math.min(limitY, y + delta[1])) });
          }
        }}
      >
        {status !== "error" && size.width > 0 && (
          <Image
            key={attempt}
            src={scene.image}
            alt={scene.title + ". " + scene.visualNote}
            width={scene.imageWidth}
            height={scene.imageHeight}
            unoptimized
            priority
            draggable={false}
            onLoad={() => setStatus("ready")}
            onError={() => setStatus("error")}
            className="pointer-events-none absolute left-1/2 top-1/2 select-none"
            style={{
              width: imageWidth, height: imageHeight, maxWidth: "none",
              transform: "translate(-50%, -50%) translate(" + x + "px, " + y + "px)",
              opacity: status === "ready" ? 1 : 0
            }}
          />
        )}
        {status === "loading" && <p className="absolute inset-0 grid place-items-center text-sm text-paper/[0.8]" role="status">Abriendo la imagen…</p>}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center" role="status">
            <p>No se pudo abrir esta imagen.</p>
            <button type="button" className="viewer-button" onClick={() => { setStatus("loading"); setAttempt(value => value + 1); }}>
              <RefreshCw size={16} /> Reintentar
            </button>
            <p className="text-xs text-paper/[0.7]">Puedes continuar con otra vista del recorrido.</p>
          </div>
        )}
      </div>
      <div className="mt-3 flex shrink-0 flex-wrap items-center justify-center gap-2">
        <button type="button" className="viewer-button" aria-label="Alejar imagen" disabled={scale <= 1 || status !== "ready"} onClick={() => zoom(scale - 0.5)}><Minus size={17} /></button>
        <button type="button" className="viewer-button" aria-label="Ver imagen completa" onClick={() => zoom(1)}><RotateCcw size={15} /><span className="text-xs">Ver completa</span></button>
        <button type="button" className="viewer-button" aria-label="Acercar imagen" disabled={scale >= 2.5 || status !== "ready"} onClick={() => zoom(scale + 0.5)}><Plus size={17} /></button>
        <span className="text-xs text-paper/[0.65]" aria-live="polite">{Math.round(scale * 100)}%{scale > 1 ? " · arrastra para explorar" : ""}</span>
      </div>
    </div>
  );
}
