# 🧪 TESTING DE WEBHOOKS
## IKU Cábala Activa

---

## 1. Test Manual con Stripe

### 1.1 Usar Stripe Test Mode
1. Ir a: https://dashboard.stripe.com
2. Activar "**Test mode**" (toggle en la esquina superior derecha)
3. Ir a: **Developers** → **Webhooks**
4. Verificar que el endpoint esté configurado

### 1.2 Realizar Pago de Prueba
1. Ir a: https://iku-cabalactiva.com
2. Seleccionar producto: "Carta Astral Cabalística"
3. Click en "**Comprar Ahora**"
4. En el checkout de Stripe, usar tarjeta de prueba:
   - **Número**: `4242 4242 4242 4242`
   - **Fecha**: Cualquier fecha futura (ej: 12/25)
   - **CVC**: Cualquier 3 dígitos (ej: 123)
   - **Nombre**: Tu nombre
   - **Email**: Tu email de prueba
5. Completar pago

### 1.3 Verificar Resultados
Después de completar el pago, verificar:

✅ **Google Apps Script Logs**
1. Ir a: https://script.google.com
2. Abrir proyecto "IKU Cabala Activa - Webhook Handler"
3. Click en "Executions" (icono de reloj ⏱️)
4. Ver última ejecución
5. Verificar logs:
   ```
   ✅ Webhook recibido: Stripe
   ✅ Evento: checkout.session.completed
   ✅ Cliente registrado: [ID]
   ✅ Compra registrada: [ID]
   ✅ Email enviado a: maor@iku-cabalactiva.com
   ✅ Email enviado a: kabbalahuniversal@gmail.com
   ```

✅ **Google Sheets**
1. Abrir Google Sheet del CRM
2. Verificar hoja "**Clientes**": Nuevo registro con datos del cliente
3. Verificar hoja "**Compras**": Nuevo registro con datos de la compra
4. Verificar hoja "**Sesiones**": Nueva sesión programada (si aplica)

✅ **Emails**
1. Revisar inbox de `maor@iku-cabalactiva.com`
2. Debe haber email: "🎉 Nueva Compra en IKU Cábala Activa"
3. Revisar inbox de `kabbalahuniversal@gmail.com`
4. Debe haber email: "📅 Nueva Sesión Programada - IKU Cábala Activa"

✅ **Stripe Dashboard**
1. Ir a: Developers → Webhooks → Tu endpoint
2. Ver "Recent deliveries"
3. Verificar que el último webhook tenga status "Succeeded" (200)

---

## 2. Test Manual con PayPal

### 2.1 Usar PayPal Sandbox
1. Ir a: https://developer.paypal.com
2. Asegurarse de estar en modo "**Sandbox**"
3. Ir a: Dashboard → Sandbox → Accounts
4. Usar credenciales de cuenta de prueba

### 2.2 Realizar Pago de Prueba
1. Ir a: https://iku-cabalactiva.com
2. Seleccionar producto: "Constelación Familiar Cabalística"
3. Click en "**Comprar con PayPal**"
4. Iniciar sesión con cuenta de sandbox
5. Completar pago

### 2.3 Verificar Resultados
Verificar los mismos puntos que en el test de Stripe:
- ✅ Logs de Google Apps Script
- ✅ Registros en Google Sheets
- ✅ Emails recibidos
- ✅ PayPal webhook delivery status

---

## 3. Test Automatizado con Google Apps Script

### 3.1 Test de Stripe
1. Ir a: https://script.google.com
2. Abrir proyecto "IKU Cabala Activa - Webhook Handler"
3. Seleccionar función: `testStripeWebhook`
4. Click "**Run**"
5. Autorizar permisos si se solicita
6. Ver logs (View → Logs o Ctrl+Enter)

**Resultado esperado:**
```
═══════════════════════════════════════════════════════════
🔔 WEBHOOK RECIBIDO
Timestamp: 2025-01-05T...
═══════════════════════════════════════════════════════════
✅ Payload parseado correctamente
📍 Origen identificado: STRIPE
🔵 Procesando webhook de STRIPE
Tipo de evento: checkout.session.completed
Cliente: Cliente de Prueba (test@example.com)
Producto: Carta Astral Cabalística - $97
💰 Procesando pago exitoso
✅ Cliente registrado: [ID]
✅ Compra registrada: [ID]
✅ Sesión programada: [ID]
✅ Notificaciones enviadas
✅ Webhook procesado exitosamente
```

