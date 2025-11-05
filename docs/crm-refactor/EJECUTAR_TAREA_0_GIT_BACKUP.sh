#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# TAREA 0: CREAR PUNTO DE SEGURIDAD EN GIT
# ═══════════════════════════════════════════════════════════════════════════
# 
# INSTRUCCIONES:
# 1. Abrir terminal WSL
# 2. cd /home/masua/iku-cabalactiva
# 3. bash docs/crm-refactor/EJECUTAR_TAREA_0_GIT_BACKUP.sh
#
# ═══════════════════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════════════════"
echo "🔒 TAREA 0: CREAR PUNTO DE SEGURIDAD EN GIT"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# 1. Verificar estado actual
echo "📋 Paso 1: Verificando estado del repositorio..."
git status
echo ""

# 2. Asegurar que estamos en main
echo "📋 Paso 2: Cambiando a rama main..."
git checkout main
echo ""

# 3. Asegurar que todo está commiteado
echo "📋 Paso 3: Verificando cambios pendientes..."
if [[ -n $(git status -s) ]]; then
  echo "⚠️  Hay cambios sin commitear. Commiteando..."
  git add .
  git commit -m "chore: backup antes de implementación de webhooks CRM"
  echo "✅ Cambios commiteados"
else
  echo "✅ No hay cambios pendientes"
fi
echo ""

# 4. Crear rama de refactor
echo "📋 Paso 4: Creando rama crm-refactor-20251105..."
git checkout -b crm-refactor-20251105
echo "✅ Rama creada"
echo ""

# 5. Crear tag de respaldo
echo "📋 Paso 5: Creando tag v1.0-pre-webhook-refactor..."
git tag v1.0-pre-webhook-refactor
echo "✅ Tag creado"
echo ""

# 6. Push de rama y tag
echo "📋 Paso 6: Subiendo rama y tag a GitHub..."
git push origin crm-refactor-20251105
git push origin v1.0-pre-webhook-refactor
echo "✅ Backup subido a GitHub"
echo ""

# 7. Verificación final
echo "═══════════════════════════════════════════════════════════════════════════"
echo "✅ TAREA 0 COMPLETADA"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Estado actual:"
echo "  - Rama actual: $(git branch --show-current)"
echo "  - Tag creado: v1.0-pre-webhook-refactor"
echo "  - Backup disponible en GitHub"
echo ""
echo "🔄 Próximo paso: TAREA 1 - Desplegar Google Apps Script"
echo ""
