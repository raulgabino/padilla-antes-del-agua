"use client";

import { Compass, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { GyroscopeControls } from "./PanoramaViewer";

type GyroscopeControlProps = {
  controls: GyroscopeControls | null;
};

type GyroState = "idle" | "checking" | "enabled" | "unsupported" | "denied";

export function GyroscopeControl({ controls }: GyroscopeControlProps) {
  const [state, setState] = useState<GyroState>("idle");

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
      setState(controls.isEnabled() ? "enabled" : "denied");
    } catch {
      setState("denied");
    }
  };

  const disableGyroscope = () => {
    controls?.stop();
    setState("idle");
  };

  return (
    <div className="absolute left-4 right-4 top-[4.6rem] z-20 md:hidden">
      <div className="ml-auto max-w-[15.5rem] rounded-lg border border-paper/14 bg-night/68 p-3 text-paper shadow-soft backdrop-blur-md">
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
    </div>
  );
}
