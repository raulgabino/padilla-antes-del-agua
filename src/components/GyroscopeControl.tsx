"use client";

import { Compass, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { enableMotion, type MotionControls } from "@/lib/motion";

type Props = { controls: MotionControls; disabled?: boolean };
type GyroState = "idle" | "checking" | "enabled" | "unsupported" | "denied" | "insecure";

export function GyroscopeControl({ controls, disabled = false }: Props) {
  const [state, setState] = useState<GyroState>("idle");
  const [showMessage, setShowMessage] = useState(false);
  const generation = useRef(0);

  useEffect(() => {
    generation.current += 1;
    setState(controls.isEnabled() ? "enabled" : "idle");
    const update = (event: { gyroscopeEnabled: boolean }) => {
      setState(event.gyroscopeEnabled ? "enabled" : "idle");
    };
    controls.addEventListener?.("gyroscope-updated", update);
    return () => {
      generation.current += 1;
      controls.removeEventListener?.("gyroscope-updated", update);
    };
  }, [controls]);

  const toggle = async () => {
    if (controls.isEnabled()) {
      controls.stop();
      setState("idle");
      return;
    }
    const current = generation.current;
    setState("checking");
    setShowMessage(false);
    const orientation = typeof DeviceOrientationEvent === "undefined" ? undefined : DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
    const result = await enableMotion(controls, orientation, window.isSecureContext, () => generation.current === current);
    if (generation.current !== current || result === "cancelled") return;
    setState(result);
    setShowMessage(result !== "enabled");
  };

  return <div className="motion-controls absolute left-4 top-16 z-20 max-w-[17rem] flex-col items-start gap-2 md:left-auto md:right-4 md:top-28">
    <button
      type="button"
      onClick={toggle}
      disabled={state === "checking" || (disabled && state !== "enabled")}
      aria-pressed={state === "enabled"}
      className="viewer-button text-xs"
    >
      {state === "checking" ? <Loader2 size={16} className="animate-spin" /> : <Compass size={16} className={state === "enabled" ? "text-sepia" : undefined} />}
      {state === "checking" ? "Pidiendo permiso…" : state === "enabled" ? "Desactivar giroscopio" : "Activar giroscopio"}
    </button>
    {showMessage && <div className="relative rounded-lg border border-paper/[0.15] bg-night/[0.95] p-3 pr-11 text-xs leading-relaxed text-paper" role="status">
      <button type="button" onClick={() => setShowMessage(false)} aria-label="Cerrar aviso del giroscopio" className="absolute right-0 top-0 grid min-h-11 min-w-11 place-items-center"><X size={17} /></button>
      {state === "unsupported" && "Este dispositivo no proporciona movimiento al recorrido. Puedes mirar alrededor arrastrando con el dedo."}
      {state === "denied" && "No se concedió el permiso de movimiento. Puedes seguir explorando con el dedo y volver a intentarlo."}
      {state === "insecure" && "Abre el enlace seguro del recorrido para poder activar el giroscopio."}
    </div>}
  </div>;
}
