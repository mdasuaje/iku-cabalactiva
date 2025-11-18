# 🔒 Security Documentation - IKU CABALA ACTIVA

## Security Overview

This document outlines the security measures implemented in the IKU CABALA ACTIVA CI/CD pipeline and deployment process.

## Environment Variables

**NEVER commit sensitive environment variables to version control.**

### Local Development Setup
1. Copy `.env.example` to `.env.local`
2. Fill in your actual credentials in `.env.local`
3. `.env.local` is automatically ignored by git
4. Never commit `.env`, `.env.local`, or `.env.production` files

### Production Deployment
All production secrets are managed via **GitHub Secrets**:
- Navigate to **Settings** → **Secrets and variables** → **Actions**
- Add each required secret (see DEPLOYMENT.md for complete list)
- Secrets are encrypted and only accessible during workflow execution

## Secrets Management

### GitHub Secrets Security

All sensitive configuration is stored as **GitHub Secrets**:

- **Storage**: Encrypted at rest using GitHub's encryption
- **Transmission**: Encrypted in transit via TLS
- **Access**: Only accessible during workflow execution
- **Audit**: All secret access is logged in workflow runs
- **Rotation**: Secrets should be rotated every 90 days

### Secret Types

#### 🔐 Never Expose (Backend Only)
These should **NEVER** be in frontend code:
- Stripe Secret Keys (`sk_test_*`, `sk_live_*`)
- PayPal Secret Keys
- Database credentials
- Private API keys
- JWT signing secrets

#### ✅ Safe for Frontend (Public Keys)
These can be safely embedded in frontend code:
- Stripe Publishable Keys (`pk_test_*`, `pk_live_*`)
- PayPal Client IDs
- Google Maps API keys (with domain restrictions)
- Public configuration values

### Environment Variable Naming Convention

All frontend environment variables **MUST** be prefixed with `VITE_`:

```javascript
// ✅ Correct - Accessible in frontend
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// ❌ Wrong - Not accessible without VITE_ prefix
const apiKey = import.meta.env.API_SECRET_KEY;
```

## Build-Time Security

### 1. Automated Secret Scanning

The CI/CD pipeline includes automated secret scanning:

```bash
# Scan for Stripe secret keys
grep -r "sk_live_\|sk_test_\|pk_test_51" dist/

# Scan for other sensitive patterns
grep -r "SECRET\|PASSWORD\|PRIVATE_KEY" dist/
```

If secrets are detected, the build fails immediately.

### 2. Dependency Security

```yaml
# Reproducible builds with locked versions
npm ci --prefer-offline --no-audit

# Regular security audits
npm audit
```

### 3. Build Validation

The pipeline validates:
- ✅ dist directory exists
- ✅ index.html is not empty
- ✅ Minimum file size requirements met
- ✅ No exposed secrets in build artifacts
- ✅ CNAME file preserved for custom domain

## Deployment Security

### GitHub Pages Security Features

1. **HTTPS Enforcement**: All traffic encrypted via TLS
2. **CDN Protection**: Cloudflare DDoS protection
3. **Domain Validation**: Custom domain verified via DNS
4. **Access Control**: Deploy access via GitHub permissions

### Deployment Workflow Security

```yaml
# Minimal permissions principle
permissions:
  contents: read      # Read code only
  pages: write        # Deploy to Pages only
  id-token: write     # OIDC token for authentication

# No concurrent deployments
concurrency:
  group: "pages-deployment"
  cancel-in-progress: false
```

## Payment Integration Security

### Stripe Security

```javascript
// ✅ Correct - Public key only
const stripe = Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ❌ NEVER do this - Secret key exposure
const stripe = Stripe('sk_live_xxxxx');
```

**Security Measures**:
- ✅ Only publishable keys used in frontend
- ✅ Payment processing happens on Stripe's servers
- ✅ No credit card data touches our servers
- ✅ PCI DSS compliance handled by Stripe
- ✅ HTTPS required for all Stripe API calls

### PayPal Security

```javascript
// ✅ Correct - Client ID only
paypal.Buttons({
  createOrder: function(data, actions) {
    // Order creation via PayPal SDK
  }
});
```

**Security Measures**:
- ✅ Only client ID used in frontend
- ✅ Payment processing on PayPal's servers
- ✅ OAuth authentication for API access
- ✅ PCI DSS compliance handled by PayPal

## CRM & API Security

### Google Apps Script Integration

