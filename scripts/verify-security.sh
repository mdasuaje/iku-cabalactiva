#!/bin/bash

# 🔍 Security Verification Script
# Verifies security fixes in remote repository

echo "🔍 Verificando actualizaciones de seguridad..."

# Check remote repository status
echo "📡 Estado del repositorio remoto:"
git ls-remote --heads origin

echo ""
echo "🔒 Verificando archivos sensibles en remoto:"

# Check if .env.local exists in remote
if git ls-tree -r --name-only origin/main | grep -q "\.env\.local"; then
    echo "❌ CRÍTICO: .env.local aún existe en remoto"
else
    echo "✅ .env.local removido del remoto"
fi

# Check .gitignore in remote
echo ""
echo "📋 Verificando .gitignore en remoto:"
git show origin/main:.gitignore | head -10

echo ""
echo "🔐 Verificando .env.example en remoto:"
git show origin/main:.env.example | head -5

echo ""
echo "📊 Últimos commits de seguridad:"
git log --oneline -5 origin/main | grep -i "security\|fix\|🔒"

echo ""
echo "🌐 Verificar manualmente en GitHub:"
echo "https://github.com/mdasuaje/iku-cabalactiva/blob/main/.env.local"
echo "^ Este enlace debe mostrar 404 si se removió correctamente"

echo ""
echo "✅ Verificación completa"