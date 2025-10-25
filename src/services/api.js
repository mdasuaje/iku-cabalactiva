/**
 * API Service - Integración con AWS API Gateway
 * IKU Cábala Activa
 */

const API_CONFIG = {
  baseURL: import.meta.env.VITE_AWS_API_GATEWAY_URL || 'https://api.iku-cabalactiva.com',
  apiKey: import.meta.env.VITE_AWS_API_KEY,
  timeout: 30000,
  retries: 3
};

class APIService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  async request(endpoint, options = {}) {
    if (!this.baseURL) {
      throw new Error('AWS API Gateway URL no configurada');
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add API key if available
    if (API_CONFIG.apiKey) {
      headers['x-api-key'] = API_CONFIG.apiKey;
    }

    const config = {
      method: 'POST',
      headers,
      ...options
    };

    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Error en API: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.retries && error.name !== 'AbortError') {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        break;
      }
    }

    throw lastError;
  }

  async sendContactForm(formData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify({
        type: 'contact',
        ...formData,
        timestamp: new Date().toISOString()
      })
    });
  }

  async sendDownloadRequest(requestData) {
    return this.request('/download', {
      method: 'POST',
      body: JSON.stringify({
        type: 'download',
        ...requestData,
        timestamp: new Date().toISOString()
      })
    });
  }

  async checkApiHealth() {
    return this.request('/health', {
      method: 'GET'
    });
  }

  async sendServiceRequest(serviceData) {
    return this.request('/service-request', {
      method: 'POST',
      body: JSON.stringify({
        type: 'service_request',
        ...serviceData,
        timestamp: new Date().toISOString()
      })
    });
  }
}

export const apiService = new APIService();
export default apiService;