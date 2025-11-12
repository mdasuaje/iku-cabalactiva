# 🚨 REPORTE DE AUDITORÍA DE SEGURIDAD - CRÍTICO

**Fecha:** 2025-11-12  
**Repositorio:** iku-cabalactiva (PÚBLICO)  
**Auditor:** GitHub Copilot  
**Severidad:** 🔴 CRÍTICA

---

## 📊 RESUMEN EJECUTIVO

Se ha identificado **exposición masiva de credenciales y secretos** en el repositorio público `iku-cabalactiva`. Esto incluye:

- ✅ Claves API de Stripe (producción)
- ✅ URLs de PayPal con identificadores
- ✅ Tokens de seguridad CRM
- ✅ URLs de Google Apps Script
- ✅ Archivo `.env.production` con credenciales reales

**IMPACTO:** 🔴 Cualquier persona en internet puede acceder a estas credenciales y:
- Crear pagos fraudulentos
- Acceder al CRM de Google Sheets
- Comprometer la integridad de datos de clientes

**ACCIÓN REQUERIDA:** Inmediata (próximas 2 horas)

---

## 🔍 ARCHIVOS COMPROMETIDOS

### 1. `.env.production` (CRÍTICO ⚠️)

**Ubicación:** `/home/masua/iku-cabalactiva/.env.production`

**Contenido expuesto:**
```bash
VITE_STRIPE_PUBLIC_KEY=pk_live_51RxxvlKiSP3zJu4NUEoP0H7CxMm4hkju4aupv6bmh8tWIAEimGf4kO0OlsAo5AQh3ZAc7dZ7FXztAzDAFSv76etT005L8PKaWZ
VITE_STRIPE_CHECKOUT=https://buy.stripe.com/3cIcN6fhNdAS1S34SCdnW00
VITE_PAYPAL_SINGLE_SESSION=https://www.paypal.com/ncp/payment/FJGC4GE6SBS98
VITE_PAYPAL_FULL_PACKAGE=https://www.paypal.com/ncp/payment/QHUXGLD7VZ8RA
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz48aBhDeY1cagFxeVXk-PfmUl1p1FV7_LLos02BhLsgQE3ARfHc_Fv7yerOKEShcYARg/exec
VITE_CRM_SECRET_TOKEN=IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025
```

**Riesgo:** 🔴 CRÍTICO
- Stripe Public Key de PRODUCCIÓN
- PayPal payment links activos
- Google Script URL con deployment ID
- Token de seguridad CRM

---

### 2. `scripts/google-apps-script-final.js`

**Ubicación:** `/home/masua/iku-cabalactiva/scripts/google-apps-script-final.js`

**Línea 9:**
```javascript
SECRET_TOKEN: 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025',
```

**Riesgo:** 🔴 ALTO - Token hardcodeado en código fuente público

---

### 3. `scripts/emergency-verification.cjs`

**Ubicación:** `/home/masua/iku-cabalactiva/scripts/emergency-verification.cjs`

**Línea 10:**
```javascript
token: 'IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025'
```

**Riesgo:** 🔴 ALTO - Mismo token expuesto

---

### 4. Documentación con Credenciales

**Archivos afectados:**
- `docs/dev-sessions/202509292162315.md` (Google Script deployment IDs, tokens)
- `docs/chats/chat-2025-09-22.md` (Tokens CRM múltiples veces)
- `docs/chats/chat-2025-09-29-1622.md` (44+ menciones del token)
- `docs/CI-CD-Cloud-native-q-dev-chat-2025-08-29.md` (Stripe pk_live)
- `docs/mcp-q-dev-chat-2025-08-29.md` (Stripe pk_live)
- `docs/q-dev-chat-2025-08-29.md` (Stripe pk_live)
- `docs/kubernetes-q-dev-chat-2025-08-29.md` (Stripe pk_live)

**Riesgo:** 🟡 MEDIO-ALTO - Documentación técnica con ejemplos reales

---

### 5. `docs/implementation/crm-production-fix/*`