```javascript
const response = await fetch(import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_CRM_SECRET_TOKEN}`
  },
  body: JSON.stringify(data)
});
```

**Security Measures**:
- ✅ Apps Script URL kept secret
- ✅ Token-based authentication
- ✅ CORS restrictions on Apps Script
- ✅ Rate limiting on server side
- ✅ Input validation on server side

## Incident Response

### If Credentials are Exposed

**Immediate Actions Required**:

1. **Revoke all exposed API keys immediately**
   - Stripe: Revoke in Stripe Dashboard → Developers → API Keys
   - PayPal: Revoke in PayPal Developer Dashboard
   - Google: Revoke in Google Cloud Console

2. **Generate new credentials**
   - Create new API keys/tokens
   - Update GitHub Secrets with new values

3. **Update production environment**
   - Trigger new deployment with updated secrets
   - Verify new keys work correctly

4. **Investigate and document**
   - Review git history for exposure
   - Check workflow logs
   - Document incident and prevention measures

### Affected Services
- PayPal API credentials
- Google Calendar API key
- Stripe keys
- Google Apps Script deployment
- CRM authentication tokens

### Reporting Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

**Contact**:
- **Email**: mdasuaje@proton.me
- **Subject**: [SECURITY] IKU CABALA ACTIVA Vulnerability Report

**Include**:
- Vulnerability description
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

## Best Practices

### For Developers

1. **Never commit secrets**: Use `.env.local` for local development
2. **Use public keys only**: Frontend should only use public/publishable keys
3. **Validate inputs**: Always validate and sanitize user input
4. **Keep dependencies updated**: Run `npm audit` regularly
5. **Review PRs carefully**: Check for accidental secret exposure
6. **Test locally first**: Use `npm run build` before pushing
7. **Use git hooks**: Implement pre-commit hooks to prevent secret commits

### For Administrators

1. **Rotate secrets regularly**: At least every 90 days
2. **Monitor workflow logs**: Review for suspicious activity
3. **Enable GitHub security features**: Dependabot, security advisories, secret scanning
4. **Backup secrets securely**: Store in password manager (1Password, LastPass, etc.)
5. **Document changes**: Keep security documentation updated
6. **Limit repository access**: Only trusted team members with necessary permissions
7. **Enable 2FA**: Require two-factor authentication for all collaborators

### For Deployment

#### GitHub Actions Best Practices
- ✅ Use GitHub Secrets for sensitive values
- ✅ Never log sensitive information
- ✅ Validate all inputs
- ✅ Use minimal permissions
- ✅ Pin action versions (avoid `@latest`)
- ✅ Review workflow logs after each deployment

#### Production Best Practices
- ✅ Use secure environment variable injection
- ✅ Enable HTTPS only
- ✅ Implement proper CORS policies
- ✅ Set Content Security Policy headers
- ✅ Regular security audits
- ✅ Monitor for unauthorized access

## Vulnerability Management

### Regular Security Audits

```bash
# Check for known vulnerabilities
npm audit

# Fix non-breaking vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

### Update Policy

- **Critical vulnerabilities**: Immediate update required
- **High severity**: Update within 7 days
- **Medium severity**: Update within 30 days
- **Low severity**: Update during regular maintenance

### Automated Security Monitoring

GitHub automatically:
- ✅ Scans dependencies for vulnerabilities
- ✅ Creates Dependabot alerts
- ✅ Suggests security updates
- ✅ Scans for exposed secrets in commits

## Compliance

### Data Protection
- **HTTPS**: All data in transit encrypted
- **No PII Storage**: Personal data not stored locally
- **Third-party Processing**: Payment data handled by certified processors
- **User Consent**: Required before data collection

### PCI DSS Compliance
- ✅ No card data stored or processed on our servers
- ✅ Stripe and PayPal are PCI DSS Level 1 certified
- ✅ All payment forms served over HTTPS
- ✅ No logging of payment information

## Security Checklist

### Pre-Deployment
- [ ] All secrets configured in GitHub Secrets
- [ ] No secrets in source code
- [ ] `.env*` files in `.gitignore`
- [ ] Dependencies updated and scanned
- [ ] No use of deprecated APIs
- [ ] HTTPS enforcement enabled

### During Deployment
- [ ] Build completes without errors
- [ ] Secret scanning passes
- [ ] No sensitive data in logs
- [ ] Build artifacts validated
- [ ] CNAME file present

### Post-Deployment
- [ ] Site accessible via HTTPS
- [ ] Payment integration works
- [ ] No console errors
- [ ] SSL certificate valid
- [ ] Custom domain resolves correctly

## Security Resources

### Tools
- **GitHub Secret Scanning**: Automatic detection of exposed secrets
- **Dependabot**: Automated dependency updates
- **npm audit**: Vulnerability scanning for Node.js packages
- **TruffleHog**: Git repository secret scanning (optional)

### Documentation
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Stripe Security Guide](https://stripe.com/docs/security)
- [PayPal Security](https://developer.paypal.com/docs/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Last Updated**: November 2024
**Maintained By**: IKU CABALA ACTIVA Development Team
**Security Contact**: mdasuaje@proton.me