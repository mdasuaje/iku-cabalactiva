# 🎯 CHAT SESIÓN - PROMPT 1: VERIFICACIÓN DE PRE-REQUISITOS
## AWS Re-ingeniería IKU Cábala Activa

**Fecha**: 2025-01-24  
**Hora Inicio**: $(date '+%H:%M:%S')  
**Fase**: 1/5 - Verificación de Pre-requisitos  
**Estado**: INICIANDO  

---

## 📋 CONTEXTO
Implementación AWS Re-ingeniería IKU Cábala Activa - Verificación de pre-requisitos antes de iniciar la migración completa del sistema.

## 🎯 OBJETIVO
Verificar que todos los pre-requisitos estén cumplidos antes de iniciar la implementación AWS.

## 📝 INSTRUCCIONES PARA AI-ASSISTANT-CODING

### TAREAS A EJECUTAR:
1. ✅ Verificar cuenta AWS activa y configurada
2. ✅ Validar permisos IAM necesarios  
3. ✅ Confirmar dominio verificado en SES
4. ✅ Verificar variables de entorno actuales
5. ✅ Crear backup completo del sistema actual

### CRITERIOS DE ÉXITO:
- [ ] AWS CLI configurado y funcional
- [ ] Permisos IAM creados y asignados
- [ ] SES domain verification completada
- [ ] Backup del sistema actual creado
- [ ] Variables de entorno documentadas

### COMANDO DE VALIDACIÓN:
```bash
aws sts get-caller-identity && \
aws ses get-account-sending-enabled && \
aws iam list-attached-user-policies --user-name iku-cabalactiva-service
```

### CONDICIONES DE CONTINUIDAD:
- **SI FALLA**: DETENER TODO Y REPORTAR ERROR
- **SI ÉXITO**: CONTINUAR CON PROMPT 2

---

## 📊 LOG DE EJECUCIÓN

### [$(date '+%H:%M:%S')] - INICIO DE SESIÓN
- Chat iniciado automáticamente
- Contexto cargado desde GUIA_MANUAL_DESARROLLO_AWS_REINGENIERIA.md
- Preparando verificación de pre-requisitos...

### [PENDIENTE] - VERIFICACIÓN AWS CLI
- Estado: PENDIENTE
- Comando: `aws sts get-caller-identity`
- Resultado: PENDIENTE

### [PENDIENTE] - VERIFICACIÓN SES
- Estado: PENDIENTE  
- Comando: `aws ses get-account-sending-enabled`
- Resultado: PENDIENTE

### [PENDIENTE] - VERIFICACIÓN IAM
- Estado: PENDIENTE
- Comando: `aws iam list-attached-user-policies --user-name iku-cabalactiva-service`
- Resultado: PENDIENTE

### [PENDIENTE] - BACKUP SISTEMA
- Estado: PENDIENTE
- Archivos a respaldar: ContactModal.jsx, crmService.js, .env.local
- Resultado: PENDIENTE

---

## 🚨 PLAN DE CONTINGENCIA
Si cualquier verificación falla:
1. Documentar error específico
2. Detener ejecución inmediatamente
3. No proceder con siguientes prompts
4. Reportar estado en archivo de chat

---

**NOTA**: Este archivo se actualizará automáticamente durante la ejecución y se cerrará al completar el prompt 1.