import type { Scene } from "@/types/scene";

/**
 * Guia rapida para calibrar hotspots:
 * - yaw es la posicion horizontal sobre la esfera, en radianes.
 * - pitch es la posicion vertical, tambien en radianes.
 * - Para mover un hotspot a la derecha, aumenta yaw. Para moverlo a la izquierda, reduce yaw.
 * - Para subir un hotspot, aumenta pitch. Para bajarlo, reduce pitch.
 * - Para conectar un nodo con otro, cambia targetSceneId por el id de la escena destino.
 * - Usa type: "forward" para avanzar, "back" para volver e "info" para nodos alternativos.
 * - Punto de partida recomendado: yaw cerca de 0 mira al frente; yaw cerca de 3.14 mira hacia atras.
 */

export const scenes: Scene[] = [
  {
    id: "plaza-vista-escuela",
    order: 0,
    title: "La plaza frente a la escuela",
    subtitle: "Villa de Padilla, 1950",
    image: "/scenes/1950/n00-plaza-vista-escuela.webp",
    description:
      "Desde la plaza principal, la escuela aparece como uno de los edificios dominantes del centro de la Villa de Padilla. La escena reconstruye una mañana cotidiana de 1950, con el kiosco, el movimiento de vecinos y alumnos, y la Escuela Primaria Miguel Hidalgo y Costilla integrada a la vida diaria del pueblo.",
    historicalNote:
      "La Escuela Primaria Miguel Hidalgo y Costilla comenzó a construirse en 1932 y concluyó a inicios de la década de 1940. Su lenguaje arquitectónico corresponde al neocolonial mexicano y formó parte central de la vida educativa y cultural de la Villa de Padilla hasta quedar expuesta a las aguas de la presa Vicente Guerrero en 1971.",
    certainty: "documentado",
    suggestedNext: "llegada",
    hotspots: [
      { id: "h-plaza-llegada", label: "Caminar hacia la escuela", targetSceneId: "llegada", yaw: 0.0, pitch: -0.05, type: "forward" }
    ]
  },
  {
    id: "llegada",
    order: 1,
    title: "Llegada a la escuela",
    subtitle: "El antiguo camino hacia Viejo Padilla, 1950",
    image: "/scenes/1950/n01-llegada-calle-centro.webp",
    description:
      "La mirada se coloca antes de entrar al edificio. El camino seco, la luz abierta y la presencia sobria de la escuela preparan una visita situada en el Padilla anterior a la presa.",
    historicalNote:
      "Reconstrucción interpretativa basada en la existencia documentada del antiguo poblado y su escuela, con ambiente regional de mediados del siglo XX.",
    certainty: "interpretativo",
    suggestedNext: "fachada",
    hotspots: [
      { id: "h-llegada-fachada", label: "Avanzar a la fachada", targetSceneId: "fachada", yaw: 0.0, pitch: -0.05, type: "forward" },
      { id: "h-llegada-plaza", label: "Volver a la plaza", targetSceneId: "plaza-vista-escuela", yaw: 3.1, pitch: -0.04, type: "back" }
    ]
  },
  {
    id: "fachada",
    order: 2,
    title: "Fachada frontal completa",
    subtitle: "La escuela como punto de reunión",
    image: "/scenes/1950/n02-fachada-frontal.webp",
    description:
      "La fachada se presenta completa, con muros claros, vanos sencillos y el acceso al centro. La escena busca recuperar la escala cotidiana de una escuela de pueblo.",
    historicalNote:
      "La volumetría se interpreta desde rasgos visibles del edificio conservado y memoria arquitectónica regional.",
    certainty: "inferido",
    suggestedNext: "escalinata-arco",
    hotspots: [
      { id: "h-fachada-arco", label: "Subir a la escalinata", targetSceneId: "escalinata-arco", yaw: 0.02, pitch: -0.08, type: "forward" },
      { id: "h-fachada-llegada", label: "Regresar a la calle", targetSceneId: "llegada", yaw: 3.12, pitch: -0.05, type: "back" }
    ]
  },
  {
    id: "escalinata-arco",
    order: 3,
    title: "Escalinata y arco principal",
    subtitle: "El umbral antes de entrar",
    image: "/scenes/1950/n03-escalinata-arco.webp",
    description:
      "Desde la escalinata, el arco enmarca el paso hacia el interior. Es un punto breve y solemne, pensado como transición entre el exterior del pueblo y la vida escolar.",
    historicalNote:
      "El acceso se reconstruye de forma interpretativa a partir de la lectura formal del inmueble y su función escolar.",
    certainty: "inferido",
    suggestedNext: "zaguan",
    hotspots: [
      { id: "h-arco-zaguan", label: "Entrar al zaguán", targetSceneId: "zaguan", yaw: 0.0, pitch: -0.03, type: "forward" },
      { id: "h-arco-fachada", label: "Bajar a la fachada", targetSceneId: "fachada", yaw: 3.14, pitch: -0.06, type: "back" }
    ]
  },
  {
    id: "zaguan",
    order: 4,
    title: "Pasillo interior",
    subtitle: "Paso hacia las aulas y la vida escolar",
    image: "/scenes/1950/n04-zaguan-acceso-interior.webp",
    description:
      "El recorrido entra al pasillo principal. La luz de la puerta queda atrás y el edificio empieza a sentirse como escuela en uso: puertas abiertas, muros sobrios y circulación cotidiana.",
    historicalNote:
      "Escena interpretativa sobre la circulación interior de la Escuela Primaria Miguel Hidalgo y Costilla hacia 1950.",
    certainty: "interpretativo",
    suggestedNext: "corredor",
    hotspots: [
      { id: "h-zaguan-corredor", label: "Entrar al primer salón", targetSceneId: "corredor", yaw: 0.05, pitch: -0.03, type: "forward" },
      { id: "h-zaguan-arco", label: "Salir al arco", targetSceneId: "escalinata-arco", yaw: 3.1, pitch: -0.04, type: "back" }
    ]
  },
  {
    id: "corredor",
    order: 5,
    title: "Primer salón",
    subtitle: "Un aula de trabajo cotidiano",
    image: "/scenes/1950/n06-aula-clases.webp",
    description:
      "Este punto conserva el nodo funcional, pero deja de usar la imagen anterior del corredor. La escena se entiende ahora como un primer salón de trabajo antes de avanzar al aula en plena actividad.",
    historicalNote:
      "Ajuste curatorial: el antiguo asset de N05 se retira del recorrido porque no correspondía al pasillo definido para la historia.",
    certainty: "inferido",
    suggestedNext: "aula",
    hotspots: [
      { id: "h-corredor-aula", label: "Entrar al aula en funcionamiento", targetSceneId: "aula", yaw: -0.42, pitch: -0.04, type: "forward" },
      { id: "h-corredor-zaguan", label: "Volver al pasillo", targetSceneId: "zaguan", yaw: 3.1, pitch: -0.04, type: "back" }
    ]
  },
  {
    id: "aula",
    order: 6,
    title: "Aula de clases",
    subtitle: "La escuela en funcionamiento",
    image: "/scenes/1950/n10-aula-clases.webp",
    description:
      "El salón aparece en plena actividad escolar. Pupitres, pizarrón, cuadernos y la luz del día ayudan a imaginar una clase ordinaria en la Villa de Padilla de 1950.",
    historicalNote:
      "Escena interpretativa basada en la función educativa documentada del edificio y en mobiliario escolar plausible de mediados del siglo XX.",
    certainty: "interpretativo",
    suggestedNext: "patio",
    hotspots: [
      { id: "h-aula-patio", label: "Salir hacia el patio", targetSceneId: "patio", yaw: 0.72, pitch: -0.05, type: "forward" },
      { id: "h-aula-corredor", label: "Volver al primer salón", targetSceneId: "corredor", yaw: 3.04, pitch: -0.04, type: "back" }
    ]
  },
  {
    id: "patio",
    order: 7,
    title: "Patio escolar",
    subtitle: "Convivencia y juego durante la jornada",
    image: "/scenes/1950/n11-patio-futbol.webp",
    description:
      "El patio muestra a la escuela viva por dentro: niños conviven y juegan fútbol entre clases, con el edificio como marco cotidiano y no como ruina.",
    historicalNote:
      "Reconstrucción interpretativa de una práctica escolar común, situada en el ambiente social de una escuela pública tamaulipeca hacia 1950.",
    certainty: "interpretativo",
    suggestedNext: "direccion",
    hotspots: [
      { id: "h-patio-direccion", label: "Ir a la dirección", targetSceneId: "direccion", yaw: -0.32, pitch: -0.04, type: "forward" },
      { id: "h-patio-aula", label: "Regresar al aula", targetSceneId: "aula", yaw: 3.1, pitch: -0.05, type: "back" }
    ]
  },
  {
    id: "direccion",
    order: 8,
    title: "Dirección",
    subtitle: "Oficina escolar en una jornada de 1950",
    image: "/scenes/1950/n09-direccion-oficina.webp",
    description:
      "La oficina conserva el tono sencillo de una escuela activa: mesa de trabajo, papeles, luz natural y objetos de uso diario. La escena ubica la organización cotidiana detrás de las clases.",
    historicalNote:
      "Reconstrucción interpretativa del espacio administrativo escolar, situada antes de la transformación territorial causada por la Presa Vicente Guerrero.",
    certainty: "interpretativo",
    suggestedNext: "sala-maestras",
    hotspots: [
      { id: "h-direccion-lateral", label: "Continuar a sala de maestras", targetSceneId: "sala-maestras", yaw: 0.36, pitch: -0.04, type: "forward" },
      { id: "h-direccion-patio", label: "Volver al patio", targetSceneId: "patio", yaw: 3.02, pitch: -0.04, type: "back" }
    ]
  },
  {
    id: "sala-maestras",
    order: 9,
    title: "Sala de maestras",
    subtitle: "Reunión breve durante la jornada",
    image: "/scenes/1950/n12-reunion-maestras.webp",
    description:
      "Un grupo de maestras se reúne de manera informal para revisar cuadernos, comentar la jornada y preparar el siguiente momento de clase.",
    historicalNote:
      "Escena interpretativa sobre la vida laboral docente y la organización cotidiana de la escuela en la primera mitad del siglo XX.",
    certainty: "inferido",
    suggestedNext: "salida-corredor",
    hotspots: [
      { id: "h-maestras-salida", label: "Ir a la salida de clases", targetSceneId: "salida-corredor", yaw: 0.42, pitch: -0.03, type: "forward" },
      { id: "h-maestras-patio", label: "Volver a la dirección", targetSceneId: "direccion", yaw: 3.08, pitch: -0.04, type: "back" }
    ]
  },
  {
    id: "salida-corredor",
    order: 10,
    title: "Salida de clases",
    subtitle: "Corredor principal, 12:30 pm",
    image: "/scenes/1950/n13-salida-corredor.webp",
    description:
      "La jornada termina en el corredor principal. Los niños salen con sus útiles, entre voces bajas y movimiento ordenado, mientras la escuela conserva su ritmo cotidiano.",
    historicalNote:
      "Cierre funcional del recorrido principal: una reconstrucción interpretativa de la salida escolar en la Escuela Primaria Miguel Hidalgo y Costilla hacia 1950.",
    certainty: "interpretativo",
    suggestedNext: "primer-cuadro",
    hotspots: [
      { id: "h-salida-corredor-cuadro", label: "Salir al primer cuadro", targetSceneId: "primer-cuadro", yaw: 0.42, pitch: -0.03, type: "forward" },
      { id: "h-salida-corredor-maestras", label: "Volver a sala de maestras", targetSceneId: "sala-maestras", yaw: 3.08, pitch: -0.05, type: "back" }
    ]
  },
  {
    id: "primer-cuadro",
    order: 11,
    title: "Conexión con el primer cuadro",
    subtitle: "Alrededor de la escuela",
    image: "/scenes/1950/n14-primer-cuadro-viejo-padilla.webp",
    description:
      "La escuela se entiende como parte de un conjunto mayor: calle, plaza, casas y recorridos cotidianos del Viejo Padilla anterior al embalse.",
    historicalNote:
      "Nodo futuro para conectar la escuela con una reconstrucción más amplia del primer cuadro del antiguo pueblo.",
    certainty: "interpretativo",
    suggestedNext: "memoria",
    hotspots: [
      { id: "h-cuadro-memoria", label: "Continuar al nodo memoria", targetSceneId: "memoria", yaw: 0.52, pitch: -0.03, type: "forward" },
      { id: "h-cuadro-salida", label: "Volver a la salida de clases", targetSceneId: "salida-corredor", yaw: 3.1, pitch: -0.04, type: "back" }
    ]
  },
  {
    id: "memoria",
    order: 12,
    title: "Nodo memoria",
    subtitle: "La escuela como recuerdo vivo",
    image: "/scenes/1950/n15-nodo-memoria.webp",
    description:
      "Este punto no cambia de época. Permanece en 1950 y recoge la escuela como imagen de pertenencia, aprendizaje y memoria comunitaria.",
    historicalNote:
      "Nodo bonus pensado para integrar testimonios, archivos familiares o notas curatoriales en versiones futuras.",
    certainty: "interpretativo",
    suggestedNext: "plaza-vista-escuela",
    hotspots: [
      { id: "h-memoria-inicio", label: "Volver al inicio", targetSceneId: "plaza-vista-escuela", yaw: 0.0, pitch: -0.04, type: "forward" },
      { id: "h-memoria-cuadro", label: "Regresar al primer cuadro", targetSceneId: "primer-cuadro", yaw: 3.08, pitch: -0.03, type: "back" }
    ]
  }
];

export const getSceneById = (id: string) => scenes.find((scene) => scene.id === id) ?? scenes[0];
