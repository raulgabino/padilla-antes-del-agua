export type SceneCertainty = "documentado" | "inferido" | "interpretativo";

export type SceneHotspot = {
  id: string;
  label: string;
  targetSceneId: string;
  yaw: number;
  pitch: number;
  type: "forward" | "back" | "info";
};

export type Scene = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  projection: "rectilinear" | "equirectangular";
  initialView: { yaw: number; pitch: number; zoom: number };
  description: string;
  historicalNote: string;
  certainty: SceneCertainty;
  visualNote: string;
  sourceIds: string[];
  suggestedNext?: string;
  hotspots: SceneHotspot[];
};
