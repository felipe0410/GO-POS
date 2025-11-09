import { useState } from 'react';
import { createInvoice, getActiveCashSession } from '@/firebase';
import { useAsyncOperation } from './useAsyncOperation';
import { useNotification } from './useNotification';
import { useCashSession } from './useCashSession';

interface SaleData {
  uid: string;
  total: number;
  paymentMethod: string;
  status: string;
  compra: any[];
  cliente?: any;
  descuento?: number;
  date?: string;
  [key: string]: any;
}

interface UseSalesWithCashSessionReturn {
  // Estados
  loading: boolean;
  activeCashSession: any;
  
  // Funciones
  saveSale: (saleData: SaleData) => Promise<string | null>;
  validateCashSession: () => Promise<boolean>;
  refreshCashSession: () => Promise<void>;
  
  // Utilidades
  formatSaleForSession: (saleData: SaleData) => SaleData;
  getSaleSessionInfo: (saleData: SaleData) => any;
}

/**
 * Hook para manejar ventas con asociación automática a sesión de caja
 */
export function useSalesWithCashSession(): UseSalesWithCashSessionReturn {
  const [activeCashSession, setActiveCashSession] = useState<any>(null);
  
  const { success, error: notifyError, warning, info } = useNotification();
  const { currentSession, refreshData } = useCashSession();

  // Operación para guardar venta
  const { execute: saveSaleOperation, loading } = useAsyncOperation(
    async (saleData: SaleData) => {
      // Validar que hay sesión activa
      const sessionValid = await validateCashSession();
      if (!sessionValid) {
        warning('No hay sesión de caja activa. La venta se guardará sin asociación.');
      }
      
      // Formatear datos de venta
      const formattedSale = formatSaleForSession(saleData);
      
      // Guardar en Firebase (se asociará automáticamente)
      const invoiceId = await createInvoice(formattedSale.uid, formattedSale);
      
      if (invoiceId) {
        if (sessionValid) {
          success(`Venta guardada y asociada a sesión de caja: ${formattedSale.uid}`);
          info(`Total: $${formattedSale.total.toLocaleString()} - Método: ${formattedSale.paymentMethod}`);
        } else {
          success(`Venta guardada: ${formattedSale.uid}`);
          warning('Recomendación: Abrir sesión de caja para mejor control.');
        }
        
        // Refrescar sesión para actualizar contadores
        await refreshData();
        
        return invoiceId;
      }
      
      throw new Error('No se pudo guardar la venta');
    }
  );

  // Operación para validar sesión de caja
  const { execute: validateOperation } = useAsyncOperation(
    async () => {
      const session = await getActiveCashSession();
      setActiveCashSession(session);
      
      if (!session) {
        console.warn('⚠️ No hay sesión de caja activa');
        return false;
      }
      
      console.log('✅ Sesión de caja activa encontrada:', {
        id: session.id,
        data: session
      });
      
      return true;
    }
  );

  // Operación para refrescar sesión
  const { execute: refreshOperation } = useAsyncOperation(
    async () => {
      await validateOperation();
      await refreshData();
    }
  );

  // Función pública para guardar venta
  const saveSale = async (saleData: SaleData): Promise<string | null> => {
    try {
      return await saveSaleOperation(saleData);
    } catch (error) {
      notifyError('Error guardando la venta');
      console.error('Error en saveSale:', error);
      return null;
    }
  };

  // Función pública para validar sesión
  const validateCashSession = async (): Promise<boolean> => {
    try {
      return await validateOperation();
    } catch (error) {
      console.error('Error validando sesión:', error);
      return false;
    }
  };

  // Función pública para refrescar
  const refreshCashSession = async (): Promise<void> => {
    try {
      await refreshOperation();
    } catch (error) {
      console.error('Error refrescando sesión:', error);
    }
  };

  // Formatear venta para sesión
  const formatSaleForSession = (saleData: SaleData): SaleData => {
    const now = new Date();
    const localDateString = now.toLocaleString('sv-SE').replace('T', ' ').substring(0, 16);
    
    return {
      ...saleData,
      // Asegurar formato de fecha local
      date: saleData.date || localDateString,
      // Normalizar método de pago
      paymentMethod: normalizePaymentMethod(saleData.paymentMethod),
      // Asegurar estado
      status: saleData.status || 'PAGADO',
      // Timestamp de creación
      createdAt: now.toISOString(),
      // Metadatos de sesión (se agregarán en createInvoice)
      sessionMetadata: {
        associatedAt: now.toISOString(),
        source: 'vender-module'
      }
    };
  };

  // Obtener información de sesión de una venta
  const getSaleSessionInfo = (saleData: SaleData) => {
    return {
      hasCashSession: !!saleData.cashSessionId,
      sessionId: saleData.cashSessionId,
      sessionUid: saleData.cashSessionUid,
      associatedAt: saleData.sessionMetadata?.associatedAt,
      source: saleData.sessionMetadata?.source
    };
  };

  // Normalizar método de pago
  const normalizePaymentMethod = (method: string): string => {
    const normalized = (method || '').toUpperCase();
    
    switch (normalized) {
      case 'CASH':
      case 'EFECTIVO':
        return 'EFECTIVO';
      case 'TRANSFER':
      case 'TRANSFERENCIA':
        return 'TRANSFERENCIA';
      case 'MIXED':
      case 'MIXTO':
        return 'MIXTO';
      default:
        return 'EFECTIVO'; // Por defecto
    }
  };

  return {
    // Estados
    loading,
    activeCashSession: activeCashSession || currentSession,
    
    // Funciones
    saveSale,
    validateCashSession,
    refreshCashSession,
    
    // Utilidades
    formatSaleForSession,
    getSaleSessionInfo
  };
}

/**
 * Hook simplificado para validar sesión de caja antes de vender
 */
export function useCashSessionValidation() {
  const { currentSession } = useCashSession();
  const { warning, info } = useNotification();
  
  const validateBeforeSale = (): boolean => {
    if (!currentSession) {
      warning('No hay sesión de caja activa');
      info('Recomendación: Abrir sesión de caja antes de realizar ventas');
      return false;
    }
    
    return true;
  };
  
  const getSessionStatus = () => {
    return {
      hasActiveSession: !!currentSession,
      sessionId: currentSession?.uid || null,
      sessionUid: currentSession?.uid || null,
      startTime: currentSession?.fechaApertura || null,
      initialAmount: currentSession?.montoInicial || null
    };
  };
  
  return {
    validateBeforeSale,
    getSessionStatus,
    hasActiveSession: !!currentSession
  };
}