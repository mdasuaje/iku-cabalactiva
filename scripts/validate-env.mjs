// scripts/validate-env.mjs
const requiredVars = [
  'VITE_GOOGLE_APP_SCRIPT_URL',
  'VITE_CRM_SECRET_TOKEN',
  'VITE_PAYPAL_SESION_INDIVIDUAL',
  'VITE_PAYPAL_PAQUETE_COMPLETO',
  'VITE_STRIPE_SESION_INDIVIDUAL',
  'VITE_STRIPE_PAQUETE_COMPLETO'
];

console.log('🔍 Verificando variables de entorno críticas para producción...');
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ ¡ERROR! Faltan las siguientes variables de entorno críticas:');
  missingVars.forEach(v => console.error(`  - ${v}`));
  console.error('\n🚨 BLOQUEO DE DESPLIEGUE ACTIVADO');
  console.error('💡 Configura estas variables en GitHub Secrets antes de continuar.');
  process.exit(1); // Falla el script y detiene el workflow
}

console.log('✅ Todas las variables de entorno críticas están presentes.');
console.log('🚀 Continuando con el despliegue seguro...');
process.exit(0);