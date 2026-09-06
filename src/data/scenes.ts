import type { Scene } from "@/types/scene";
import assets from "./scene-assets.json";

type SceneId = keyof typeof assets;
type SceneDraft = Pick<Scene, "title" | "subtitle" | "description" | "historicalNote" | "visualNote" | "sourceIds"> & { id: SceneId };

const drafts: SceneDraft[] = [
  {
    id: "plaza-vista-escuela",
    title: "Frente a la escuela",
    subtitle: "Villa de Padilla · hacia 1950",
    description: "Antes del embalse, aquí había un pueblo habitado. Este recorrido imagina una jornada alrededor de la escuela Miguel Hidalgo: llegar, aprender, preparar las clases y volver a casa.",
    historicalNote: "La antigua escuela Miguel Hidalgo forma parte de los vestigios de Padilla. La memoria institucional del estado recuerda a las familias que dejaron la antigua villa en el contexto de la presa Vicente Guerrero.",
    visualNote: "Fachada reconstruida a partir de la fotografía conservada. Se mantiene el acceso de tres arcos; acabados, colores y vida cotidiana son interpretativos.",
    sourceIds: ["escuela-identificacion", "foto-fachada", "padilla-memoria-2024"]
  },
  {
    id: "fachada",
    title: "El acceso de tres arcos",
    subtitle: "Reconocer el edificio",
    description: "El arco central y los dos laterales dan identidad a la escuela. La vista se acerca a ese umbral para observar sus proporciones y la relación con las galerías laterales.",
    historicalNote: "Los tres arcos son visibles en la fotografía del inmueble conservado. Esa evidencia permite orientar la reconstrucción de la fachada; no fija por sí sola su aspecto completo en 1950.",
    visualNote: "Restitución interpretativa del acceso. La fecha exacta de construcción no se da por establecida con las fuentes reunidas.",
    sourceIds: ["foto-fachada", "escuela-identificacion"]
  },
  {
    id: "zaguan",
    title: "Entre clases",
    subtitle: "Una interpretación del interior escolar",
    description: "Puertas abiertas, pasos y conversaciones permiten imaginar la circulación de alumnos durante la mañana. El pasillo introduce el ambiente de trabajo que continúa en el aula.",
    historicalNote: "La existencia de la escuela está identificada. Su distribución interior hacia 1950 requiere planos, fotografías o testimonios específicos para reconstruirse con precisión.",
    visualNote: "Interior hipotético. El recorrido enlaza momentos de la vida escolar; las conexiones no equivalen a un plano del edificio.",
    sourceIds: ["escuela-identificacion"]
  },
  {
    id: "aula",
    title: "Una mañana de clase",
    subtitle: "Aprender en comunidad",
    description: "Cuadernos, lápices y un pizarrón reúnen a la clase alrededor de una actividad sencilla. La escena busca acercarnos al trabajo cotidiano de alumnos y docente.",
    historicalNote: "Hacia 1950 es el marco narrativo elegido. No se atribuyen a esta escuela una matrícula, un uniforme, un método de enseñanza ni una jornada concreta sin documentación local.",
    visualNote: "Recreación de época. Mobiliario, vestimenta, personas y disposición del salón son interpretativos; no representan alumnos o docentes identificados.",
    sourceIds: ["escuela-identificacion"]
  },
  {
    id: "direccion",
    title: "Organizar la escuela",
    subtitle: "El trabajo detrás de las clases",
    description: "Papeles, cuadernos y una mesa de trabajo evocan las tareas de organización escolar y el encuentro entre la escuela y las familias.",
    historicalNote: "Esta escena interpreta una función escolar. No identifica al director, a las personas retratadas ni una oficina documentada de la escuela Miguel Hidalgo.",
    visualNote: "Oficina hipotética. Los retratos y objetos generados no se utilizan como prueba histórica ni como identificación de personas.",
    sourceIds: ["escuela-identificacion"]
  },
  {
    id: "sala-maestras",
    title: "Preparar la siguiente clase",
    subtitle: "Conversaciones entre maestras",
    description: "Compartir cuadernos y conversar sobre la jornada forma parte de la vida de una escuela. Esta reunión imaginada pone atención en el trabajo que sostiene cada clase.",
    historicalNote: "No se ha identificado un testimonio que documente esta reunión ni una sala exclusiva de maestras. La escena representa una actividad posible, no un episodio registrado.",
    visualNote: "Personas, vestimenta y estancia recreadas. La fecha elegida funciona como ambientación, no como fecha de una fotografía.",
    sourceIds: ["escuela-identificacion"]
  },
  {
    id: "salida-corredor",
    title: "Al terminar la jornada",
    subtitle: "La escuela vuelve a encontrarse con el pueblo",
    description: "Los alumnos recogen sus útiles y la actividad se desplaza hacia el exterior. El final de las clases devuelve a cada uno a los caminos y conversaciones de Padilla.",
    historicalNote: "La hora de salida y la organización del patio no se han documentado para esta escuela. Por eso la escena conserva un momento general del día.",
    visualNote: "Patio y galerías hipotéticos. La arquitectura interior de esta ilustración no equivale a una restitución comprobada del inmueble.",
    sourceIds: ["escuela-identificacion"]
  },
  {
    id: "memoria",
    title: "Un lugar en la memoria",
    subtitle: "La comunidad continúa",
    description: "Volvemos a la misma fachada con otra mirada: un edificio escolar también guarda recuerdos de quienes lo habitaron. Las fotografías familiares y los testimonios permitirán precisar esta reconstrucción.",
    historicalNote: "Las fuentes oficiales recuerdan el traslado de los habitantes en torno a 1970–1971. La inauguración de la presa y la mudanza de una comunidad son acontecimientos relacionados, con tiempos distintos.",
    visualNote: "El recorrido permanece en su recreación de 1950. La cronología y la fotografía conservada pueden consultarse en Fuentes y contexto.",
    sourceIds: ["padilla-memoria-2024", "padilla-cronologia", "foto-fachada"]
  }
];

export const scenes: Scene[] = drafts.map((draft, index) => {
  const next = drafts[(index + 1) % drafts.length];
  const previous = drafts[(index + drafts.length - 1) % drafts.length];
  return {
    ...draft,
    ...assets[draft.id],
    projection: assets[draft.id].projection as Scene["projection"],
    order: index + 1,
    certainty: "interpretativo",
    initialView: { yaw: 0, pitch: 0, zoom: 0 },
    suggestedNext: next.id,
    hotspots: [
      { id: draft.id + "-next", label: "Continuar: " + next.title, targetSceneId: next.id, yaw: 0.65, pitch: -0.18, type: "forward" },
      { id: draft.id + "-previous", label: "Anterior: " + previous.title, targetSceneId: previous.id, yaw: -0.65, pitch: -0.18, type: "back" }
    ]
  };
});

// Preserve links from the original, longer sequence.
const legacyIds: Record<string, string> = {
  llegada: "plaza-vista-escuela",
  "escalinata-arco": "fachada",
  corredor: "zaguan",
  patio: "salida-corredor",
  "primer-cuadro": "memoria"
};

export const getSceneById = (id: string) => scenes.find(scene => scene.id === (legacyIds[id] ?? id)) ?? scenes[0];
