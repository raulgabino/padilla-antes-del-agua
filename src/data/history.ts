export type HistoricalSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  scope: string;
  kind: "institucional" | "periodístico" | "fotográfico";
};

export const historicalSources: HistoricalSource[] = [
  {
    id: "padilla-memoria-2024",
    title: "Conmemoración del primer Congreso Constituyente",
    publisher: "Gobierno del Estado de Tamaulipas · 13 de julio de 2024",
    url: "https://www.tamaulipas.gob.mx/2024/07/conmemora-tamaulipas-bicentenario-del-primer-congreso-constituyente/",
    scope: "Documenta la memoria del traslado de los habitantes en 1971 y la instalación del Congreso en Padilla en 1824. No describe la distribución de la escuela.",
    kind: "institucional"
  },
  {
    id: "padilla-cronologia",
    title: "Padilla: reseña histórica del municipio",
    publisher: "Gobierno del Estado de Tamaulipas",
    url: "https://tamaulipas.gob.mx/estado/municipios/padilla/",
    scope: "La cronología sitúa la evacuación en 1970 y la inauguración de la presa el 27 de septiembre de 1971. El traslado se presenta como un proceso de 1970–1971.",
    kind: "institucional"
  },
  {
    id: "escuela-identificacion",
    title: "Antiguo Padilla: de inundación a sequía",
    publisher: "Salma Hernández · Milenio · 3 de marzo de 2022",
    url: "https://www.milenio.com/ciencia-y-salud/medioambiente/presa-vicente-guerrero-y-viejo-padilla-donde-es",
    scope: "Identifica y muestra la antigua escuela Miguel Hidalgo. Se usa para identificar el inmueble; no para fechar su construcción ni reconstruir su interior.",
    kind: "periodístico"
  },
  {
    id: "foto-fachada",
    title: "Fotografía de la fachada conservada",
    publisher: "Imagen incorporada al proyecto · autor y fecha por identificar",
    url: "/intro/padilla-entrada.png",
    scope: "Permite observar el acceso de tres arcos y la silueta conservada. Los acabados, cubiertas restituidas, colores y personas de la reconstrucción son interpretaciones.",
    kind: "fotográfico"
  }
];

export const historicalTimeline = [
  { year: "1824", text: "Padilla fue sede del primer Congreso Constituyente de Tamaulipas.", sourceId: "padilla-memoria-2024" },
  { year: "Hacia 1950", text: "Época elegida para imaginar la vida escolar. Las escenas no reproducen una jornada identificada en un archivo.", sourceId: null },
  { year: "1970–1971", text: "Traslado de la población en el contexto de la presa Vicente Guerrero. La cronología estatal fecha su inauguración el 27 de septiembre de 1971.", sourceId: "padilla-cronologia" }
];

export const reconstructionNote = "Las imágenes del recorrido son recreaciones realizadas con IA. La fotografía conservada orienta la fachada; los interiores, las personas y sus actividades son interpretaciones. Las fuentes históricas respaldan el contexto indicado en cada ficha.";
