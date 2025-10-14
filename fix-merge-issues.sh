#!/bin/bash

# Script de reparación para problemas detectados durante el merge CRM Payment Gateway

echo "🔧 Iniciando reparación de problemas post-merge..."

# 1. Otorgar permisos de ejecución a los scripts creados
echo "📝 Otorgando permisos de ejecución a scripts..."
chmod +x deploy-to-production.sh
chmod +x diagnose.sh

# 2. Comprobar si crmServiceFixed.js existe y aplicar correcciones
echo "🔍 Aplicando correcciones al servicio CRM..."
if [ -f "src/services/crmServiceFixed.js" ]; then
  # Realizar copia de seguridad del original
  cp src/services/crmService.js src/services/crmService.js.bak
  
  # Reemplazar el servicio existente con la versión corregida
  cp src/services/crmServiceFixed.js src/services/crmService.js
  
  echo "✅ Servicio CRM actualizado con versión tolerante a fallos"
else
  echo "❌ No se encontró la versión corregida del servicio CRM"
fi

# 3. Añadir archivos creados o modificados al repositorio
echo "📝 Añadiendo archivos al repositorio..."
git add deploy-to-production.sh diagnose.sh docs/BRANCH_PROTECTION_SETUP.md src/services/crmService.js

# 4. Crear un commit con las correcciones
echo "📝 Creando commit con correcciones post-merge..."
git commit -m "fix: correcciones post-merge CRM Payment Gateway
- Añade scripts deploy-to-production.sh y diagnose.sh
- Mejora tolerancia a fallos del servicio CRM
- Añade documentación para protección de rama principal"

echo "
✅ Reparación completada. Acciones realizadas:
-----------------------------------------------
1. Scripts faltantes creados y con permisos de ejecución
2. Servicio CRM mejorado con mayor tolerancia a fallos
3. Documentación de protección de rama principal creada
4. Cambios confirmados en un commit

🚀 Próximos pasos recomendados:
-----------------------------------------------
1. Aplicar la protección de rama principal en GitHub siguiendo la guía en docs/BRANCH_PROTECTION_SETUP.md
2. Ejecutar una suite completa de pruebas: npm run test
3. Volver a ejecutar diagnose.sh para verificar el estado del sistema
4. Considerar un despliegue a producción una vez verificado todo
"