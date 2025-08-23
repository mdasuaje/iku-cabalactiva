#!/bin/bash

set -e

echo "🌟 IKU Cábala Activa – Setup Inicial 🌟"

# Verificar dependencias en una sola función
check_deps() {
  local missing=()
  for cmd in node npm git; do
    command -v "$cmd" &>/dev/null || missing+=("$cmd")
  done
  
  if [ ${#missing[@]} -gt 0 ]; then
    echo "❌ Dependencias faltantes: ${missing[*]}"
    exit 1
  fi
  
  echo "✅ Node.js: $(node -v) | npm: $(npm -v) | git: $(git --version | cut -d' ' -f3)"
}

check_deps

# Setup en paralelo donde sea posible
{
  npm install &
  [ ! -f ".env.local" ] && cp .env.example .env.local && echo "📝 Creado .env.local - edita con tus credenciales" &
  wait
}

# Corregir vulnerabilidades si existen
if npm audit --audit-level=moderate | grep -q "vulnerabilities"; then
  echo "🔧 Corrigiendo vulnerabilidades..."
  npm audit fix --force --silent
fi

# Build de prueba
echo "🔨 Probando build..."
npm run build > /dev/null && echo "✅ Build exitoso" || { echo "❌ Error en build"; exit 1; }

echo "✅ Setup completado. Ejecuta 'npm run dev' para iniciar."