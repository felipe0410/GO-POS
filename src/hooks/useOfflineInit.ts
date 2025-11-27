import { useEffect, useCallback } from 'react';
import { OfflineService } from '@/services/offlineService';
import { useNotification } from './useNotification';

/**
 * Hook para inicializar el sistema offline en páginas específicas
 * Se asegura de que el caché esté poblado antes de usar funcionalidades offline
 */
export function useOfflineInit() {
  const { info } = useNotification();

  const initializeOfflineSystem = useCallback(async () => {
    try {
      // 1. Inicializar base de datos
      await OfflineService.initDB();
      
      // 2. Verificar caché de productos
      const cachedProducts = await OfflineService.getCachedProducts();
      
      if (cachedProducts.length === 0) {
        // 3. Esperar a que se carguen los productos y poblar caché
        const waitForProducts = () => {
          return new Promise<void>((resolve) => {
            const checkProducts = async () => {
              try {
                const { useProducts }:any = await import('@/store/useAppStore');
                const { products } = useProducts.getState();
                
                if (products.length > 0) {
                  await OfflineService.updateProductsCache(products);
                  console.log('✅ Caché offline inicializado con', products.length, 'productos');
                  resolve();
                } else {
                  // Reintentar en 1 segundo
                  setTimeout(checkProducts, 1000);
                }
              } catch (error) {
                console.error('Error inicializando caché:', error);
                resolve(); // Resolver para no bloquear
              }
            };
            
            checkProducts();
          });
        };
        
        // Esperar máximo 10 segundos para que se carguen los productos
        const timeout = new Promise<void>((resolve) => {
          setTimeout(() => {
            console.warn('⚠️ Timeout inicializando caché offline');
            resolve();
          }, 10000);
        });
        
        await Promise.race([waitForProducts(), timeout]);
      } else {
        console.log('✅ Caché offline ya disponible:', cachedProducts.length, 'productos');
      }
      
      // 4. Limpiar datos antiguos
      await OfflineService.cleanupSyncedData(7);
      
    } catch (error) {
      console.error('❌ Error inicializando sistema offline:', error);
    }
  }, []);

  useEffect(() => {
    initializeOfflineSystem();
  }, [initializeOfflineSystem]);

  return {
    initializeOfflineSystem,
  };
}