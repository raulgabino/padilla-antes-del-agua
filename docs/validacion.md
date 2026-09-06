# Validación de la revisión

Revisión: 6 de septiembre de 2026, incluida la recuperación del 360° y del giroscopio.

## Comprobaciones realizadas

- `npm run validate`: ocho vistas esféricas con referencias y enlaces válidos; siete WebP activos presentes y con dimensiones correctas; diez pruebas correctas; ESLint sin errores ni avisos.
- Las pruebas cubren conversión y dimensiones, solicitud de permiso de iPhone desde el toque, rechazo del permiso, cancelación de respuestas antiguas y dispositivos sin el método de permiso de iOS. También ejecutan el método real `Viewer.setPanorama` con servicios de navegador y GPU simulados para detectar opciones que detengan el giroscopio. No sustituyen una prueba física del sensor.
- `npm run build`: compilación de producción, TypeScript y prerenderizado correctos.
- `git diff --check`: correcto.
- Inspección de las tres imágenes nuevas tanto completas como proyectadas en seis direcciones de 90°: frente, derecha, unión posterior, izquierda, cenit y nadir. Se comprobó cobertura alrededor de la cámara. La imagen generada puede conservar irregularidades locales; no es una captura panorámica calibrada.
- La fachada y el acceso conservan tres arcos; el aula es una recreación sin retratos o emblemas. Las otras cuatro ilustraciones panorámicas no se modificaron.
- Fotografía de referencia: WebP de 2204 × 1112 píxeles y 296886 bytes; original PNG de 2126998 bytes conservado en GitHub. Portada independiente: 960 × 480 y 59580 bytes; no se usa como escena del recorrido.

## Publicación de esta corrección

El usuario autorizó expresamente publicar la vista previa. Vercel aceptó el envío de 44 archivos con destino **preview**: los archivos de ejecución del commit `4efac6d2f338a466f1c36856c9129cf209e832c1`, las siete texturas activas, la referencia y la portada. Se preservó el archivo de dependencias bloqueadas.

Vista previa: [Padilla, corrección 360°](https://padilla-antes-del-agua-h2ywcybua-raul-gabinos-projects.vercel.app).

Identificador: `dpl_AGB6EczP2Hi1abdCRn9MuKWM8TJh`. El servicio devolvió `INITIALIZING`; la compilación se ejecuta de forma asíncrona. No se pudo confirmar el estado final: la consulta del despliegue responde 403 por falta de acceso de la conexión al equipo `raul-gabinos-projects`. La creación de un enlace temporal también responde 403. Al abrir la vista previa, el navegador muestra el inicio de sesión de Vercel. No se han cambiado sus protecciones de acceso.

La corrección queda guardada en la rama `codex/padilla-historia-imagenes` y en la [propuesta de cambios número 1](https://github.com/raulgabino/padilla-antes-del-agua/pull/1). La revisión automática había rechazado un intento anterior por falta de autorización explícita; tras la confirmación del usuario, el nuevo envío sí creó el despliegue indicado.

La revisión anterior, que todavía no incluía esta corrección 360°, había generado un despliegue de revisión con identificador `dpl_DHswPBBDZMgW9oMaTxdcEjbYi3kM`. No se confirmó su estado final: la consulta y el enlace temporal respondieron 403 para el equipo `raul-gabinos-projects`, y el navegador mostró el inicio de sesión de Vercel. Ese despliegue no sirve para revisar la presente corrección.

## Validación física y visual pendiente

Abrir la nueva vista previa con una cuenta de Vercel que tenga acceso al proyecto; entrar al recorrido; cambiar por las ocho escenas; arrastrar y pellizcar; comprobar diálogos, Atrás/Adelante y diseño móvil. En un iPhone real: activar el giroscopio, conceder el permiso, girar e inclinar el dispositivo, cambiar de escena y comprobar que el movimiento siga activo; repetir en horizontal y comprobar la desactivación. También queda pendiente la recuperación visual ante un fallo de WebGL2. Para poder verificar el despliegue desde la conexión, se requiere volver a vincular Vercel con acceso al equipo `raul-gabinos-projects`.

La propuesta sigue como borrador. La rama de producción `main` no se ha modificado.
