import type { SceneHotspot as SceneHotspotType } from "@/types/scene";

export function hotspotTooltip(hotspot: SceneHotspotType) {
  const prefix =
    hotspot.type === "back" ? "Volver" : hotspot.type === "info" ? "Explorar" : "Avanzar";

  return `
    <div style="max-width: 190px">
      <div style="font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #c9a56a; margin-bottom: 4px">${prefix}</div>
      <div style="font-size: 14px; line-height: 1.3; color: #f1e4cf">${hotspot.label}</div>
    </div>
  `;
}
