#!/bin/bash

set -e

# Función para crear directorio solo si no existe
create_dir() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1" || echo "Error: no se pudo crear el directorio $1" >&2
  fi
}

# Función para crear archivo solo si no existe
create_file() {
  if [ ! -f "$1" ]; then
    touch "$1" || echo "Error: no se pudo crear el archivo $1" >&2
  fi
}

# Estructura de carpetas
create_dir "public"
create_dir "src"
create_dir "src/components/common"
create_dir "src/components/sections"
create_dir "src/components/pages"
create_dir "src/data"
create_dir "src/services"
create_dir "src/styles"
create_dir "src/utils"
create_dir ".github/workflows"

# Archivos esenciales
create_file "src/main.jsx"
create_file ".env.example"
create_file "vite.config.js"

# Si el archivo README.md no existe, crea uno básico
create_file "README.md"

# Si el archivo package.json no existe, crea uno vacío
create_file "package.json"

# .gitignore básico si no existe
if [ ! -f ".gitignore" ]; then
  echo 'node_modules/
.env.local
dist/
' > ".gitignore" || echo "Error: no se pudo crear .gitignore" >&2
fi

# CNAME para dominio personalizado
create_file "public/CNAME"

# Workflow básico de deploy (solo si no existe)
if [ ! -f ".github/workflows/deploy.yml" ]; then
  cat <<EOF > .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
EOF
fi

# Mensaje final sólo si hubo errores, en stderr, no en stdout.