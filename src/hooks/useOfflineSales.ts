import { useState, useEffect, useCallback } from 'react';
import { useAsyncOperation } from './useAsyncOperation';
import { useNotification } from './useNotification';
import { useConnectivity } from './useConnectivity';
import { OfflineService } from '@/services/offlineService';

interface UseOfflineSalesReturn {
  isOnline: boolean;
  processOfflineSale: (invoiceData: any, saleItems: any[], establishmentId: string) => Promise<string>;
  syncPendingSales: () => Promise<void>;
  syncStats: {
    pendingSales: number;
    syncedSales: number;
    failedSales: number;
    lastSync?: number;
  };
  loading: boolean;
  error: string | null;
  checkConnectivity: (showNotifications?: boolean) => Promise<any>;
  quickConnectivityCheck: () => Promise<boolean>;
}

export function useOfflineSales(): UseOfflineSalesReturn {
  const [syncStats, setSyncStats] = useState({
    pendingSales: 0,
    syncedSales: 0,
    failedSales: 0,
  });

  const { success, error: notifyError, warning, info } = useNotification();
  const { 
    isOnline, 
    checkConnectivity, 
    quickCheck, 
    loading: connectivityLoading 
  } = useConnectivity();

  // Operación para procesar venta offline
  const { execute: processOfflineSaleOperation, loading: processingOffline } = useAsyncOperation(
    async (invoiceData: any, saleItems: any[], establishmentId: string) => {
      // 1. Verificar stock en caché local
      const stockCheck = await OfflineService.checkOfflineStock(saleItems);
      
      if (!stockCheck.available) {
        throw new Error(`Stock insuficiente: ${stockCheck.insufficientStock.join(', ')}`);
      }

      // 2. Guardar venta para sincronización posterior
      const saleId = await OfflineService.saveOfflineSale(invoiceData, saleItems, establishmentId);

      // 3. Actualizar inventario local (caché)
      await OfflineService.updateLocalInventory(saleItems);

      return saleId;
    }
  );

  // Operación para sincronizar ventas pendientes
  const { execute: syncOperation, loading: syncing } = useAsyncOperation(
    async () => {
      const result = await OfflineService.syncOfflineSales();
      
      if (result.synced > 0) {
        success(`${result.synced} ventas sincronizadas exitosamente`);
        await OfflineService.markLastSync();
      }
      
      if (result.failed > 0) {
        warning(`${result.failed} ventas fallaron al sincronizar`);
      }
      
      if (result.errors.length > 0) {
        console.warn('Errores de sincronización:', result.errors);
      }

      // Actualizar estadísticas
      await updateSyncStats();
      
      return result;
    }
  );

  // Procesar venta (online u offline)
  const processOfflineSale = useCallback(async (
    invoiceData: any,
    saleItems: any[],
    establishmentId: string
  ): Promise<string> => {
    try {
      const saleId = await processOfflineSaleOperation(invoiceData, saleItems, establishmentId);
      
      if (isOnline) {
        info('Venta guardada offline - se sincronizará automáticamente');
      } else {
        warning('Sin conexión - venta guardada offline para sincronizar después');
      }
      
      return saleId;
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Error procesando venta offline');
      throw error;
    }
  }, [processOfflineSaleOperation, isOnline, info, warning, notifyError]);

  // Sincronizar ventas pendientes
  const syncPendingSales = useCallback(async () => {
    try {
      await syncOperation();
    } catch (error) {
      notifyError('Error sincronizando ventas pendientes');
    }
  }, [syncOperation, notifyError]);

  // Actualizar estadísticas de sincronización
  const updateSyncStats = useCallback(async () => {
    try {
      const stats = await OfflineService.getSyncStats();
      setSyncStats(stats);
    } catch (error) {
      console.error('Error obteniendo estadísticas de sync:', error);
    }
  }, []);

  // Poblar caché de productos para validaciones offline
  const populateProductsCache = useCallback(async () => {
    try {
      // Verificar si ya tenemos productos en caché
      const cachedProducts = await OfflineService.getCachedProducts();
      
      if (cachedProducts.length === 0) {
        // Esperar un poco para que los productos se carguen en el store
        setTimeout(async () => {
          try {
            const { useAppStore } = await import('@/store/useAppStore');
            const { products } = useAppStore.getState();
            
            if (products.length > 0) {
              await OfflineService.updateProductsCache(products);
              console.log('✅ Caché de productos inicializado:', products.length, 'productos');
            } else {
              console.warn('⚠️ No hay productos disponibles para caché offline');
            }
          } catch (error) {
            console.error('❌ Error poblando caché de productos:', error);
          }
        }, 2000); // Esperar 2 segundos para que se carguen los productos
      } else {
        console.log('✅ Caché offline ya disponible:', cachedProducts.length, 'productos');
      }
    } catch (error) {
      console.error('Error verificando caché de productos:', error);
    }
  }, []);

  // Manejar cambios de conectividad
  const handleConnectivityChange = useCallback((wasOnline: boolean, nowOnline: boolean) => {
    if (nowOnline && !wasOnline) {
      info('Conexión restaurada - sincronizando ventas pendientes...');
      // Sincronizar automáticamente cuando regrese la conexión
      setTimeout(() => {
        syncPendingSales();
      }, 3000); // Esperar 3 segundos para estabilizar la conexión
    } else if (!nowOnline && wasOnline) {
      warning('Sin conexión a internet - las ventas se guardarán offline');
    }
  }, [syncPendingSales, info, warning]);

  // Efectos
  useEffect(() => {
    // Inicializar sistema offline
    const initializeOfflineSystem = async () => {
      try {
        // 1. Inicializar base de datos offline
        await OfflineService.initDB();
        
        // 2. Actualizar estadísticas iniciales
        await updateSyncStats();
        
        // 3. Poblar caché de productos si está vacío
        await populateProductsCache();
        
        console.log('✅ Sistema offline inicializado correctamente');
      } catch (error) {
        console.error('❌ Error inicializando sistema offline:', error);
      }
    };

    initializeOfflineSystem();
  }, [updateSyncStats, populateProductsCache]);

  // Manejar cambios de conectividad
  useEffect(() => {
    let previousOnlineState = isOnline;
    
    return () => {
      if (previousOnlineState !== isOnline) {
        handleConnectivityChange(previousOnlineState, isOnline);
        previousOnlineState = isOnline;
      }
    };
  }, [isOnline, handleConnectivityChange]);

  useEffect(() => {
    // Sincronización automática cuando hay conexión y ventas pendientes
    const syncInterval = setInterval(async () => {
      if (isOnline && syncStats.pendingSales > 0) {
        console.log('🔄 Sincronización automática iniciada');
        syncPendingSales();
      }
    }, 2 * 60 * 1000); // 2 minutos

    return () => clearInterval(syncInterval);
  }, [isOnline, syncStats.pendingSales, syncPendingSales]);

  useEffect(() => {
    // Limpiar datos antiguos cada día
    const cleanupInterval = setInterval(() => {
      OfflineService.cleanupSyncedData(7).catch(console.error);
    }, 24 * 60 * 60 * 1000); // 24 horas

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    isOnline,
    processOfflineSale,
    syncPendingSales,
    syncStats,
    loading: processingOffline || syncing || connectivityLoading,
    error: null, // Los errores se manejan con notificaciones
    checkConnectivity, // Del hook de conectividad
    quickConnectivityCheck: quickCheck, // Del hook de conectividad
  };
}

// Hook específico para integración con el sistema de ventas existente
export function useOfflineIntegration() {
  const offlineSales = useOfflineSales();
  const { success, warning } = useNotification();

  // Procesar venta con fallback offline automático
  const processSaleWithOfflineSupport = useCallback(async (
    invoiceData: any,
    saleItems: any[],
    establishmentId: string,
    onlineProcessor: () => Promise<void>
  ): Promise<boolean> => {
    try {
      if (offlineSales.isOnline) {
        // Intentar procesamiento online primero
        try {
          await onlineProcessor();
          success('Venta procesada online exitosamente');
          return true;
        } catch (onlineError) {
          console.warn('Fallo procesamiento online, intentando offline:', onlineError);
          warning('Problema de conexión - procesando offline');
        }
      }

      // Procesar offline como fallback
      await offlineSales.processOfflineSale(invoiceData, saleItems, establishmentId);
      return true;

    } catch (error) {
      console.error('Error en procesamiento offline:', error);
      return false;
    }
  }, [offlineSales, success, warning]);

  return {
    ...offlineSales,
    processSaleWithOfflineSupport,
  };
}