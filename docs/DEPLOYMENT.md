# 🚀 Deployment Guide - IKU CABALA ACTIVA

## Overview

This document provides comprehensive instructions for deploying the IKU CABALA ACTIVA landing page to production using GitHub Actions and GitHub Pages.

## Architecture

The deployment pipeline uses a **secure CI/CD workflow** that:

1. ✅ Builds the static production site from source code
2. ✅ Injects environment variables from GitHub Secrets during build
3. ✅ Scans for exposed secrets in build artifacts
4. ✅ Deploys to GitHub Pages with custom domain
5. ✅ Validates deployment health and accessibility

## Prerequisites

### Required Accounts & Access

- GitHub repository with **Actions** enabled
- GitHub Pages enabled in repository settings
- Access to configure **GitHub Secrets** (requires admin/maintainer role)
- Domain registrar access to configure DNS (if using custom domain)

### Required Services

The application integrates with the following services:

- **Stripe**: Payment processing for spiritual tools
- **PayPal**: Alternative payment processor
- **Google Apps Script**: CRM and contact form backend
- **EmailJS** (Optional): Email notifications
- **Google Sheets** (Optional): Data storage

## GitHub Secrets Configuration

### Setting Up Secrets

Navigate to your repository on GitHub:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret listed below

### Required Secrets

#### 🌐 Site Configuration

| Secret Name | Description | Example Value | Required |
|------------|-------------|---------------|----------|
| `VITE_SITE_URL` | Production site URL | `https://iku-cabalactiva.com` | ✅ Yes |

#### 📧 CRM & Contact Integration

| Secret Name | Description | Example Value | Required |
|------------|-------------|---------------|----------|
| `VITE_GOOGLE_APP_SCRIPT_URL` | Google Apps Script webhook URL | `https://script.google.com/macros/s/...` | ✅ Yes |
| `VITE_WEB_APP_URL` | Alternative web app URL | `https://script.google.com/...` | ⚠️ Conditional |
| `VITE_CRM_SECRET_TOKEN` | CRM authentication token | `your-secret-token-here` | ⚠️ Conditional |

#### 💳 Stripe Payment Configuration

> **Note:**  
> There are two similar environment variables for the Stripe publishable key:  
> - `VITE_STRIPE_PUBLIC_KEY` (recommended, standard)  
> - `VITE_STRIPE_PUBLISHABLE_KEY` (legacy/alternate; use only if your codebase or workflow specifically requires it)  
>  
> For most setups, only `VITE_STRIPE_PUBLIC_KEY` is needed. If you are migrating from an older configuration or using code that expects `VITE_STRIPE_PUBLISHABLE_KEY`, you may set both to the same value.

| Secret Name | Description | Example Value | Required |
|------------|-------------|---------------|----------|
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key (recommended) | `pk_live_...` | ✅ Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (legacy/alternate; use only if required) | `pk_live_...` | ⚠️ If used |
| `VITE_STRIPE_CHECKOUT` | Stripe checkout URL | `https://buy.stripe.com/...` | ⚠️ Optional |

#### 💳 Stripe Product URLs

| Secret Name | Description | Example Value | Required |
|------------|-------------|---------------|----------|
| `VITE_STRIPE_CARTA_URL` | Carta Astral Cabalística ($97) | `https://buy.stripe.com/...` | ⚠️ Optional |
| `VITE_STRIPE_CONSTELACION_URL` | Constelación Familiar ($147) | `https://buy.stripe.com/...` | ⚠️ Optional |
| `VITE_STRIPE_MEDITACION_URL` | Meditación Cabalística ($97) | `https://buy.stripe.com/...` | ⚠️ Optional |
| `VITE_STRIPE_LIMPIEZA_URL` | Limpieza Áurica ($247) | `https://buy.stripe.com/...` | ⚠️ Optional |
| `VITE_STRIPE_PAQUETE_URL` | Full Package | `https://buy.stripe.com/...` | ⚠️ Optional |
| `VITE_STRIPE_PAQUETE_PARTES_URL` | Package Parts | `https://buy.stripe.com/...` | ⚠️ Optional |

