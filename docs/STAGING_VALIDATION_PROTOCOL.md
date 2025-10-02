# 🏺 PROTOCOLO DE VALIDACIÓN EN STAGING
## MISIÓN: "El Crisol del Guerrero - Validación Cuali-Cuantitativa v1.0"

**Arquitecto, proceda con los siguientes pasos en la URL de Staging que proporcionará GitHub Actions:**

---

### **✅ PREPARACIÓN PRE-VALIDACIÓN**

**Paso 0: Configuración de Secrets de Staging**
- [ ] Ir a GitHub > Settings > Secrets and variables > Actions
- [ ] Crear los siguientes secrets con prefijo `STAGING_`:
  - `STAGING_VITE_GOOGLE_APP_SCRIPT_URL` 
  - `STAGING_VITE_CRM_SECRET_TOKEN`
  - `STAGING_VITE_PAYPAL_SESION_INDIVIDUAL`
  - `STAGING_VITE_PAYPAL_PAQUETE_COMPLETO`
  - `STAGING_VITE_STRIPE_SESION_INDIVIDUAL` ⚠️ **DEJAR EN BLANCO INICIALMENTE**
  - `STAGING_VITE_STRIPE_PAQUETE_COMPLETO`

---

### **🔥 PRUEBA 1: Validación del Fallback (Simulación de Configuración Incompleta)**

**Objetivo:** Verificar que el sistema maneja graciosamente la ausencia de configuración Stripe

- [ ] **Acción:** Confirmar que `STAGING_VITE_STRIPE_SESION_INDIVIDUAL` está **EN BLANCO**
- [ ] **Trigger:** Hacer push a `develop` para activar deployment automático
- [ ] **Verificación Cuantitativa:** 
  - ¿El workflow `deploy-staging.yml` se ejecuta sin errores?
  - ¿La URL de staging se genera correctamente?
- [ ] **Verificación Cualitativa:** 
  - Abrir modal de contacto en staging
  - ¿Aparece el botón de Stripe con color gris/deshabilitado?
  - ¿El botón tiene el title tooltip correcto?
- [ ] **Test de Interacción:**
  - Clic en botón Stripe deshabilitado
  - ¿Aparece alert() con mensaje de contacto alternativo?
  - ¿El mensaje incluye email de soporte correcto?

**✅ Resultado Esperado:** Experiencia degradada graciosamente, sin errores JavaScript

---

### **🎯 PRUEBA 2: Validación de Flujo Exitoso (Configuración Completa)**

**Objetivo:** Confirmar funcionamiento completo con configuración válida

- [ ] **Acción:** En GitHub Secrets, **completar** `STAGING_VITE_STRIPE_SESION_INDIVIDUAL` con URL válida
- [ ] **Trigger:** Push a `develop` para redespliegue
- [ ] **Verificación Cuantitativa:**
  - ¿Build exitoso con todas las variables configuradas?
  - ¿URL de staging actualizada correctamente?
- [ ] **Verificación Cualitativa:**
  - Modal de contacto: ¿botón Stripe aparece activo (azul/gradiente)?
  - ¿Textos actualizados: "$297" y "$997"?
- [ ] **Test de Navegación:**
  - Clic en botón Stripe activo
  - ¿Redirige a URL correcta en nueva pestaña?
  - ¿La URL de destino es la configurada en el secret?

**✅ Resultado Esperado:** Flujo completo funcional, redirección correcta

---

### **💎 PRUEBA 3: Validación de Contenido Comercial**

**Objetivo:** Verificar que la propuesta de valor está correctamente implementada

- [ ] **Navegación por Herramientas:**
  - ¿Cada herramienta muestra precios actualizados?
  - ¿Los modales individuales tienen botones Stripe/PayPal?
- [ ] **Verificación de Constantes:**
  - ¿Precios en UI coinciden exactamente con `constants.js`?
  - ¿Descripción del "Programa de Transformación Completa" se muestra formateada?
- [ ] **UX Assessment:**
  - ¿La jerarquía visual prioriza correctamente las opciones de pago?
  - ¿Los CTAs son persuasivos y claros?

**✅ Resultado Esperado:** Experiencia comercial optimizada y coherente

---

### **🛡️ PRUEBA 4: Validación del Blindaje del Dojo**

**Objetivo:** Confirmar que el sistema previene despliegues con configuración incompleta

- [ ] **Simulación de Producción:**
  - Crear Pull Request desde `develop` hacia `main`
  - **⚠️ NO HACER MERGE**
- [ ] **Verificación de Seguridad:**
  - ¿El workflow de producción (`static.yml`) **FALLA** en validación?
  - ¿El error menciona específicamente las variables faltantes?
  - ¿El failure ocurre ANTES del build, no después?
- [ ] **Test de Recuperación:**
  - Cerrar PR sin merge
  - Confirmar que production permanece intacta

**✅ Resultado Esperado:** Sistema de CI/CD rechaza configuraciones incompletas

---

### **📊 CRITERIOS DE ÉXITO DE LA MISIÓN**

**La misión se considera EXITOSA solo si:**

- [x] **Disponibilidad:** Staging deployed exitosamente desde `develop`
- [ ] **Funcionalidad:** Fallback inteligente opera correctamente
- [ ] **Comercial:** Precios y enlaces actualizados funcionan
- [ ] **Seguridad:** CI/CD previene deploys defectuosos
- [ ] **UX:** Experiencia de usuario optimizada en ambos escenarios

### **🎯 DECISIÓN FINAL**

**Solo cuando TODOS los checkboxes estén marcados ✅, proceder con:**

1. **Configuración de Production Secrets** (variables sin prefijo `STAGING_`)
2. **Merge de `develop` → `main`**
3. **Deploy a producción** 
4. **Monitoreo post-deploy**

---

**IMPORTANTE:** Este protocolo garantiza que ningún cambio llegue a producción sin validación exhaustiva, siguiendo los principios de Clean Architecture y Zero Trust Development.

**Estado actual: PENDIENTE DE EJECUCIÓN POR EL ARQUITECTO**