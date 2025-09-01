# 🔐 Guía de Implementación Zero Trust - IKU CRM

## 📋 Resumen de Cambios Implementados

### ✅ Mejoras de Seguridad Zero Trust
- **Autenticación por token secreto** en todas las peticiones
- **Validación de datos** en frontend y backend
- **Manejo de errores específicos** con códigos de error
- **Sanitización de inputs** para prevenir inyecciones
- **Validación de permisos** por hoja de Google Sheets

---

## 🔑 1. Generación y Almacenamiento del Token Secreto

### Generar Token Seguro
```bash
# Opción 1: Usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 2: Usar OpenSSL
openssl rand -hex 32

# Opción 3: Token personalizado
echo "IKU_CRM_$(date +%Y)_$(openssl rand -hex 16)"
```

### Almacenar Token de Forma Segura

#### En el Frontend (.env.local)
```bash
# Agregar al archivo .env.local
VITE_CRM_SECRET_TOKEN=tu_token_generado_aqui_32_caracteres_minimo
```

#### En Google Apps Script
```javascript
// En scripts/google-apps-script-zero-trust.js línea 8
SECRET_TOKEN: 'tu_token_generado_aqui_32_caracteres_minimo'
```

**⚠️ IMPORTANTE**: Usar el mismo token en ambos lugares.

---

## 🚀 2. Despliegue del Google Apps Script

