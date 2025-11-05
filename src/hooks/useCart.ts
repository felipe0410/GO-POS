import { useCallback } from 'react';
import { useCart as useCartStore } from '@/store/useAppStore';
import { useNotification } from './useNotification';
import { useAsyncOperation } from './useAsyncOperation';
import { createInvoice, updateProductDataCantidad } from '@/firebase';
import { validateData, createInvoiceSchema } from '@/schemas/productSchemas';

export function useCart() {
  const {
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    addToCart: addToCartStore,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    applyDiscount,
    isProductInCart,
    getCartItemCount,
  } = useCartStore();

  const { success, error: notifyError, handleAsyncError } = useNotification();
  
  // Operación para procesar venta
  const processInvoiceOperation = useAsyncOperation(async (invoiceData: any) => {
    // Validar datos de la factura
    const validatedData = validateData(createInvoiceSchema, invoiceData);
    
    // Generar número de factura
    const invoiceNumber = `${Date.now()}`;
    
    // Crear factura en Firebase
    const result = await createInvoice(invoiceNumber, validatedData);
    
    if (!result) {
      throw new Error('Error al crear la factura');
    }
    
    // Actualizar inventario
    for (const item of cart) {
      await updateProductDataCantidad(item.product.uid, {
        cantidad: item.quantity,
      });
    }
    
    return { invoiceNumber, result };
  });

  // Agregar producto al carrito con validaciones
  const addToCart = useCallback((product: any, quantity: number = 1, unitPrice?: number) => {
    try {
      // Validaciones
      if (!product) {
        throw new Error('Producto no válido');
      }
      
      if (quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }
      
      const availableQuantity = parseFloat(product.cantidad || '0');
      const currentInCart = cart.find(item => item.product.uid === product.uid)?.quantity || 0;
      
      if (currentInCart + quantity > availableQuantity) {
        throw new Error(`Solo hay ${availableQuantity} unidades disponibles`);
      }
      
      addToCartStore(product, quantity, unitPrice);
      success(`${product.productName} agregado al carrito`);
      
    } catch (error) {
      handleAsyncError(error as Error, 'Error al agregar al carrito');
    }
  }, [cart, addToCartStore, success, handleAsyncError]);

  // Actualizar cantidad con validaciones
  const updateQuantity = useCallback((productUid: string, quantity: number) => {
    try {
      const cartItem = cart.find(item => item.product.uid === productUid);
      if (!cartItem) {
        throw new Error('Producto no encontrado en el carrito');
      }
      
      if (quantity <= 0) {
        removeFromCart(productUid);
        success('Producto removido del carrito');
        return;
      }
      
      const availableQuantity = parseFloat(cartItem.product.cantidad || '0');
      if (quantity > availableQuantity) {
        throw new Error(`Solo hay ${availableQuantity} unidades disponibles`);
      }
      
      updateCartItemQuantity(productUid, quantity);
      
    } catch (error) {
      handleAsyncError(error as Error, 'Error al actualizar cantidad');
    }
  }, [cart, updateCartItemQuantity, removeFromCart, success, handleAsyncError]);

  // Procesar venta completa
  const processInvoice = useCallback(async (customerData?: any, paymentMethod: string = 'Efectivo') => {
    try {
      if (cart.length === 0) {
        throw new Error('El carrito está vacío');
      }
      
      if (cartTotal <= 0) {
        throw new Error('El total debe ser mayor a 0');
      }
      
      // Preparar datos de la factura
      const invoiceData = {
        compra: cart.map(item => ({
          barCode: item.product.barCode,
          productName: item.product.productName,
          cantidad: item.quantity,
          acc: item.unitPrice,
        })),
        subtotal: cartSubtotal,
        descuento: cartDiscount,
        total: cartTotal,
        paymentMethod,
        name: customerData?.name || '',
        clientId: customerData?.uid || '',
      };
      
      const result = await processInvoiceOperation.execute(invoiceData);
      
      // Limpiar carrito después de venta exitosa
      clearCart();
      success(`Venta procesada exitosamente. Factura: ${result.invoiceNumber}`);
      
      return result;
      
    } catch (error) {
      handleAsyncError(error as Error, 'Error al procesar la venta');
      throw error;
    }
  }, [cart, cartTotal, cartSubtotal, cartDiscount, processInvoiceOperation, clearCart, success, handleAsyncError]);

  // Aplicar descuento con validaciones
  const applyDiscountWithValidation = useCallback((discount: number) => {
    try {
      if (discount < 0) {
        throw new Error('El descuento no puede ser negativo');
      }
      
      if (discount > cartSubtotal) {
        throw new Error('El descuento no puede ser mayor al subtotal');
      }
      
      applyDiscount(discount);
      success(`Descuento de $${discount.toLocaleString()} aplicado`);
      
    } catch (error) {
      handleAsyncError(error as Error, 'Error al aplicar descuento');
    }
  }, [cartSubtotal, applyDiscount, success, handleAsyncError]);

  // Calcular estadísticas del carrito
  const getCartStats = useCallback(() => {
    const itemCount = getCartItemCount();
    const uniqueProducts = cart.length;
    const averageItemPrice = itemCount > 0 ? cartSubtotal / itemCount : 0;
    
    return {
      itemCount,
      uniqueProducts,
      averageItemPrice,
      discountPercentage: cartSubtotal > 0 ? (cartDiscount / cartSubtotal) * 100 : 0,
    };
  }, [cart.length, cartSubtotal, cartDiscount, getCartItemCount]);

  // Validar disponibilidad de todos los productos en el carrito
  const validateCartAvailability = useCallback(() => {
    const unavailableItems: string[] = [];
    
    cart.forEach(item => {
      const availableQuantity = parseFloat(item.product.cantidad || '0');
      if (item.quantity > availableQuantity) {
        unavailableItems.push(`${item.product.productName} (disponible: ${availableQuantity})`);
      }
    });
    
    return {
      isValid: unavailableItems.length === 0,
      unavailableItems,
    };
  }, [cart]);

  return {
    // Estado del carrito
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    isEmpty: cart.length === 0,
    
    // Operaciones básicas
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount: applyDiscountWithValidation,
    
    // Operaciones avanzadas
    processInvoice,
    
    // Utilidades
    isProductInCart,
    getCartItemCount,
    getCartStats,
    validateCartAvailability,
    
    // Estados de operaciones
    processingInvoice: processInvoiceOperation.loading,
    invoiceError: processInvoiceOperation.error,
  };
}