import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncOperationReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useAsyncOperation<T>(
  operation: (...args: any[]) => Promise<T>
): UseAsyncOperationReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await operation(...args);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [operation]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// Hook específico para operaciones de Firebase
export function useFirebaseOperation<T>(
  operation: (...args: any[]) => Promise<T>
) {
  return useAsyncOperation(async (...args: any[]) => {
    try {
      return await operation(...args);
    } catch (error: any) {
      // Manejo específico de errores de Firebase
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para realizar esta acción');
      }
      if (error.code === 'network-request-failed') {
        throw new Error('Error de conexión. Verifica tu internet');
      }
      if (error.code === 'quota-exceeded') {
        throw new Error('Límite de operaciones excedido. Intenta más tarde');
      }
      
      throw new Error(error.message || 'Error en la operación');
    }
  });
}