**Archivos creados hoy:**
- README.md
- PLAN_MAESTRO_REPARACION_CRM_PRODUCCION.md
- INDICE_MAESTRO.md
- RESUMEN_EJECUTIVO.md
- GUIA_EJECUTIVA.md
- RESUMEN_EJECUCION.md
- SOLICITUD_EJECUCION.md

**Riesgo:** 🟢 BAJO - No contienen credenciales directas, pero mencionan `.env` y configuraciones

---

## ⚠️ VECTORES DE ATAQUE

### 1. Stripe API Abuse

- **Clave expuesta:** `pk_live_51Rxxvl...`
- **Permite:** Crear sesiones de checkout, consultar información pública
- **NO permite:** Cobros directos (requiere sk_live), pero sí phishing

### 2. Google Apps Script Manipulation

- **URL expuesta:** `https://script.google.com/macros/s/AKfycbz48aBhD...`
- **Token expuesto:** `IKU_CRM_2025_SECURE_94b30092ee15690f3c64428ecd112025`
- **Permite:** 
  - Enviar datos falsos al CRM
  - Consultar datos del CRM
  - DoS del webhook

### 3. PayPal Payment Link Hijacking

- **URLs expuestas:** 
  - `https://www.paypal.com/ncp/payment/FJGC4GE6SBS98`
  - `https://www.paypal.com/ncp/payment/QHUXGLD7VZ8RA`
- **Permite:**
  - Usuarios pueden ver detalles del pago
  - Potencial uso en phishing

---

## 🛡️ PLAN DE REMEDIACIÓN INMEDIATA

### FASE 1: CONTENCIÓN (15 minutos)

#### 1.1. Eliminar `.env.production` del Repositorio Público

```bash
cd /home/masua/iku-cabalactiva
git rm -f .env.production
git commit -m "security: remove .env.production with credentials"
git push origin main
```

#### 1.2. Verificar `.gitignore`

Verificado: ✅ `.env.production` **NO está** en `.gitignore`

**ACCIÓN:**
```bash
echo ".env.production" >> .gitignore
git add .gitignore
git commit -m "security: add .env.production to gitignore"
git push origin main
```

---

### FASE 2: LIMPIEZA DE HISTORIAL (30 minutos)

#### 2.1. Usar BFG Repo-Cleaner (Recomendado)

```bash
# Instalar BFG
cd /tmp
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Backup del repo
cd /home/masua
cp -r iku-cabalactiva iku-cabalactiva-backup-$(date +%Y%m%d)

# Limpiar .env.production del historial
cd /home/masua/iku-cabalactiva
java -jar /tmp/bfg-1.14.0.jar --delete-files .env.production

# Limpiar referencias
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (PELIGRO: coordinar con equipo)
git push origin --force --all
```

#### 2.2. Alternativa: git filter-branch

```bash
cd /home/masua/iku-cabalactiva

git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.production" \
  --prune-empty --tag-name-filter cat -- --all

git reflog expire --expire=now --all
git gc --prune=now --aggressive

git push origin --force --all
```

---

### FASE 3: ROTACIÓN DE CREDENCIALES (1-2 horas)

#### 3.1. Stripe

**Acción:** Regenerar Public Key
- Login a Stripe Dashboard
- Developers → API Keys
- Rotar `pk_live_...`
- Actualizar en repo privado

**Nota:** La `pk_live` es menos crítica que `sk_live`, pero debe rotarse igual.

#### 3.2. Google Apps Script

**Acción:** Regenerar Deployment
1. Abrir Google Apps Script proyecto
2. Deploy → Manage Deployments
3. Crear nuevo deployment
4. Archivar deployment anterior
5. Nueva URL generada

#### 3.3. CRM Secret Token

**Acción:** Generar nuevo token
```bash
openssl rand -hex 32
# Resultado: nuevo_token_aqui
```

Actualizar en:
- Google Apps Script (CONFIG.SECRET_TOKEN)
- Repo privado (.env.production)

