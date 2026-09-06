# Panoramas 360° y movimiento del teléfono

Revisión: 6 de septiembre de 2026.

La corrección recupera el requisito de inmersión de las tres escenas nuevas. Se generaron de nuevo como mapas equirectangulares completos de 360° × 180°, con entorno lateral y posterior, cenit y nadir. No se estiraron las perspectivas v2.

| Archivo activo | Dimensiones | Bytes |
| --- | --- | ---: |
| `fachada-360-v3.webp` | 1774 × 887 | 551734 |
| `acceso-360-v3.webp` | 1774 × 887 | 547052 |
| `aula-360-v3.webp` | 1774 × 887 | 328062 |

Son recreaciones con IA, no levantamientos arquitectónicos. La fotografía del proyecto documenta el acceso de tres arcos; las casas y árboles de la plaza, el interior, las figuras y los materiales reconstruidos son interpretativos. El cierre reutiliza la fachada v3. Los cuatro panoramas anteriores permanecen iguales.

Se inspeccionó cada panorama mediante seis vistas rectilíneas de 90° calculadas desde la esfera: frente, derecha, cierre posterior, izquierda, cenit y nadir. Esto confirma la cobertura alrededor de la cámara y permite examinar la unión de los extremos; no certifica una costura fotogramétrica perfecta. Pueden persistir irregularidades de textura o geometría generada. La resolución nativa recibida limita el detalle al acercarse; WebP calidad 92, sin ampliación artificial.

## Visor y giroscopio

El visor y su plugin de movimiento se crean una sola vez. Cada escena cambia la textura mediante `setPanorama`, sin pasar posición ni zoom en esa llamada: la biblioteca detendría el giroscopio si se incluyen. Cuando el movimiento está apagado, el visor ajusta después el encuadre inicial. Con movimiento activo conserva la orientación del teléfono. Se suministran dimensiones esféricas completas y se omite XMP de cámara.

El botón solicita `DeviceOrientationEvent.requestPermission()` directamente dentro del toque del usuario, antes de esperar otras comprobaciones. En iPhone se requiere HTTPS y permiso. La activación no ocurre automáticamente. El botón permite desactivarlo y permanece disponible en teléfonos en horizontal. Los errores no convierten silenciosamente el recorrido en vistas planas.

