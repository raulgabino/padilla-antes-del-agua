"use client";

import { Compass, Loader2, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { GyroscopeControls } from "./PanoramaViewer";

type GyroscopeControlProps = {
  controls: GyroscopeControls | null;
};

type GyroState = "idle" | "checking" | "enabled" | "unsupported" | "denied";

export function GyroscopeControl({ controls }: GyroscopeControlProps) {
  const [state, setState] = useState<GyroState>("idle");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!controls) {
      setState("idle");
      return;
    }

    setState(controls.isEnabled() ? "enabled" : "idle");

    const handleGyroscopeUpdate = (event: { gyroscopeEnabled: boolean }) => {
      setState(event.gyroscopeEnabled ? "enabled" : "idle");
    };

    controls.addEventListener?.("gyroscope-updated", handleGyroscopeUpdate);

    return () => {
      controls.removeEventListener?.("gyroscope-updated", handleGyroscopeUpdate);
    };
  }, [controls]);

  const enableGyroscope = async () => {
    if (!controls) {
      setState("unsupported");
      return;
    }

    try {
      setState("checking");
      const supported = await controls.isSupported();
      if (!supported) {
        setState("unsupported");
        return;
      }

      await controls.start();
      const enabled = controls.isEnabled();
      setState(enabled ? "enabled" : "denied");
      if (enabled) setExpanded(false);
    } catch {
      setState("denied");
    }
  };

  const disableGyroscope = () => {
    controls?.stop();
    setState("idle");
  };

  return (
    <div className="absolute left-4 right-4 top-[4.6rem] z-20 flex justify-end md:hidden">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper/15 bg-night/68 px-3 py-2 text-xs font-medium text-paper shadow-soft backdrop-blur-md"
          aria-label="Opciones de movimiento"
        >
          <Compass size={15} className={state === "enabled" ? "text-sepia" : undefined} />
          {state === "enabled" ? "Movimiento activo" : "Movimiento"}
        </button>
      ) : (
      <div className="max-w-[15.5rem] rounded-lg border border-paper/14 bg-night/78 p-3 text-paper shadow-soft backdrop-blur-md">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-sepia">
            <Compass size={15} />
            Movimiento
          </div>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded-md p-1 text-paper/68 transition hover:bg-paper/10 hover:text-paper"
            aria-label="Minimizar movimiento"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-xs leading-relaxed text-paper/76">
          Puedes explorar arrastrando con el dedo. Si prefieres, activa el movimiento del celular para mirar alrededor inclinándolo.
        </p>

        {state === "unsupported" && (
          <p className="mt-2 text-xs leading-relaxed text-sepia">Este navegador o dispositivo no reporta giroscopio disponible.</p>
        )}
        {state === "denied" && (
          <p className="mt-2 text-xs leading-relaxed text-sepia">No se pudo activar. Revisa el permiso de movimiento del navegador.</p>
        )}

        <button
          type="button"
          onClick={state === "enabled" ? disableGyroscope : enableGyroscope}
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-paper/16 bg-paper/[0.065] px-3 py-2 text-sm font-medium text-paper transition hover:border-sepia/60"
        >
          {state === "checking" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : state === "enabled" ? (
            <RotateCcw size={16} />
          ) : (
            <Compass size={16} />
          )}
          {state === "checking" ? "Pidiendo permiso" : state === "enabled" ? "Desactivar movimiento" : "Activar movimiento"}
        </button>
      </div>
      )}
    </div>
  );
}
