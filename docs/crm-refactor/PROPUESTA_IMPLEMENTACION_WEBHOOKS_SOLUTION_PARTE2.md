# PROPUESTA DE IMPLEMENTACIÓN - PARTE 2
## Continuación del Plan de Tareas

### ✅ TAREA 2: Actualizar Variables de Entorno

**Prompt para AI Assistant:**
```
Actualiza el archivo `.env.example` para incluir las nuevas variables de entorno necesarias:

CONTEXTO:
- Archivo: .env.example
- Propósito: Template de variables de entorno para el proyecto

CAMBIOS REQUERIDOS:
1. Agregar sección "Google Apps Script Webhook"
2. Agregar variable VITE_GOOGLE_APP_SCRIPT_URL
3. Agregar variable VITE_CRM_SECRET_TOKEN
4. Mantener todas las variables existentes
5. Agregar comentarios explicativos

CONTENIDO A AGREGAR:
```env
# Google Apps Script Webhook (CRM Backend)
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_CRM_SECRET_TOKEN=your_secret_token_here

# Emails (Actualizados)
VITE_EMAIL_ADMIN=maor@iku-cabalactiva.com
VITE_EMAIL_RABBI=kabbalahuniversal@gmail.com
```

VALIDACIÓN:
- ✅ Variables agregadas correctamente
- ✅ Comentarios claros
- ✅ Formato consistente
- ✅ No se eliminaron variables existentes
```

**Archivo Afectado:** `.env.example`  
**Criterio de Éxito:** Variables agregadas sin eliminar contenido existente

---

### ✅ TAREA 3: Eliminar Hardcoding en emailService.js

**Prompt para AI Assistant:**
```
Modifica el archivo `src/services/emailService.js` para eliminar la URL hardcoded:

CONTEXTO:
- Archivo: src/services/emailService.js
- Problema: URL de Google Apps Script está hardcoded
- Solución: Usar variable de entorno

CAMBIO ESPECÍFICO:
Línea 3 - ANTES:
```javascript
this.webhookUrl = 'https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec';
```

Línea 3 - DESPUÉS:
```javascript
this.webhookUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL || 
  'https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec';
```

VALIDACIÓN:
- ✅ URL ya no está hardcoded
- ✅ Fallback mantiene URL actual para compatibilidad
- ✅ No se modificó ninguna otra línea
- ✅ Sintaxis correcta
```

**Archivo Afectado:** `src/services/emailService.js`  
**Criterio de Éxito:** URL usa variable de entorno con fallback

---

### ✅ TAREA 4: Actualizar README.md

**Prompt para AI Assistant:**
```
Actualiza el archivo `README.md` con la información correcta del proyecto:

CONTEXTO:
- Archivo: README.md
- Cambios: Precios actualizados, descripción del paquete, terminología

CAMBIOS REQUERIDOS:

1. ACTUALIZAR PRECIOS (Sección "Descripción del Proyecto"):
```markdown
1. **Carta Astral Cabalística** ($97 USD)
2. **Constelación Familiar Cabalística** ($147 USD)  
3. **Limpieza Áurica Cabalística** ($247 USD)
4. **Meditación Cabalística** ($97 USD)

Las cuatro (04) herramientas cabalísticas se presentan como un paquete completo que incluye además un Bono Especial que consiste en una 'Mandala de Poder y Éxito' que contiene un Árbol Cabalístico Personalizado imprimible. Esta 'Mandala de Poder y Éxito' o Kamea tiene un Valor Individual de $597 USD, y se ofrece todo este paquete por un valor de $997 USD.
```

2. SUSTITUIR TERMINOLOGÍA:
- Buscar: "Maestro Isaac Benzaquén"
- Reemplazar: "Rabbí Isaac Benzaquén"

- Buscar: "Maestro y Rabino"
- Reemplazar: "Rabbí"

3. AGREGAR SECCIÓN DE ARQUITECTURA DE WEBHOOKS:
```markdown
### Arquitectura de Webhooks
- **Receptor**: Google Apps Script Web App
- **Procesadores**: Stripe + PayPal
- **CRM**: Google Sheets
- **Notificaciones**: Gmail API
- **Frontend**: GitHub Pages (estático)
```

VALIDACIÓN:
- ✅ Precios actualizados correctamente
- ✅ Descripción del paquete completa
- ✅ Terminología corregida en todo el documento
- ✅ Nueva sección agregada
- ✅ No se eliminó contenido existente
```

