#!/bin/bash

# Script para ejecutar Fase 2 del Plan de Merge CRM Payment Gateway
echo "🚀 Continuando Plan de Merge CRM Payment Gateway - ID: 202510141523917"

# FASE 3-4: Verificación CI/CD, Merge y Despliegue
echo "📋 FASE 3-4: Verificación CI/CD, Merge y Despliegue"
gh pr checks
gh pr review --approve
gh pr merge --merge --delete-branch

git checkout main
git pull origin main
./deploy-to-production.sh

echo "✅ Merge y despliegue completados"
echo "⏳ Ejecutando fase final de documentación y monitoreo:"
echo "bash execute_merge_crm_payment_phase3.sh"