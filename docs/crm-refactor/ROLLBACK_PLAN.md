# 🔄 PLAN DE ROLLBACK Y CONTINGENCIA
## IKU Cábala Activa

---

## 1. Escenarios de Rollback

### Escenario A: Webhooks no funcionan después de implementación
**Impacto**: Pagos no se registran automáticamente  
**Severidad**: 🟡 MEDIA (sitio sigue funcionando, proceso manual requerido)

**Síntomas**:
- Webhooks retornan error 500
- No se registran datos en Google Sheets
- No se envían emails de notificación

**Rollback**:
1. Desactivar webhooks en Stripe y PayPal temporalmente
2. Volver a proceso manual de registro:
   - Revisar pagos en Stripe/PayPal Dashboard
   - Registrar manualmente en Google Sheets
   - Enviar emails manualmente
3. Investigar logs de Google Apps Script para identificar el problema
4. Corregir el error
5. Re-desplegar Google Apps Script
6. Reactivar webhooks

**Tiempo estimado**: 30 minutos

---

### Escenario B: Google Apps Script falla
**Impacto**: CRM no funciona  
**Severidad**: 🟡 MEDIA

**Síntomas**:
- Todos los webhooks fallan
- Errores en logs de Google Apps Script
- No se puede acceder al script

**Rollback**:
1. Ir a Google Apps Script → Deploy → Manage deployments
2. Restaurar versión anterior del deployment
3. O crear nuevo deployment con código anterior
4. Actualizar URL del webhook en Stripe/PayPal si cambió
5. Usar fallback local en `crmService.js` mientras se corrige

**Código de fallback** (ya implementado en crmService.js):
```javascript
// Fallback para desarrollo local
if (import.meta.env.DEV) {
  console.log('Modo desarrollo: datos guardados localmente');
  return { success: true, clienteId: 'local-' + Date.now() };
}
```

**Tiempo estimado**: 15 minutos

---

### Escenario C: Sitio web no carga
**Impacto**: Sitio completamente caído  
**Severidad**: 🔴 CRÍTICA

**Síntomas**:
- https://iku-cabalactiva.com no responde
- Error 404 o 500
- GitHub Pages muestra error

**Rollback Inmediato**:
```bash
# Opción 1: Revertir a main
cd /home/masua/iku-cabalactiva
git checkout main
git push origin main --force

# Opción 2: Revertir a tag de respaldo
git checkout v1.0-pre-webhook-refactor
git checkout -b emergency-rollback
git push origin emergency-rollback
# Luego en GitHub: cambiar rama de deployment a emergency-rollback
```

**Tiempo estimado**: 5 minutos (GitHub Pages se actualiza en 2-3 minutos)

---

### Escenario D: Variables de entorno incorrectas
**Impacto**: Funcionalidades parcialmente rotas  
**Severidad**: 🟡 MEDIA

**Síntomas**:
- Algunos componentes no funcionan
- Errores en consola del navegador
- URLs incorrectas

**Rollback**:
1. Verificar `.env.production`:
   ```bash
   cat .env.production
   ```
2. Comparar con `.env.example`
3. Corregir variables incorrectas
4. Rebuild y redeploy:
   ```bash
   npm run build
   git add dist/
   git commit -m "fix: corregir variables de entorno"
   git push
   ```

**Tiempo estimado**: 10 minutos

---

## 2. Procedimiento de Rollback Git

### Paso 1: Identificar Commit Anterior
```bash
cd /home/masua/iku-cabalactiva
git log --oneline --graph --all -10
```

Buscar el commit antes de los cambios problemáticos.

### Paso 2: Opción A - Revert (Recomendado)
Crea un nuevo commit que deshace los cambios:
```bash
git checkout main
git revert HEAD~1  # O el commit específico
git push origin main
```

**Ventajas**:
- Mantiene historial completo
- Seguro y reversible
- No requiere force push

### Paso 3: Opción B - Reset (Solo en emergencias)
Elimina commits del historial:
```bash
git checkout main
git reset --hard v1.0-pre-webhook-refactor
git push origin main --force
```

**⚠️ ADVERTENCIA**: Solo usar en emergencias críticas.

### Paso 4: Verificar Restauración
1. Visitar: https://iku-cabalactiva.com
2. Esperar 2-3 minutos para que GitHub Pages se actualice
3. Verificar que el sitio carga correctamente
4. Probar funcionalidades básicas:
   - Navegación
   - Formularios
   - Links de pago

---

## 3. Backup de Datos

### Google Sheets (CRM)
**Frecuencia**: Automático por Google (cada cambio)  
**Retención**: 30 días de historial de versiones

**Restauración**:
1. Abrir Google Sheet
2. File → Version history → See version history
3. Seleccionar versión anterior
4. Click "Restore this version"

**Backup manual** (recomendado antes de cambios grandes):
1. File → Download → Microsoft Excel (.xlsx)
2. Guardar con nombre: `CRM_Backup_YYYY-MM-DD.xlsx`

