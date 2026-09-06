# Validación de la revisión

Revisión: 6 de septiembre de 2026.

## Comprobaciones realizadas

- `npm run validate`: ocho vistas con referencias y enlaces válidos; siete WebP activos presentes y con dimensiones correctas; cuatro pruebas del conversor correctas; ESLint sin errores ni avisos.
- `npm run build`: compilación de producción, TypeScript y prerenderizado correctos. Repetido después de optimizar la fotografía de referencia.
- `git diff --check`: correcto.
- Inspección visual de las tres imágenes generadas: fachada de tres arcos, acceso coherente y aula sin retratos o emblemas.
- Fotografía de referencia: conversión WebP de 2204 × 1112 píxeles y 296886 bytes; original PNG de 2126998 bytes conservado en GitHub.

## Despliegue de revisión

Se creó un despliegue con destino **preview** y los archivos de ejecución de esta revisión:

https://padilla-antes-del-agua-b6i1k2s6j-raul-gabinos-projects.vercel.app

Identificador: `dpl_DHswPBBDZMgW9oMaTxdcEjbYi3kM`.

El servicio devolvió inicialmente `INITIALIZING`. No se ha podido confirmar su estado final: la consulta del despliegue y la creación de un enlace temporal responden 403 para el equipo `raul-gabinos-projects`. El navegador llega a la pantalla de inicio de sesión de Vercel, sin acceso al recorrido. El build local correcto no equivale a comprobar el build remoto.

El envío incluye las ocho imágenes necesarias para la aplicación (siete escenas únicas y la referencia). Los archivos retirados y el PNG original siguen en GitHub; se omiten del envío para mantenerlo dentro del límite de 4 MB. Se añadió exclusivamente al despliegue una página temporal `_review/mobile.html` con un iframe de 390 × 844 para comprobar el diseño móvil; no forma parte de la aplicación versionada.

## Comprobaciones pendientes por acceso

Entrada al recorrido; navegación por las ocho escenas; carga y zoom de imágenes; diálogos y Escape; navegación con Atrás/Adelante; adaptación a 390 píxeles; recuperación visual cuando WebGL2 no está disponible. El giroscopio requiere además un iPhone físico. La propuesta se mantiene como borrador hasta completar la revisión visual.

La rama de producción `main` no se ha modificado.

