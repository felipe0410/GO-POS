import { useEffect, useCallback } from 'react';
import { ProductService } from '@/services/productService';
import { useAsyncOperation } from './useAsyncOperation';
import { useNotification } from './useNotification';
import { useProducts as useProductsStore } from '@/store/useAppStore';
import { getAllProductsDataonSnapshot } from '@/firebase';
import { CACHE_CONFIG } from '@/config/constants';

export function useProducts() {
  const {
    products,
    productsLoading,
    productsLastUpdate,
    setProducts,
    addProduct,
    updateProduct: updateProductInStore,
    removeProduct,
    setProductsLoading,
    getProductByBarCode,
  } = useProductsStore();

  const { success, error: notifyError } = useNotification();
  
  // Operaciones async con manejo de errores
  const createOperation = useAsyncOperation(ProductService.createProduct);
  const updateOperation = useAsyncOperation(ProductService.updateProduct);
  const deleteOperation = useAsyncOperation(ProductService.deleteProduct);

  // Verificar si necesitamos actualizar el caché
  const shouldRefreshCache = useCallback(() => {
    if (!productsLastUpdate) return true;
    const now = Date.now();
    const cacheAge = now - productsLastUpdate;
    return cacheAge > CACHE_CONFIG.products.ttl;
  }, [productsLastUpdate]);

  // Cargar productos con caché inteligente
  useEffect(() => {
    // Si tenemos productos en caché y no han expirado, no cargar
    if (products.length > 0 && !shouldRefreshCache()) {
      return;
    }

    setProductsLoading(true);

    const unsubscribe = getAllProductsDataonSnapshot((data: any[] | null) => {
      if (data === null) {
        notifyError('Error al cargar productos');
        setProductsLoading(false);
        return;
      }
      
      setProducts(data);
      setProductsLoading(false);
      
      // Actualizar caché offline cuando se cargan productos
      updateOfflineCache(data);
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [products.length, shouldRefreshCache, setProducts, setProductsLoading, notifyError]);

  // Actualizar caché offline
  const updateOfflineCache = useCallback(async (productsData: any[]) => {
    try {
      const { OfflineService } = await import('@/services/offlineService');
      await OfflineService.updateProductsCache(productsData);
    } catch (error) {
      // Error silencioso - no es crítico para la funcionalidad principal
      console.warn('No se pudo actualizar caché offline:', error);
    }
  }, []);

  // Crear producto
  const createProduct = useCallback(async (productData: unknown) => {
    try {
      const uid = await createOperation.execute(productData);
      success('Producto creado exitosamente');
      
      // Actualizar el store local inmediatamente
      const newProduct = { ...productData, uid } as any;
      addProduct(newProduct);
      
      return uid;
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Error al crear producto');
      throw error;
    }
  }, [createOperation, success, notifyError, addProduct]);

  // Actualizar producto
  const updateProduct = useCallback(async (uid: string, productData: unknown) => {
    try {
      await updateOperation.execute(uid, productData);
      success('Producto actualizado exitosamente');
      
      // Actualizar el store local inmediatamente
      updateProductInStore(uid, productData as any);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Error al actualizar producto');
      throw error;
    }
  }, [updateOperation, success, notifyError, updateProductInStore]);

  // Eliminar producto
  const deleteProduct = useCallback(async (uid: string, imageUrl?: string) => {
    try {
      await deleteOperation.execute(uid, imageUrl);
      success('Producto eliminado exitosamente');
      
      // Remover del store local inmediatamente
      removeProduct(uid);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Error al eliminar producto');
      throw error;
    }
  }, [deleteOperation, success, notifyError, removeProduct]);

  // Buscar productos (optimizado con useMemo en el store)
  const searchProducts = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.productName.toLowerCase().includes(term) ||
      product.barCode.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term)
    );
  }, [products]);

  // Filtrar por categoría
  const filterByCategory = useCallback((category: string) => {
    if (!category) return products;
    return products.filter(product => product.category === category);
  }, [products]);

  // Obtener categorías únicas (memoizado)
  const categories = useCallback(() => {
    const uniqueCategories = new Set(
      products
        .map(p => p.category)
        .filter(Boolean)
    );
    return Array.from(uniqueCategories);
  }, [products]);

  // Forzar actualización del caché
  const refreshProducts = useCallback(() => {
    setProductsLoading(true);
    const unsubscribe = getAllProductsDataonSnapshot((data: any[] | null) => {
      if (data !== null) {
        setProducts(data);
      }
      setProductsLoading(false);
    });
    
    // Cleanup inmediato ya que solo queremos una actualización
    setTimeout(() => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    }, 1000);
  }, [setProducts, setProductsLoading]);

  return {
    // Estado
    products,
    loading: productsLoading || createOperation.loading || updateOperation.loading || deleteOperation.loading,
    error: createOperation.error || updateOperation.error || deleteOperation.error,
    
    // Operaciones
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    
    // Utilidades
    searchProducts,
    filterByCategory,
    categories,
    getProductByBarCode,
    
    // Estados específicos de operaciones
    creating: createOperation.loading,
    updating: updateOperation.loading,
    deleting: deleteOperation.loading,
    
    // Información de caché
    cacheAge: productsLastUpdate ? Date.now() - productsLastUpdate : null,
    isCacheExpired: shouldRefreshCache(),
  };
}