---

### Código Fuente
**Backup**: Git + GitHub  
**Tag de respaldo**: `v1.0-pre-webhook-refactor`  
**Rama de respaldo**: `crm-refactor-20251105`

**Restauración**:
```bash
# Desde tag
git checkout v1.0-pre-webhook-refactor
git checkout -b rollback-branch
git push origin rollback-branch

# Desde rama
git checkout crm-refactor-20251105
git checkout -b rollback-from-branch
git push origin rollback-from-branch
```

---

### Google Apps Script
**Backup**: Versiones automáticas en Google Apps Script

**Restauración**:
1. Abrir Google Apps Script
2. File → Version history
3. Seleccionar versión anterior
4. Click "Restore"

**Backup manual**:
1. Copiar todo el código
2. Guardar en archivo local: `google-apps-script-backup-YYYY-MM-DD.js`

---

## 4. Contactos de Emergencia

### Equipo Técnico
**Desarrollador Principal:**
- Nombre: Mauro Asuaje
- Email: maor@iku-cabalactiva.com
- Rol: Implementación y soporte técnico

**Cliente:**
- Nombre: Rabbí Isaac Benzaquén
- Email: kabbalahuniversal@gmail.com
- Rol: Stakeholder principal

### Soporte Externo
**GitHub Support:**
- URL: https://support.github.com
- Para: Problemas con GitHub Pages

**Google Workspace Support:**
- URL: https://support.google.com
- Para: Problemas con Google Apps Script, Sheets, Gmail API

**Stripe Support:**
- URL: https://support.stripe.com
- Para: Problemas con webhooks de Stripe

**PayPal Developer Support:**
- URL: https://developer.paypal.com/support
- Para: Problemas con webhooks de PayPal

---

## 5. Checklist de Contingencia

En caso de problema crítico, seguir este checklist:

### Fase 1: Evaluación (5 minutos)
- [ ] Identificar el problema específico
- [ ] Evaluar severidad:
  - 🟢 **Baja**: Problema cosmético, no afecta funcionalidad
  - 🟡 **Media**: Funcionalidad parcialmente afectada
  - 🟠 **Alta**: Funcionalidad crítica afectada
  - 🔴 **Crítica**: Sitio completamente caído
- [ ] Determinar impacto en usuarios
- [ ] Verificar si hay pagos en proceso

### Fase 2: Decisión (2 minutos)
- [ ] ¿Es un problema menor que se puede corregir rápido? → Fix Forward
- [ ] ¿Es un problema crítico que requiere rollback? → Ejecutar Rollback
- [ ] ¿Afecta solo a webhooks? → Desactivar webhooks temporalmente
- [ ] ¿Afecta al sitio completo? → Rollback inmediato a main

### Fase 3: Ejecución (10-30 minutos)
- [ ] Ejecutar procedimiento correspondiente (ver Escenarios arriba)
- [ ] Documentar acciones tomadas
- [ ] Monitorear restauración

### Fase 4: Verificación (10 minutos)
- [ ] Verificar que el sitio carga correctamente
- [ ] Probar funcionalidades críticas:
  - [ ] Navegación
  - [ ] Formularios de contacto
  - [ ] Links de pago (Stripe y PayPal)
  - [ ] WhatsApp integration
- [ ] Verificar logs (sin errores)
- [ ] Verificar métricas (tráfico normal)

### Fase 5: Comunicación (5 minutos)
- [ ] Notificar a Rabbí Isaac Benzaquén del problema y resolución
- [ ] Documentar incidente en `/docs/crm-refactor/INCIDENTES.md`
- [ ] Actualizar documentación si es necesario

### Fase 6: Post-Mortem (1 hora)
- [ ] Analizar causa raíz del problema
- [ ] Documentar lecciones aprendidas
- [ ] Planear corrección definitiva
- [ ] Implementar medidas preventivas

---

## 6. Monitoreo Post-Implementación

### Primeras 24 horas (Crítico)
**Frecuencia**: Cada 2 horas

**Verificar**:
- [ ] Logs de Google Apps Script (sin errores)
- [ ] Webhooks de Stripe (deliveries exitosos)
- [ ] Webhooks de PayPal (deliveries exitosos)
- [ ] Emails de notificación recibidos
- [ ] Registros en Google Sheets correctos
- [ ] Sitio web cargando correctamente
- [ ] No hay errores en consola del navegador

**Herramientas**:
- Google Apps Script Executions
- Stripe Dashboard → Webhooks
- PayPal Dashboard → Webhooks
- Google Sheets
- Browser DevTools Console

---

### Primera semana (Alta prioridad)
**Frecuencia**: Diaria

**Verificar**:
- [ ] Logs diarios sin errores críticos
- [ ] Métricas de conversión normales
- [ ] Todos los pagos se registran correctamente
- [ ] Emails se envían sin problemas
- [ ] No hay quejas de clientes

**Métricas clave**:
- Tasa de éxito de webhooks: > 99%
- Tiempo de procesamiento: < 5 segundos
- Emails entregados: 100%

