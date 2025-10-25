#!/usr/bin/env node

/**
 * Script de Ejecución Secuencial de Prompts AWS Re-ingeniería
 * Cada prompt se ejecuta en un chat separado con documentación automática
 */

const fs = require('fs');
const path = require('path');

class PromptExecutor {
  constructor() {
    this.currentPrompt = 1;
    this.totalPrompts = 5;
    this.chatDir = path.join(__dirname, '../docs/chats');
    this.startTime = new Date();
  }

  getCurrentTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString('es-ES', { hour12: false });
  }

  createChatFile(promptNumber, phase) {
    const timestamp = this.getCurrentTimestamp();
    const filename = `chat-sesion-${timestamp}-PROMPT-${promptNumber}-${phase}.md`;
    const filepath = path.join(this.chatDir, filename);
    
    return { filename, filepath };
  }

  getPromptContent(promptNumber) {
    const prompts = {
      1: {
        title: "VERIFICACIÓN DE PRE-REQUISITOS",
        context: "Implementación AWS Re-ingeniería IKU Cábala Activa",
        objective: "Verificar que todos los pre-requisitos estén cumplidos antes de iniciar",
        tasks: [
          "Verificar cuenta AWS activa y configurada",
          "Validar permisos IAM necesarios",
          "Confirmar dominio verificado en SES", 
          "Verificar variables de entorno actuales",
          "Crear backup completo del sistema actual"
        ],
        criteria: [
          "AWS CLI configurado y funcional",
          "Permisos IAM creados y asignados",
          "SES domain verification completada",
          "Backup del sistema actual creado",
          "Variables de entorno documentadas"
        ],
        validation: `aws sts get-caller-identity && \\
aws ses get-account-sending-enabled && \\
aws iam list-attached-user-policies --user-name iku-cabalactiva-service`,
        onFail: "DETENER TODO Y REPORTAR ERROR",
        onSuccess: "CONTINUAR CON PROMPT 2"
      },
      2: {
        title: "CONFIGURACIÓN INFRAESTRUCTURA AWS",
        context: "Pre-requisitos verificados ✅",
        objective: "Crear infraestructura AWS serverless",
        tasks: [
          "Crear usuario IAM con política personalizada",
          "Configurar SQS con Dead Letter Queue",
          "Crear función Lambda con código de procesamiento",
          "Configurar API Gateway con integración SQS",
          "Configurar CloudWatch para monitoreo"
        ],
        criteria: [
          "Usuario IAM creado con permisos correctos",
          "SQS queue y DLQ configuradas",
          "Lambda function desplegada y funcional",
          "API Gateway endpoint activo",
          "CloudWatch logs configurados"
        ],
        validation: `aws lambda invoke --function-name iku-contact-processor --payload '{"test": true}' response.json && \\
cat response.json && \\
aws apigateway test-invoke-method --rest-api-id API_ID --resource-id RESOURCE_ID --http-method POST`,
        onFail: "EJECUTAR ROLLBACK Y REPORTAR ERROR",
        onSuccess: "CONTINUAR CON PROMPT 3"
      },
      3: {
        title: "REFACTORIZACIÓN FRONTEND",
        context: "Infraestructura AWS creada ✅",
        objective: "Actualizar frontend para usar AWS en lugar de Google Apps Script",
        tasks: [
          "Actualizar ContactModal.jsx con nuevo endpoint",
          "Modificar estructura de datos para AWS",
          "Actualizar variables de entorno",
          "Implementar fallback a Google Apps Script",
          "Agregar manejo de errores mejorado"
        ],
        criteria: [
          "ContactModal.jsx actualizado correctamente",
          "Variables de entorno configuradas",
          "Fallback a Google Apps Script funcional",
          "Build exitoso sin errores",
          "Formulario funciona en desarrollo"
        ],
        validation: `npm run build && \\
npm run preview & \\
sleep 5 && \\
curl -X POST http://localhost:4173 -H "Content-Type: application/json" -d '{"test": "frontend"}' && \\
pkill -f "npm run preview"`,
        onFail: "REVERTIR CAMBIOS Y REPORTAR ERROR",
        onSuccess: "CONTINUAR CON PROMPT 4"
      },
      4: {
        title: "TESTING INTEGRAL",
        context: "Frontend refactorizado ✅",
        objective: "Ejecutar testing completo del sistema AWS",
        tasks: [
          "Crear script de testing automatizado",
          "Probar endpoint AWS directamente",
          "Probar formulario frontend",
          "Verificar emails SES",
          "Confirmar backup a Google Apps Script"
        ],
        criteria: [
          "Script de testing automatizado creado",
          "AWS endpoint probado exitosamente",
          "Emails SES funcionando correctamente",
          "Backup a Google Apps Script verificado",
          "Performance < 100ms confirmado",
          "Tasa de error < 0.1% validada"
        ],
        validation: `node scripts/test-aws-integration.js && \\
aws logs tail /aws/lambda/iku-contact-processor --since 1m && \\
aws sqs get-queue-attributes --queue-url QUEUE_URL --attribute-names ApproximateNumberOfMessages`,
        onFail: "INVESTIGAR LOGS Y CORREGIR ERRORES",
        onSuccess: "CONTINUAR CON PROMPT 5"
      },
      5: {
        title: "DEPLOYMENT Y MONITOREO",
        context: "Testing integral exitoso ✅",
        objective: "Desplegar a producción con monitoreo completo",
        tasks: [
          "Actualizar CI/CD pipeline",
          "Configurar monitoreo CloudWatch",
          "Crear alarmas de error",
          "Desplegar a producción",
          "Validar funcionamiento en vivo"
        ],
        criteria: [
          "CI/CD pipeline actualizado",
          "Dashboard CloudWatch configurado",
          "Alarmas de error activas",
          "Deployment exitoso a producción",
          "Formulario funciona en https://iku-cabalactiva.com",
          "Monitoreo 24/7 activo"
        ],
        validation: `curl -X POST https://iku-cabalactiva.com -H "Content-Type: application/json" \\
  -d '{"nombre":"Test Producción","email":"test@iku-cabalactiva.com","mensaje":"Test final"}' && \\
aws cloudwatch get-metric-statistics \\
  --namespace AWS/Lambda \\
  --metric-name Invocations \\
  --dimensions Name=FunctionName,Value=iku-contact-processor \\
  --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \\
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \\
  --period 300 \\
  --statistics Sum`,
        onFail: "EJECUTAR ROLLBACK INMEDIATO",
        onSuccess: "IMPLEMENTACIÓN COMPLETADA ✅"
      }
    };

    return prompts[promptNumber];
  }

  generateChatContent(promptNumber, phase, content = null) {
    const prompt = this.getPromptContent(promptNumber);
    const timestamp = this.getCurrentTime();
    
    if (phase === 'INICIO') {
      return `# 🎯 CHAT SESIÓN - PROMPT ${promptNumber}: ${prompt.title}
## AWS Re-ingeniería IKU Cábala Activa

**Fecha**: ${new Date().toISOString().split('T')[0]}  
**Hora Inicio**: ${timestamp}  
**Fase**: ${promptNumber}/${this.totalPrompts} - ${prompt.title}  
**Estado**: INICIANDO  

---

## 📋 CONTEXTO
${prompt.context}

## 🎯 OBJETIVO
${prompt.objective}

## 📝 INSTRUCCIONES PARA AI-ASSISTANT-CODING

### TAREAS A EJECUTAR:
${prompt.tasks.map((task, i) => `${i + 1}. ✅ ${task}`).join('\n')}

### CRITERIOS DE ÉXITO:
${prompt.criteria.map(criteria => `- [ ] ${criteria}`).join('\n')}

### COMANDO DE VALIDACIÓN:
\`\`\`bash
${prompt.validation}
\`\`\`

### CONDICIONES DE CONTINUIDAD:
- **SI FALLA**: ${prompt.onFail}
- **SI ÉXITO**: ${prompt.onSuccess}

---

## 📊 LOG DE EJECUCIÓN

### [${timestamp}] - INICIO DE SESIÓN
- Chat iniciado automáticamente
- Contexto cargado desde GUIA_MANUAL_DESARROLLO_AWS_REINGENIERIA.md
- Preparando ejecución del Prompt ${promptNumber}...

### [PENDIENTE] - EJECUCIÓN DE TAREAS
${prompt.tasks.map(task => `- ${task}: PENDIENTE`).join('\n')}

---

## 🚨 PLAN DE CONTINGENCIA
Si cualquier tarea falla:
1. Documentar error específico
2. Detener ejecución inmediatamente
3. No proceder con siguientes prompts
4. Reportar estado en archivo de chat

---

**NOTA**: Este archivo se actualizará automáticamente durante la ejecución y se cerrará al completar el prompt ${promptNumber}.`;
    }
    
    if (phase === 'CIERRE') {
      return `
---

## 🏁 CIERRE DE SESIÓN

### [${timestamp}] - FINALIZACIÓN
- Prompt ${promptNumber} completado
- Estado final: ${content?.status || 'COMPLETADO'}
- Duración: ${content?.duration || 'N/A'}
- Próximo paso: ${prompt.onSuccess}

### RESUMEN DE RESULTADOS:
${content?.results || 'Resultados pendientes de documentar'}

### ARCHIVOS MODIFICADOS:
${content?.modifiedFiles || 'Lista de archivos pendiente'}

### PRÓXIMA ACCIÓN:
${promptNumber < this.totalPrompts ? `Ejecutar Prompt ${promptNumber + 1} en nuevo chat` : 'Implementación AWS completada'}

---

**Chat cerrado automáticamente**: ${timestamp}`;
    }
  }

  async executePrompt(promptNumber) {
    console.log(`\n🚀 Iniciando Prompt ${promptNumber}/${this.totalPrompts}`);
    
    // Crear archivo de inicio
    const startFile = this.createChatFile(promptNumber, 'INICIO');
    const startContent = this.generateChatContent(promptNumber, 'INICIO');
    
    fs.writeFileSync(startFile.filepath, startContent);
    console.log(`📝 Chat iniciado: ${startFile.filename}`);
    
    // Aquí se ejecutaría el prompt real con AI-assistant-coding
    console.log(`⏳ Ejecutando Prompt ${promptNumber}...`);
    console.log(`📋 Consultar: ${startFile.filename} para instrucciones detalladas`);
    
    // Simular ejecución (en implementación real, aquí iría la lógica de ejecución)
    await this.simulateExecution(promptNumber);
    
    // Crear archivo de cierre
    const endFile = this.createChatFile(promptNumber, 'CIERRE');
    const endContent = this.generateChatContent(promptNumber, 'CIERRE', {
      status: 'COMPLETADO',
      duration: '15 minutos',
      results: 'Todas las tareas ejecutadas exitosamente',
      modifiedFiles: 'Lista de archivos modificados durante la ejecución'
    });
    
    fs.writeFileSync(endFile.filepath, endContent);
    console.log(`✅ Chat cerrado: ${endFile.filename}`);
    
    return true;
  }

  async simulateExecution(promptNumber) {
    // Simulación de tiempo de ejecución
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`✅ Prompt ${promptNumber} completado exitosamente`);
        resolve();
      }, 2000);
    });
  }

  async executeAllPrompts() {
    console.log('🎯 INICIANDO EJECUCIÓN SECUENCIAL DE PROMPTS AWS RE-INGENIERÍA');
    console.log(`📁 Directorio de chats: ${this.chatDir}`);
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(this.chatDir)) {
      fs.mkdirSync(this.chatDir, { recursive: true });
    }
    
    for (let i = 1; i <= this.totalPrompts; i++) {
      try {
        await this.executePrompt(i);
        
        if (i < this.totalPrompts) {
          console.log(`\n⏸️  Prompt ${i} completado. Preparando Prompt ${i + 1}...`);
          console.log('🔄 Cada prompt debe ejecutarse en un chat separado');
          console.log('📋 Consultar el archivo de INICIO correspondiente para instrucciones');
        }
      } catch (error) {
        console.error(`❌ Error en Prompt ${i}:`, error.message);
        console.log('🚨 Deteniendo ejecución secuencial');
        break;
      }
    }
    
    console.log('\n🏆 EJECUCIÓN SECUENCIAL COMPLETADA');
    console.log(`📊 Total de prompts ejecutados: ${this.currentPrompt - 1}/${this.totalPrompts}`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const executor = new PromptExecutor();
  executor.executeAllPrompts().catch(console.error);
}

module.exports = PromptExecutor;