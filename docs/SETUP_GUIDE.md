# 🚀 Guía de Configuración CRM - MVP

## 📋 FASE 1: Configuración Google Cloud (30 min)

### 1. Crear Proyecto en Google Cloud Console
```bash
1. Ir a https://console.cloud.google.com/
2. Crear nuevo proyecto: "iku-cabalactiva-crm"
3. Habilitar APIs necesarias:
   - Google Sheets API
   - Google Drive API
   - Google Calendar API
   - Gmail API
```

### 2. Crear Cuenta de Servicio
```json
{
  "name": "iku-cabalactiva-automation",
  "roles": [
    "Editor de Hojas de cálculo",
    "Editor de Drive",
    "Editor de Calendar"
  ]
}
```

### 3. Descargar Credenciales
- Descargar archivo JSON de credenciales
- Guardar como `google-credentials.json`

## 📊 FASE 2: Configurar Google Sheets CRM (15 min)

### 1. Crear Google Sheets
```bash
1. Crear nueva hoja: "IKU CRM - Cábala Activa"
2. Copiar ID de la hoja (desde URL)
3. Compartir con la cuenta de servicio (email del JSON)
```

### 2. Ejecutar Script de Inicialización
```javascript
// Copiar código de scripts/google-apps-script.js
// Pegar en Google Apps Script
// Ejecutar función inicializarCRM()
```

## 🔗 FASE 3: Google Apps Script (20 min)

### 1. Crear Web App
```bash
1. Ir a https://script.google.com/
2. Nuevo proyecto: "IKU CRM Automation"
3. Pegar código de scripts/google-apps-script.js
4. Configurar SPREADSHEET_ID
5. Implementar como Web App
6. Permisos: "Cualquiera puede acceder"
```

### 2. Obtener URL del Webhook
```bash
URL formato: https://script.google.com/macros/s/[SCRIPT_ID]/exec
```

## ⚙️ FASE 4: Variables de Entorno (5 min)

### Configurar .env.local
```bash
cp .env.example .env.local
```

```env
VITE_GOOGLE_SHEETS_ID=1ABC123...
VITE_GOOGLE_API_KEY=AIza...
VITE_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
EMAIL_ADMIN=maor@iku-cabalactiva.com
EMAIL_MAESTRO=kabbalahuniversal@gmail.com
```

## 💳 FASE 5: Configurar Webhooks (15 min)

### Stripe
```bash
1. Dashboard Stripe → Webhooks
2. Agregar endpoint: https://tu-dominio.com/api/webhooks/stripe
3. Eventos: payment_intent.succeeded, payment_intent.payment_failed
4. Copiar webhook secret
```

### PayPal
```bash
1. PayPal Developer → Webhooks
2. Agregar endpoint: https://tu-dominio.com/api/webhooks/paypal
3. Eventos: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED
```

## 🧪 FASE 6: Pruebas (10 min)

### Test Básico
```bash
npm run dev
# Simular compra de prueba
# Verificar:
# - Email a maor@iku-cabalactiva.com
# - Registro en Google Sheets
# - Notificación a kabbalahuniversal@gmail.com (si aplica)
```

## ✅ Checklist de Verificación

- [ ] Google Cloud APIs habilitadas
- [ ] Cuenta de servicio creada
- [ ] Google Sheets configurado con headers
- [ ] Google Apps Script desplegado como Web App
- [ ] Variables de entorno configuradas
- [ ] Webhooks de Stripe configurados
- [ ] Webhooks de PayPal configurados
- [ ] Prueba de compra exitosa
- [ ] Emails llegando correctamente
- [ ] Datos guardándose en CRM

## 🚨 Troubleshooting

### Error: "Sheets API not enabled"
```bash
Solución: Habilitar Google Sheets API en Google Cloud Console
```

### Error: "Permission denied"
```bash
Solución: Compartir Google Sheets con email de cuenta de servicio
```

### Error: "Webhook not receiving data"
```bash
Solución: Verificar URL del webhook y permisos de Google Apps Script
```

## 📞 Soporte

Para dudas técnicas contactar al equipo de desarrollo.

---

**Tiempo total estimado: 95 minutos**