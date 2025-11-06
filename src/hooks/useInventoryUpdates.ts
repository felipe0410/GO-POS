import { useCallback } from 'react';
import { useAsyncOperation } from './useAsyncOperation';
import { useNotification } from './useNotification';
import { InventoryService } from '@/services/inventoryService';

interface SaleItem {
  productId: string;
  barCode: string;
  productName: string;
  quantity: number;
  price: number;
}

interface UseInventoryUpdatesReturn {
  updateInventoryAfterSale: (establishmentId: string, saleItems: SaleItem[]) => Promise<boolean>;
  checkStockBeforeSale: (establishmentId: string, saleItems: SaleItem[]) => Promise<boolean>;
  revertInventoryUpdate: (establishmentId: string, saleItems: SaleItem[]) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useInventoryUpdates(): UseInventoryUpdatesReturn {
  const { success, error: notifyError, warning } = useNotification();

  // Operación para actualizar inventario después de venta
  const updateOperation = useAsyncOperation(InventoryService.updateInventoryAfterSale);
  
  // Operación para verificar stock
  const checkStockOperation = useAsyncOperation(InventoryService.checkStockAvailability);
  
  // Operación para revertir inventario
  const revertOperation = useAsyncOperation(InventoryService.revertInventoryUpdate);

  // Actualizar inventario después de venta exitosa
  const updateInventoryAfterSale = useCallback(async (
    establishmentId: string, 
    saleItems: SaleItem[]
  ): Promise<boolean> => {
    try {
      const result = await updateOperation.execute(establishmentId, saleItems);
      
      if (result.success) {
        success(`Inventario actualizado: ${result.updatedProducts.length} productos`);
        
        // Mostrar detalles si hay productos con bajo stock
        const lowStockWarnings = result.updatedProducts.filter(product => {
          // Aquí podrías agregar lógica para detectar stock bajo
          return false; // Por ahora, no implementado
        });
        
        if (lowStockWarnings.length > 0) {
          warning(`Productos con stock bajo: ${lowStockWarnings.join(', ')}`);
        }
        
        return true;
      } else {
        // Manejar errores específicos
        if (result.insufficientStock.length > 0) {
          notifyError(`Stock insuficiente: ${result.insufficientStock.join(', ')}`);
        } else if (result.errors.length > 0) {
          notifyError(`Error actualizando inventario: ${result.errors.join(', ')}`);
        }
        return false;
      }
    } catch (error) {
      notifyError('Error crítico actualizando inventario');
      return false;
    }
  }, [updateOperation, success, notifyError, warning]);

  // Verificar stock antes de procesar venta
  const checkStockBeforeSale = useCallback(async (
    establishmentId: string, 
    saleItems: SaleItem[]
  ): Promise<boolean> => {
    try {
      const result = await checkStockOperation.execute(establishmentId, saleItems);
      
      if (result.available) {
        return true;
      } else {
        // Mostrar detalles específicos del stock insuficiente
        const stockDetails = result.stockStatus
          .filter(item => !item.available)
          .map(item => `${item.productName}: ${item.currentStock}/${item.requiredStock}`)
          .join(', ');
        
        notifyError(`Stock insuficiente: ${stockDetails}`);
        return false;
      }
    } catch (error) {
      notifyError('Error verificando stock disponible');
      return false;
    }
  }, [checkStockOperation, notifyError]);

  // Revertir inventario (para cancelaciones)
  const revertInventoryUpdate = useCallback(async (
    establishmentId: string, 
    saleItems: SaleItem[]
  ): Promise<boolean> => {
    try {
      const result = await revertOperation.execute(establishmentId, saleItems);
      
      if (result.success) {
        success(`Inventario revertido: ${result.updatedProducts.length} productos`);
        return true;
      } else {
        notifyError(`Error revirtiendo inventario: ${result.errors.join(', ')}`);
        return false;
      }
    } catch (error) {
      notifyError('Error crítico revirtiendo inventario');
      return false;
    }
  }, [revertOperation, success, notifyError]);

  return {
    updateInventoryAfterSale,
    checkStockBeforeSale,
    revertInventoryUpdate,
    loading: updateOperation.loading || checkStockOperation.loading || revertOperation.loading,
    error: updateOperation.error || checkStockOperation.error || revertOperation.error,
  };
}

// Hook específico para integración con el carrito
export function useCartInventoryIntegration() {
  const inventoryUpdates = useInventoryUpdates();
  
  // Convertir items del carrito al formato requerido
  const convertCartItemsToSaleItems = useCallback((cartItems: any[]): SaleItem[] => {
    return cartItems.map(item => ({
      productId: item.product?.uid || item.uid,
      barCode: item.product?.barCode || item.barCode,
      productName: item.product?.productName || item.productName,
      quantity: item.quantity || item.cantidad,
      price: item.unitPrice || item.acc || parseFloat(item.price?.replace(/[^0-9.-]+/g, '') || '0')
    }));
  }, []);

  // Procesar venta completa con actualización de inventario
  const processSaleWithInventoryUpdate = useCallback(async (
    establishmentId: string,
    cartItems: any[]
  ): Promise<boolean> => {
    const saleItems = convertCartItemsToSaleItems(cartItems);
    
    // 1. Verificar stock antes de procesar (solo warning, no bloquear)
    const stockAvailable = await inventoryUpdates.checkStockBeforeSale(establishmentId, saleItems);
    if (!stockAvailable) {
      console.warn('⚠️ Venta procesada con stock insuficiente en algunos productos');
      // No retornar false, continuar con la venta
    }
    
    // 2. Actualizar inventario después de venta (permitir stock negativo)
    return await inventoryUpdates.updateInventoryAfterSale(establishmentId, saleItems);
  }, [inventoryUpdates, convertCartItemsToSaleItems]);

  return {
    ...inventoryUpdates,
    processSaleWithInventoryUpdate,
    convertCartItemsToSaleItems,
  };
}