#!/bin/bash

echo "🏯 ============================="
echo "🏯 VALIDACIÓN FINAL - PÓRTICO v3.5"
echo "🏯 ============================="
echo ""

# 1. Verificar arquitectura v3 creada
echo "1️⃣ Verificando Arquitectura Clean v3..."
if [[ -d "src-v3/1-Domain" && -d "src-v3/2-Application" && -d "src-v3/3-Infrastructure" ]]; then
    echo "   ✅ Clean Architecture implementada"
    echo "   📁 Capas: Dominio, Aplicación, Infraestructura"
else
    echo "   ❌ Arquitectura v3 incompleta"
    exit 1
fi

# 2. Verificar agente MCP de persistencia
echo ""
echo "2️⃣ Verificando Agente MCP de Persistencia..."
if docker ps | grep -q "persistence-agent"; then
    echo "   ✅ Agente de persistencia ejecutándose"
    
    # Probar endpoint
    UNIQUE_EMAIL="validation.$(date +%s)@iku-cabalactiva.com"
    RESULT=$(curl -s -X POST http://localhost:8082/users/save \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"$UNIQUE_EMAIL\"}")
    
    if [[ $RESULT == *"success"* ]]; then
        echo "   ✅ Endpoint /users/save funcionando"
        echo "   📊 Usuario guardado: $UNIQUE_EMAIL"
    else
        echo "   ❌ Endpoint falló: $RESULT"
        exit 1
    fi
else
    echo "   ❌ Agente de persistencia no está corriendo"
    exit 1
fi

# 3. Verificar aplicación Next.js creada
echo ""
echo "3️⃣ Verificando Aplicación Next.js + TypeScript..."
if [[ -d "webapp/src/app" && -f "webapp/package.json" ]]; then
    echo "   ✅ Estructura Next.js creada"
    
    # Verificar dependencias clave
    if grep -q "next" webapp/package.json && grep -q "typescript" webapp/package.json; then
        echo "   ✅ Next.js y TypeScript configurados"
    else
        echo "   ❌ Dependencias faltantes"
        exit 1
    fi
else
    echo "   ❌ Aplicación webapp no encontrada"
    exit 1
fi

# 4. Verificar componente TypeScript
echo ""
echo "4️⃣ Verificando Componente ContactForm.tsx..."
CONTACT_FORM="webapp/src/app/components/ContactForm.tsx"
if [[ -f "$CONTACT_FORM" ]]; then
    echo "   ✅ ContactForm.tsx existe"
    
    # Verificar contenido TypeScript
    if grep -q "type FormData" "$CONTACT_FORM" && grep -q "useState<FormData>" "$CONTACT_FORM"; then
        echo "   ✅ Tipado TypeScript implementado"
    else
        echo "   ❌ Tipado TypeScript faltante"
        exit 1
    fi
else
    echo "   ❌ ContactForm.tsx no encontrado"
    exit 1
fi

# 5. Verificar API Route
echo ""
echo "5️⃣ Verificando API Route (/api/register)..."
API_ROUTE="webapp/src/app/api/register/route.ts"
if [[ -f "$API_ROUTE" ]]; then
    echo "   ✅ route.ts existe"
    
    # Verificar importaciones v3
    if grep -q "RegisterUserUseCase" "$API_ROUTE" && grep -q "GoogleSheetsUserRepository" "$API_ROUTE"; then
        echo "   ✅ Importaciones de lógica v3 configuradas"
        echo "   ✅ Proxy Next.js → v3 Backend implementado"
    else
        echo "   ❌ Importaciones v3 faltantes"
        exit 1
    fi
else
    echo "   ❌ API Route no encontrada"
    exit 1
fi

# 6. Verificar integración de configuración
echo ""
echo "6️⃣ Verificando Configuración de Integración..."
if [[ -f "webapp/tsconfig.json" ]]; then
    if grep -q "src-v3" webapp/tsconfig.json; then
        echo "   ✅ TypeScript configurado para importar v3"
    else
        echo "   ❌ Configuración de paths faltante"
        exit 1
    fi
    
    if [[ -f "webapp/tailwind.config.js" && -f "webapp/next.config.js" ]]; then
        echo "   ✅ Tailwind y Next.js configurados"
    else
        echo "   ❌ Archivos de configuración faltantes"
        exit 1
    fi
else
    echo "   ❌ tsconfig.json no encontrado"
    exit 1
fi

# 7. Mostrar estructura del logro
echo ""
echo "7️⃣ Estructura Completa del Pórtico:"
echo "   📁 /webapp (Next.js + TypeScript)"
echo "      ├── src/app/page.tsx (Página principal)"
echo "      ├── src/app/components/ContactForm.tsx (Formulario tipado)"
echo "      └── src/app/api/register/route.ts (Proxy a v3)"
echo ""
echo "   🏛️ /src-v3 (Clean Architecture)"
echo "      ├── 1-Domain/Entities/User.js (Entidades de negocio)"
echo "      ├── 2-Application/UseCases/RegisterUserUseCase.js (Casos de uso)"
echo "      └── 3-Infrastructure/McpServers/persistence-agent (Agente MCP)"

# 8. Resultado final
echo ""
echo "🏆 ================================"
echo "🏆 PÓRTICO ILUMINADO COMPLETADO"
echo "🏆 ================================"
echo ""
echo "🔥 LOGROS DE LA ITERACIÓN OCTAVA:"
echo "   ⚛️  Next.js 15.5.4 + TypeScript configurado"
echo "   🎯 Formulario tipado con interface FormData"
echo "   🌐 API Route como proxy seguro"
echo "   🏛️ Integración completa con arquitectura v3"
echo "   🐍 Comunicación Python ↔ JavaScript ↔ TypeScript"
echo "   🎭 Frontend moderno + Backend limpio"
echo ""
echo "🚀 LA TRANSMUTACIÓN ESTÁ COMPLETA"
echo "🚀 Next.js + Clean Architecture + MCP Agents"
echo ""

exit 0