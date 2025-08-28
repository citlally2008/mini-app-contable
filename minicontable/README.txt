
MINI CONTABLE (PWA) — Paso a paso rápido
=======================================

¿Qué es?
--------
Una app súper básica para registrar entradas y salidas (como tabla tipo Excel).
Calcula totales y saldo. Guarda los datos en tu celular (localStorage).
Permite exportar un reporte con "Guardar como PDF" (usa la impresión del navegador).
Funciona sin internet después de instalarla como app (PWA) cuando se sirve en HTTPS.

Cómo usarla ya mismo (sin conocimientos de programación)
--------------------------------------------------------
OPCIÓN A: Abrir directamente en el celular (SIN instalar como app)
  1) Descomprime el ZIP.
  2) Abre el archivo 'index.html' con Chrome en tu Android.
     - Nota: así funciona, pero NO se puede "instalar" porque el navegador exige HTTPS.
     - Igual puedes usarla y tus datos se guardan en el navegador del celular.
  3) Para exportar PDF, toca "Exportar PDF" y en el diálogo elige "Guardar como PDF".

OPCIÓN B (RECOMENDADA): Publicarla gratis en GitHub Pages e INSTALARLA como app
-------------------------------------------------------------------------------
  1) Crea una cuenta en https://github.com si no tienes.
  2) Crea un repositorio NUEVO llamado, por ejemplo, "minicontable".
     - Marca la opción "Public" (público).
  3) Entra al repo y sube TODO el contenido de esta carpeta (index.html, app.js, styles.css, manifest.json, service-worker.js, carpeta icons).
     - Puedes arrastrar y soltar los archivos desde el navegador.
  4) Ve a: Settings -> Pages.
     - "Build and deployment": selecciona "Deploy from a branch".
     - "Branch": elige "main" y carpeta "/" (root). Guarda.
  5) Espera unos segundos y recarga; verás la URL de tu sitio (algo como https://tuusuario.github.io/minicontable).
  6) Abre esa URL en tu CELULAR con Chrome.
     - Te saldrá la opción "Instalar app" o "Añadir a pantalla de inicio". Tócala.
     - Desde ahora funciona como app independiente y offline.

Consejos
--------
- Para borrar todos los datos: botón "Borrar todo".
- Para eliminar un movimiento específico: icono 🗑️ en la fila.
- La moneda está formateada en COP (pesos colombianos).

¿Cómo generar el PDF?
---------------------
- Toca "Exportar PDF". Se abre una vista imprimible.
- Toca el menú de Chrome -> Compartir/Imprimir -> "Guardar como PDF".

¿Cómo editar el nombre o los colores?
-------------------------------------
- Cambia el <title> y textos en index.html.
- Colores en styles.css (variables :root).
- Íconos en /icons (puedes reemplazarlos por otros PNG de 192 y 512 px).

Soporte
-------
- Si algo no te carga en GitHub Pages, revisa:
  * Que TODOS los archivos estén en la raíz del repo (no dentro de otra carpeta).
  * Que el nombre sea EXACTO: service-worker.js (minúsculas).
  * Que abras la URL 'https://TU_USUARIO.github.io/minicontable' desde Chrome en Android.

¡Listo! Ya tienes tu primera app contable simple.
