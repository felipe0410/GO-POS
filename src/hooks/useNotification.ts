import { useSnackbar, VariantType } from 'notistack';
import { useCallback } from 'react';

interface NotificationOptions {
  variant?: VariantType;
  persist?: boolean;
  autoHideDuration?: number;
}

export function useNotification() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const notify = useCallback((
    message: string, 
    options: NotificationOptions = {}
  ) => {
    const { variant = 'default', persist = false, autoHideDuration = 4000 } = options;
    
    return enqueueSnackbar(message, {
      variant,
      persist,
      autoHideDuration: persist ? undefined : autoHideDuration,
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
    });
  }, [enqueueSnackbar]);

  const success = useCallback((message: string, persist = false) => {
    return notify(message, { variant: 'success', persist });
  }, [notify]);

  const error = useCallback((message: string, persist = true) => {
    return notify(message, { variant: 'error', persist });
  }, [notify]);

  const warning = useCallback((message: string, persist = false) => {
    return notify(message, { variant: 'warning', persist });
  }, [notify]);

  const info = useCallback((message: string, persist = false) => {
    return notify(message, { variant: 'info', persist });
  }, [notify]);

  // Función para manejar errores de operaciones async
  const handleAsyncError = useCallback((error: Error | string, context?: string) => {
    const message = error instanceof Error ? error.message : error;
    const fullMessage = context ? `${context}: ${message}` : message;
    return notify(fullMessage, { variant: 'error', persist: true });
  }, [notify]);

  return {
    notify,
    success,
    error,
    warning,
    info,
    handleAsyncError,
    close: closeSnackbar,
  };
}