import { useState, useEffect, useCallback } from 'react';
import { ConnectivityService, ConnectivityStatus } from '@/services/connectivityService';
import { useNotification } from './useNotification';

interface UseConnectivityReturn {
  isOnline: boolean;
  status: ConnectivityStatus;
  checkConnectivity: (showNotifications?: boolean) => Promise<ConnectivityStatus>;
  quickCheck: () => Promise<boolean>;
  getDiagnostics: () => Promise<any>;
  loading: boolean;
}

/**
 * Hook para manejo robusto de conectividad
 * Utiliza el ConnectivityService para verificaciones confiables
 */
export function useConnectivity(): UseConnectivityReturn {
  const [status, setStatus] = useState<ConnectivityStatus>(() => 
    ConnectivityService.getCurrentStatus()
  );
  const [loading, setLoading] = useState(false);
  
  const { info, warning, error } = useNotification();

  // Verificación completa con notificaciones opcionales
  const checkConnectivity = useCallback(async (showNotifications = true) => {
    setLoading(true);
    
    try {
      const newStatus = await ConnectivityService.checkConnectivity();
      
      if (showNotifications) {
        const wasOnline = status.isOnline;
        
        if (newStatus.isOnline && !wasOnline) {
          info('Conexión restaurada');
        } else if (!newStatus.isOnline && wasOnline) {
          warning('Sin conexión a internet');
        } else if (newStatus.isOnline) {
          // Mostrar detalles de la conexión
          const details = [];
          if (newStatus.firebaseAccessible) details.push('Firebase');
          if (newStatus.generalConnectivity) details.push('Internet');
          if (newStatus.latency) details.push(`${newStatus.latency}ms`);
          
          info(`Conectado (${details.join(', ')})`);
        } else {
          error('Sin conexión disponible');
        }
      }
      
      return newStatus;
    } catch (err) {
      if (showNotifications) {
        error('Error verificando conectividad');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [status.isOnline, info, warning, error]);

  // Verificación rápida sin notificaciones
  const quickCheck = useCallback(async () => {
    try {
      return await ConnectivityService.quickCheck();
    } catch (err) {
      console.error('Error en verificación rápida:', err);
      return false;
    }
  }, []);

  // Obtener diagnóstico detallado
  const getDiagnostics = useCallback(async () => {
    try {
      return await ConnectivityService.getDiagnostics();
    } catch (err) {
      console.error('Error obteniendo diagnósticos:', err);
      return null;
    }
  }, []);

  // Suscribirse a cambios de conectividad
  useEffect(() => {
    const unsubscribe = ConnectivityService.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    return unsubscribe;
  }, []);

  // Verificación inicial
  useEffect(() => {
    checkConnectivity(false); // Sin notificaciones en la carga inicial
  }, []);

  return {
    isOnline: status.isOnline,
    status,
    checkConnectivity,
    quickCheck,
    getDiagnostics,
    loading,
  };
}

/**
 * Hook simplificado que solo retorna el estado online/offline
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const unsubscribe = ConnectivityService.subscribe((status) => {
      setIsOnline(status.isOnline);
    });

    return unsubscribe;
  }, []);

  return isOnline;
}