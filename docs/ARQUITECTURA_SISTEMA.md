# Arquitectura del Sistema Iku Cabalactiva

## Introducción

Este documento describe la arquitectura del sistema Iku Cabalactiva, enfocándose especialmente en la integración de los sistemas de pago (PayPal y Stripe) y el formulario de contacto. El objetivo es proporcionar una visión clara de cómo están estructurados los componentes y cómo fluyen los datos a través del sistema.

## Estructura General

El sistema está organizado siguiendo una arquitectura de componentes React con servicios para la lógica de negocio. Los principales directorios son:

- `/src/components/` - Componentes de UI organizados por tipo y funcionalidad
- `/src/services/` - Servicios para lógica de negocio y comunicación con APIs
- `/src/utils/` - Utilidades y funciones auxiliares
- `/docs/` - Documentación del sistema
- `/scripts/` - Scripts de diagnóstico y utilidades de desarrollo

## Formularios de Contacto

### ContactForm.jsx

El componente `ContactForm.jsx` proporciona un formulario reutilizable para la captura de información de contacto de los usuarios. Este componente:

- Maneja validación de datos
- Conecta con el servicio CRM a través de `contactService`
- Proporciona feedback al usuario mediante notificaciones toast
- Es altamente personalizable mediante props

### Integración con CRM

El formulario se conecta con el servicio CRM a través de la clase `contactService`, que proporciona métodos para:

- Enviar consultas generales
- Registrar leads
- Notificar sesiones confirmadas

El servicio utiliza un webhook de Google Apps Script para procesar las solicitudes y actualizar la base de datos del CRM.

## Integración de Sistemas de Pago

### Arquitectura de Integración con PayPal

La integración con PayPal sigue un patrón de proveedor de contexto (Context Provider) para establecer la configuración global y componentes específicos para la UI.

#### Componentes Principales:

1. **PayPalProvider.jsx**
   - Configura el SDK de PayPal usando `PayPalScriptProvider`
   - Establece las opciones iniciales incluyendo `client-id`, `currency`, etc.
   - Utiliza la variable de entorno `VITE_PAYPAL_CLIENT_ID` para la autenticación
   - Envuelve los componentes hijos que necesitan acceso al contexto de PayPal

2. **PayPalButton.jsx**
   - Implementa la UI del botón de pago
   - Utiliza hooks como `usePayPalScriptReducer` para acceder al contexto configurado por el proveedor
   - Define la lógica para crear órdenes (`createOrder`) y procesar aprobaciones (`onApprove`)
   - Se comunica con el servicio CRM para registrar compras exitosas

**Flujo de datos**:

```
Variables de Entorno (.env) → PayPalProvider → Contexto React → PayPalButton → Procesamiento de Pagos → CRM
```

### Arquitectura de Integración con Stripe

Similar a PayPal, la integración con Stripe sigue un patrón de proveedor de contexto con componentes específicos para la UI.

## Diagnósticos del Sistema

El sistema incluye scripts de diagnóstico para verificar la integridad de los componentes y servicios:

- `diagnose.sh` - Script principal que ejecuta todos los diagnósticos
- `scripts/diagnose-comprehensive-e2e.js` - Diagnóstico completo end-to-end
- `scripts/diagnose-paypal.js` - Diagnóstico específico para la integración de PayPal
- `scripts/diagnose-stripe.js` - Diagnóstico específico para la integración de Stripe

Estos scripts verifican:

1. Variables de entorno
2. Existencia y configuración correcta de componentes
3. Integración adecuada con servicios externos
4. Generación de reportes de diagnóstico

### Notas sobre el Diagnóstico de PayPal

El diagnóstico de PayPal reconoce el patrón arquitectónico donde:
- El `client-id` de PayPal se configura en el `PayPalProvider.jsx`
- `PayPalButton.jsx` accede a esta configuración a través del contexto de React
- No es necesario que `PayPalButton.jsx` use directamente la variable de entorno

Este patrón es considerado una buena práctica ya que:
1. Centraliza la configuración en un solo componente
2. Evita duplicación de código y configuración
3. Facilita cambios de configuración globales
4. Sigue los principios de React para gestión de estado y contexto

## Conclusiones

La arquitectura del sistema está diseñada para ser modular, mantenible y escalable. La separación entre componentes UI y servicios de lógica de negocio permite un desarrollo más organizado y facilita las pruebas.

Las integraciones con sistemas de pago siguen patrones de diseño modernos de React, centralizando la configuración en proveedores de contexto y manteniendo los componentes UI enfocados en su responsabilidad principal.