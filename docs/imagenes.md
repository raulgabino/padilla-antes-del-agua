# Imágenes: procedencia y tratamiento

Revisión: 6 de septiembre de 2026.

Se generaron tres imágenes interpretativas con ChatGPT Image. Se conserva el archivo fuente de cada generación en la conversación y se incorporan al repositorio sus versiones WebP, calidad 92. Las tres salidas recibidas miden **1774 × 887 píxeles**, aunque los prompts pidieran una resolución mayor. No se reescalaron para simular más detalle.

La fachada utiliza tres arcos como ancla documental. Acabados, cubiertas, colores, vegetación y figuras humanas son interpretativos. El aula no reproduce un interior conocido.

## Presentación

La fotografía de referencia se sirve como `public/intro/padilla-referencia.webp`, conservando sus 2204 × 1112 píxeles, sin recorte ni alteración del contenido. Es una conversión de formato con calidad 92 para reducir la descarga. El PNG original permanece en el repositorio.

Las tres imágenes nuevas son perspectivas rectilíneas 2:1 y se muestran completas, con zoom y arrastre; no se declaran panoramas 360°. Las cuatro ilustraciones panorámicas heredadas conservan ese modo, con acercamiento limitado por su resolución. Sus bordes, polos y objetos generados pueden presentar discontinuidades: no son capturas fotográficas calibradas. El modo de imagen completa permite consultar cada ilustración sin depender de WebGL2.

El manifiesto `src/data/scene-assets.json` contiene ocho escenas y siete archivos únicos. La fachada se reutiliza en el cierre para mantener la identidad del edificio. Los archivos retirados permanecen en el repositorio pero no se precargan.

## Prompts conservados

Los prompts expresan instrucciones de generación, no hechos históricos ni garantía de que cada detalle haya sido reproducido exactamente.

### Fachada

Archivo: `public/scenes/1950/fachada-reconstruida-v2.webp`.

Referencia: Fotografía del proyecto `public/intro/padilla-entrada.png`.

```text
Use case: historical-scene / precise-object-edit. Asset type: high-detail rectilinear image for the historical website 'Padilla antes del agua'. Edit target and authoritative architectural reference: the attached photograph of the actual ruined school. Reconstruct this SAME building as a functioning school around 1950. Preserve the full width, low one-storey height, exact position of all visible openings, the entire facade silhouette, the stepped curved central parapet with its small pinnacles, the long low side galleries and end pavilions. CRITICAL invariant: the entrance is a THREE-ARCH arcade: one taller rounded central arch and two smaller open arches on either side on the same facade plane. Keep these THREE openings clearly legible. Do not replace them with one monumental arch. Do not change the school into an L-shaped corner building. Repair missing plaster and roofs with restrained warm ivory limewash, timber and period-compatible materials, retaining modest wear appropriate to an occupied school. Keep the environment dry, with a plain packed-earth forecourt and blue Tamaulipas daylight. Remove flood damage, rubble and vegetation growing on walls. No reservoir, no modern objects, no invented kiosk or monuments, no signage or lettering, no dates, no watermark. Include at most four small schoolchildren with plain period clothing in the middle distance; the building is the main subject. Match the camera position and wide front-facing composition of the reference photograph, eye level, straight architectural lines, NOT fisheye and NOT a 360 panorama. Produce a single photorealistic landscape image, aspect ratio 2:1, as much native detail as possible, ideally 3072 x 1536 or higher. This is an interpretive reconstruction anchored to the provided geometry, not an archival photograph.
```

### Acceso

Archivo: `public/scenes/1950/acceso-tres-arcos-v2.webp`.

Referencia: Nueva fachada y fotografía del proyecto.

```text
Use case: historical-scene. Asset: rectilinear architectural detail for a historical website. Reference image 1 is the approved interpretive reconstruction of the school. Reference image 2 is the actual ruined school and is authoritative for the geometry. Create a closer, front-facing view of the same entrance, from immediately before the shallow steps. Keep the THREE open rounded arches: taller central arch and two smaller flanking arches; the wide low facade, stepped curved parapet, the same warm ivory limewash, restrained wear, dark wood windows and galleries on both sides. Preserve the same building, no new ornamental elements, no invented names, no writing, no dates, no signs. The close view should include all three arches, full central parapet and visible portions of both adjacent galleries so they match reference 1. Camera height 1.6 m, corrected straight verticals, 28 mm-like architectural photograph, not fisheye, not panorama or 360. Warm natural daytime light from the same direction as reference 1. No people close to the camera, no furniture outside, no water, no modern objects. Single photorealistic landscape image, aspect 2:1, maximum native detail, ideally 3072x1536 or larger. Interpretive restoration of architecture anchored to the provided photograph.
```

### Aula

Archivo: `public/scenes/1950/aula-recreada-v2.webp`.

Referencia: Aula previa `n10-aula-clases.webp` y nueva fachada como referencia de paleta.

```text
Use case: historical-scene. Asset: a rectilinear classroom illustration for 'Padilla antes del agua', set around 1950. Reference image 1 (the existing classroom) is the edit target; reference image 2 (the reconstructed exterior) gives material and daylight continuity. Rework the classroom into a natural, carefully composed wide photograph, with straight verticals and a normal architectural perspective, NOT fisheye and NOT a 360 panorama. Preserve its modest village-school character and broad arrangement, warm ivory plaster, dark timber doors, simple wood desks and natural daylight, but reduce the crowd to around twelve children at sensible distances so anatomy, hands and scale remain clear. A female teacher conducts a simple arithmetic exercise. Varied plain period-appropriate clothing; do not imply a documented uniform. Remove portraits of identifiable political figures, flags, printed calendars, generated fake notices, decorative maps and illegible lettering. Blackboard text only: '2 + 3 = 5', small and handwritten; no other text. Pupils use plain notebooks and pencils; no modern objects, branded textbooks, electronics or synthetic school bags. Keep exterior glimpses quiet, with a simple shaded gallery, never a second full facade or a newly invented building. The light and plaster tones should match the exterior reference. This is an explicitly interpretive classroom, not an assertion of the actual building floorplan. Single photorealistic wide landscape image, 2:1 aspect ratio, highest native detail possible, ideally 3072x1536 or greater. No watermarks or captions.
```
