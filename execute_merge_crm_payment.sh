#!/bin/bash

# Script para ejecutar el Plan de Merge CRM Payment Gateway
echo "🚀 Iniciando Plan de Merge CRM Payment Gateway - ID: 202510141523917"

# FASE 1: Preparación Pre-PR
echo "📋 FASE 1: Preparación Pre-PR"
git checkout crm-payment-gateway-implementation
git pull origin main
npm run test
npm run test-crm
npm run build

# FASE 2: Creación y Revisión del Pull Request
echo "📋 FASE 2: Creación y Revisión del Pull Request"
gh pr create --base main --head crm-payment-gateway-implementation \
  --title "🔄 Integración CRM Payment Gateway" \
  --body "Implementa integración completa del gateway de pagos con el CRM.

## 🎯 Cambios principales
- Integración con PayPal y Stripe
- Sistema de webhooks para procesamiento de pagos
- Mejoras en el sistema de diagnóstico
- Tests automatizados para flujo completo

## 📋 Checklist
- [x] Tests pasando
- [x] Build exitoso
- [x] Documentación actualizada
- [x] Revisión de seguridad completada"

echo "✅ Pull Request creado. Por favor revise el PR en GitHub"
echo "⏳ Una vez revisado y aprobado, ejecute la siguiente fase:"
echo "bash execute_merge_crm_payment_phase2.sh"