### 3.2 Test de PayPal
1. Seleccionar función: `testPayPalWebhook`
2. Click "**Run**"
3. Ver logs

**Resultado esperado:** Similar al test de Stripe pero con origen PayPal.

---

## 4. Test de Logs en Google Apps Script

### 4.1 Ver Logs de Ejecución
1. Abrir Google Apps Script
2. Click en "**Executions**" (icono de reloj ⏱️)
3. Ver últimas ejecuciones
4. Click en una ejecución para ver detalles

### 4.2 Logs Esperados para Ejecución Exitosa
```
✅ Webhook recibido: [Stripe/PayPal]
✅ Evento: [tipo de evento]
✅ Cliente registrado: [ID_CLIENTE]
✅ Compra registrada: [ID_COMPRA]
✅ Email enviado a: maor@iku-cabalactiva.com
✅ Email enviado a: kabbalahuniversal@gmail.com
✅ Respuesta HTTP 200 enviada
```

### 4.3 Logs de Error (si hay problemas)
```
❌ ERROR: [descripción del error]
Stack trace: [detalles técnicos]
```

---

## 5. Test de Errores

### 5.1 Simular Webhook Inválido
**Usando webhook.site:**
1. Ir a: https://webhook.site
2. Copiar tu URL única
3. Enviar POST request con JSON inválido:
   ```json
   {
     "invalid": "data"
   }
   ```
4. Verificar que Google Apps Script retorna HTTP 400

**Resultado esperado:**
```json
{
  "success": false,
  "error": "Origen de webhook desconocido",
  "timestamp": "2025-01-05T..."
}
```

### 5.2 Simular Fallo de Google Sheets
1. En Google Apps Script, cambiar temporalmente:
   ```javascript
   SPREADSHEET_ID: 'ID_INVALIDO'
   ```
2. Ejecutar `testStripeWebhook`
3. Verificar que retorna HTTP 500
4. Ver log de error detallado
5. **IMPORTANTE**: Restaurar el SPREADSHEET_ID correcto

---

## 6. Test de Integración Completa (E2E)

### 6.1 Flujo Completo de Compra
1. **Inicio**: Usuario visita https://iku-cabalactiva.com
2. **Selección**: Usuario selecciona "Paquete Completo + Mandala" ($997)
3. **Checkout**: Usuario completa pago con Stripe (tarjeta de prueba)
4. **Webhook**: Stripe envía webhook a Google Apps Script
5. **Procesamiento**: Google Apps Script procesa el pago
6. **CRM**: Datos registrados en Google Sheets
7. **Notificaciones**: Emails enviados a admin y Rabbí
8. **Confirmación**: Usuario recibe confirmación de pago

### 6.2 Verificación E2E
Después del flujo completo, verificar:

- [ ] Pago completado en Stripe Dashboard
- [ ] Webhook entregado exitosamente (200 OK)
- [ ] Cliente registrado en hoja "Clientes"
- [ ] Compra registrada en hoja "Compras"
- [ ] 4 sesiones programadas en hoja "Sesiones" (paquete completo)
- [ ] Email recibido por maor@iku-cabalactiva.com
- [ ] Email recibido por kabbalahuniversal@gmail.com
- [ ] Logs de Google Apps Script sin errores

---

## 7. Checklist de Validación Final

Antes de pasar a producción, completar este checklist:

### Configuración
- [ ] Google Apps Script desplegado correctamente
- [ ] SPREADSHEET_ID configurado correctamente
- [ ] Webhooks configurados en Stripe (Production mode)
- [ ] Webhooks configurados en PayPal (Live mode)
- [ ] Variables de entorno actualizadas (.env.production)
- [ ] Hojas de Google Sheets con estructura correcta

### Testing
- [ ] Test manual con Stripe completado exitosamente
- [ ] Test manual con PayPal completado exitosamente
- [ ] Test automatizado de Stripe ejecutado sin errores
- [ ] Test automatizado de PayPal ejecutado sin errores
- [ ] Test de pago real completado (con monto mínimo)

