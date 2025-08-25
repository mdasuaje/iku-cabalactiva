# Security Guidelines

## Environment Variables

**NEVER commit sensitive environment variables to version control.**

### Setup
1. Copy `.env.example` to `.env.local`
2. Fill in your actual credentials in `.env.local`
3. `.env.local` is automatically ignored by git

### Exposed Credentials - Immediate Actions Required

If credentials were exposed in git history:

1. **Revoke all exposed API keys immediately**
2. **Generate new credentials**
3. **Update production environment**

### Affected Services
- PayPal API credentials
- Google Calendar API key
- Stripe keys
- Google Apps Script deployment

### Best Practices
- Use environment-specific files (.env.local, .env.production)
- Never commit actual credentials
- Rotate keys regularly
- Use least-privilege access
- Monitor for unauthorized usage

## Deployment Security

### GitHub Actions
- Use GitHub Secrets for sensitive values
- Never log sensitive information
- Validate all inputs

### Production
- Use secure environment variable injection
- Enable HTTPS only
- Implement proper CORS policies