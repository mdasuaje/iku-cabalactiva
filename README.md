# 🌟 IKU Cábala Activa

**Herramientas Espirituales del Maestro Isaac Benzaquén**

Una plataforma web moderna para conectar personas with la sabiduría ancestral de la Cábala a través de herramientas espirituales personalizadas.

## 🎯 Descripción del Proyecto

IKU Cábala Activa es una landing page diseñada para promocionar y vender herramientas espirituales cabalísticas desarrolladas por el Maestro y Rabino Isaac Benzaquén. El sitio ofrece cuatro herramientas principales:

1. **Carta Astral Cabalística** ($67 USD)
2. **Constelación Familiar Cabalística** ($97 USD)  
3. **Limpieza Áurica Cabalística** ($150 USD)
4. **Meditación Cabalística** ($67 USD)

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

### Automatic Deployment
El proyecto usa GitHub Actions para deployment automático:

1. Push a la rama `main`
2. GitHub Actions ejecuta tests y build
3. Deploy automático a GitHub Pages
4. Site disponible en `https://iku-cabalactiva.com`

### Manual Deployment
```bash
npm run deploy
```

## 🌿 Branch Policy

### Repositorio Público (iku-cabalactiva)

Este repositorio público solo mantiene las siguientes ramas:

- **`main`**: Rama de producción
  - Protegida contra eliminación y force push
  - Requiere PR y revisión para cambios
  - Deploy automático a GitHub Pages

- **`gh-pages`**: Rama de deployment
  - Generada automáticamente por GitHub Actions
  - No debe ser modificada manualmente

### Repositorio Privado (iku-cabalactiva-private)

Todo el desarrollo y ramas adicionales se mantienen en el repositorio privado:
- `develop` - Rama principal de desarrollo
- `feature/*` - Nuevas funcionalidades
- `bugfix/*` - Corrección de bugs
- `hotfix/*` - Correcciones urgentes
- `release/*` - Preparación de releases

### Migración de Ramas

Si necesitas migrar ramas del repositorio público al privado, consulta:
- 📖 [Guía de Migración de Ramas](/docs/BRANCH_MIGRATION_GUIDE.md)
- 🔧 Scripts en `/scripts/`:
  - `list-branches-to-migrate.sh` - Lista ramas a migrar
  - `migrate-branches-to-private.sh` - Migra ramas al privado
  - `verify-branches.sh` - Verifica la migración
  - `cleanup-public-branches.sh` - Limpia el repositorio público

## 📝 License

Private project - All rights reserved to IKU Cábala Activa and Isaac Benzaquén.

---

**IKU Cábala Activa** - Transformando vidas a través de la sabiduría ancestral 🌟  