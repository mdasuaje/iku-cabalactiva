const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

exports.handler = async (event) => {
  console.log('Procesando mensaje:', JSON.stringify(event, null, 2));
  
  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body);
      await processContact(messageBody);
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      throw error;
    }
  }
  
  return { statusCode: 200, body: 'Procesado exitosamente' };
};

async function processContact(contactData) {
  // 1. Enviar email via SES
  await sendEmailNotification(contactData);
  
  // 2. Backup a Google Apps Script
  await sendToGoogleAppsScript(contactData);
}

async function sendEmailNotification(data) {
  const params = {
    Source: 'contacto@iku-cabalactiva.com',
    Destination: {
      ToAddresses: ['contacto@iku-cabalactiva.com'],
      CcAddresses: ['maor@iku-cabalactiva.com']
    },
    Message: {
      Subject: { Data: `🔔 Nuevo Contacto: ${data.nombre}` },
      Body: {
        Html: {
          Data: `
            <h2>Nuevo Contacto Recibido</h2>
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Teléfono:</strong> ${data.telefono || 'No proporcionado'}</p>
            <p><strong>Herramienta:</strong> ${data.herramienta || 'No especificada'}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${data.mensaje}</p>
            <hr>
            <p><small>Enviado desde: iku-cabalactiva.com</small></p>
            <p><small>Timestamp: ${data.timestamp || new Date().toISOString()}</small></p>
          `
        }
      }
    }
  };
  
  return ses.sendEmail(params).promise();
}

async function sendToGoogleAppsScript(data) {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbz48aBhDeY1cagFxeVXk-PfmUl1p1FV7_LLos02BhLsgQE3ARfHc_Fv7yerOKEShcYARg/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.warn('Backup a GAS falló:', response.statusText);
    }
    
    return response.json();
  } catch (error) {
    console.warn('Error en backup a GAS:', error.message);
    // No lanzar error para no fallar el procesamiento principal
  }
}