# Webhooks Deprecated

Estos archivos fueron movidos aquí porque GitHub Pages no soporta serverless functions.

## Archivos:
- `stripe.js` - Webhook de Stripe (NO FUNCIONAL en GitHub Pages)
- `paypal.js` - Webhook de PayPal (NO FUNCIONAL en GitHub Pages)

## Razón de Deprecación:

GitHub Pages es un servicio de hosting estático que:
- ✅ Sirve HTML, CSS, JavaScript, imágenes
- ❌ NO ejecuta código backend
- ❌ NO soporta API endpoints
- ❌ NO soporta serverless functions
- ❌ NO puede recibir webhooks POST

## Solución Implementada:

Los webhooks ahora se procesan directamente en Google Apps Script, que actúa como receptor de webhooks y procesa los pagos automáticamente.

### Nueva Arquitectura:
```
Stripe/PayPal → Google Apps Script → Google Sheets (CRM) → Gmail (Notificaciones)
```

### Documentación:
Ver: `/docs/crm-refactor/PROPUESTA_IMPLEMENTACION_WEBHOOKS_SOLUTION.md`

## Fecha de Deprecación:
2025-01-05

## Contacto:
- Mauro Asuaje: maor@iku-cabalactiva.com
- Rabbí Isaac Benzaquén: kabbalahuniversal@gmail.com