**Archivo Afectado:** `README.md`  
**Criterio de Éxito:** Documento actualizado con información correcta

---

### ✅ TAREA 5: Deprecar Webhooks de GitHub Pages

**Prompt para AI Assistant:**
```
Mueve los archivos de webhooks no funcionales a una carpeta deprecated:

CONTEXTO:
- Los webhooks en /api/webhooks/ no funcionan en GitHub Pages
- Deben preservarse para referencia histórica
- No deben eliminarse

ACCIONES:
1. Crear carpeta: `/api/webhooks/deprecated/`
2. Mover archivo: `/api/webhooks/stripe.js` → `/api/webhooks/deprecated/stripe.js`
3. Mover archivo: `/api/webhooks/paypal.js` → `/api/webhooks/deprecated/paypal.js`
4. Crear archivo: `/api/webhooks/deprecated/README.md` con explicación

CONTENIDO DE README.md:
```markdown
# Webhooks Deprecated

Estos archivos fueron movidos aquí porque GitHub Pages no soporta serverless functions.

## Archivos:
- `stripe.js` - Webhook de Stripe (NO FUNCIONAL en GitHub Pages)
- `paypal.js` - Webhook de PayPal (NO FUNCIONAL en GitHub Pages)

## Solución Implementada:
Los webhooks ahora se procesan directamente en Google Apps Script.

Ver: `/docs/crm-refactor/PROPUESTA_IMPLEMENTACION_WEBHOOKS_SOLUTION.md`

## Fecha de Deprecación:
2025-01-05
```

VALIDACIÓN:
- ✅ Carpeta deprecated creada
- ✅ Archivos movidos (no eliminados)
- ✅ README.md explicativo creado
- ✅ Estructura del proyecto limpia
```

**Archivos Afectados:** `/api/webhooks/stripe.js`, `/api/webhooks/paypal.js`  
**Criterio de Éxito:** Archivos movidos a deprecated con documentación

---

### ✅ TAREA 6: Crear Guía de Configuración de Webhooks

