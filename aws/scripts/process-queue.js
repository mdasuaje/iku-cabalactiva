const AWS = require('aws-sdk');

// Configurar AWS
AWS.config.update({ region: 'us-east-1' });

const sqs = new AWS.SQS();
const ses = new AWS.SES();

const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/533267221285/iku-contact-queue';

async function processMessages() {
  try {
    console.log('🔄 Procesando mensajes de la cola...');
    
    const messages = await sqs.receiveMessage({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20
    }).promise();

    if (!messages.Messages || messages.Messages.length === 0) {
      console.log('📭 No hay mensajes en la cola');
      return;
    }

    console.log(`📨 Procesando ${messages.Messages.length} mensajes`);

    for (const message of messages.Messages) {
      try {
        const contactData = JSON.parse(message.Body);
        
        // Validar datos requeridos
        if (!contactData.nombre || !contactData.email || !contactData.mensaje) {
          console.error('❌ Datos incompletos:', contactData);
          continue;
        }

        // Enviar email via SES
        const emailParams = {
          Source: 'contacto@iku-cabalactiva.com',
          Destination: {
            ToAddresses: ['contacto@iku-cabalactiva.com'],
            CcAddresses: ['maor@iku-cabalactiva.com']
          },
          Message: {
            Subject: { 
              Data: `🌟 Nuevo contacto IKU Cábala Activa: ${contactData.nombre}`,
              Charset: 'UTF-8'
            },
            Body: {
              Text: { 
                Data: `Nuevo contacto recibido:

📧 Email: ${contactData.email}
👤 Nombre: ${contactData.nombre}
📱 Teléfono: ${contactData.telefono || 'No proporcionado'}
🛍️ Herramienta de interés: ${contactData.herramienta || 'No especificada'}

💬 Mensaje:
${contactData.mensaje}

---
Enviado desde: iku-cabalactiva.com
Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/New_York' })}`,
                Charset: 'UTF-8'
              }
            }
          }
        };

        await ses.sendEmail(emailParams).promise();
        console.log(`✅ Email enviado para: ${contactData.nombre} (${contactData.email})`);

        // Eliminar mensaje de la cola después del procesamiento exitoso
        await sqs.deleteMessage({
          QueueUrl: QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle
        }).promise();

        console.log(`🗑️ Mensaje eliminado de la cola`);

      } catch (messageError) {
        console.error(`❌ Error procesando mensaje individual:`, messageError);
        // No eliminar el mensaje si hay error, se reintentará
      }
    }

    console.log('✅ Procesamiento completado');

  } catch (error) {
    console.error('💥 Error general procesando cola:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  processMessages()
    .then(() => {
      console.log('🎯 Proceso finalizado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { processMessages };