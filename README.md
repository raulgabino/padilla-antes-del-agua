# Padilla antes del agua

Recorrido interpretativo por la escuela Miguel Hidalgo de Viejo Padilla, Tamaulipas, ambientado **hacia 1950**. Ocho momentos de la vida escolar combinan panoramas 360° y fuentes históricas. Las recreaciones no sustituyen fotografías, planos o testimonios del inmueble.

## Desarrollo

Next.js 14, React, TypeScript, Tailwind CSS y Photo Sphere Viewer. Datos locales; no requiere variables de entorno.

```bash
npm ci
npm run dev
```

Abre http://localhost:3000. Para validar y compilar:

```bash
npm run validate
npm run build
npm run start
```

`validate` comprueba escenas, fuentes, enlaces, imágenes activas, conversión, permisos de movimiento, continuidad del giroscopio entre panoramas y ESLint. El build comprueba también TypeScript.

## Contenido

- `src/data/scenes.ts`: relato, notas, fuentes por escena y navegación.
- `src/data/history.ts`: referencias, alcance y cronología.
- `src/data/scene-assets.json`: único inventario activo de rutas, dimensiones reales y proyección.
- [Revisión histórica](docs/revision-historica.md).
- [Procedencia y tratamiento de imágenes](docs/imagenes.md).

Los enlaces antiguos se conservan mediante alias. La secuencia es narrativa: los puntos de navegación no representan conexiones medidas en un plano. Todos los dibujos se identifican como recreaciones, incluso cuando contienen elementos apoyados por una fotografía.

## Imágenes

Los WebP se sirven desde `public/scenes/1950/`. Las nuevas vistas de fachada, acceso y aula son entornos esféricos completos 360° × 180°; las otras cuatro ilustraciones panorámicas se conservan. El recorrido abre siempre en 360°. Si falla WebGL2 o la carga, muestra un aviso con reintento y una opción explícita para consultar la imagen de respaldo. No cambia silenciosamente a una imagen plana.

La portada estática usa `/intro/padilla-portada.webp` (960 × 480); no forma parte de las escenas navegables. Consulta los [prompts y límites de los nuevos panoramas](docs/panoramas-360.md).

```bash
npm run images:audit
npm run images:check
```

Se revisan los archivos activos de `public`, aunque no exista la carpeta de originales. Un archivo ausente o con dimensiones equivocadas hace fallar la comprobación. Los avisos de resolución son informativos.

Para incorporar originales:

1. Añade la vista y sus metadatos a `src/data/scene-assets.json`.
2. Coloca originales PNG, JPEG o WebP en `assets-originales/` (no se versionan).
3. Asigna cada original a un destino activo en `scripts/image-map.json`.
4. Ejecuta `npm run images:prepare` y `npm run images:check`.

El conversor conserva dimensiones y orientación, actualiza el manifiesto y evita reemplazos accidentales. Para sustituir archivos existentes usa `npm run images:prepare -- --overwrite`.

Una proporción 2:1 es necesaria para un panorama equirectangular completo, pero **no demuestra que la imagen cubra una esfera**. Revisa proyección, continuidad lateral, cenit y nadir visualmente. No estires una perspectiva para obtener 2:1. Busca originales de mayor resolución; agrandar sus dimensiones no recupera información. Consulta la [documentación del adaptador](https://photo-sphere-viewer.js.org/guide/adapters/equirectangular.html).

## Navegación

- Escritorio: panel plegable, ocho vistas inferiores, botones de zoom y arrastre.
- Celular: abre el título inferior para leer, avanzar, elegir vista o consultar fuentes.
- En la imagen de respaldo: +, − y 0 para zoom; flechas para desplazarla.
- Fuentes y ayuda usan diálogos con foco contenido y cierre con Escape.
- Cada vista tiene un fragmento de URL compartible y respeta Atrás/Adelante.
- En el teléfono: toca **Activar giroscopio** y concede el permiso de movimiento. Safari necesita que la solicitud se inicie desde ese toque y que el sitio use HTTPS. La misma instancia del visor conserva el movimiento al cambiar de escena. El control sigue visible en teléfonos en horizontal.

## Vercel

Usa la integración Git de Vercel con el preset Next.js. Las ramas de trabajo permiten revisar una vista previa antes de integrar cambios en la rama de producción.
