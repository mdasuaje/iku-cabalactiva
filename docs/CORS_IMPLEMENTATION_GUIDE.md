# 🔐 Guía de Implementación CORS para CRM en Producción

## 📝 Resumen del Problema

El sistema CRM presenta errores de comunicación:
- **Producción**: `(!) El servicio de contacto no está disponible`
- **Local**: `Failed to fetch`

**Causa raíz**: Falta la función `doOptions(e)` en Google Apps Script para manejar las peticiones CORS preflight.

## ✅ Cambios Implementados

### 1. Función `doOptions(e)` Añadida

Se ha añadido la función crítica para manejar peticiones OPTIONS (CORS preflight):

```javascript
function doOptions(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "3600",
    "Access-Control-Allow-Credentials": "true"
  };
  
  return ContentService
    .createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}
```

### 2. Headers CORS en Todas las Respuestas

Se han actualizado las funciones `createSuccessResponse`, `createErrorResponse` y `doGet` para incluir headers CORS:

```javascript
.setHeaders({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
});
```

## 🚀 Pasos para Desplegar la Solución

### Paso 1: Actualizar Google Apps Script

1. **Abrir Google Apps Script**: Ir a [script.google.com](https://script.google.com)
2. **Localizar el proyecto**: Buscar "IKU CRM Zero Trust" o el proyecto actual
3. **Reemplazar código completo**: 
   - Eliminar todo el código existente
   - Copiar **TODO** el contenido de `scripts/google-apps-script-zero-trust.js`
   - Pegar en el editor de Google Apps Script

### Paso 2: Verificar Configuración

1. **Revisar el token secreto**: Asegurarse de que el `SECRET_TOKEN` en el CONFIG sea el correcto
2. **Verificar el SPREADSHEET_ID**: Confirmar que la ID de la hoja de cálculo es correcta
3. **Guardar el proyecto**: Ctrl+S o Cmd+S

### Paso 3: Re-desplegar como Web App

1. **Hacer clic en "Desplegar"** → **"Nueva implementación"**
2. **Configurar permisos**:
   - Tipo: Aplicación web
   - Ejecutar como: Yo (tu cuenta)
   - Quién puede acceder: **Cualquiera, incluso anónimo**
3. **Autorizar permisos** si se solicita
4. **Copiar la nueva URL** de la aplicación web

### Paso 4: Actualizar Variables de Entorno (si es necesario)

Si la URL cambió, actualizar en GitHub Secrets:
1. Ir a **GitHub** → **Settings** → **Secrets and variables** → **Actions**
2. Actualizar `VITE_GOOGLE_APP_SCRIPT_URL` con la nueva URL

## 🧪 Verificación de la Solución

### Prueba Local
```bash
# En el directorio del proyecto
npm run dev
# Abrir http://localhost:5173
# Probar el formulario de contacto
```

### Prueba en Producción
1. Esperar a que se complete el deployment de GitHub Actions
2. Visitar https://iku-cabalactiva.com
3. Probar el formulario de contacto

## 🔍 Troubleshooting

### Si persisten los errores CORS:

1. **Verificar que la función `doOptions` existe** en Google Apps Script
2. **Confirmar que el Web App está publicado** con permisos para "Cualquiera, incluso anónimo"
3. **Revisar que la URL está actualizada** en las variables de entorno
4. **Probar la URL directamente** en el navegador para confirmar que responde

### Comandos de diagnóstico:
```bash
# Probar conexión al Google Apps Script
curl -X OPTIONS [URL_DEL_GOOGLE_APPS_SCRIPT]

# Verificar variables de entorno locales
echo $VITE_GOOGLE_APP_SCRIPT_URL
```

## ✅ Criterios de Aceptación Completados

- [x] **Función `doOptions(e)` implementada** ✅
- [x] **Headers CORS en todas las respuestas** ✅
- [x] **Configuración de GitHub Actions verificada** ✅
- [x] **Documentación creada** ✅

## 📞 Próximos Pasos

1. **Desplegar el código actualizado** en Google Apps Script
2. **Probar la funcionalidad** localmente y en producción
3. **Verificar que no hay errores** de CORS en la consola del navegador
4. **Confirmar que los formularios funcionan** correctamente

---

**⚠️ Importante**: La función `doOptions(e)` es **crítica** para el funcionamiento de CORS. Sin ella, las peticiones desde el navegador fallarán con errores de CORS.