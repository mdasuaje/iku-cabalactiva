import { IUserRepository } from '../../2-Application/Ports/IUserRepository.js';
import http from 'http';

// Esta es la implementación CONCRETA que habla con nuestra infraestructura (el agente MCP).
class GoogleSheetsUserRepository extends IUserRepository {
  constructor() {
    super();
    // Para pruebas de integración, usar la URL del agente de persistencia
    this.agentUrl = process.env.VITE_PERSISTENCE_AGENT_URL || 'http://localhost:8082';
  }

  async _makeRequest(path, data) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);
      const url = new URL(`${this.agentUrl}${path}`);
      
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(responseData);
            resolve(jsonData);
          } catch (error) {
            reject(new Error('Invalid JSON response: ' + responseData));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  async existsByEmail(email) {
    const data = await this._makeRequest('/users/exists-by-email', { email });
    return data.exists;
  }

  async findByEmail(email) {
    // En este repositorio real, usar existsByEmail para simular la búsqueda
    const exists = await this.existsByEmail(email);
    if (exists) {
      // Si existe, retornar un objeto User simulado
      const { User } = await import('../../1-Domain/Entities/User.js');
      return new User({ 
        email: email, 
        passwordHash: 'existing_hash',
        id: 'existing_id'
      });
    }
    return null;
  }

  async save(user) {
    const data = await this._makeRequest('/users/save', { email: user.email });
    if (!data.success) {
      throw new Error('Fallo al guardar el usuario en el agente de persistencia.');
    }
    // Retornar el usuario con los datos actualizados
    return user;
  }
}

export { GoogleSheetsUserRepository };