import { doc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';

interface Product {
  uid: string;
  productName: string;
  barCode: string;
  price: string;
  cantidad: string;
  isFavorite?: boolean;
  [key: string]: any;
}

export class FavoritesService {
  /**
   * Toggle el estado de favorito de un producto
   */
  static async toggleFavorite(
    establishmentId: string,
    productId: string,
    currentFavoriteState: boolean
  ): Promise<boolean> {
    try {
      const productRef = doc(
        db,
        `establecimientos/${establishmentId}/productos`,
        productId
      );

      const newFavoriteState = !currentFavoriteState;

      await updateDoc(productRef, {
        isFavorite: newFavoriteState,
        favoriteUpdatedAt: new Date().toISOString(),
      });

      return newFavoriteState;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Error al actualizar favorito');
    }
  }

  /**
   * Obtener todos los productos favoritos
   */
  static async getFavorites(establishmentId: string): Promise<Product[]> {
    try {
      const productsRef = collection(
        db,
        `establecimientos/${establishmentId}/productos`
      );

      const q = query(
        productsRef,
        where('isFavorite', '==', true),
        orderBy('productName', 'asc')
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      } as Product));
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  /**
   * Marcar múltiples productos como favoritos
   */
  static async setMultipleFavorites(
    establishmentId: string,
    productIds: string[],
    isFavorite: boolean
  ): Promise<void> {
    try {
      const promises = productIds.map((productId) => {
        const productRef = doc(
          db,
          `establecimientos/${establishmentId}/productos`,
          productId
        );
        return updateDoc(productRef, {
          isFavorite,
          favoriteUpdatedAt: new Date().toISOString(),
        });
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error setting multiple favorites:', error);
      throw new Error('Error al actualizar favoritos');
    }
  }

  /**
   * Obtener conteo de favoritos
   */
  static async getFavoritesCount(establishmentId: string): Promise<number> {
    try {
      const productsRef = collection(
        db,
        `establecimientos/${establishmentId}/productos`
      );

      const q = query(productsRef, where('isFavorite', '==', true));
      const snapshot = await getDocs(q);

      return snapshot.size;
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return 0;
    }
  }

  /**
   * Filtrar productos favoritos de una lista
   */
  static filterFavorites(products: Product[]): Product[] {
    return products.filter((product) => product.isFavorite === true);
  }

  /**
   * Ordenar productos poniendo favoritos primero
   */
  static sortByFavorites(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
      // Favoritos primero
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      // Si ambos son favoritos o no favoritos, ordenar por nombre
      return a.productName.localeCompare(b.productName);
    });
  }
}