#### 3.4. PayPal Payment Links

**Acción:** Verificar si se pueden revocar/regenerar
- Login a PayPal Business
- Verificar si hay opción de deshabilitar links antiguos
- Crear nuevos links

---

### FASE 4: MIGRACIÓN A REPOSITORIO PRIVADO (30 minutos)

#### 4.1. Copiar Implementaciones

```bash
# Verificar que repo privado existe
cd /home/masua/iku-cabalactiva-private

# Copiar documentación sensible
cp -r ../iku-cabalactiva/docs/implementation/crm-production-fix docs/implementation/
cp -r ../iku-cabalactiva/docs/implementation/ci-cd-testing-fix docs/implementation/

# Commit en privado
git add docs/implementation/
git commit -m "feat: añadir implementaciones CRM y CI/CD"
git push origin main
```

#### 4.2. Eliminar del Repositorio Público

```bash
cd /home/masua/iku-cabalactiva

git rm -r docs/implementation/crm-production-fix/
git rm -r docs/implementation/ci-cd-testing-fix/

git commit -m "security: mover implementaciones a repositorio privado"
git push origin main
```

#### 4.3. Crear README Pointer en Público

```bash
cd /home/masua/iku-cabalactiva
mkdir -p docs/implementation

cat > docs/implementation/README.md << 'EOF'
# 🔒 Implementaciones

Las implementaciones detalladas se encuentran en el repositorio privado por razones de seguridad.

**Acceso:** iku-cabalactiva-private/docs/implementation/

## Implementaciones Disponibles

- `crm-production-fix/` - Mejoras de robustez CRM y UX
- `ci-cd-testing-fix/` - Reparación de pipeline CI/CD

Para acceso, contactar al equipo de desarrollo.
EOF

git add docs/implementation/README.md
git commit -m "docs: añadir pointer a repo privado"
git push origin main
```

---

### FASE 5: LIMPIEZA DE DOCUMENTACIÓN (30 minutos)

#### 5.1. Sanitizar Archivos de Documentación

**Scripts a limpiar:**
```bash
cd /home/masua/iku-cabalactiva

# Archivos con tokens hardcodeados
vim scripts/google-apps-script-final.js
# Reemplazar línea 9:
# SECRET_TOKEN: import.meta.env.VITE_CRM_SECRET_TOKEN,

vim scripts/emergency-verification.cjs
# Reemplazar línea 10:
# token: process.env.VITE_CRM_SECRET_TOKEN || 'CHANGE_ME'

git add scripts/
git commit -m "security: remove hardcoded tokens from scripts"
git push origin main
```

#### 5.2. Limpiar Documentación

**Opción A: Mover todo a privado**
```bash
cd /home/masua/iku-cabalactiva-private
cp -r ../iku-cabalactiva/docs/dev-sessions docs/
cp -r ../iku-cabalactiva/docs/chats docs/

cd ../iku-cabalactiva
git rm -r docs/dev-sessions/
git rm -r docs/chats/
git commit -m "security: mover sesiones de desarrollo a repo privado"
git push origin main
```

**Opción B: Sanitizar con script**
```bash
cd /home/masua/iku-cabalactiva

# Script de limpieza
cat > /tmp/sanitize-docs.sh << 'EOF'
#!/bin/bash
find docs/ -type f -name "*.md" | while read file; do
  sed -i 's/IKU_CRM_2025_SECURE_[a-f0-9]*/REDACTED_TOKEN/g' "$file"
  sed -i 's/pk_live_[a-zA-Z0-9]*/pk_live_REDACTED/g' "$file"
  sed -i 's/AKfycb[a-zA-Z0-9_-]*/REDACTED_SCRIPT_ID/g' "$file"
done
EOF

chmod +x /tmp/sanitize-docs.sh
/tmp/sanitize-docs.sh

git add docs/
git commit -m "security: sanitizar credenciales en documentación"
git push origin main
```

---

## 📋 CHECKLIST DE SEGURIDAD POST-REMEDIACIÓN