### Verificación de Datos
- [ ] Datos correctos en Google Sheets hoja "Clientes"
- [ ] Datos correctos en Google Sheets hoja "Compras"
- [ ] Datos correctos en Google Sheets hoja "Sesiones"
- [ ] Emails recibidos correctamente por ambos destinatarios
- [ ] Formato de emails correcto y profesional

### Logs y Monitoreo
- [ ] Logs de Google Apps Script sin errores
- [ ] Stripe webhook delivery status: Succeeded
- [ ] PayPal webhook delivery status: Succeeded
- [ ] No hay errores en consola del navegador

### Documentación
- [ ] README.md actualizado
- [ ] Guías de configuración creadas
- [ ] Plan de rollback documentado
- [ ] Contactos de emergencia actualizados

---

## 8. Troubleshooting

### Problema: Webhook no se recibe
**Síntomas**: No hay logs en Google Apps Script después de un pago.

**Diagnóstico**:
1. Verificar URL del webhook en Stripe/PayPal
2. Verificar que Google Apps Script esté desplegado como "Anyone"
3. Verificar que el deployment esté activo

**Solución**:
1. Ir a Google Apps Script → Deploy → Manage deployments
2. Verificar que el deployment esté activo
3. Si no, crear nuevo deployment
4. Actualizar URL en Stripe/PayPal

---

### Problema: Webhook retorna 500
**Síntomas**: Stripe/PayPal muestra error 500 en delivery status.

**Diagnóstico**:
1. Ver logs de Google Apps Script (Executions)
2. Identificar el error específico

**Soluciones comunes**:
- **Error: "Hoja no encontrada"** → Verificar nombres de hojas en Google Sheets
- **Error: "Permission denied"** → Verificar permisos de edición en Google Sheets
- **Error: "Invalid SPREADSHEET_ID"** → Verificar SPREADSHEET_ID en el código

---

### Problema: Datos no se registran en Google Sheets
**Síntomas**: Webhook se recibe pero no hay datos en las hojas.

**Diagnóstico**:
1. Verificar logs de Google Apps Script
2. Verificar estructura de las hojas

**Solución**:
1. Verificar que las hojas tengan los nombres exactos:
   - "Clientes"
   - "Compras"
   - "Sesiones"
2. Verificar que la cuenta tenga permisos de edición
3. Verificar que el SPREADSHEET_ID sea correcto

---

### Problema: No se envían emails
**Síntomas**: Datos registrados pero no se reciben emails.

**Diagnóstico**:
1. Verificar cuota de Gmail API
2. Verificar direcciones de email en el código
3. Ver logs de errores

**Solución**:
1. Ir a: https://console.cloud.google.com/apis/api/gmail.googleapis.com/quotas
2. Verificar cuota disponible
3. Si está agotada, esperar 24 horas o solicitar aumento
4. Verificar que las direcciones de email sean correctas:
   - `maor@iku-cabalactiva.com`
   - `kabbalahuniversal@gmail.com`

---

### Problema: Emails van a spam
**Síntomas**: Emails se envían pero llegan a carpeta de spam.

**Solución**:
1. Marcar emails como "No es spam"
2. Agregar remitente a contactos
3. Considerar usar un servicio de email transaccional (SendGrid, Mailgun) en el futuro

---

## 9. Métricas de Éxito

### KPIs a Monitorear
- **Tasa de éxito de webhooks**: > 99%
- **Tiempo de procesamiento**: < 5 segundos
- **Emails entregados**: 100%
- **Datos registrados correctamente**: 100%

### Herramientas de Monitoreo
1. **Google Apps Script Executions**: Ver todas las ejecuciones
2. **Stripe Dashboard**: Ver webhook deliveries
3. **PayPal Dashboard**: Ver webhook deliveries
4. **Google Sheets**: Verificar registros diarios

---

## 10. Contacto y Soporte

**Desarrollador:**
- Mauro Asuaje
- maor@iku-cabalactiva.com

**Cliente:**
- Rabbí Isaac Benzaquén
- kabbalahuniversal@gmail.com

**Documentación:**
- Configuración: `/docs/crm-refactor/GUIA_CONFIGURACION_WEBHOOKS.md`
- Propuesta completa: `/docs/crm-refactor/PROPUESTA_IMPLEMENTACION_WEBHOOKS_SOLUTION.md`
- Rollback: `/docs/crm-refactor/ROLLBACK_PLAN.md`

---

**Última actualización**: 2025-01-05
