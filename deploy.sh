#!/bin/bash

set -e

echo "🚀 Deploying IKU Cábala Activa to GitHub Pages..."

# Lint y build
npm run lint
npm run build

# Deploy usando gh-pages
npm run deploy

echo "✅ Deploy completado. El sitio estará disponible en https://iku-cabalactiva.com"