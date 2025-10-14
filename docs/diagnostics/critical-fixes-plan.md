# 🔧 Plan de Correcciones Críticas E2E

**Basado en:** Análisis de errores E2E reales  
**Objetivo:** Corregir todos los fallos sistemáticos identificados  
**Timeline:** Implementación inmediata  

## 🎯 Correcciones por Prioridad

### P0 - CRÍTICO: Agregar Data-TestIDs Faltantes

#### 1. Hero Section
**Archivo:** `/src/components/sections/Hero.jsx`
**Línea:** 9
**Cambio:**
```jsx
// ANTES
<section id="hero" className="min-h-screen relative overflow-hidden flex items-center justify-center">

// DESPUÉS  
<section id="hero" data-testid="hero-section" className="min-h-screen relative overflow-hidden flex items-center justify-center">
```

#### 2. Herramientas Section
**Archivo:** `/src/components/sections/Herramientas.jsx`
**Cambio:** Agregar `data-testid="herramientas-section"` al elemento raíz

#### 3. Pricing Section  
**Archivo:** `/src/components/sections/Pricing.jsx`
**Cambios:**
- Agregar `data-testid="pricing-section"` al elemento raíz
- Agregar `data-testid="pricing-card"` a cada card de precio

#### 4. Contact Section
**Archivo:** `/src/components/sections/Contact.jsx`
**Cambios:**
- Agregar `data-testid="contact-section"` al elemento raíz
- Agregar `data-testid="contact-form"` al formulario

#### 5. WhatsApp Float
**Archivo:** `/src/components/common/WhatsAppFloat.jsx`
**Cambio:** Agregar `data-testid="whatsapp-float"` al botón principal

### P0 - CRÍTICO: Resolver Elementos Duplicados

#### 1. Títulos de Herramientas Duplicados
**Problema:** Mismos títulos en Herramientas.jsx y Pricing.jsx
**Solución:** Usar selectores más específicos en tests
```jsx
// En tests, cambiar:
page.getByText('Carta Astral Cabalística')
// Por:
page.locator('#herramientas').getByText('Carta Astral Cabalística')
```

#### 2. Meta Descriptions Duplicadas
**Problema:** Meta description en head y #root
**Solución:** Eliminar duplicado en componente React

### P1 - ALTA: Corregir Errores de JavaScript

#### 1. Event Dispatching Error
**Archivo:** `/tests/e2e/complete-flow.spec.js`
**Línea:** 233-235
**Cambio:**
```javascript
// ANTES
await page.evaluate(() => {
  window.dispatchEvent(new Error('Test error'));
});

// DESPUÉS
await page.evaluate(() => {
  window.dispatchEvent(new CustomEvent('error', { detail: 'Test error' }));
});
```

### P2 - MEDIA: Mejorar Accesibilidad

#### 1. Focus Management
**Problema:** `:focus` selector no encuentra elementos
**Solución:** Agregar tabindex y mejorar keyboard navigation

## 🚀 Implementación Paso a Paso

### Paso 1: Correcciones Hero Section
```bash
# Editar Hero.jsx
# Agregar data-testid="hero-section"
```

### Paso 2: Correcciones Herramientas
```bash
# Editar Herramientas.jsx  
# Agregar data-testid="herramientas-section"
```

### Paso 3: Correcciones Pricing
```bash
# Editar Pricing.jsx
# Agregar data-testid="pricing-section" y "pricing-card"
```

### Paso 4: Correcciones Contact
```bash
# Editar Contact.jsx
# Agregar data-testid="contact-section" y "contact-form"
```

### Paso 5: Correcciones WhatsApp
```bash
# Editar WhatsAppFloat.jsx
# Agregar data-testid="whatsapp-float"
```

### Paso 6: Correcciones Tests
```bash
# Editar complete-flow.spec.js
# Corregir event dispatching
# Usar selectores más específicos
```

## ✅ Validación Post-Corrección

### Tests que DEBEN Pasar
1. ✅ Hero section visible
2. ✅ Navegación entre secciones  
3. ✅ Herramientas interactivas
4. ✅ Formulario de contacto
5. ✅ WhatsApp integration
6. ✅ Pricing cards
7. ✅ Responsive design
8. ✅ Performance básico
9. ✅ SEO meta tags
10. ✅ Accessibility básica

### Comando de Validación
```bash
npm run test:e2e
```

### Criterio de Éxito
- **Mínimo 90% tests passing**
- **Zero errores críticos**
- **Todos los browsers OK**

## 📊 Tracking de Progreso

### Estado Actual
- [ ] Hero Section corregida
- [ ] Herramientas Section corregida  
- [ ] Pricing Section corregida
- [ ] Contact Section corregida
- [ ] WhatsApp Float corregido
- [ ] Tests JavaScript corregidos
- [ ] Validación E2E completa

### Tiempo Estimado
- **Correcciones:** 1-2 horas
- **Testing:** 30 minutos  
- **Validación:** 30 minutos
- **Total:** 2-3 horas

---

**PRÓXIMO PASO:** Implementar correcciones en orden de prioridad  
**VALIDACIÓN:** Ejecutar tests E2E después de cada corrección  
**OBJETIVO:** 100% tests passing sin errores críticos