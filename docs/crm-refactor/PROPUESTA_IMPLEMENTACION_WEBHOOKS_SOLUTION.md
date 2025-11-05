# 🎯 PROPUESTA DE IMPLEMENTACIÓN - SOLUCIÓN WEBHOOKS CRM
## IKU Cábala Activa - Proyecto de Producción

**Fecha:** 2025-01-05  
**Versión:** 1.0  
**Autor:** Mauro Asuaje (maor@iku-cabalactiva.com)  
**Rabbí:** Isaac Benzaquén (kabbalahuniversal@gmail.com)  
**Repositorio:** github.com/mdasuaje/iku-cabalactiva  
**Dominio:** iku-cabalactiva.com  

---

## 📋 ÍNDICE

1. [Diagnóstico Totalizador del Proyecto](#1-diagnóstico-totalizador-del-proyecto)
2. [Diagnóstico Específico de Problemas](#2-diagnóstico-específico-de-problemas)
3. [Solución Técnica Propuesta](#3-solución-técnica-propuesta)
4. [Archivos Afectados - Análisis Detallado](#4-archivos-afectados---análisis-detallado)
5. [Plan de Implementación por Tareas](#5-plan-de-implementación-por-tareas)
6. [Validación y Testing](#6-validación-y-testing)
7. [Rollback y Contingencia](#7-rollback-y-contingencia)

---

## 1. DIAGNÓSTICO TOTALIZADOR DEL PROYECTO

### 1.1 Estado Actual de la Infraestructura

#### ✅ Componentes Funcionales

**Frontend (React + Vite)**
- Estado: ✅ OPERATIVO
- Ubicación: `/src/`
- Tecnologías: React 18, Vite, Tailwind CSS, Framer Motion
- Deployment: GitHub Pages
- Dominio: iku-cabalactiva.com (CNAME configurado)

**CRM Service**
- Estado: ✅ OPERATIVO (con limitaciones)
- Archivo: `/src/services/crmService.js`
- Funcionalidades implementadas:
  - ✅ Registro de clientes
  - ✅ Registro de compras
  - ✅ Programación de sesiones
  - ✅ Retry logic con 3 intentos
  - ✅ Fallback local para desarrollo
  - ✅ Validación de datos robusta

**Email Service**
- Estado: ✅ OPERATIVO
- Archivo: `/src/services/emailService.js`
- Funcionalidades:
  - ✅ Notificación de nuevas compras
  - ✅ Notificación de sesiones programadas
  - ✅ Recordatorios de sesiones

**Google Apps Script Backend**
- Estado: ✅ OPERATIVO
- URL: `https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec`
- Integración: Google Sheets + Gmail API
- Problema: ⚠️ URL hardcoded en múltiples archivos

**Procesamiento de Pagos**
- PayPal: ✅ Links configurados
- Stripe: ✅ Links configurados
- Estado: ⚠️ PARCIALMENTE FUNCIONAL (pagos manuales funcionan)

#### ❌ Componentes NO Funcionales

**Webhooks de Pago**
- Estado: ❌ NO OPERATIVOS
- Archivos afectados:
  - `/api/webhooks/stripe.js` - NO SE EJECUTA
  - `/api/webhooks/paypal.js` - NO SE EJECUTA
  - `/src/services/webhookService.js` - NO RECIBE EVENTOS

**Causa Raíz:** GitHub Pages solo sirve archivos estáticos, NO puede ejecutar código backend (Node.js/serverless functions)

### 1.2 Arquitectura Actual

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           iku-cabalactiva.com (GitHub Pages)                 │
│                  React + Vite (Estático)                     │
└────────┬────────────────────────────────┬───────────────────┘
         │                                │
         │ (Frontend)                     │ (Frontend)
         ▼                                ▼
┌────────────────────┐          ┌────────────────────┐
│  Stripe Checkout   │          │  PayPal Checkout   │
│   (Externo)        │          │    (Externo)       │
└────────┬───────────┘          └────────┬───────────┘
         │                                │
         │ Webhook POST                   │ Webhook POST
         ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│          ❌ /api/webhooks/* (NO FUNCIONA)                    │
│          GitHub Pages NO ejecuta código backend             │
└─────────────────────────────────────────────────────────────┘
         │
         │ (Debería conectar pero NO puede)
         ▼
┌─────────────────────────────────────────────────────────────┐
│         Google Apps Script (Web App)                         │
│         - Google Sheets (CRM Database)                       │
│         - Gmail API (Notificaciones)                         │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Inventario de Archivos del Proyecto

**Archivos Core del Sistema:**
```
iku-cabalactiva/
├── src/
│   ├── services/
│   │   ├── crmService.js          ✅ OPERATIVO
│   │   ├── emailService.js        ✅ OPERATIVO
│   │   └── webhookService.js      ⚠️ NO RECIBE EVENTOS
│   └── components/
│       └── payments/
│           └── UnifiedPaymentModal.jsx  ✅ OPERATIVO
├── api/
│   └── webhooks/
│       ├── stripe.js              ❌ NO SE EJECUTA
│       └── paypal.js              ❌ NO SE EJECUTA
├── docs/
│   └── crm-refactor/              📁 DOCUMENTACIÓN
├── .env.example                   ✅ TEMPLATE
├── .env.production                ⚠️ CONTIENE SECRETS
└── package.json                   ✅ OPERATIVO
```

### 1.4 Dependencias Críticas

**Servicios Externos:**
- ✅ Google Apps Script (Free Tier)
- ✅ Google Sheets API (Free Tier)
- ✅ Gmail API (Free Tier - con límites reducidos por downgrade)
- ✅ Stripe (2.9% + $0.30 por transacción)
- ✅ PayPal (3.49% + tarifa fija por transacción)
- ❌ Google Workspace (Downgraded - recursos limitados)

**Limitaciones Actuales:**
- ⚠️ Email `contacto@iku-cabalactiva.com` ELIMINADO
- ⚠️ Solo disponible: `maor@iku-cabalactiva.com`
- ⚠️ Gmail API con cuotas reducidas
- ❌ Sin presupuesto para servicios pagos adicionales

---

## 2. DIAGNÓSTICO ESPECÍFICO DE PROBLEMAS

### 2.1 PROBLEMA CRÍTICO #1: Webhooks NO Funcionales

**Descripción:**
Los webhooks de Stripe y PayPal no pueden ejecutarse porque GitHub Pages solo sirve archivos estáticos y no puede ejecutar código backend (Node.js).

**Impacto en el Negocio:**
- ❌ Pagos NO se registran automáticamente en CRM
- ❌ Emails de confirmación NO se envían automáticamente
- ❌ Sesiones NO se programan automáticamente
- ❌ Rabbí Isaac NO recibe notificaciones de nuevas ventas
- ❌ Proceso manual requerido para cada venta (pérdida de tiempo y dinero)

**Archivos Directamente Afectados:**
```javascript
// /api/webhooks/stripe.js - NO SE EJECUTA EN GITHUB PAGES
export default async function handler(req, res) {
  // Este código NUNCA se ejecuta porque GitHub Pages no soporta serverless functions
}

// /api/webhooks/paypal.js - NO SE EJECUTA EN GITHUB PAGES
export default async function handler(req, res) {
  // Este código NUNCA se ejecuta porque GitHub Pages no soporta serverless functions
}
```

**Archivos Indirectamente Afectados:**
- `/src/services/webhookService.js` - Lógica de procesamiento lista pero nunca se invoca
- `/src/services/crmService.js` - Métodos preparados pero no se ejecutan automáticamente
- `/src/services/emailService.js` - Notificaciones preparadas pero no se envían

**Causa Técnica:**
GitHub Pages es un servicio de hosting estático que:
- ✅ Sirve HTML, CSS, JavaScript, imágenes
- ❌ NO ejecuta código backend
- ❌ NO soporta API endpoints
- ❌ NO soporta serverless functions
- ❌ NO puede recibir webhooks POST

### 2.2 PROBLEMA #2: URL de Google Apps Script Hardcoded

**Descripción:**
La URL del webhook de Google Apps Script está hardcoded en múltiples archivos, lo que dificulta el mantenimiento y testing.

**Archivos Afectados:**
```javascript
// /src/services/emailService.js - LÍNEA 3
this.webhookUrl = 'https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec';

// /src/services/crmService.js - LÍNEA 9-10
this._webhookUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL || 
  'https://script.google.com/macros/s/AKfycby47dq2ghkTTBdjoSw7ALCou0YpwznBvkLX69pt8FPKsVPijZ0YqBFR9HiPcKqp61JgTg/exec'
```

**Impacto:**
- ⚠️ Dificulta cambios de deployment de Google Apps Script
- ⚠️ Imposibilita testing con diferentes endpoints
- ⚠️ Variables de entorno no se utilizan correctamente

**Solución Requerida:**
Centralizar la URL en variables de entorno y eliminar hardcoding.

### 2.3 PROBLEMA #3: Email Routing Roto

**Descripción:**
El email `contacto@iku-cabalactiva.com` fue eliminado por reducción de costos, pero puede haber referencias en el código.

**Impacto:**
- ⚠️ Formularios de contacto pueden fallar
- ⚠️ Referencias hardcoded pueden causar errores

**Corrección Requerida:**
- Sustituir todas las referencias a `contacto@` por `maor@iku-cabalactiva.com`
- Implementar email forwarding gratuito (ImprovMX)

### 2.4 PROBLEMA #4: Terminología Incorrecta

**Descripción:**
Se usa "Maestro y Rabino" en lugar de "Rabbí" según solicitud del Rabbí Isaac Benzaquén.

**Archivos a Revisar:**
- Todos los componentes de UI
- Textos de emails
- Documentación

**Corrección:**
Buscar y reemplazar "Maestro" y "Rabino" por "Rabbí" en todo el proyecto.

---

## 3. SOLUCIÓN TÉCNICA PROPUESTA

### 3.1 Estrategia: Google Apps Script como Webhook Endpoint

**Fundamento:**
Aprovechar la infraestructura existente de Google Apps Script para recibir webhooks directamente, eliminando la necesidad de un servidor backend adicional.

**Ventajas:**
- ✅ 100% Gratuito (Free Tier de Google)
- ✅ Ya implementado y funcionando para CRM
- ✅ Integración nativa con Google Sheets y Gmail
- ✅ No requiere migración de hosting
- ✅ Cero costos adicionales
- ✅ Mantiene GitHub Pages para frontend

**Arquitectura Propuesta:**

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           iku-cabalactiva.com (GitHub Pages)                 │
│                  React + Vite (Estático)                     │
└────────┬────────────────────────────────┬───────────────────┘
         │                                │
         │ Redirect to Checkout           │ Redirect to Checkout
         ▼                                ▼
┌────────────────────┐          ┌────────────────────┐
│  Stripe Checkout   │          │  PayPal Checkout   │
│   (Externo)        │          │    (Externo)       │
└────────┬───────────┘          └────────┬───────────┘
         │                                │
         │ Webhook POST                   │ Webhook POST
         │ (DIRECTO)                      │ (DIRECTO)
         ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│    ✅ Google Apps Script Web App (doPost)                    │
│    URL: script.google.com/macros/s/.../exec                 │
│                                                              │
│    Funciones:                                                │
│    - doPost(e) → Recibe webhooks                            │
│    - procesarStripeWebhook(payload)                         │
│    - procesarPayPalWebhook(payload)                         │
│    - registrarClienteEnCRM(data)                            │
│    - enviarNotificacionEmail(data)                          │
│    - programarSesionInicial(data)                           │
└────────┬────────────────────────────────────────────────────┘
         │
         ├─────► Google Sheets (CRM Database)
         └─────► Gmail API (Notificaciones)
```

### 3.2 Implementación en Google Apps Script

**Archivo: `google-apps-script-webhook-handler.js`**

El script debe implementar:

1. **Función doPost(e)** - Receptor de webhooks
2. **Validación de origen** - Seguridad básica
3. **Procesamiento de Stripe** - Parser de eventos Stripe
4. **Procesamiento de PayPal** - Parser de eventos PayPal
5. **Registro en CRM** - Escritura en Google Sheets
6. **Envío de emails** - Notificaciones vía Gmail API

### 3.3 Configuración de Webhooks

**Stripe Dashboard:**
```
URL: https://script.google.com/macros/s/AKfycby.../exec
Eventos a escuchar:
  - checkout.session.completed
  - payment_intent.succeeded
  - payment_intent.payment_failed
```

**PayPal Developer Dashboard:**
```
URL: https://script.google.com/macros/s/AKfycby.../exec
Eventos a escuchar:
  - PAYMENT.CAPTURE.COMPLETED
  - PAYMENT.CAPTURE.DENIED
```

### 3.4 Cambios en el Frontend

**Mínimos cambios requeridos:**
- ✅ Mantener flujo de pago actual (redirect a Stripe/PayPal)
- ✅ Mantener servicios existentes (crmService, emailService)
- ✅ Actualizar variables de entorno
- ✅ Documentar nueva arquitectura

**NO se requiere:**
- ❌ Migración de hosting
- ❌ Cambios en componentes de UI
- ❌ Reescritura de servicios
- ❌ Nuevas dependencias

---

## 4. ARCHIVOS AFECTADOS - ANÁLISIS DETALLADO

### 4.1 Archivos a CREAR

#### 📄 `google-apps-script-webhook-handler.js`
**Ubicación:** Google Apps Script Editor (cloud)  
**Propósito:** Receptor central de webhooks de Stripe y PayPal  
**Estado:** NUEVO  
**Prioridad:** 🔴 CRÍTICO

**Contenido:**
- Función `doPost(e)` para recibir webhooks
- Lógica de procesamiento de Stripe
- Lógica de procesamiento de PayPal
- Integración con Google Sheets
- Envío de emails vía Gmail API

#### 📄 `docs/crm-refactor/GUIA_CONFIGURACION_WEBHOOKS.md`
**Ubicación:** `/docs/crm-refactor/`  
**Propósito:** Guía paso a paso para configurar webhooks  
**Estado:** NUEVO  
**Prioridad:** 🟡 ALTA

#### 📄 `docs/crm-refactor/TESTING_WEBHOOKS.md`
**Ubicación:** `/docs/crm-refactor/`  
**Propósito:** Procedimientos de testing y validación  
**Estado:** NUEVO  
**Prioridad:** 🟡 ALTA

### 4.2 Archivos a MODIFICAR

#### 📝 `.env.example`
**Cambios:**
```diff
+ # Google Apps Script Webhook
+ VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
+ VITE_CRM_SECRET_TOKEN=your_secret_token_here
```

#### 📝 `src/services/emailService.js`
**Cambios:**
```diff
- this.webhookUrl = 'https://script.google.com/macros/s/AKfycby.../exec';
+ this.webhookUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
```

#### 📝 `README.md`
**Cambios:**
- Actualizar precios de herramientas
- Actualizar descripción del paquete completo
- Documentar nueva arquitectura de webhooks
- Sustituir "Maestro y Rabino" por "Rabbí"

### 4.3 Archivos a DEPRECAR (NO ELIMINAR)

#### 🗄️ `/api/webhooks/stripe.js`
**Acción:** Mover a `/api/webhooks/deprecated/`  
**Razón:** No funciona en GitHub Pages, pero mantener para referencia

#### 🗄️ `/api/webhooks/paypal.js`
**Acción:** Mover a `/api/webhooks/deprecated/`  
**Razón:** No funciona en GitHub Pages, pero mantener para referencia

### 4.4 Archivos SIN CAMBIOS (Preservar Integridad)

✅ **Componentes de UI** - `/src/components/**/*`  
✅ **Estilos** - `/src/styles/**/*`  
✅ **Hooks** - `/src/hooks/**/*`  
✅ **Assets** - `/public/**/*`  
✅ **Configuración de build** - `vite.config.js`  
✅ **GitHub Actions** - `.github/workflows/**/*`  

---

## 5. PLAN DE IMPLEMENTACIÓN POR TAREAS

### Metodología: Context-Engineering + Prompt-Engineering

Cada tarea está diseñada como un prompt optimizado para ejecución por AI Assistant con 100% de completitud.

---

### ✅ TAREA 0: Punto de Seguridad Git

**Prompt para AI Assistant:**
```
Crea un punto de seguridad en Git antes de cualquier cambio:

1. Verifica el estado actual del repositorio
2. Crea una nueva rama: `crm-refactor-20251105`
3. Asegúrate de que todos los cambios actuales estén commiteados
4. Crea un tag de respaldo: `v1.0-pre-webhook-refactor`
5. Confirma que la rama main está limpia

Comandos a ejecutar:
```bash
git status
git checkout -b crm-refactor-20251105
git tag v1.0-pre-webhook-refactor
git push origin crm-refactor-20251105
git push origin v1.0-pre-webhook-refactor
```

Validación:
- ✅ Rama creada exitosamente
- ✅ Tag creado exitosamente
- ✅ Backup disponible en remoto
```

**Criterio de Éxito:** Rama y tag creados, visible en GitHub

---

### ✅ TAREA 1: Crear Google Apps Script Webhook Handler

**Prompt para AI Assistant:**
```
Crea el archivo `google-apps-script-webhook-handler.js` con la siguiente especificación:

CONTEXTO:
- Proyecto: IKU Cábala Activa
- Propósito: Recibir webhooks de Stripe y PayPal
- Integración: Google Sheets (CRM) + Gmail API (notificaciones)
- Emails: maor@iku-cabalactiva.com, kabbalahuniversal@gmail.com

REQUISITOS FUNCIONALES:
1. Implementar función doPost(e) para recibir webhooks HTTP POST
2. Validar que el request sea JSON válido
3. Identificar el origen del webhook (Stripe o PayPal)
4. Procesar eventos de Stripe: checkout.session.completed, payment_intent.succeeded
5. Procesar eventos de PayPal: PAYMENT.CAPTURE.COMPLETED
6. Extraer datos del cliente: nombre, email, teléfono
7. Extraer datos del producto: nombre, precio, tipo
8. Registrar en Google Sheets hoja "Clientes"
9. Registrar en Google Sheets hoja "Compras"
10. Enviar email a maor@iku-cabalactiva.com (notificación de compra)
11. Enviar email a kabbalahuniversal@gmail.com (notificación de sesión)
12. Retornar HTTP 200 con JSON {success: true}
13. Manejo de errores con HTTP 500 y logging

REQUISITOS NO FUNCIONALES:
- Código limpio y comentado en español
- Manejo robusto de errores
- Logging detallado para debugging
- Validación de datos de entrada
- Seguridad: validar origen del request

PRODUCTOS DISPONIBLES:
- Carta Astral Cabalística: $97 USD
- Constelación Familiar Cabalística: $147 USD
- Limpieza Áurica Cabalística: $247 USD
- Meditación Cabalística: $97 USD
- Paquete Completo + Mandala de Poder: $997 USD

ESTRUCTURA DEL CÓDIGO:
```javascript
/**
 * Webhook Handler para IKU Cábala Activa
 * Recibe webhooks de Stripe y PayPal
 * Registra en CRM y envía notificaciones
 */

function doPost(e) {
  // Implementación aquí
}

function procesarStripeWebhook(payload) {
  // Implementación aquí
}

function procesarPayPalWebhook(payload) {
  // Implementación aquí
}

function registrarCliente(datos) {
  // Implementación aquí
}

function registrarCompra(datos) {
  // Implementación aquí
}

function enviarNotificaciones(datos) {
  // Implementación aquí
}
```

VALIDACIÓN:
- ✅ Código compila sin errores
- ✅ Todas las funciones implementadas
- ✅ Comentarios en español
- ✅ Manejo de errores completo
```

**Archivo de Salida:** `docs/crm-refactor/google-apps-script-webhook-handler.js`  
**Criterio de Éxito:** Archivo creado con todas las funciones implementadas

---