**Prompt para AI Assistant:**
```
Crea el archivo `GUIA_CONFIGURACION_WEBHOOKS.md` con instrucciones paso a paso:

CONTEXTO:
- Ubicación: docs/crm-refactor/
- Propósito: Guía completa para configurar webhooks en Stripe y PayPal
- Audiencia: Mauro Asuaje (maor@iku-cabalactiva.com)

CONTENIDO REQUERIDO:

# 🔧 GUÍA DE CONFIGURACIÓN DE WEBHOOKS
## IKU Cábala Activa

## 1. Desplegar Google Apps Script

### Paso 1.1: Abrir Google Apps Script
1. Ir a: https://script.google.com
2. Iniciar sesión con: maor@iku-cabalactiva.com
3. Abrir proyecto existente o crear nuevo

### Paso 1.2: Copiar Código
1. Abrir archivo: `docs/crm-refactor/google-apps-script-webhook-handler.js`
2. Copiar TODO el contenido
3. Pegar en el editor de Google Apps Script

### Paso 1.3: Configurar Variables
1. Actualizar SPREADSHEET_ID con el ID de tu Google Sheet
2. Actualizar EMAIL_ADMIN: maor@iku-cabalactiva.com
3. Actualizar EMAIL_RABBI: kabbalahuniversal@gmail.com

### Paso 1.4: Desplegar como Web App
1. Click en "Deploy" → "New deployment"
2. Tipo: "Web app"
3. Execute as: "Me (maor@iku-cabalactiva.com)"
4. Who has access: "Anyone"
5. Click "Deploy"
6. COPIAR la URL generada (será algo como: https://script.google.com/macros/s/AKfycby.../exec)

## 2. Configurar Webhook en Stripe

### Paso 2.1: Acceder a Stripe Dashboard
1. Ir a: https://dashboard.stripe.com
2. Iniciar sesión
3. Ir a: Developers → Webhooks

### Paso 2.2: Agregar Endpoint
1. Click "Add endpoint"
2. Endpoint URL: PEGAR la URL de Google Apps Script
3. Description: "IKU Cabala Activa - CRM Webhook"
4. Events to send:
   - ✅ checkout.session.completed
   - ✅ payment_intent.succeeded
   - ✅ payment_intent.payment_failed
5. Click "Add endpoint"

### Paso 2.3: Obtener Signing Secret
1. Click en el endpoint recién creado
2. Copiar "Signing secret" (empieza con whsec_...)
3. Guardar en lugar seguro

## 3. Configurar Webhook en PayPal

### Paso 3.1: Acceder a PayPal Developer
1. Ir a: https://developer.paypal.com
2. Iniciar sesión
3. Ir a: Dashboard → My Apps & Credentials

### Paso 3.2: Configurar Webhooks
1. Seleccionar tu app o crear una nueva
2. Ir a sección "Webhooks"
3. Click "Add Webhook"
4. Webhook URL: PEGAR la URL de Google Apps Script
5. Event types:
   - ✅ Payment capture completed
   - ✅ Payment capture denied
6. Click "Save"

## 4. Actualizar Variables de Entorno

### Paso 4.1: Crear archivo .env.local
1. Copiar `.env.example` → `.env.local`
2. Actualizar:
```env
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec
VITE_CRM_SECRET_TOKEN=genera_un_token_secreto_aleatorio
```

### Paso 4.2: Actualizar .env.production
1. Actualizar las mismas variables en `.env.production`
2. NO commitear este archivo a Git

## 5. Testing

Ver: `TESTING_WEBHOOKS.md`

VALIDACIÓN:
- ✅ Guía completa y detallada
- ✅ Pasos numerados claramente
- ✅ Screenshots o descripciones visuales
- ✅ Información de contacto correcta
```

**Archivo de Salida:** `docs/crm-refactor/GUIA_CONFIGURACION_WEBHOOKS.md`  
**Criterio de Éxito:** Guía completa y fácil de seguir

---

### ✅ TAREA 7: Crear Guía de Testing

