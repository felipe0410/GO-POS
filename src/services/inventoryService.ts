import { 
  doc, 
  updateDoc, 
  writeBatch, 
  runTransaction,
  getDoc,
  collection 
} from 'firebase/firestore';
import { db } from '@/firebase';
import { performanceLogger } from '@/utils/performanceLogger';

interface SaleItem {
  productId: string;
  barCode: string;
  productName: string;
  quantity: number;
  price: number;
}

interface InventoryUpdateResult {
  success: boolean;
  updatedProducts: string[];
  errors: string[];
  insufficientStock: string[];
}

export class InventoryService {
  
  /**
   * Actualiza el inventario después de una venta usando transacciones
   * Garantiza consistencia de datos y manejo de errores
   */
  static async updateInventoryAfterSale(
    establishmentId: string,
    saleItems: SaleItem[]
  ): Promise<InventoryUpdateResult> {
    const operationId = `inventory-service-update-${Date.now()}`;
    performanceLogger.start(operationId, 'InventoryService.updateInventoryAfterSale', {
      establishmentId,
      itemCount: saleItems.length
    });

    const result: InventoryUpdateResult = {
      success: false,
      updatedProducts: [],
      errors: [],
      insufficientStock: []
    };

    try {
      performanceLogger.checkpoint(operationId, 'Iniciando transacción Firebase');
      const transactionStart = performance.now();
      
      // Usar transacción para garantizar consistencia
      await runTransaction(db, async (transaction) => {
        performanceLogger.checkpoint(operationId, 'Dentro de transacción - obteniendo colección');
        const productsCollection = collection(db, `establecimientos/${establishmentId}/productos`);
        
        // 1. Leer todos los productos involucrados
        performanceLogger.checkpoint(operationId, `Leyendo ${saleItems.length} productos de Firebase`);
        const readStart = performance.now();
        
        const productUpdates: Array<{
          docRef: any;
          currentStock: number;
          newStock: number;
          productName: string;
          saleQuantity: number;
        }> = [];

        for (const item of saleItems) {
          const productDocRef = doc(productsCollection, item.productId);
          const productDoc = await transaction.get(productDocRef);
          
          if (!productDoc.exists()) {
            result.errors.push(`Producto ${item.productName} no encontrado`);
            continue;
          }

          const productData = productDoc.data();
          const currentStock = parseFloat(productData.cantidad || '0');
          const saleQuantity = item.quantity;
          const newStock = currentStock - saleQuantity;

          // Verificar stock suficiente (solo para warning, no bloquear)
          if (newStock < 0) {
            result.insufficientStock.push(
              `${item.productName}: Stock actual ${currentStock}, se requiere ${saleQuantity}`
            );
            // Continuar con la actualización aunque el stock sea negativo
          }

          productUpdates.push({
            docRef: productDocRef,
            currentStock,
            newStock, // Permitir stock negativo
            productName: item.productName,
            saleQuantity
          });
        }

        const readDuration = performance.now() - readStart;
        performanceLogger.checkpoint(operationId, 'Productos leídos de Firebase', {
          duration: readDuration.toFixed(2) + 'ms',
          productsRead: productUpdates.length
        });

        // Si hay productos con stock insuficiente, solo hacer warning
        if (result.insufficientStock.length > 0) {
          console.warn(`⚠️ Stock insuficiente: ${result.insufficientStock.join(', ')}`);
          console.warn('⚠️ La venta continuará y algunos productos quedarán con stock negativo');
        }

        // 2. Actualizar todos los productos en la transacción
        performanceLogger.checkpoint(operationId, `Actualizando ${productUpdates.length} productos en transacción`);
        const updateStart = performance.now();
        
        for (const update of productUpdates) {
          transaction.update(update.docRef, {
            cantidad: update.newStock.toString(),
            lastSaleDate: new Date().toISOString(),
            lastSaleQuantity: update.saleQuantity
          });
          
          result.updatedProducts.push(update.productName);
        }

        const updateDuration = performance.now() - updateStart;
        performanceLogger.checkpoint(operationId, 'Productos actualizados en transacción', {
          duration: updateDuration.toFixed(2) + 'ms'
        });
      });

      const transactionDuration = performance.now() - transactionStart;
      performanceLogger.end(operationId, {
        success: true,
        transactionTime: transactionDuration.toFixed(2) + 'ms',
        updatedProducts: result.updatedProducts.length
      });

      result.success = true;
      return result;

    } catch (error) {
      performanceLogger.end(operationId, {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('Error updating inventory:', error);
      result.errors.push(error instanceof Error ? error.message : 'Error desconocido');
      return result;
    }
  }

  /**
   * Actualización por lotes (más eficiente para ventas grandes)
   * Usa writeBatch para operaciones más rápidas
   */
  static async updateInventoryBatch(
    establishmentId: string,
    saleItems: SaleItem[]
  ): Promise<InventoryUpdateResult> {
    const result: InventoryUpdateResult = {
      success: false,
      updatedProducts: [],
      errors: [],
      insufficientStock: []
    };

    try {
      const batch = writeBatch(db);
      const productsCollection = collection(db, `establecimientos/${establishmentId}/productos`);

      // Verificar stock antes de crear el batch
      for (const item of saleItems) {
        const productDocRef = doc(productsCollection, item.productId);
        const productDoc = await getDoc(productDocRef);
        
        if (!productDoc.exists()) {
          result.errors.push(`Producto ${item.productName} no encontrado`);
          continue;
        }

        const productData = productDoc.data();
        const currentStock = parseFloat(productData.cantidad || '0');
        const newStock = currentStock - item.quantity;

        if (newStock < 0) {
          result.insufficientStock.push(
            `${item.productName}: Stock ${currentStock}, requerido ${item.quantity}`
          );
          continue;
        }

        // Agregar al batch
        batch.update(productDocRef, {
          cantidad: newStock.toString(),
          lastSaleDate: new Date().toISOString(),
          lastSaleQuantity: item.quantity
        });

        result.updatedProducts.push(item.productName);
      }

      // Si hay errores de stock, no ejecutar el batch
      if (result.insufficientStock.length > 0) {
        throw new Error(`Stock insuficiente en productos: ${result.insufficientStock.join(', ')}`);
      }

      // Ejecutar todas las actualizaciones
      await batch.commit();
      result.success = true;
      return result;

    } catch (error) {
      console.error('Error in batch update:', error);
      result.errors.push(error instanceof Error ? error.message : 'Error en actualización por lotes');
      return result;
    }
  }

  /**
   * Revertir inventario (para cancelaciones o devoluciones)
   */
  static async revertInventoryUpdate(
    establishmentId: string,
    saleItems: SaleItem[]
  ): Promise<InventoryUpdateResult> {
    const result: InventoryUpdateResult = {
      success: false,
      updatedProducts: [],
      errors: [],
      insufficientStock: []
    };

    try {
      const batch = writeBatch(db);
      const productsCollection = collection(db, `establecimientos/${establishmentId}/productos`);

      for (const item of saleItems) {
        const productDocRef = doc(productsCollection, item.productId);
        const productDoc = await getDoc(productDocRef);
        
        if (!productDoc.exists()) {
          result.errors.push(`Producto ${item.productName} no encontrado`);
          continue;
        }

        const productData = productDoc.data();
        const currentStock = parseFloat(productData.cantidad || '0');
        const newStock = currentStock + item.quantity; // Sumar de vuelta

        batch.update(productDocRef, {
          cantidad: newStock.toString(),
          lastReturnDate: new Date().toISOString(),
          lastReturnQuantity: item.quantity
        });

        result.updatedProducts.push(item.productName);
      }

      await batch.commit();
      result.success = true;
      return result;

    } catch (error) {
      console.error('Error reverting inventory:', error);
      result.errors.push(error instanceof Error ? error.message : 'Error revirtiendo inventario');
      return result;
    }
  }

  /**
   * Verificar stock disponible antes de venta
   */
  static async checkStockAvailability(
    establishmentId: string,
    saleItems: SaleItem[]
  ): Promise<{
    available: boolean;
    insufficientStock: string[];
    stockStatus: Array<{
      productName: string;
      currentStock: number;
      requiredStock: number;
      available: boolean;
    }>;
  }> {
    const operationId = `inventory-check-stock-${Date.now()}`;
    performanceLogger.start(operationId, 'InventoryService.checkStockAvailability', {
      establishmentId,
      itemCount: saleItems.length
    });

    const result = {
      available: true,
      insufficientStock: [] as string[],
      stockStatus: [] as Array<{
        productName: string;
        currentStock: number;
        requiredStock: number;
        available: boolean;
      }>
    };

    try {
      const productsCollection = collection(db, `establecimientos/${establishmentId}/productos`);
      performanceLogger.checkpoint(operationId, `Verificando stock de ${saleItems.length} productos`);
      const checkStart = performance.now();

      for (const item of saleItems) {
        const productDocRef = doc(productsCollection, item.productId);
        const productDoc = await getDoc(productDocRef);
        
        if (!productDoc.exists()) {
          result.available = false;
          result.insufficientStock.push(`${item.productName}: Producto no encontrado`);
          continue;
        }

        const productData = productDoc.data();
        const currentStock = parseFloat(productData.cantidad || '0');
        const isAvailable = currentStock >= item.quantity;

        result.stockStatus.push({
          productName: item.productName,
          currentStock,
          requiredStock: item.quantity,
          available: isAvailable
        });

        if (!isAvailable) {
          result.available = false;
          result.insufficientStock.push(
            `${item.productName}: Disponible ${currentStock}, requerido ${item.quantity}`
          );
        }
      }

      const checkDuration = performance.now() - checkStart;
      performanceLogger.end(operationId, {
        checkTime: checkDuration.toFixed(2) + 'ms',
        available: result.available,
        insufficientCount: result.insufficientStock.length
      });

      return result;

    } catch (error) {
      performanceLogger.end(operationId, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('Error checking stock:', error);
      return {
        available: false,
        insufficientStock: ['Error verificando stock'],
        stockStatus: []
      };
    }
  }
}