#### 💰 PayPal Payment Configuration

| Secret Name | Description | Example Value | Required |
|------------|-------------|---------------|----------|
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID | `AaBbCcDd...` | ⚠️ If using PayPal |
| `VITE_PAYPAL_CLIENT_TOKEN` | PayPal client token | `your-token-here` | ⚠️ If using PayPal |
| `VITE_PAYPAL_SINGLE_SESSION` | Single session link | `https://paypal.me/...` | ⚠️ Optional |
| `VITE_PAYPAL_FULL_PACKAGE` | Full package link | `https://paypal.me/...` | ⚠️ Optional |

#### 💰 PayPal Product URLs

| Secret Name | Description | Example Value | Required |
|------------|-------------|---------------|----------|
| `VITE_PAYPAL_CARTA_URL` | Carta Astral Cabalística | `https://paypal.me/...` | ⚠️ Optional |
| `VITE_PAYPAL_CONSTELACION_URL` | Constelación Familiar | `https://paypal.me/...` | ⚠️ Optional |
| `VITE_PAYPAL_MEDITACION_URL` | Meditación Cabalística | `https://paypal.me/...` | ⚠️ Optional |
| `VITE_PAYPAL_LIMPIEZA_URL` | Limpieza Áurica | `https://paypal.me/...` | ⚠️ Optional |
| `VITE_PAYPAL_PAQUETE_URL` | Full Package | `https://paypal.me/...` | ⚠️ Optional |

#### 📧 Email Configuration (Optional)

| Secret Name | Description | Example Value | Required |
|------------|-------------|---------------|----------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | `service_xxxxx` | ❌ Optional |
| `VITE_EMAILJS_TEMPLATE_ID_CONTACT` | EmailJS template ID | `template_xxxxx` | ❌ Optional |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | `your-public-key` | ❌ Optional |
| `VITE_EMAIL_ADMIN` | Admin email | `admin@iku-cabalactiva.com` | ❌ Optional |
| `VITE_EMAIL_MAESTRO` | Maestro email | `maestro@iku-cabalactiva.com` | ❌ Optional |

#### 📊 Google Sheets Integration (Optional)

| Secret Name | Description | Example Value | Required |
|------------|-------------|---------------|----------|
| `VITE_SPREADSHEET_ID` | Google Sheets ID | `1AbC...xyz` | ❌ Optional |
| `VITE_DEPLOYMENT_ID` | Deployment ID | `AKfyc...` | ❌ Optional |
| `VITE_GOOGLE_CALENDAR_API_KEY` | Google Calendar API key | `AIza...` | ❌ Optional |

#### 📱 Contact Configuration (Optional)

| Secret Name | Description | Example Value | Required |
|------------|-------------|---------------|----------|
| `VITE_WHATSAPP_NUMBER` | WhatsApp number with country code | `+19298336069` | ❌ Optional |

### Secret Naming Convention

All environment variables for the frontend must be prefixed with `VITE_` to be accessible during build.

**Security Note**: Never commit actual values to the repository. Always use GitHub Secrets for production values.

## Custom Domain Configuration

### DNS Settings

Configure the following DNS records at your domain registrar:

```dns
# A Records for apex domain (@)
Type: A     Host: @     Value: 185.199.108.153
Type: A     Host: @     Value: 185.199.109.153
Type: A     Host: @     Value: 185.199.110.153
Type: A     Host: @     Value: 185.199.111.153

# CNAME for www subdomain
Type: CNAME Host: www   Value: mdasuaje.github.io
```

### GitHub Pages Settings

1. Go to **Settings** → **Pages**
2. **Source**: Deploy from a branch → `gh-pages` or GitHub Actions
3. **Custom domain**: `iku-cabalactiva.com`
4. **Enforce HTTPS**: ✅ Enabled

## Deployment Process

### Automatic Deployment

The deployment happens automatically when:

1. Code is pushed to the `main` branch
2. A pull request is merged to `main`