### Inmediato

- [ ] `.env.production` eliminado del repo público
- [ ] `.env.production` añadido a `.gitignore`
- [ ] Historial de Git limpiado (BFG o filter-branch)
- [ ] Force push realizado

### Rotación de Credenciales

- [ ] Stripe Public Key rotada
- [ ] Google Apps Script re-deployed
- [ ] CRM Secret Token regenerado
- [ ] PayPal links verificados/regenerados

### Migración

- [ ] Implementaciones copiadas a repo privado
- [ ] Implementaciones eliminadas de repo público
- [ ] README pointer creado

### Limpieza

- [ ] Tokens hardcodeados removidos de scripts
- [ ] Documentación sanitizada o movida
- [ ] Verificación final de exposición

---

## 🔍 VERIFICACIÓN POST-REMEDIACIÓN

### 1. Buscar Credenciales Residuales

```bash
cd /home/masua/iku-cabalactiva

# Buscar patterns de credenciales
grep -r "pk_live_" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "IKU_CRM_2025_SECURE" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "AKfycb" . --exclude-dir=node_modules --exclude-dir=.git

# Si todo limpio, resultado debe ser vacío
```

### 2. Verificar GitHub

```bash
# Clonar repo fresco para verificar
cd /tmp
git clone https://github.com/mdasuaje/iku-cabalactiva.git test-clean
cd test-clean

# Buscar credenciales
grep -r "pk_live_51Rxxvl" .
# Debe retornar: no matches
```

### 3. Usar TruffleHog (Recomendado)

```bash
cd /home/masua/iku-cabalactiva

# Instalar trufflehog
pip install trufflehog

# Escanear repo
trufflehog --regex --entropy=True .

# O con Docker
docker run -it -v "$PWD:/proj" trufflesecurity/trufflehog:latest github --repo=https://github.com/mdasuaje/iku-cabalactiva
```

---

## 📊 IMPACTO ESTIMADO

| Área | Antes | Después | Mejora |
|------|-------|---------|---------|
| **Exposición Pública** | 🔴 100% | 🟢 0% | ✅ |
| **Riesgo de Fraude** | 🔴 Alto | 🟢 Bajo | ✅ |
| **Compliance** | 🔴 Falla | 🟢 Pass | ✅ |
| **Tiempo Invertido** | - | ~3h | - |

---

## 🎯 RECOMENDACIONES FUTURAS

### 1. Automatización

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on: [push, pull_request]

jobs:
  trufflehog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

### 2. Pre-commit Hooks

```bash
# .git/hooks/pre-commit
#!/bin/bash

if git diff --cached --name-only | grep -E "\.env|\.env\.(production|local)$"; then
  echo "🚨 ERROR: Intentando commitear archivo .env"
  echo "Esto está bloqueado por razones de seguridad."
  exit 1
fi

if git diff --cached | grep -E "pk_live_|sk_live_|IKU_CRM_2025_SECURE"; then
  echo "🚨 ALERTA: Posible credencial detectada en commit"
  echo "Revisar cambios antes de continuar."
  read -p "¿Continuar de todos modos? (y/N): " confirm
  [[ $confirm != [yY] ]] && exit 1
fi
```

### 3. Educación del Equipo

- ✅ Nunca commitear archivos `.env*` (excepto `.env.example`)
- ✅ Usar variables de entorno para credenciales
- ✅ Documentación técnica con ejemplos genéricos solamente
- ✅ Revisión de seguridad antes de cada push

---

## 📞 CONTACTOS DE EMERGENCIA

**Si detectas uso fraudulento:**

- **Stripe:** https://support.stripe.com/contact/email
- **PayPal:** https://www.paypal.com/us/smarthelp/contact-us
- **Google Cloud:** https://support.google.com/cloud/answer/4943265

---

**Creado:** 2025-11-12  
**Prioridad:** 🔴 CRÍTICA  
**Estado:** PENDIENTE DE EJECUCIÓN  
**Responsable:** @mdasuaje
