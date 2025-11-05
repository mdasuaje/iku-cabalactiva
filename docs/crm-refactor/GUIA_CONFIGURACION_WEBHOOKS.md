# 🔧 GUÍA DE CONFIGURACIÓN DE WEBHOOKS
## IKU Cábala Activa

---

## 1. Desplegar Google Apps Script

### Paso 1.1: Abrir Google Apps Script
1. Ir a: https://script.google.com
2. Iniciar sesión con: maor@iku-cabalactiva.com
3. Abrir proyecto existente o crear nuevo: "IKU Cabala Activa - Webhook Handler"

### Paso 1.2: Copiar Código
1. Abrir archivo: `docs/crm-refactor/google-apps-script-webhook-handler.js`
2. Copiar TODO el contenido
3. Pegar en el editor de Google Apps Script (reemplazar todo el contenido existente)

### Paso 1.3: Configurar Variables
Actualizar las siguientes líneas en el código:

```javascript
const CONFIG = {
  // ⚠️ ACTUALIZAR CON TU ID DE GOOGLE SHEETS
  SPREADSHEET_ID: 'TU_SPREADSHEET_ID_AQUI',
  
  // Emails ya configurados correctamente
  EMAILS: {
    ADMIN: 'maor@iku-cabalactiva.com',
    RABBI: 'kabbalahuniversal@gmail.com'
  }
};
```

**Para obtener el SPREADSHEET_ID:**
1. Abrir tu Google Sheet del CRM
2. La URL será: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copiar el ID entre `/d/` y `/edit`

### Paso 1.4: Desplegar como Web App
1. Click en "Deploy" → "New deployment"
2. Click en el ícono de engranaje ⚙️ → Seleccionar "Web app"
3. Configurar:
   - **Description**: "IKU Cabala Activa Webhook Handler v1.0"
   - **Execute as**: "Me (maor@iku-cabalactiva.com)"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. Autorizar permisos cuando se solicite
6. **COPIAR la URL generada** (será algo como: `https://script.google.com/macros/s/AKfycby.../exec`)

⚠️ **IMPORTANTE**: Guarda esta URL en un lugar seguro, la necesitarás en los siguientes pasos.

---

## 2. Configurar Webhook en Stripe

### Paso 2.1: Acceder a Stripe Dashboard
1. Ir a: https://dashboard.stripe.com
2. Iniciar sesión con tu cuenta de Stripe
3. Ir a: **Developers** → **Webhooks**

### Paso 2.2: Agregar Endpoint
1. Click "**Add endpoint**"
2. **Endpoint URL**: PEGAR la URL de Google Apps Script que copiaste en el paso 1.4
3. **Description**: "IKU Cabala Activa - CRM Webhook"
4. **Events to send**: Click "Select events"
5. Seleccionar los siguientes eventos:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
6. Click "**Add events**"
7. Click "**Add endpoint**"

### Paso 2.3: Obtener Signing Secret (Opcional)
1. Click en el endpoint recién creado
2. En la sección "Signing secret", click "Reveal"
3. Copiar el secret (empieza con `whsec_...`)
4. Guardar en lugar seguro (para validación futura si es necesario)

### Paso 2.4: Probar el Webhook
1. En la página del endpoint, click "**Send test webhook**"
2. Seleccionar evento: `checkout.session.completed`
3. Click "Send test webhook"
4. Verificar que el estado sea "Succeeded" (200 OK)

---

## 3. Configurar Webhook en PayPal

### Paso 3.1: Acceder a PayPal Developer
1. Ir a: https://developer.paypal.com
2. Iniciar sesión con tu cuenta de PayPal
3. Ir a: **Dashboard** → **My Apps & Credentials**

### Paso 3.2: Seleccionar o Crear App
1. Si ya tienes una app, selecciónala
2. Si no, click "**Create App**":
   - **App Name**: "IKU Cabala Activa"
   - **App Type**: "Merchant"
   - Click "Create App"

### Paso 3.3: Configurar Webhooks
1. Scroll down hasta la sección "**Webhooks**"
2. Click "**Add Webhook**"
3. **Webhook URL**: PEGAR la URL de Google Apps Script
4. **Event types**: Click "Select events"
5. Seleccionar:
   - ✅ `Payment capture completed` (PAYMENT.CAPTURE.COMPLETED)
   - ✅ `Payment capture denied` (PAYMENT.CAPTURE.DENIED)
6. Click "**Save**"

