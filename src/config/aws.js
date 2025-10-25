// Configuración AWS para IKU Cábala Activa
export const AWS_CONFIG = {
  // API Gateway endpoint
  API_ENDPOINT: 'https://b83zea5u0e.execute-api.us-east-1.amazonaws.com/prod/contact',
  
  // SQS Queue URL
  SQS_QUEUE_URL: 'https://sqs.us-east-1.amazonaws.com/533267221285/iku-contact-queue',
  
  // AWS Region
  REGION: 'us-east-1',
  
  // Account ID
  ACCOUNT_ID: '533267221285',
  
  // SES Configuration
  SES: {
    VERIFIED_EMAILS: [
      'contacto@iku-cabalactiva.com',
      'maor@iku-cabalactiva.com'
    ],
    DOMAIN: 'iku-cabalactiva.com'
  }
};

// Headers para requests a API Gateway
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Función para enviar contacto via API Gateway
export const sendContact = async (contactData) => {
  try {
    const response = await fetch(AWS_CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error enviando contacto:', error);
    throw error;
  }
};