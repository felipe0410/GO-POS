/**
 * Servicio centralizado para manejo de conectividad
 * Proporciona métodos robustos para verificar el estado de la conexión
 */

export interface ConnectivityStatus {
  isOnline: boolean;
  lastCheck: number;
  latency?: number;
  firebaseAccessible: boolean;
  generalConnectivity: boolean;
}

export class ConnectivityService {
  private static instance: ConnectivityService;
  private static currentStatus: ConnectivityStatus = {
    isOnline: false,
    lastCheck: 0,
    firebaseAccessible: false,
    generalConnectivity: false,
  };

  private static listeners: Array<(status: ConnectivityStatus) => void> = [];
  private static checkInProgress = false;

  /**
   * Obtener instancia singleton
   */
  static getInstance(): ConnectivityService {
    if (!this.instance) {
      this.instance = new ConnectivityService();
    }
    return this.instance;
  }

  /**
   * Verificación completa de conectividad
   */
  static async checkConnectivity(useCache = false): Promise<ConnectivityStatus> {
    // Si hay una verificación en progreso, esperar
    if (this.checkInProgress) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.checkInProgress) {
            clearInterval(checkInterval);
            resolve(this.currentStatus);
          }
        }, 100);
      });
    }

    // Si se permite usar caché y es reciente (menos de 30 segundos)
    if (useCache && this.currentStatus.lastCheck > Date.now() - 30000) {
      return this.currentStatus;
    }

    this.checkInProgress = true;
    const startTime = Date.now();

    try {
      // Verificación básica del navegador
      const navigatorOnline = navigator.onLine;
      
      if (!navigatorOnline) {
        this.currentStatus = {
          isOnline: false,
          lastCheck: Date.now(),
          firebaseAccessible: false,
          generalConnectivity: false,
        };
        this.notifyListeners();
        return this.currentStatus;
      }

      // Verificaciones paralelas
      const [generalResult, firebaseResult] = await Promise.allSettled([
        this.checkGeneralConnectivity(),
        this.checkFirebaseConnectivity(),
      ]);

      const generalConnectivity = generalResult.status === 'fulfilled' && generalResult.value;
      const firebaseAccessible = firebaseResult.status === 'fulfilled' && firebaseResult.value;
      const isOnline = generalConnectivity || firebaseAccessible;
      const latency = Date.now() - startTime;

      this.currentStatus = {
        isOnline,
        lastCheck: Date.now(),
        latency,
        firebaseAccessible,
        generalConnectivity,
      };

      this.notifyListeners();
      return this.currentStatus;

    } catch (error) {
      console.error('Error en verificación de conectividad:', error);
      
      this.currentStatus = {
        isOnline: false,
        lastCheck: Date.now(),
        firebaseAccessible: false,
        generalConnectivity: false,
      };

      this.notifyListeners();
      return this.currentStatus;
    } finally {
      this.checkInProgress = false;
    }
  }

  /**
   * Verificación rápida (solo para uso frecuente)
   */
  static async quickCheck(): Promise<boolean> {
    if (!navigator.onLine) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verificar conectividad general a internet
   */
  private static async checkGeneralConnectivity(): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      // Probar múltiples endpoints para mayor confiabilidad
      const endpoints = [
        'https://www.google.com/favicon.ico',
        'https://www.cloudflare.com/favicon.ico',
        'https://httpbin.org/status/200',
      ];

      // Intentar con el primer endpoint disponible
      for (const endpoint of endpoints) {
        try {
          await fetch(endpoint, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          return true;
        } catch (error) {
          // Continuar con el siguiente endpoint
          continue;
        }
      }

      clearTimeout(timeoutId);
      return false;
    } catch (error) {
      clearTimeout(timeoutId);
      return false;
    }
  }

  /**
   * Verificar conectividad específica a Firebase
   */
  private static async checkFirebaseConnectivity(): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      // Importar Firebase dinámicamente para evitar errores de inicialización
      const { db } = await import('@/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      // Crear una referencia a un documento de prueba
      const testDoc = doc(db, '_connectivity_test', 'test');
      
      // Intentar leer el documento (no importa si existe o no)
      await getDoc(testDoc);
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Analizar el tipo de error para mejor diagnóstico
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          console.warn('🔴 Error de red accediendo a Firebase');
        } else if (error.message.includes('permission')) {
          console.warn('🟡 Firebase accesible pero sin permisos (conexión OK)');
          return true; // La conexión funciona, solo hay un problema de permisos
        } else {
          console.warn('🔴 Error desconocido accediendo a Firebase:', error.message);
        }
      }
      
      return false;
    }
  }

  /**
   * Suscribirse a cambios de conectividad
   */
  static subscribe(listener: (status: ConnectivityStatus) => void): () => void {
    this.listeners.push(listener);
    
    // Enviar estado actual inmediatamente
    listener(this.currentStatus);
    
    // Retornar función de desuscripción
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notificar a todos los listeners
   */
  private static notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentStatus);
      } catch (error) {
        console.error('Error notificando listener de conectividad:', error);
      }
    });
  }

  /**
   * Obtener estado actual (desde caché)
   */
  static getCurrentStatus(): ConnectivityStatus {
    return { ...this.currentStatus };
  }

  /**
   * Inicializar monitoreo automático
   */
  static startMonitoring(): void {
    // Verificación inicial
    this.checkConnectivity();

    // Escuchar eventos del navegador
    const handleOnline = () => {
      console.log('🟢 Navegador reporta conexión');
      setTimeout(() => this.checkConnectivity(), 1000);
    };

    const handleOffline = () => {
      console.log('🔴 Navegador reporta desconexión');
      this.currentStatus = {
        isOnline: false,
        lastCheck: Date.now(),
        firebaseAccessible: false,
        generalConnectivity: false,
      };
      this.notifyListeners();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificación periódica (cada 5 minutos)
    setInterval(() => {
      this.checkConnectivity(true); // Usar caché si es reciente
    }, 5 * 60 * 1000);
  }

  /**
   * Obtener diagnóstico detallado de conectividad
   */
  static async getDiagnostics(): Promise<{
    navigator: boolean;
    general: boolean;
    firebase: boolean;
    latency?: number;
    timestamp: number;
  }> {
    const status = await this.checkConnectivity();
    
    return {
      navigator: navigator.onLine,
      general: status.generalConnectivity,
      firebase: status.firebaseAccessible,
      latency: status.latency,
      timestamp: status.lastCheck,
    };
  }
}

// Inicializar monitoreo automáticamente
if (typeof window !== 'undefined') {
  ConnectivityService.startMonitoring();
}