The workflow will:
1. ✅ Checkout the code
2. ✅ Install dependencies
3. ✅ Validate environment configuration
4. ✅ Build the production static site with injected secrets
5. ✅ Scan for exposed secrets in build artifacts
6. ✅ Validate build artifacts
7. ✅ Deploy to GitHub Pages
8. ✅ Verify deployment health

### Manual Deployment

To trigger a manual deployment:

1. Go to **Actions** tab in GitHub
2. Select **🌟 Production Deployment to GitHub Pages** workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow** button

### Build Process

The build process:

```bash
# Install dependencies
npm ci --prefer-offline --no-audit

# Validate environment
node scripts/verify-env.js

# Build with Vite
npm run build

# Output: ./dist directory with static files
```

### Environment Variables During Build

Environment variables are injected at build time. Vite replaces `import.meta.env.VITE_*` with actual values during the build.

**Example**:
```javascript
// In source code:
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// After build:
const stripeKey = "pk_live_xxxxx...";
```

## Security Best Practices

### ✅ DO's

- ✅ Use GitHub Secrets for all sensitive values
- ✅ Use publishable/public keys for client-side integrations (Stripe, PayPal)
- ✅ Rotate secrets regularly
- ✅ Use different keys for test/development and production
- ✅ Review GitHub Actions logs for any exposed data
- ✅ Enable HTTPS enforcement on GitHub Pages
- ✅ Use CNAME file for custom domain

### ❌ DON'Ts

- ❌ Never commit secrets to the repository
- ❌ Never use secret/private keys in frontend code
- ❌ Never log secrets in console or GitHub Actions
- ❌ Never commit `.env`, `.env.production`, or `.env.local` files
- ❌ Never expose API secret keys in client-side code
- ❌ Never disable HTTPS on production

## Troubleshooting

### Build Fails

1. Check GitHub Actions logs for specific error
2. Verify all required secrets are configured
3. Test build locally: `npm run build`
4. Ensure `dist/` directory is in `.gitignore`

### Blank Page After Deployment

1. Check browser console for errors
2. Verify base URL is configured correctly in `vite.config.js`
3. Check that `dist/index.html` exists
4. Verify GitHub Pages source is set correctly

### Payment Integration Not Working

1. Verify Stripe/PayPal secrets are configured
2. Check that public keys are used (not secret keys)
3. Test payment URLs in browser
4. Check browser console for CORS errors
5. Verify environment variables are properly prefixed with `VITE_`

### Custom Domain Not Working

1. Verify DNS records are configured correctly
2. Wait 24-48 hours for DNS propagation
3. Check that CNAME file exists in repository root
4. Verify CNAME file is copied to `dist/` during build
5. Check GitHub Pages settings

### Environment Variables Not Available

1. Ensure variable names are prefixed with `VITE_`
2. Verify secrets are configured in GitHub Settings
3. Check that workflow includes the secret in `env:` section
4. Rebuild to apply new environment variables

## Monitoring & Validation

### Post-Deployment Checks

After each deployment, verify:

1. ✅ Site is accessible at https://iku-cabalactiva.com
2. ✅ No console errors in browser
3. ✅ Payment buttons work correctly
4. ✅ Contact forms submit successfully
5. ✅ Images and assets load properly
6. ✅ Mobile responsiveness works
7. ✅ HTTPS certificate is valid

### Health Check Commands

```bash
# Check deployment status
curl -I https://iku-cabalactiva.com

# Verify HTTPS
curl -v https://iku-cabalactiva.com 2>&1 | grep -i "SSL certificate"

# Test page load
curl -s https://iku-cabalactiva.com | grep -i "IKU"
```

## Rollback Procedure

If deployment fails or causes issues:

1. Go to **Actions** tab
2. Find the last successful workflow run
3. Click **Re-run all jobs**
4. Or revert the commit and push to `main`

## Support & Contact

For deployment issues or questions:

- **Developer**: Mauro D. Asuaje G. (mdasuaje@proton.me)
- **Content Owner**: Rabbi Isaac Benzaquén
- **GitHub Repository**: https://github.com/mdasuaje/iku-cabalactiva

---

**IKU Cábala Activa** - Transformando vidas a través de la sabiduría ancestral 🌟