**Prompt para AI Assistant:**
```
Crea el archivo `TESTING_WEBHOOKS.md` con procedimientos de testing:

CONTEXTO:
- Ubicación: docs/crm-refactor/
- Propósito: Validar que los webhooks funcionan correctamente
- Incluir: Tests manuales y automatizados

CONTENIDO REQUERIDO:

# 🧪 TESTING DE WEBHOOKS
## IKU Cábala Activa

## 1. Test Manual con Stripe

### 1.1 Usar Stripe Test Mode
1. Ir a: https://dashboard.stripe.com
2. Activar "Test mode" (toggle en la esquina superior derecha)
3. Ir a: Developers → Webhooks
4. Verificar que el endpoint esté configurado

### 1.2 Realizar Pago de Prueba
1. Ir a: https://iku-cabalactiva.com
2. Seleccionar producto: "Carta Astral Cabalística"
3. Click en "Comprar Ahora"
4. Usar tarjeta de prueba: 4242 4242 4242 4242
5. Fecha: Cualquier fecha futura
6. CVC: Cualquier 3 dígitos
7. Completar pago

### 1.3 Verificar Resultados
✅ Webhook recibido en Google Apps Script (ver Logs)
✅ Cliente registrado en Google Sheets hoja "Clientes"
✅ Compra registrada en Google Sheets hoja "Compras"
✅ Email recibido en maor@iku-cabalactiva.com
✅ Email recibido en kabbalahuniversal@gmail.com

## 2. Test Manual con PayPal

### 2.1 Usar PayPal Sandbox
1. Ir a: https://developer.paypal.com
2. Usar cuenta de sandbox
3. Verificar webhook configurado

### 2.2 Realizar Pago de Prueba
1. Ir a: https://iku-cabalactiva.com
2. Seleccionar producto
3. Elegir PayPal como método de pago
4. Usar credenciales de sandbox
5. Completar pago

### 2.3 Verificar Resultados
✅ Webhook recibido en Google Apps Script
✅ Datos registrados en Google Sheets
✅ Emails enviados correctamente

## 3. Test de Logs en Google Apps Script

### 3.1 Ver Logs de Ejecución
1. Abrir Google Apps Script
2. Ir a: Executions (icono de reloj)
3. Ver últimas ejecuciones
4. Verificar que no haya errores

### 3.2 Logs Esperados
```
✅ Webhook recibido: Stripe
✅ Evento: checkout.session.completed
✅ Cliente registrado: ID_CLIENTE
✅ Compra registrada: ID_COMPRA
✅ Email enviado a: maor@iku-cabalactiva.com
✅ Email enviado a: kabbalahuniversal@gmail.com
✅ Respuesta HTTP 200 enviada
```

## 4. Test de Errores

### 4.1 Simular Webhook Inválido
1. Usar herramienta: https://webhook.site
2. Enviar POST con JSON inválido
3. Verificar que retorna HTTP 400

### 4.2 Simular Fallo de Google Sheets
1. Cambiar SPREADSHEET_ID a uno inválido
2. Enviar webhook
3. Verificar que retorna HTTP 500
4. Verificar log de error

## 5. Checklist de Validación Final

Antes de pasar a producción, verificar:

- [ ] Webhooks configurados en Stripe (Production mode)
- [ ] Webhooks configurados en PayPal (Live mode)
- [ ] Google Apps Script desplegado correctamente
- [ ] Variables de entorno actualizadas
- [ ] Test de pago real completado exitosamente
- [ ] Emails recibidos correctamente
- [ ] Datos en Google Sheets correctos
- [ ] Logs sin errores
- [ ] Documentación actualizada

## 6. Troubleshooting

### Problema: Webhook no se recibe
**Solución:**
1. Verificar URL del webhook en Stripe/PayPal
2. Verificar que Google Apps Script esté desplegado como "Anyone"
3. Ver logs de Google Apps Script

### Problema: Email no se envía
**Solución:**
1. Verificar cuota de Gmail API
2. Verificar direcciones de email
3. Ver logs de errores

### Problema: Datos no se registran en Sheets
**Solución:**
1. Verificar SPREADSHEET_ID
2. Verificar permisos de la hoja
3. Verificar nombres de las hojas

VALIDACIÓN:
- ✅ Procedimientos de testing completos
- ✅ Casos de éxito y error cubiertos
- ✅ Checklist de validación incluido
- ✅ Troubleshooting incluido
```

**Archivo de Salida:** `docs/crm-refactor/TESTING_WEBHOOKS.md`  
**Criterio de Éxito:** Guía de testing completa y ejecutable

---

### ✅ TAREA 8: Crear Plan de Rollback

