# GitHub Pages React App

Este proyecto es una aplicación de React que se despliega en GitHub Pages. A continuación se presentan las instrucciones para instalar, ejecutar y desplegar la aplicación.

## Requisitos

- Node.js (versión 14 o superior)
- npm (gestor de paquetes de Node)

## Instalación

1. Clona el repositorio en tu máquina local:

   ```
   git clone <URL_DEL_REPOSITORIO>
   cd github-pages-app
   ```

2. Instala las dependencias del proyecto:

   ```
   npm install
   ```

## Ejecución

Para ejecutar la aplicación en modo de desarrollo, utiliza el siguiente comando:

```
npm start
```

Esto abrirá la aplicación en tu navegador en `http://localhost:3000`.

## Construcción

Para construir la aplicación para producción, utiliza el siguiente comando:

```
npm run build
```

Esto generará una carpeta `build` con los archivos optimizados para producción.

## Despliegue en GitHub Pages

Para desplegar la aplicación en GitHub Pages, asegúrate de tener configurado el script en `package.json`. Luego, ejecuta el siguiente comando:

```
npm run deploy
```

Esto construirá la aplicación y la desplegará en la rama `gh-pages` de tu repositorio.

## Estructura del Proyecto

- `src/main.jsx`: Punto de entrada de la aplicación.
- `src/components/App.jsx`: Componente principal de la aplicación.
- `public/index.html`: Plantilla HTML principal.
- `package.json`: Configuración del proyecto y scripts.

## Licencia

Este proyecto está bajo la licencia MIT.