---

### Primer mes (Monitoreo continuo)
**Frecuencia**: Semanal

**Actividades**:
- [ ] Análisis de estabilidad del sistema
- [ ] Revisión de logs para patrones de error
- [ ] Optimizaciones si es necesario
- [ ] Documentación de lecciones aprendidas
- [ ] Actualización de procedimientos

---

## 7. Procedimientos de Emergencia

### Emergencia 1: Sitio Caído (Downtime)
**Tiempo máximo de respuesta**: 15 minutos

**Procedimiento**:
1. Verificar status de GitHub Pages: https://www.githubstatus.com
2. Si GitHub está operativo:
   ```bash
   git checkout main
   git push origin main --force
   ```
3. Si GitHub está caído: Esperar a que se restaure
4. Notificar a stakeholders

---

### Emergencia 2: Pérdida de Datos en Google Sheets
**Tiempo máximo de respuesta**: 30 minutos

**Procedimiento**:
1. No entrar en pánico
2. Ir a Google Sheets → File → Version history
3. Restaurar última versión buena conocida
4. Si no hay versión disponible:
   - Restaurar desde backup manual (.xlsx)
   - Contactar a Google Workspace Support
5. Verificar integridad de datos restaurados

---

### Emergencia 3: Cuota de Gmail API Agotada
**Tiempo máximo de respuesta**: Inmediato

**Procedimiento**:
1. Verificar cuota en: https://console.cloud.google.com/apis/api/gmail.googleapis.com/quotas
2. Si está agotada:
   - Esperar 24 horas para reset automático
   - O solicitar aumento de cuota (puede tomar días)
3. Mientras tanto:
   - Enviar emails manualmente
   - Considerar servicio alternativo (SendGrid, Mailgun)

---

### Emergencia 4: Webhooks Comprometidos (Seguridad)
**Tiempo máximo de respuesta**: Inmediato

**Procedimiento**:
1. Desactivar webhooks inmediatamente en Stripe y PayPal
2. Cambiar VITE_CRM_SECRET_TOKEN:
   ```bash
   openssl rand -hex 32
   ```
3. Actualizar en `.env.production`
4. Redesplegar Google Apps Script con nuevo token
5. Reactivar webhooks con nueva URL
6. Auditar logs para actividad sospechosa
7. Notificar a Stripe/PayPal si es necesario

---

## 8. Matriz de Decisión Rápida

| Problema | Severidad | Acción Inmediata | Tiempo |
|----------|-----------|------------------|--------|
| Sitio caído | 🔴 Crítica | Rollback a main | 5 min |
| Webhooks fallan | 🟡 Media | Desactivar webhooks | 2 min |
| Google Apps Script error | 🟡 Media | Restaurar versión anterior | 15 min |
| Emails no se envían | 🟡 Media | Verificar cuota Gmail API | 10 min |
| Datos incorrectos en Sheets | 🟠 Alta | Restaurar versión de Sheet | 10 min |
| Variables de entorno incorrectas | 🟡 Media | Corregir y rebuild | 10 min |
| Error cosmético en UI | 🟢 Baja | Fix forward cuando sea posible | N/A |

---

## 9. Lecciones Aprendidas (Template)

Después de cada incidente, documentar:

```markdown
## Incidente: [Título]
**Fecha**: YYYY-MM-DD  
**Severidad**: [Baja/Media/Alta/Crítica]  
**Duración**: [X minutos/horas]

### Descripción
[Qué pasó]

### Causa Raíz
[Por qué pasó]

### Impacto
[A quién afectó y cómo]

### Resolución
[Cómo se resolvió]

### Acciones Preventivas
[Qué hacer para evitar que vuelva a pasar]

### Documentación Actualizada
[Qué documentos se actualizaron]
```

---

## 10. Recursos Adicionales

### Documentación
- **Propuesta completa**: `/docs/crm-refactor/PROPUESTA_IMPLEMENTACION_WEBHOOKS_SOLUTION.md`
- **Guía de configuración**: `/docs/crm-refactor/GUIA_CONFIGURACION_WEBHOOKS.md`
- **Guía de testing**: `/docs/crm-refactor/TESTING_WEBHOOKS.md`

### Scripts de Utilidad
```bash
# Verificar estado del sitio
curl -I https://iku-cabalactiva.com

# Ver últimos commits
git log --oneline -10

# Ver ramas disponibles
git branch -a

# Ver tags disponibles
git tag -l

# Verificar variables de entorno
cat .env.production | grep VITE_
```

---

## 11. Contacto y Soporte

**Desarrollador:**
- Mauro Asuaje
- maor@iku-cabalactiva.com

**Cliente:**
- Rabbí Isaac Benzaquén
- kabbalahuniversal@gmail.com

**Repositorio:**
- github.com/mdasuaje/iku-cabalactiva

---

**Última actualización**: 2025-01-05  
**Versión**: 1.0  
**Estado**: ACTIVO
