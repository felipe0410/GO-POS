/**
 * Sistema de logging de performance para identificar cuellos de botella
 */

interface PerformanceLog {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceLogger {
  private logs: Map<string, PerformanceLog> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Deshabilitado por defecto - habilitar manualmente cuando se necesite debug
    this.enabled = localStorage.getItem('enablePerformanceLog') === 'true';
  }

  /**
   * Iniciar medición de una operación
   */
  start(operationId: string, operationName: string, metadata?: Record<string, any>) {
    if (!this.enabled) return;

    const log: PerformanceLog = {
      operation: operationName,
      startTime: performance.now(),
      metadata,
    };

    this.logs.set(operationId, log);
    
    console.log(`🚀 [PERFORMANCE] Iniciando: ${operationName}`, metadata || '');
  }

  /**
   * Finalizar medición de una operación
   */
  end(operationId: string, additionalMetadata?: Record<string, any>) {
    if (!this.enabled) return;

    const log = this.logs.get(operationId);
    if (!log) {
      console.warn(`⚠️ [PERFORMANCE] No se encontró log para: ${operationId}`);
      return;
    }

    log.endTime = performance.now();
    log.duration = log.endTime - log.startTime;
    
    if (additionalMetadata) {
      log.metadata = { ...log.metadata, ...additionalMetadata };
    }

    // Determinar el emoji según la duración
    let emoji = '✅';
    if (log.duration > 3000) emoji = '🔴'; // Muy lento (>3s)
    else if (log.duration > 1000) emoji = '🟡'; // Lento (>1s)
    else if (log.duration > 500) emoji = '🟢'; // Aceptable (>500ms)

    console.log(
      `${emoji} [PERFORMANCE] ${log.operation}: ${log.duration.toFixed(2)}ms`,
      log.metadata || ''
    );

    // Limpiar el log
    this.logs.delete(operationId);

    return log;
  }

  /**
   * Marcar un checkpoint dentro de una operación
   */
  checkpoint(operationId: string, checkpointName: string, metadata?: Record<string, any>) {
    if (!this.enabled) return;

    const log = this.logs.get(operationId);
    if (!log) {
      console.warn(`⚠️ [PERFORMANCE] No se encontró log para checkpoint: ${operationId}`);
      return;
    }

    const elapsed = performance.now() - log.startTime;
    console.log(
      `⏱️ [CHECKPOINT] ${log.operation} → ${checkpointName}: ${elapsed.toFixed(2)}ms`,
      metadata || ''
    );
  }

  /**
   * Medir una función async automáticamente
   */
  async measure<T>(
    operationName: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const operationId = `${operationName}-${Date.now()}`;
    
    this.start(operationId, operationName, metadata);
    
    try {
      const result = await fn();
      this.end(operationId, { success: true });
      return result;
    } catch (error) {
      this.end(operationId, { success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Habilitar/deshabilitar logging
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('enablePerformanceLog', enabled.toString());
  }

  /**
   * Obtener resumen de operaciones
   */
  getSummary() {
    return Array.from(this.logs.entries()).map(([id, log]) => ({
      id,
      operation: log.operation,
      elapsed: performance.now() - log.startTime,
      metadata: log.metadata,
    }));
  }
}

// Instancia singleton
export const performanceLogger = new PerformanceLogger();

// Helper para usar en componentes
export function usePerformanceLogger() {
  return performanceLogger;
}

// Decorator para funciones
export function measurePerformance(operationName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return performanceLogger.measure(
        `${operationName || propertyKey}`,
        () => originalMethod.apply(this, args)
      );
    };

    return descriptor;
  };
}