**Prompt para AI Assistant:**
```
Crea el archivo `ROLLBACK_PLAN.md` con procedimientos de contingencia:

CONTEXTO:
- Ubicación: docs/crm-refactor/
- Propósito: Plan de rollback en caso de problemas
- Garantizar: Cero downtime del sitio

CONTENIDO REQUERIDO:

# 🔄 PLAN DE ROLLBACK Y CONTINGENCIA
## IKU Cábala Activa

## 1. Escenarios de Rollback

### Escenario A: Webhooks no funcionan después de implementación
**Impacto:** Pagos no se registran automáticamente
**Severidad:** 🟡 MEDIA (sitio sigue funcionando, proceso manual requerido)

**Rollback:**
1. Desactivar webhooks en Stripe y PayPal
2. Volver a proceso manual de registro
3. Investigar logs de Google Apps Script
4. Corregir y re-desplegar

### Escenario B: Google Apps Script falla
**Impacto:** CRM no funciona
**Severidad:** 🟡 MEDIA

**Rollback:**
1. Restaurar versión anterior de Google Apps Script
2. Usar fallback local en crmService.js
3. Registrar manualmente en Google Sheets

### Escenario C: Sitio web no carga
**Impacto:** Sitio completamente caído
**Severidad:** 🔴 CRÍTICA

**Rollback:**
1. Revertir a rama main:
```bash
git checkout main
git push origin main --force
```
2. GitHub Pages se actualizará automáticamente
3. Sitio restaurado en 2-3 minutos

## 2. Procedimiento de Rollback Git

### Paso 1: Identificar Commit Anterior
```bash
git log --oneline
# Identificar el commit antes de los cambios
```

### Paso 2: Revertir Cambios
```bash
git checkout main
git revert HEAD~1  # O el commit específico
git push origin main
```

### Paso 3: Verificar Restauración
1. Visitar: https://iku-cabalactiva.com
2. Verificar que el sitio carga correctamente
3. Verificar funcionalidades básicas

## 3. Backup de Datos

### Google Sheets (CRM)
**Frecuencia:** Diario (automático por Google)
**Restauración:**
1. Ir a: Google Sheets → File → Version history
2. Seleccionar versión anterior
3. Restaurar

### Código Fuente
**Backup:** Git + GitHub
**Tag de respaldo:** `v1.0-pre-webhook-refactor`
**Restauración:**
```bash
git checkout v1.0-pre-webhook-refactor
git checkout -b rollback-branch
git push origin rollback-branch
```

## 4. Contactos de Emergencia

**Desarrollador:**
- Nombre: Mauro Asuaje
- Email: maor@iku-cabalactiva.com

**Cliente:**
- Nombre: Rabbí Isaac Benzaquén
- Email: kabbalahuniversal@gmail.com

**Soporte Técnico:**
- GitHub Support: https://support.github.com
- Google Workspace Support: https://support.google.com

## 5. Checklist de Contingencia

En caso de problema crítico:

- [ ] Identificar el problema específico
- [ ] Evaluar severidad (Baja/Media/Alta/Crítica)
- [ ] Decidir: ¿Rollback o Fix Forward?
- [ ] Ejecutar procedimiento correspondiente
- [ ] Verificar restauración
- [ ] Notificar a stakeholders
- [ ] Documentar incidente
- [ ] Planear corrección definitiva

## 6. Monitoreo Post-Implementación

### Primeras 24 horas:
- Verificar logs cada 2 horas
- Monitorear emails de notificación
- Revisar Google Sheets para nuevos registros

### Primera semana:
- Verificar logs diariamente
- Revisar métricas de conversión
- Validar que todos los pagos se registran

### Primer mes:
- Análisis de estabilidad
- Optimizaciones si es necesario
- Documentación de lecciones aprendidas

VALIDACIÓN:
- ✅ Escenarios de rollback definidos
- ✅ Procedimientos claros
- ✅ Contactos de emergencia
- ✅ Checklist de contingencia
```

**Archivo de Salida:** `docs/crm-refactor/ROLLBACK_PLAN.md`  
**Criterio de Éxito:** Plan de contingencia completo y ejecutable

---

## 6. VALIDACIÓN Y TESTING

### 6.1 Criterios de Aceptación

**Funcionalidad:**
- ✅ Webhooks de Stripe reciben eventos correctamente
- ✅ Webhooks de PayPal reciben eventos correctamente
- ✅ Clientes se registran automáticamente en Google Sheets
- ✅ Compras se registran automáticamente en Google Sheets
- ✅ Emails se envían a maor@iku-cabalactiva.com
- ✅ Emails se envían a kabbalahuniversal@gmail.com
- ✅ Sitio web sigue funcionando sin cambios visibles

**Seguridad:**
- ✅ Webhooks validan origen del request
- ✅ Variables sensibles en .env (no en código)
- ✅ Logs no exponen información sensible

**Performance:**
- ✅ Webhooks responden en < 5 segundos
- ✅ Sitio web carga en < 3 segundos
- ✅ No hay regresiones de performance

