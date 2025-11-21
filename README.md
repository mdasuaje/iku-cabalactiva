# 🌟 IKU Cábala Activa

**Herramientas Espirituales del Maestro Isaac Benzaquén**

Una plataforma web moderna para conectar personas with la sabiduría ancestral de la Cábala a través de herramientas espirituales personalizadas.

[![Deploy Status](https://github.com/mdasuaje/iku-cabalactiva/workflows/🌟%20Production%20Deployment%20to%20GitHub%20Pages/badge.svg)](https://github.com/mdasuaje/iku-cabalactiva/actions)
[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fiku-cabalactiva.com)](https://iku-cabalactiva.com)

## 📚 Documentation

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Complete CI/CD setup and GitHub Secrets configuration
- **[Security Documentation](docs/SECURITY.md)** - Security best practices and guidelines
- **[Change Log](CHANGELOG.md)** - Version history and updates

## 🎯 Descripción del Proyecto

IKU Cábala Activa es una landing page diseñada para promocionar y vender herramientas espirituales cabalísticas desarrolladas por el Maestro y Rabino Isaac Benzaquén. El sitio ofrece cuatro herramientas principales:

1. **Carta Astral Cabalística** ($97 USD)
2. **Constelación Familiar Cabalística** ($147 USD)  
3. **Limpieza Áurica Cabalística** ($247 USD)
4. **Meditación Cabalística** ($97 USD)

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Deployment**: GitHub Pages
- **Domain**: Custom domain via CNAME

### Estructura del Proyecto
```
iku-cabalactiva/
├── public/                 # Assets estáticos
├── src/
│   ├── components/        # Componentes React
│   │   ├── common/       # Componentes reutilizables
│   │   ├── sections/     # Secciones de página
│   │   └── pages/        # Páginas principales
│   ├── data/            # Datos estáticos
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Estilos personalizados
│   └── utils/           # Utilidades
├── .github/workflows/   # GitHub Actions
└── dist/               # Build de producción
```

## 🚀 Configuración e Instalación

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/mdasuaje/iku-cabalactiva.git
cd iku-cabalactiva
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con las variables necesarias
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run test         # Ejecutar tests
npm run lint         # Linting del código
npm run format       # Formatear código con Prettier
npm run deploy       # Deploy manual a GitHub Pages
```

## 🌍 Configuración de Dominio

### DNS Settings

```dns
# Registros A para el dominio raíz
Type: A    Host: @    Value: 185.199.108.153
Type: A    Host: @    Value: 185.199.109.153
Type: A    Host: @    Value: 185.199.110.153
Type: A    Host: @    Value: 185.199.111.153

# Registro CNAME para www
Type: CNAME    Host: www    Value: mdasuaje.github.io
```

### GitHub Pages Configuration
- **Source**: GitHub Actions
- **Custom domain**: iku-cabalactiva.com
- **Enforce HTTPS**: ✅

## 📊 Features Implementadas

### ✅ Funcionalidades Core
- [x] Landing page responsive con diseño moderno
- [x] Sistema de lazy loading para mejor performance
- [x] Formularios de contacto con validación
- [x] WhatsApp integration
- [x] SEO optimizado con meta tags dinámicos
- [x] Performance optimizations
- [x] Error boundaries y manejo de errores
- [x] Loading states y componentes reutilizables
- [x] Animaciones con Framer Motion
- [x] GitHub Actions CI/CD

### 🎨 Diseño y UX
- [x] Tema cabalístico con colores dorados y púrpuras
- [x] Tipografías premium (Inter, Playfair Display)
- [x] Componentes reutilizables con Tailwind CSS
- [x] Micro-interacciones y hover effects
- [x] Mobile-first responsive design
- [x] Dark theme optimizado para contenido espiritual

## 🚢 Deployment

**For complete deployment instructions, see [DEPLOYMENT.md](docs/DEPLOYMENT.md)**

### Quick Start - Automatic Deployment

The project uses a secure CI/CD pipeline with GitHub Actions:

1. **Push to `main` branch** - Triggers automatic deployment
2. **GitHub Actions workflow** runs:
   - ✅ Installs dependencies
   - ✅ Validates environment configuration
   - ✅ Builds production static site
   - ✅ Scans for exposed secrets
   - ✅ Validates build artifacts
   - ✅ Deploys to GitHub Pages
   - ✅ Verifies deployment health
3. **Site live** at `https://iku-cabalactiva.com`

### Required Configuration

Before deployment, configure **GitHub Secrets** (see [DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete list):

**Essential Secrets**:
- `VITE_SITE_URL` - Production site URL
- `VITE_GOOGLE_APP_SCRIPT_URL` - CRM backend
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key
- `VITE_PAYPAL_CLIENT_ID` - PayPal client ID
- Plus 20+ optional payment and integration URLs

Navigate to **Settings** → **Secrets and variables** → **Actions** to configure.

### Manual Deployment

For manual deployment (not recommended):
```bash
npm run deploy
```

## 🔒 Security

**For complete security guidelines, see [SECURITY.md](docs/SECURITY.md)**

### Key Security Features

- ✅ **No secrets in code** - All sensitive data via GitHub Secrets
- ✅ **Automated secret scanning** - Build fails if secrets detected
- ✅ **Build-time injection only** - Environment variables injected during build
- ✅ **HTTPS enforced** - All traffic encrypted via GitHub Pages
- ✅ **Minimal permissions** - CI/CD workflow uses least-privilege principle
- ✅ **PCI DSS compliant** - Payment processing via Stripe/PayPal

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Contact: **mdasuaje@proton.me** with subject `[SECURITY] IKU CABALA ACTIVA`

## 📝 License

Private project - All rights reserved to IKU Cábala Activa and Isaac Benzaquén.

---

**IKU Cábala Activa** - Transformando vidas a través de la sabiduría ancestral 🌟  