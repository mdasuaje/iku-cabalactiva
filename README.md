# 🌟 IKU Cábala Activa

**Herramientas Espirituales del Rabbí Isaac Benzaquén**

Una plataforma web moderna para conectar personas with la sabiduría ancestral de la Cábala a través de herramientas espirituales personalizadas.

## 🎯 Descripción del Proyecto

IKU Cábala Activa es una landing page diseñada para promocionar y vender herramientas espirituales cabalísticas desarrolladas por el Rabbí Isaac Benzaquén. El sitio ofrece cuatro herramientas principales:

1. **Carta Astral Cabalística** ($97 USD)
2. **Constelación Familiar Cabalística** ($147 USD)  
3. **Limpieza Áurica Cabalística** ($247 USD)
4. **Meditación Cabalística** ($97 USD)

Las cuatro (04) herramientas cabalísticas se presentan como un paquete completo que incluye además un Bono Especial que consiste en una 'Mandala de Poder y Éxito' que contiene un Árbol Cabalístico Personalizado imprimible. Esta 'Mandala de Poder y Éxito' o Kamea tiene un Valor Individual de $597 USD, y se ofrece todo este paquete por un valor de $997 USD.

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Deployment**: GitHub Pages
- **Domain**: Custom domain via CNAME
- **CRM Backend**: Google Apps Script
- **Database**: Google Sheets
- **Email**: Gmail API
- **Payments**: Stripe + PayPal

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

## 🔗 Arquitectura de Webhooks

### Sistema de Procesamiento de Pagos
- **Receptor**: Google Apps Script Web App
- **Procesadores**: Stripe + PayPal webhooks
- **CRM**: Google Sheets (Clientes, Compras, Sesiones)
- **Notificaciones**: Gmail API
- **Frontend**: GitHub Pages (estático)

### Flujo de Pago
1. Cliente completa pago en Stripe/PayPal
2. Webhook enviado a Google Apps Script
3. Registro automático en CRM (Google Sheets)
4. Notificaciones enviadas a maor@iku-cabalactiva.com y kabbalahuniversal@gmail.com
5. Sesión inicial programada automáticamente

## 📝 License

Private project - All rights reserved to IKU Cábala Activa and Isaac Benzaquén.

---

**IKU Cábala Activa** - Transformando vidas a través de la sabiduría ancestral 🌟  