/**
 * Indicador de estado de la API
 * IKU Cábala Activa
 */

import React from 'react';
import { useApiStatus } from '../../hooks/useApiStatus';

const ApiStatusIndicator = () => {
  const { isOnline, error } = useApiStatus();

  if (isOnline) return null; // No mostrar nada si está online

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 px-4 z-50">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm">
          Servicio temporalmente no disponible. Reintentando...
        </span>
      </div>
    </div>
  );
};

export default ApiStatusIndicator;