### Paso 3.4: Probar el Webhook (Sandbox)
1. Cambiar a modo "Sandbox" en el toggle superior
2. Realizar una compra de prueba usando credenciales de sandbox
3. Verificar que el webhook se reciba correctamente

---

## 4. Actualizar Variables de Entorno

### Paso 4.1: Crear archivo .env.local
```bash
cd /home/masua/iku-cabalactiva
cp .env.example .env.local
```

### Paso 4.2: Editar .env.local
Abrir `.env.local` y actualizar:

```env
# Google Apps Script Webhook (CRM Backend)
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec
VITE_CRM_SECRET_TOKEN=genera_un_token_secreto_aleatorio

# Emails (Ya configurados)
VITE_EMAIL_ADMIN=maor@iku-cabalactiva.com
VITE_EMAIL_RABBI=kabbalahuniversal@gmail.com
```

**Para generar un token secreto:**
```bash
openssl rand -hex 32
```

### Paso 4.3: Actualizar .env.production
Repetir el mismo proceso para `.env.production` (NO commitear este archivo a Git)

---

## 5. Verificar Configuración de Google Sheets

### Paso 5.1: Estructura de Hojas Requerida
Tu Google Sheet debe tener las siguientes hojas con estos nombres exactos:

1. **Clientes**
   - Columnas: ID | Nombre | Email | Teléfono | Fecha Registro | Estado | Fuente

2. **Compras**
   - Columnas: ID | ID Cliente | Producto | Monto | Proveedor | Fecha | Estado | Transaction ID | Sesiones Restantes

3. **Sesiones**
   - Columnas: ID | ID Cliente | Fecha Sesión | Tipo | Estado | Notas | Creado

### Paso 5.2: Permisos
Asegurarse de que la cuenta `maor@iku-cabalactiva.com` tenga permisos de edición en el Google Sheet.

---

## 6. Testing

Ver: `TESTING_WEBHOOKS.md` para procedimientos detallados de testing.

**Quick Test:**
1. Ir a Google Apps Script
2. Seleccionar función: `testStripeWebhook`
3. Click "Run"
4. Verificar logs (View → Logs)
5. Verificar que se creó un registro en Google Sheets

---

## 7. Activar en Producción

### Paso 7.1: Cambiar Stripe a Live Mode
1. Ir a Stripe Dashboard
2. Toggle "Test mode" → "Live mode"
3. Verificar que el webhook esté configurado en Live mode
4. Si no, repetir Paso 2 en Live mode

### Paso 7.2: Cambiar PayPal a Live
1. Ir a PayPal Developer Dashboard
2. Toggle "Sandbox" → "Live"
3. Verificar webhook en app de producción

### Paso 7.3: Deploy del Frontend
```bash
cd /home/masua/iku-cabalactiva
npm run build
git add .
git commit -m "feat: implementar webhooks con Google Apps Script"
git push origin crm-refactor-20251105
```

---

## 8. Monitoreo

### Logs de Google Apps Script
1. Ir a: https://script.google.com
2. Abrir proyecto
3. Click en "Executions" (icono de reloj)
4. Ver ejecuciones recientes y logs

### Logs de Stripe
1. Ir a: Stripe Dashboard → Developers → Webhooks
2. Click en tu endpoint
3. Ver "Recent deliveries"

### Logs de PayPal
1. Ir a: PayPal Developer → Webhooks
2. Ver "Recent deliveries"

---

## 9. Troubleshooting

### Problema: Webhook retorna 404
**Solución**: Verificar que la URL del webhook sea correcta y que el deployment de Google Apps Script esté activo.

### Problema: Webhook retorna 500
**Solución**: Ver logs de Google Apps Script para identificar el error específico.

### Problema: No se registran datos en Google Sheets
**Solución**: 
1. Verificar SPREADSHEET_ID
2. Verificar nombres de las hojas
3. Verificar permisos de edición

### Problema: No se envían emails
**Solución**:
1. Verificar cuota de Gmail API
2. Verificar direcciones de email
3. Ver logs de errores en Google Apps Script

---

## 10. Contacto y Soporte

**Desarrollador:**
- Mauro Asuaje
- maor@iku-cabalactiva.com

**Cliente:**
- Rabbí Isaac Benzaquén
- kabbalahuniversal@gmail.com

**Documentación Completa:**
- `/docs/crm-refactor/PROPUESTA_IMPLEMENTACION_WEBHOOKS_SOLUTION.md`

---

**Última actualización**: 2025-01-05
