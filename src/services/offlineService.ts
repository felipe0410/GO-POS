import { openDB, IDBPDatabase } from 'idb';

interface OfflineSale {
  id: string;
  timestamp: number;
  invoiceData: any;
  saleItems: any[];
  establishmentId: string;
  status: 'pending' | 'synced' | 'failed';
  retryCount: number;
  lastAttempt?: number;
}

interface OfflineInventoryUpdate {
  id: string;
  productId: string;
  barCode: string;
  productName: string;
  quantityChange: number; // negativo para ventas
  timestamp: number;
  saleId: string;
  status: 'pending' | 'synced' | 'failed';
}

export class OfflineService {
  private static dbName = 'go-pos-offline';
  private static dbVersion = 1;
  private static db: IDBPDatabase | null = null;

  /**
   * Inicializar base de datos IndexedDB para almacenamiento offline
   */
  static async initDB(): Promise<IDBPDatabase> {
    if (this.db) return this.db;

    this.db = await openDB(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Store para ventas offline
        if (!db.objectStoreNames.contains('offline_sales')) {
          const salesStore = db.createObjectStore('offline_sales', { keyPath: 'id' });
          salesStore.createIndex('status', 'status');
          salesStore.createIndex('timestamp', 'timestamp');
        }

        // Store para actualizaciones de inventario offline
        if (!db.objectStoreNames.contains('offline_inventory')) {
          const inventoryStore = db.createObjectStore('offline_inventory', { keyPath: 'id' });
          inventoryStore.createIndex('status', 'status');
          inventoryStore.createIndex('saleId', 'saleId');
          inventoryStore.createIndex('productId', 'productId');
        }

        // Store para caché de productos (para validaciones offline)
        if (!db.objectStoreNames.contains('products_cache')) {
          const productsStore = db.createObjectStore('products_cache', { keyPath: 'uid' });
          productsStore.createIndex('barCode', 'barCode');
          productsStore.createIndex('lastUpdate', 'lastUpdate');
        }

        // Store para configuración offline
        if (!db.objectStoreNames.contains('offline_config')) {
          db.createObjectStore('offline_config', { keyPath: 'key' });
        }
      },
    });

    return this.db;
  }

  /**
   * Verificar si hay conexión a internet y acceso a Firebase
   */
  static async checkOnlineStatus(): Promise<boolean> {
    const { ConnectivityService } = await import('./connectivityService');
    const status = await ConnectivityService.checkConnectivity();
    return status.isOnline;
  }

  /**
   * Verificación rápida de conectividad (para uso frecuente)
   */
  static async quickConnectivityCheck(): Promise<boolean> {
    const { ConnectivityService } = await import('./connectivityService');
    return await ConnectivityService.quickCheck();
  }

  /**
   * Obtener diagnóstico detallado de conectividad
   */
  static async getConnectivityDiagnostics() {
    const { ConnectivityService } = await import('./connectivityService');
    return await ConnectivityService.getDiagnostics();
  }

  /**
   * Guardar venta para sincronización posterior
   */
  static async saveOfflineSale(
    invoiceData: any,
    saleItems: any[],
    establishmentId: string
  ): Promise<string> {
    const db = await this.initDB();
    const saleId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const offlineSale: OfflineSale = {
      id: saleId,
      timestamp: Date.now(),
      invoiceData,
      saleItems,
      establishmentId,
      status: 'pending',
      retryCount: 0,
    };

    await db.add('offline_sales', offlineSale);

    // También guardar las actualizaciones de inventario offline
    for (const item of saleItems) {
      const inventoryUpdate: OfflineInventoryUpdate = {
        id: `inv_${saleId}_${item.barCode}`,
        productId: item.productId || item.uid,
        barCode: item.barCode,
        productName: item.productName,
        quantityChange: -(item.quantity || item.cantidad), // negativo para venta
        timestamp: Date.now(),
        saleId,
        status: 'pending',
      };

      await db.add('offline_inventory', inventoryUpdate);
    }

    return saleId;
  }

  /**
   * Actualizar inventario local (caché) para validaciones offline
   */
  static async updateLocalInventory(saleItems: any[]): Promise<void> {
    const db = await this.initDB();
    
    // Verificar si tenemos productos en caché
    const cachedProducts = await db.getAll('products_cache');
    
    if (cachedProducts.length === 0) {
      // Si no hay caché, intentar usar productos del store global
      try {
        const { useAppStore } = await import('@/store/useAppStore');
        const { products } = useAppStore.getState();
        
        if (products.length > 0) {
          // Actualizar caché con productos del store
          await this.updateProductsCache(products);
        }
      } catch (error) {
        console.warn('No se pudo inicializar caché de productos:', error);
        return; // Salir si no podemos actualizar el caché
      }
    }

    // Actualizar inventario en caché
    const tx = db.transaction('products_cache', 'readwrite');

    for (const item of saleItems) {
      const product = await tx.store.get(item.productId || item.uid);
      if (product) {
        const currentStock = parseFloat(product.cantidad || '0');
        const newStock = currentStock - (item.quantity || item.cantidad);
        
        product.cantidad = Math.max(0, newStock).toString();
        product.lastOfflineUpdate = Date.now();
        
        await tx.store.put(product);
      } else {
        // Si el producto no está en caché, intentar agregarlo desde el store
        try {
          const { useAppStore } = await import('@/store/useAppStore');
          const { products } = useAppStore.getState();
          const storeProduct = products.find((p: any) => p.uid === (item.productId || item.uid));
          
          if (storeProduct) {
            const currentStock = parseFloat(storeProduct.cantidad || '0');
            const newStock = currentStock - (item.quantity || item.cantidad);
            
            const productToCache = {
              ...storeProduct,
              cantidad: Math.max(0, newStock).toString(),
              lastOfflineUpdate: Date.now(),
            };
            
            await tx.store.put(productToCache);
          }
        } catch (error) {
          console.warn(`No se pudo actualizar producto ${item.productName} en caché:`, error);
        }
      }
    }

    await tx.done;
  }

  /**
   * Verificar stock disponible usando caché local
   */
  static async checkOfflineStock(saleItems: any[]): Promise<{
    available: boolean;
    insufficientStock: string[];
  }> {
    const db = await this.initDB();
    const result = {
      available: true,
      insufficientStock: [] as string[],
    };

    // Primero verificar si tenemos productos en caché
    const cachedProducts = await db.getAll('products_cache');
    
    if (cachedProducts.length === 0) {
      // Si no hay caché, intentar usar productos del store global
      try {
        const { useAppStore } = await import('@/store/useAppStore');
        const { products } = useAppStore.getState();
        
        if (products.length > 0) {
          // Actualizar caché con productos del store
          await this.updateProductsCache(products);
          
          // Usar productos del store para validación
          for (const item of saleItems) {
            const product = products.find((p: any) => p.uid === (item.productId || item.uid));
            
            if (!product) {
              result.available = false;
              result.insufficientStock.push(`${item.productName}: Producto no encontrado`);
              continue;
            }

            const currentStock = parseFloat(product.cantidad || '0');
            const requiredStock = item.quantity || item.cantidad;

            if (currentStock < requiredStock) {
              result.available = false;
              result.insufficientStock.push(
                `${item.productName}: Disponible ${currentStock}, requerido ${requiredStock}`
              );
            }
          }
          
          return result;
        } else {
          // No hay productos disponibles - permitir venta pero advertir
          console.warn('No hay productos disponibles para validación offline');
          return { available: true, insufficientStock: [] };
        }
      } catch (error) {
        console.warn('Error accediendo al store de productos:', error);
        // En caso de error, permitir la venta (modo degradado)
        return { available: true, insufficientStock: [] };
      }
    }

    // Validación normal con caché
    for (const item of saleItems) {
      const product = await db.get('products_cache', item.productId || item.uid);
      
      if (!product) {
        result.available = false;
        result.insufficientStock.push(`${item.productName}: Producto no encontrado en caché`);
        continue;
      }

      const currentStock = parseFloat(product.cantidad || '0');
      const requiredStock = item.quantity || item.cantidad;

      if (currentStock < requiredStock) {
        result.available = false;
        result.insufficientStock.push(
          `${item.productName}: Disponible ${currentStock}, requerido ${requiredStock}`
        );
      }
    }

    return result;
  }

  /**
   * Obtener ventas pendientes de sincronización
   */
  static async getPendingSales(): Promise<OfflineSale[]> {
    const db = await this.initDB();
    const index = db.transaction('offline_sales').store.index('status');
    return await index.getAll('pending');
  }

  /**
   * Sincronizar ventas offline con Firebase
   */
  static async syncOfflineSales(): Promise<{
    synced: number;
    failed: number;
    errors: string[];
  }> {
    const result = {
      synced: 0,
      failed: 0,
      errors: [] as string[],
    };

    const isOnline = await this.checkOnlineStatus();
    if (!isOnline) {
      result.errors.push('Sin conexión a internet');
      return result;
    }

    const pendingSales = await this.getPendingSales();
    const db = await this.initDB();

    for (const sale of pendingSales) {
      try {
        // Intentar sincronizar con Firebase
        await this.syncSingleSale(sale);
        
        // Marcar como sincronizada
        sale.status = 'synced';
        await db.put('offline_sales', sale);
        
        result.synced++;
      } catch (error) {
        console.error(`Error sincronizando venta ${sale.id}:`, error);
        
        // Incrementar contador de reintentos
        sale.retryCount++;
        sale.lastAttempt = Date.now();
        
        // Si ha fallado muchas veces, marcar como fallida
        if (sale.retryCount >= 5) {
          sale.status = 'failed';
        }
        
        await db.put('offline_sales', sale);
        result.failed++;
        result.errors.push(`Venta ${sale.id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    return result;
  }

  /**
   * Sincronizar una venta individual
   */
  private static async syncSingleSale(sale: OfflineSale): Promise<void> {
    // Aquí iría la lógica para enviar a Firebase
    // Por ahora simularemos el proceso
    
    // 1. Crear factura en Firebase
    const { createInvoice } = await import('@/firebase');
    await createInvoice(sale.invoiceData.invoice, sale.invoiceData);
    
    // 2. Actualizar inventario en Firebase
    const { InventoryService } = await import('./inventoryService');
    await InventoryService.updateInventoryAfterSale(
      sale.establishmentId,
      sale.saleItems.map(item => ({
        productId: item.productId || item.uid,
        barCode: item.barCode,
        productName: item.productName,
        quantity: item.quantity || item.cantidad,
        price: item.price || item.acc,
      }))
    );
  }

  /**
   * Actualizar caché de productos
   */
  static async updateProductsCache(products: any[]): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction('products_cache', 'readwrite');

    for (const product of products) {
      product.lastUpdate = Date.now();
      await tx.store.put(product);
    }

    await tx.done;
  }

  /**
   * Obtener productos desde caché
   */
  static async getCachedProducts(): Promise<any[]> {
    const db = await this.initDB();
    return await db.getAll('products_cache');
  }

  /**
   * Limpiar datos sincronizados antiguos
   */
  static async cleanupSyncedData(olderThanDays: number = 7): Promise<void> {
    const db = await this.initDB();
    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);

    // Limpiar ventas sincronizadas antiguas
    const salesTx = db.transaction('offline_sales', 'readwrite');
    const salesCursor = await salesTx.store.openCursor();
    
    while (salesCursor) {
      const sale = salesCursor.value as OfflineSale;
      if (sale.status === 'synced' && sale.timestamp < cutoffTime) {
        await salesCursor.delete();
      }
      await salesCursor.continue();
    }

    // Limpiar actualizaciones de inventario sincronizadas
    const inventoryTx = db.transaction('offline_inventory', 'readwrite');
    const inventoryCursor = await inventoryTx.store.openCursor();
    
    while (inventoryCursor) {
      const update = inventoryCursor.value as OfflineInventoryUpdate;
      if (update.status === 'synced' && update.timestamp < cutoffTime) {
        await inventoryCursor.delete();
      }
      await inventoryCursor.continue();
    }
  }

  /**
   * Obtener estadísticas de sincronización
   */
  static async getSyncStats(): Promise<{
    pendingSales: number;
    syncedSales: number;
    failedSales: number;
    lastSync?: number;
  }> {
    const db = await this.initDB();
    
    const [pending, synced, failed] = await Promise.all([
      db.countFromIndex('offline_sales', 'status', 'pending'),
      db.countFromIndex('offline_sales', 'status', 'synced'),
      db.countFromIndex('offline_sales', 'status', 'failed'),
    ]);

    // Obtener última sincronización
    const config = await db.get('offline_config', 'lastSync');
    
    return {
      pendingSales: pending,
      syncedSales: synced,
      failedSales: failed,
      lastSync: config?.value,
    };
  }

  /**
   * Marcar última sincronización
   */
  static async markLastSync(): Promise<void> {
    const db = await this.initDB();
    await db.put('offline_config', {
      key: 'lastSync',
      value: Date.now(),
    });
  }
}