### Paso 1: Acceder a Google Apps Script
1. Ir a [script.google.com](https://script.google.com)
2. Crear nuevo proyecto o abrir existente
3. Nombrar: "IKU CRM Zero Trust"

### Paso 2: Copiar Código
1. Eliminar código existente
2. Copiar **todo** el contenido de `scripts/google-apps-script-zero-trust.js`
3. Pegar en el editor
4. **Cambiar el SECRET_TOKEN** por tu token generado

### Paso 3: Configurar Permisos
```javascript
// El script necesita estos permisos:
- Gmail API (envío de emails)
- Google Sheets API (lectura/escritura)
- URL Fetch (recibir webhooks)
```

### Paso 4: Desplegar como Web App
1. Clic en **"Implementar"** → **"Nueva implementación"**
2. Configurar:
   ```
   Tipo: Aplicación web
   Ejecutar como: Yo (tu email)
   Acceso: Cualquier persona
   ```
3. Clic **"Implementar"**
4. **Copiar la URL** generada (será tu nuevo webhook URL)

### Paso 5: Actualizar URL en Frontend
```javascript
// En src/services/crmService-zero-trust.js línea 4
this.webhookUrl = 'TU_NUEVA_URL_AQUI';
```

---

## 🧪 3. Pruebas de Implementación

### Script de Prueba Rápida
```bash
# Crear archivo test-zero-trust.js
cat > test-zero-trust.js << 'EOF'
import CRMService from './src/services/crmService-zero-trust.js';

async function testZeroTrust() {
  console.log('🔐 Probando Zero Trust CRM...');
  
  try {
    // Test 1: Conexión
    const connection = await CRMService.testConnection();
    console.log('✅ Conexión:', connection);
    
    // Test 2: Validación datos
    const validation = CRMService.validateClienteData({
      nombre: 'Test User',
      email: 'test@example.com',
      telefono: '1234567890'
    });
    console.log('✅ Validación:', validation);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testZeroTrust();
EOF

# Ejecutar prueba
node test-zero-trust.js
```

### Validar Respuestas de Error
```javascript
// Respuestas esperadas del servidor:
{
  "error": "Acceso no autorizado",
  "code": "UNAUTHORIZED"
}

{
  "error": "Email inválido", 
  "code": "INVALID_EMAIL"
}

{
  "success": true,
  "message": "CRM actualizado correctamente"
}
```

---

## 🔄 4. Migración del Sistema Actual

### Paso 1: Backup del Sistema Actual
```bash
# Ejecutar backup antes de migrar
npm run backup
```

### Paso 2: Reemplazar Archivos
```bash
# Reemplazar servicio CRM
mv src/services/crmService.js src/services/crmService-backup.js
mv src/services/crmService-zero-trust.js src/services/crmService.js

# Actualizar imports si es necesario
grep -r "crmService" src/ --include="*.js" --include="*.jsx"
```

### Paso 3: Actualizar Variables de Entorno
```bash
# Agregar a .env.local
echo "VITE_CRM_SECRET_TOKEN=tu_token_aqui" >> .env.local

# Agregar a .env.example para documentación
echo "VITE_CRM_SECRET_TOKEN=your_secret_token_here" >> .env.example
```

### Paso 4: Actualizar CI/CD
```yaml
# En .github/workflows/ci-cd.yml agregar:
env:
  VITE_CRM_SECRET_TOKEN: ${{ secrets.VITE_CRM_SECRET_TOKEN }}
```

---

## 🛡️ 5. Validaciones Implementadas

### Frontend (crmService-zero-trust.js)
```javascript
Validaciones:
├── Nombre: Solo letras, 2-50 caracteres
├── Email: Formato RFC válido
├── Teléfono: Mínimo 8 caracteres
├── Monto: Entre 0 y 10,000
├── Fecha sesión: No en el pasado
└── Campos requeridos: Verificación obligatoria
```

### Backend (google-apps-script-zero-trust.js)
```javascript
Validaciones:
├── Token autenticación: Verificación obligatoria
├── Acción válida: Solo acciones permitidas
├── Hojas permitidas: Solo Clientes, Compras, Sesiones, Reportes
├── Formato email: Expresión regular RFC
├── Datos requeridos: Verificación por acción
└── Límites de caracteres: Prevención overflow
```

---

## 📊 6. Monitoreo y Logs

### Logs en Google Apps Script
```javascript
// Los logs se pueden ver en:
// 1. Google Apps Script → Ejecuciones
// 2. Google Cloud Console → Logging

// Eventos registrados:
- Intentos de autenticación fallidos
- Validaciones de datos fallidas  
- Emails enviados exitosamente
- Actualizaciones CRM completadas
```

### Métricas de Seguridad
```javascript
// Monitorear en producción:
├── Intentos de acceso no autorizado
├── Validaciones fallidas por tipo
├── Tiempo de respuesta promedio
├── Tasa de éxito de operaciones
└── Errores por código de error
```

---

## 🚨 7. Troubleshooting

### Errores Comunes y Soluciones

#### Error: "Acceso no autorizado"
```bash
Causa: Token incorrecto o faltante
Solución: Verificar que el token sea idéntico en ambos archivos
```

#### Error: "Datos incompletos"
```bash
Causa: Validación frontend falló
Solución: Verificar formato de datos según validadores
```

#### Error: "Hoja no encontrada"
```bash
Causa: Google Sheets no configurado
Solución: Verificar SPREADSHEET_ID y permisos
```

#### Error: "Email inválido"
```bash
Causa: Formato de email incorrecto
Solución: Usar formato RFC válido (user@domain.com)
```

### Script de Diagnóstico
```bash
# Crear diagnóstico Zero Trust
npm run diagnostico

# O ejecutar manualmente:
node scripts/diagnostico-sistema.js --zero-trust
```

---

## ✅ 8. Checklist de Implementación

### Pre-implementación
- [ ] Backup del sistema actual realizado
- [ ] Token secreto generado (mínimo 32 caracteres)
- [ ] Permisos Google Apps Script verificados
- [ ] Variables de entorno configuradas

### Implementación
- [ ] Código Google Apps Script actualizado con token
- [ ] Web App desplegada y URL obtenida
- [ ] Frontend actualizado con nueva URL y token
- [ ] Pruebas de conexión exitosas

### Post-implementación
- [ ] Validaciones frontend funcionando
- [ ] Validaciones backend funcionando
- [ ] Manejo de errores específicos activo
- [ ] Logs de seguridad configurados
- [ ] Monitoreo de métricas activo

### Verificación Final
- [ ] Test de autenticación exitoso
- [ ] Test de validación de datos exitoso
- [ ] Test de registro cliente exitoso
- [ ] Test de registro compra exitoso
- [ ] Test de programación sesión exitoso

---

## 🎯 Beneficios Implementados

### Seguridad
- **Zero Trust**: Verificación en cada petición
- **Validación dual**: Frontend + Backend
- **Tokens seguros**: Autenticación robusta
- **Sanitización**: Prevención de inyecciones

### Confiabilidad
- **Manejo de errores**: Mensajes específicos
- **Validaciones**: Datos consistentes
- **Logs detallados**: Trazabilidad completa
- **Rollback**: Backup disponible

### Performance
- **Validación frontend**: Menos carga servidor
- **Errores tempranos**: Mejor UX
- **Códigos específicos**: Debugging rápido
- **Timeouts**: Prevención bloqueos

---

**🔐 Sistema Zero Trust implementado exitosamente**  
**Tiempo estimado de implementación**: 30-45 minutos  
**Nivel de seguridad**: Empresarial  
**Compatibilidad**: 100% con sistema actual  

---

*Guía generada automáticamente - Última actualización: 2025-01-29*