/**
 * Sistema de caché para ventas rápidas
 * Reduce consultas a Firebase y mejora performance
 */

interface QuickSaleCache {
  invoiceId: string;
  data: any;
  lastUpdate: number;
  itemsCount: number;
}

class QuickSaleCacheManager {
  private cache: Map<string, QuickSaleCache> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtener factura del caché o Firebase
   */
  async getOrFetch(
    invoiceId: string,
    fetchFn: () => Promise<any>
  ): Promise<any> {
    const cached = this.cache.get(invoiceId);
    const now = Date.now();

    // Si está en caché y no ha expirado, retornar del caché
    if (cached && (now - cached.lastUpdate) < this.CACHE_TTL) {
      return cached.data;
    }

    // Si no está en caché o expiró, consultar Firebase
    const data = await fetchFn();

    // Guardar en caché
    if (data) {
      this.cache.set(invoiceId, {
        invoiceId,
        data,
        lastUpdate: now,
        itemsCount: data.compra?.length || 0,
      });
    }

    return data;
  }

  /**
   * Actualizar caché después de modificación
   */
  update(invoiceId: string, data: any) {
    this.cache.set(invoiceId, {
      invoiceId,
      data,
      lastUpdate: Date.now(),
      itemsCount: data.compra?.length || 0,
    });
  }

  /**
   * Invalidar caché de una factura específica
   */
  invalidate(invoiceId: string) {
    this.cache.delete(invoiceId);
  }

  /**
   * Limpiar caché expirado
   */
  cleanup() {
    const now = Date.now();

    for (const [key, value] of this.cache.entries()) {
      if ((now - value.lastUpdate) > this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Limpiar todo el caché
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.values());

    return {
      totalEntries: entries.length,
      activeEntries: entries.filter(e => (now - e.lastUpdate) < this.CACHE_TTL).length,
      expiredEntries: entries.filter(e => (now - e.lastUpdate) >= this.CACHE_TTL).length,
      totalItems: entries.reduce((sum, e) => sum + e.itemsCount, 0),
      oldestEntry: entries.length > 0 
        ? Math.min(...entries.map(e => e.lastUpdate))
        : null,
    };
  }
}

// Instancia singleton
export const quickSaleCache = new QuickSaleCacheManager();

// Limpiar caché expirado cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    quickSaleCache.cleanup();
  }, 5 * 60 * 1000);
}
