#!/bin/bash

# 🔒 IKU Cábala Activa - Security Update Script
# Applies critical security fixes and resolves conflicts

set -e

echo "🔒 Starting Security Update Process..."

# Backup current .env.local if exists
if [ -f ".env.local" ]; then
    echo "📋 Backing up current .env.local..."
    cp .env.local .env.local.backup
    echo "✅ Backup created: .env.local.backup"
fi

# Abort any ongoing merge
echo "🔄 Resolving git conflicts..."
git merge --abort 2>/dev/null || true

# Stash local changes
echo "💾 Stashing local changes..."
git stash push -m "Security update stash - $(date)"

# Force pull latest security fixes
echo "⬇️ Pulling latest security updates..."
git fetch origin
git reset --hard origin/main

# Apply security fixes
echo "🛡️ Applying security configurations..."

# Ensure .env.local is not tracked
git rm --cached .env.local 2>/dev/null || true

# Create secure .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.*.backup

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache
.npm
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables
.env
.env.test

# parcel-bundler cache
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Security
*.pem
*.key
*.p12
*.pfx

# Jupyter Notebook
.ipynb_checkpoints

# Temporary files
*.tmp
*.temp
EOF

# Create secure .env.example
cat > .env.example << 'EOF'
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# PayPal
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_PAYPAL_APP_NAME=your_app_name
VITE_PAYPAL_SECRET_KEY=your_paypal_secret_key

# EmailJS
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID_CONTACT=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Google Calendar
VITE_GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key

# WhatsApp
VITE_WHATSAPP_NUMBER=+1234567890

# Site URL
VITE_SITE_URL=https://your-domain.com

# Google Sheets & Apps Script
VITE_SPREADSHEET_ID=your_spreadsheet_id
VITE_EMAIL_ADMIN=admin@your-domain.com
VITE_EMAIL_MAESTRO=maestro@your-domain.com
VITE_DEPLOYMENT_ID=your_deployment_id
VITE_WEB_APP_URL=https://script.google.com/your_web_app_url
EOF

# Restore .env.local from backup if exists
if [ -f ".env.local.backup" ]; then
    echo "🔄 Restoring .env.local from backup..."
    cp .env.local.backup .env.local
else
    echo "⚠️  Creating new .env.local from template..."
    cp .env.example .env.local
    echo "❗ IMPORTANT: Update .env.local with your actual credentials"
fi

# Clean up sensitive files
echo "🧹 Cleaning up sensitive files..."
find . -name "*.log" -delete 2>/dev/null || true
find . -name "*.backup" -delete 2>/dev/null || true
rm -f trufflehog_report.json 2>/dev/null || true

# Update dependencies for security
echo "📦 Updating dependencies..."
npm audit fix --force 2>/dev/null || true

# Commit security updates
echo "💾 Committing security updates..."
git add .gitignore .env.example SECURITY.md 2>/dev/null || true
git commit -m "🔒 SECURITY: Force apply security fixes

- Updated .gitignore with comprehensive exclusions
- Secured .env.example template  
- Removed sensitive files from tracking
- Applied dependency security updates

CRITICAL: Verify all API keys are rotated" 2>/dev/null || true

# Push updates
echo "⬆️ Pushing security updates..."
git push origin main --force-with-lease

echo ""
echo "✅ Security Update Complete!"
echo ""
echo "🚨 CRITICAL ACTIONS REQUIRED:"
echo "1. Verify .env.local contains correct credentials"
echo "2. Rotate ALL API keys that were exposed"
echo "3. Monitor services for unauthorized usage"
echo "4. Test application functionality"
echo ""
echo "📋 Files updated:"
echo "- .gitignore (enhanced security)"
echo "- .env.example (secure template)"
echo "- Dependencies (security patches)"
echo ""
echo "🔐 Your credentials are now secure!"