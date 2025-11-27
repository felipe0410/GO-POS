import { useState, useCallback } from 'react';
import { FavoritesService } from '@/services/favoritesService';
import { useNotification } from './useNotification';
import { useAsyncOperation } from './useAsyncOperation';

interface Product {
  uid: string;
  productName: string;
  isFavorite?: boolean;
  [key: string]: any;
}

export function useFavorites(establishmentId: string) {
  const { success, error: notifyError } = useNotification();
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Operación para toggle de favorito
  const toggleOperation = useAsyncOperation(
    async (productId: string, currentState: boolean) => {
      return await FavoritesService.toggleFavorite(
        establishmentId,
        productId,
        currentState
      );
    }
  );

  // Toggle favorito con feedback
  const toggleFavorite = useCallback(
    async (productId: string, currentState: boolean, productName: string) => {
      try {
        const newState = await toggleOperation.execute(productId, currentState);

        if (newState) {
          success(`⭐ ${productName} agregado a favoritos`);
        } else {
          success(`${productName} removido de favoritos`);
        }

        return newState;
      } catch (error) {
        notifyError('Error al actualizar favorito');
        throw error;
      }
    },
    [toggleOperation, success, notifyError]
  );

  // Filtrar productos según el estado del toggle
  const filterProducts = useCallback(
    (products: any[]) => {
      if (showOnlyFavorites) {
        return FavoritesService.filterFavorites(products);
      }
      return products;
    },
    [showOnlyFavorites]
  );

  // Ordenar productos poniendo favoritos primero
  const sortProducts = useCallback((products: any[]) => {
    return FavoritesService.sortByFavorites(products);
  }, []);

  // Toggle del filtro de favoritos
  const toggleShowOnlyFavorites = useCallback(() => {
    setShowOnlyFavorites((prev) => !prev);
  }, []);

  // Obtener favoritos del servidor
  const getFavorites = useCallback(async () => {
    try {
      return await FavoritesService.getFavorites(establishmentId);
    } catch (error) {
      notifyError('Error al obtener favoritos');
      return [];
    }
  }, [establishmentId, notifyError]);

  // Obtener conteo de favoritos
  const getFavoritesCount = useCallback(async () => {
    try {
      return await FavoritesService.getFavoritesCount(establishmentId);
    } catch (error) {
      return 0;
    }
  }, [establishmentId]);

  return {
    // Estados
    showOnlyFavorites,
    isTogglingFavorite: toggleOperation.loading,

    // Acciones
    toggleFavorite,
    toggleShowOnlyFavorites,
    filterProducts,
    sortProducts,
    getFavorites,
    getFavoritesCount,
  };
}
