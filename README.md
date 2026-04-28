# Padilla antes del agua

Experiencia web de exploración histórica interpretativa sobre la antigua escuela de Viejo Padilla, en la zona de la Presa Vicente Guerrero, Tamaulipas, México.

La aplicación reconstruye visualmente la escuela como si fuera 1950, antes de la presa. No incluye modo actual, comparación contemporánea, login, backend ni base de datos. Está pensada como un recorrido sobrio tipo Street View histórico, con panoramas 360, nodos narrativos y hotspots de navegación.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Photo Sphere Viewer
- Datos locales en `src/data/scenes.ts`
- Deploy compatible con Vercel

## Instalar

```bash
npm install
```

## Correr en local

```bash
npm run dev
```

Después abre `http://localhost:3000`.

## Compilar

```bash
npm run build
```

## Preparación de imágenes

Los PNG originales generados con ChatGPT Image deben colocarse en:

```text
assets-originales/
```

Después edita:

```text
scripts/image-map.json
```

Ese archivo asigna cada PNG original a su nombre WebP final. Ejemplo:

```json
{
  "ChatGPT Image 25 abr 2026, 10_13_35 p.m..png": "n02-fachada-frontal.webp",
  "ChatGPT Image 25 abr 2026, 10_23_57 p.m..png": "n03-escalinata-arco.webp"
}
```

Si el nombre original no permite inferir el nodo correcto, revisa visualmente la imagen y completa el mapeo manualmente. El script puede sugerir asignaciones por orden al auditar, pero esas sugerencias deben confirmarse.

Ejecuta la auditoría:

```bash
npm run images:audit
```

El reporte muestra nombre original, dimensiones, proporción, cumplimiento 2:1 aproximado, tamaño en MB y recomendación de nodo. Si una imagen aparece como `requiere revision`, no se deforma ni se convierte automáticamente.

Luego convierte:

```bash
npm run images:prepare
```

También puedes correr ambos pasos:

```bash
npm run images:all
```

Los WebP finales quedan en:

```text
public/scenes/1950/
```

Verifica que cada imagen sea panorámica 2:1 y que los nombres coincidan con las rutas usadas en `src/data/scenes.ts`.

Nombres finales esperados:

```text
n01-llegada-calle-centro.webp
n02-fachada-frontal.webp
n03-escalinata-arco.webp
n04-zaguan-acceso-interior.webp
n05-corredor-principal.webp
n06-aula-clases.webp
n07-patio-escolar.webp
n08-direccion-escolar.webp
n09-vista-lateral-contexto.webp
n10-salida-escuela.webp
n11-salon-vacio.webp
n12-ventana-aula-exterior.webp
n13-alumnos-formados.webp
n14-primer-cuadro-viejo-padilla.webp
n15-nodo-memoria.webp
```

## Agregar imágenes panorámicas

Las imágenes finales deben colocarse en:

```text
public/scenes/1950/
```

Formato recomendado:

- WebP
- 3584x1792 px
- Relación 2:1
- Proyección equirectangular 360
- Nombre exacto según `src/data/scenes.ts`

Ejemplo:

```text
public/scenes/1950/n06-aula-clases.webp
```

Si un archivo no existe, la app carga automáticamente un placeholder panorámico generado en el navegador. Ese placeholder muestra el nombre del nodo y la ruta esperada del asset.

## Modificar escenas

Las escenas están definidas en:

```text
src/data/scenes.ts
```

Cada nodo usa esta estructura:

```ts
type Scene = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  historicalNote: string;
  certainty: "documentado" | "inferido" | "interpretativo";
  location: string;
  isBonus?: boolean;
  suggestedNext?: string;
  hotspots: {
    id: string;
    label: string;
    targetSceneId: string;
    yaw: number;
    pitch: number;
    type: "forward" | "back" | "info";
  }[];
};
```

## Modificar hotspots

Los hotspots se editan en el arreglo `hotspots` de cada escena.

- `targetSceneId`: id de la escena destino.
- `yaw`: posición horizontal del punto en radianes.
- `pitch`: posición vertical del punto en radianes.
- `type`: estilo y sentido narrativo del punto.

Valores prácticos:

- `yaw: 0` apunta al frente inicial.
- `yaw: 3.14` apunta hacia atrás.
- `pitch` cerca de `0` queda a la altura del horizonte.
- `pitch` negativo baja el punto.

## Desplegar en Vercel

1. Sube el proyecto a GitHub.
2. Crea un proyecto nuevo en Vercel.
3. Selecciona el repositorio.
4. Usa la configuración por defecto de Next.js.
5. Ejecuta deploy.

No se requieren variables de entorno.
