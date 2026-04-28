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
  description: string;
  historicalNote: string;
  certainty: SceneCertainty;
  suggestedNext?: string;
  hotspots: SceneHotspot[];
};
