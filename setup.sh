#!/bin/bash

set -e

echo "🌟 IKU Cábala Activa – Setup Inicial 🌟"

# Verificar dependencias
if ! command -v node &> /dev/null; then echo "Node.js no está instalado"; exit 1; fi
if ! command -v npm &> /dev/null; then echo "npm no está instalado"; exit 1; fi
if ! command -v git &> /dev/null; then echo "git no está instalado"; exit 1; fi

echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"
echo "git: $(git --version)"

# Instalar dependencias
npm install

# Crear variables de entorno
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo "Edita .env.local con tus credenciales reales"
fi

# Build de prueba
npm run build

echo "✅ Setup completado. Ejecuta 'npm run dev' para iniciar el servidor local."