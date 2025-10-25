/**
 * Hook para monitorear el estado de la API
 * IKU Cábala Activa
 */

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useApiStatus = () => {
  const [status, setStatus] = useState({
    isOnline: true,
    lastCheck: null,
    error: null
  });

  const checkApiStatus = async () => {
    try {
      // Hacer una petición simple para verificar conectividad
      await fetch(`${apiService.baseURL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      setStatus({
        isOnline: true,
        lastCheck: new Date(),
        error: null
      });
    } catch (error) {
      setStatus({
        isOnline: false,
        lastCheck: new Date(),
        error: error.message
      });
    }
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return { ...status, checkApiStatus };
};