**Integridad:**
- ✅ Ningún archivo del sitio web fue eliminado
- ✅ Todas las funcionalidades existentes siguen funcionando
- ✅ Componentes de UI sin cambios
- ✅ Estilos sin cambios

### 6.2 Tests Requeridos

**Test 1: Pago con Stripe (Test Mode)**
- Producto: Carta Astral Cabalística ($97)
- Tarjeta: 4242 4242 4242 4242
- Resultado esperado: Cliente y compra registrados, emails enviados

**Test 2: Pago con PayPal (Sandbox)**
- Producto: Paquete Completo ($997)
- Cuenta: Sandbox
- Resultado esperado: Cliente y compra registrados, emails enviados

**Test 3: Webhook Inválido**
- Enviar JSON malformado
- Resultado esperado: HTTP 400, log de error

**Test 4: Sitio Web**
- Navegar por todas las páginas
- Resultado esperado: Todo funciona como antes

---

## 7. ROLLBACK Y CONTINGENCIA

### 7.1 Estrategia de Rollback

**Nivel 1: Rollback de Webhooks**
- Desactivar webhooks en Stripe/PayPal
- Volver a proceso manual
- Tiempo: 5 minutos

**Nivel 2: Rollback de Código**
- Revertir a rama main
- Tiempo: 10 minutos

**Nivel 3: Rollback Completo**
- Restaurar desde tag `v1.0-pre-webhook-refactor`
- Tiempo: 15 minutos

### 7.2 Backup de Seguridad

**Git:**
- Rama: `crm-refactor-20251105`
- Tag: `v1.0-pre-webhook-refactor`
- Remoto: GitHub

**Google Sheets:**
- Backup automático por Google
- Version history disponible

**Google Apps Script:**
- Versiones anteriores disponibles en el editor

---

## 8. CONCLUSIÓN

### 8.1 Resumen de la Solución

**Problema:**
GitHub Pages no puede ejecutar webhooks de Stripe/PayPal porque solo sirve archivos estáticos.

**Solución:**
Usar Google Apps Script como receptor de webhooks, aprovechando la infraestructura existente de CRM.

**Ventajas:**
- ✅ 100% Gratuito
- ✅ Cero migración de hosting
- ✅ Aprovecha infraestructura existente
- ✅ Mínimos cambios en el código
- ✅ Preserva integridad del sitio

**Riesgos:**
- 🟡 Dependencia de Google Apps Script (mitigado: Free Tier generoso)
- 🟡 Cuotas de Gmail API (mitigado: Límites suficientes para el volumen esperado)

### 8.2 Próximos Pasos

1. ✅ Crear rama de seguridad (TAREA 0)
2. ✅ Implementar Google Apps Script (TAREA 1)
3. ✅ Actualizar variables de entorno (TAREA 2-3)
4. ✅ Actualizar documentación (TAREA 4)
5. ✅ Deprecar archivos obsoletos (TAREA 5)
6. ✅ Crear guías (TAREA 6-8)
7. 🔄 Testing exhaustivo
8. 🔄 Deploy a producción
9. 🔄 Monitoreo post-implementación

### 8.3 Tiempo Estimado

**Implementación:** 3-4 horas  
**Testing:** 1-2 horas  
**Documentación:** 1 hora  
**Total:** 5-7 horas

### 8.4 Costo Total

**$0 USD** - Solución 100% gratuita usando Free Tier de Google

---

## 📞 CONTACTO Y SOPORTE

**Desarrollador:**
- Mauro Asuaje
- maor@iku-cabalactiva.com

**Cliente:**
- Rabbí Isaac Benzaquén
- kabbalahuniversal@gmail.com

**Repositorio:**
- github.com/mdasuaje/iku-cabalactiva

**Documentación:**
- `/docs/crm-refactor/`

---

**Fin del Documento**

*Generado el: 2025-01-05*  
*Versión: 1.0*  
*Estado: LISTO PARA IMPLEMENTACIÓN*