Referencias técnicas: [GyroscopePlugin](https://photo-sphere-viewer.js.org/plugins/gyroscope.html), [setPanorama](https://photo-sphere-viewer.js.org/guide/methods.html), [adaptador equirectangular](https://photo-sphere-viewer.js.org/guide/adapters/equirectangular.html) y [permiso de orientación](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static).

## Prompts completos

Los prompts son instrucciones de generación; no constituyen evidencia histórica ni garantizan exactitud geométrica.

### Fachada

Referencia: Fachada v2 y fotografía original del proyecto.

```text
Use case: historical-scene. Asset: a complete immersive SPHERICAL 360 x 180 degree equirectangular environment texture, exact 2:1 aspect ratio, maximum available native resolution. Reference image 1 is the architectural appearance to preserve; reference image 2 is the surviving building photograph documenting the three-arch entrance. Reconstruct the scene all the way around a single stationary camera, NOT a wide photograph or a rectilinear picture stretched to 2:1.
Scene: the school Miguel Hidalgo in Villa de Padilla, Tamaulipas, imagined around 1950, intact warm ivory plaster, low symmetrical side galleries, three central entrance arches (larger central arch and two flanking arches), restrained terracotta tiles, timber openings, central shallow steps. Preserve that exact building identity and low proportions from reference 1. Eye at 1.65 metres, standing about 22 metres before the facade in the dusty plaza. Warm clear late-morning light.
Projection and complete environment: output one continuous longitude-latitude sphere map. The school is IN FRONT, centered at longitude 0 / x=50%, occupying approximately the central 90-110 degrees, never the entire 360-degree width. To both sides continue the open dusty plaza, modest shade trees and a few low period adobe homes well away from the school. The BACK hemisphere is the opposite side of the quiet plaza, with a low garden edge, earth and distant simple homes, split across both image edges. Left and right edges represent the SAME rear meridian and MUST join seamlessly with matching sky, ground, colors, structures and lighting. Horizon at exactly half height. Top edge is the zenith, smooth blue sky converging uniformly in all longitudes; bottom edge is the nadir, earth directly under the camera with correct equirectangular polar stretching. All 360 degrees around and all 180 degrees from up to down must be depicted. One camera centre and coherent perspective. No black areas, no borders, no blank regions, no fisheye circles, no little planet, no collage, no repeated front facade on rear hemisphere. At most three small distant schoolchildren near the steps; keep people away from seam and poles. No school lettering, no signs, no text, no watermarks, no lake, no ruins, no modern vehicles, no powerlines. The image is an artistic historical reconstruction, not a measured architectural record.
```

### Acceso

Referencia: Acceso v2 y panorama de fachada v3.

```text
Use case: historical-scene. Create one complete 360 x 180 degree SPHERICAL EQUIRECTANGULAR panorama for an immersive phone viewer, exact 2:1 ratio, maximum native detail. Input 1 is the close architectural reference to preserve; input 2 is the completed plaza panorama establishing the surroundings. The output is a longitude-latitude environment map around ONE camera centre, never a rectilinear wide photograph.
Camera: same school and day, now standing about 7 metres before the three-arched entrance, eye height 1.65 metres. Front is centered at x50%. Preserve the THREE arches, ivory plaster, scalloped central parapet and finials, low side galleries, terracotta tiles, timber doors and shallow steps of input 1. The central three-arch portico spans the front sector roughly x33% to67%; side galleries recede into the side directions. The school must NOT wrap around into the back view. Looking back reveals the very same dusty village plaza with shade trees and low modest adobe houses established by input2. No new tall monumental architecture. No lake or ruins.
Projection: all 360 horizontal degrees and full 180 vertical degrees. Genuine lat-long layout with horizon at half height; correct equirectangular curvature, zenith sky at top and nadir ground below camera at bottom. Ground beneath the camera fills the lower hemisphere, naturally stretched near the nadir. Show continuous actual spatial surroundings at both sides and behind. The leftmost and rightmost columns depict the SAME rear meridian and must join seamlessly: matching sky, branches, buildings, ground texture and shadows. Keep seam mostly unobstructed sky and dusty open plaza to guarantee closure. Match top and bottom poles across their full width; no central vanishing-point wide photograph, no fisheye circles, no little planet, no collage or borders. Warm quiet late-morning light consistent with input2, realistic human eye scale and restrained textures. Leave the steps and threshold clear, no people close to camera. No signs, inscriptions, text, logos, modern objects, vehicles or telephone cables. Interpretive historical reconstruction.
```

### Aula

Referencia: Aula v2.

```text
Use case: historical-scene. Use the supplied classroom image as the identity and atmosphere reference, and rebuild the surrounding room as one complete SPHERICAL 360 x 180 degree EQUIRECTANGULAR environment map, exact 2:1 landscape ratio, maximum available native detail. This is an immersive panorama texture, not a wide-angle photograph resized to 2:1.
Preserve a hypothetical classroom of the Miguel Hidalgo school in Villa de Padilla, Tamaulipas, around1950: warm ivory plaster, dark timber windows with shutters, simple wooden desks, plain floor, soft daylight, ordinary notebooks and pencils, teacher with modest cream blouse and dark skirt. Camera at eye height about1.5metres in an aisle near the middle/back of the classroom. Front sector at x50%: blackboard and teacher ahead, several schoolchildren seen from behind at their desks. Blackboard exact sole writing: '2 + 3 = 5'. Keep this front classroom content within the central quarter/third of the environment map, not across the whole image. Side sectors: actual left and right classroom walls with doors/windows and modest timber furniture. Back sector, split between the two image edges: rear classroom wall with a plain cabinet and a closed wooden door away from the seam. There must be a real back of the room; do not duplicate the teacher or blackboard behind the viewer. About8-10 pupils total, placed well away from the seam and poles; no unverified uniform requirement.
Projection and closure are essential: one camera centre, all360degrees around, full ceiling and full floor. Midline at eye-level horizon. Zenith at the top edge, looking directly up at one continuous pale ceiling; nadir at bottom edge looking directly down at clear floor beneath camera. Correct latitude-longitude polar stretching near top and bottom, continuous real room volume. Left and right edges are the identical rear-facing meridian and must match exactly in wall colors, wall-floor/ceiling junction heights, light and floor grain when joined. Keep the seam simple uninterrupted plaster and empty floor. Only two modest hanging lamps, placed away from zenith and seam. No fisheye disks, no little planet, no cubemap collage, no margins, no missing areas. No portraits, flags, national emblems, maps, calendars, fake lettering, plastic, fluorescent lights, modern school supplies, watermark or captions. Natural historically plausible atmosphere; all interiors and people remain an explicit artistic interpretation.
```
