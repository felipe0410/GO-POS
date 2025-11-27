import { useState, useCallback, useMemo } from 'react';
import { CashRegisterService, CashRegisterSummary } from '@/services/cashRegisterService';
import { useAsyncOperation } from './useAsyncOperation';
import { useNotification } from './useNotification';

interface UseCashRegisterReturn {
  // Datos principales
  dailySummary: CashRegisterSummary | null;
  rangeSummary: CashRegisterSummary | null;
  
  // Estados
  loading: boolean;
  error: string | null;
  
  // Funciones
  calculateDailySummary: (date: Date) => Promise<void>;
  calculateRangeSummary: (startDate: Date, endDate: Date) => Promise<void>;
  getDiagnostics: () => Promise<any>;
  compareLegacy: (date: Date) => Promise<any>;
  
  // Utilidades
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string) => string;
  getPaymentMethodIcon: (method: string) => string;
}

/**
 * Hook para manejo robusto de cálculos de caja (versión corregida sin bucles infinitos)
 */
export function useCashRegisterFixed(invoices: any[] = []): UseCashRegisterReturn {
  const [dailySummary, setDailySummary] = useState<CashRegisterSummary | null>(null);
  const [rangeSummary, setRangeSummary] = useState<CashRegisterSummary | null>(null);
  
  const { success, error: notifyError, warning, info } = useNotification();

  // Operación para calcular resumen diario
  const { execute: calculateDailyOperation, loading: dailyLoading } = useAsyncOperation(
    async (date: Date) => {
      if (!invoices || invoices.length === 0) {
        warning('No hay facturas disponibles para calcular');
        return;
      }

      const summary = CashRegisterService.calculateDailySummary(invoices, date);
      setDailySummary(summary);
      
      info(`Resumen calculado: ${summary.salesCount} ventas, ${summary.totalSales.toLocaleString()}`);
      return summary;
    }
  );

  // Operación para calcular resumen de rango
  const { execute: calculateRangeOperation, loading: rangeLoading } = useAsyncOperation(
    async (startDate: Date, endDate: Date) => {
      if (!invoices || invoices.length === 0) {
        warning('No hay facturas disponibles para calcular');
        return;
      }

      const summary = CashRegisterService.calculateRangeSummary(invoices, startDate, endDate);
      setRangeSummary(summary);
      
      info(`Resumen de rango calculado: ${summary.salesCount} ventas, ${summary.totalSales.toLocaleString()}`);
      return summary;
    }
  );

  // Operación para obtener diagnósticos
  const { execute: getDiagnosticsOperation } = useAsyncOperation(
    async () => {
      if (!invoices || invoices.length === 0) {
        return { message: 'No hay facturas para diagnosticar' };
      }

      const diagnostics = CashRegisterService.getDiagnostics(invoices);
      
      if (diagnostics.issues.length > 0) {
        warning(`Se encontraron ${diagnostics.issues.length} problemas en los datos`);
        console.warn('Problemas detectados:', diagnostics.issues);
      } else {
        success('Datos de facturas validados correctamente');
      }
      
      return diagnostics;
    }
  );

  // Operación para comparar con cálculo legacy
  const { execute: compareLegacyOperation } = useAsyncOperation(
    async (date: Date) => {
      if (!invoices || invoices.length === 0) {
        return { message: 'No hay facturas para comparar' };
      }

      const comparison = CashRegisterService.compareLegacyCalculation(invoices, date);
      
      if (comparison.differences.length > 0) {
        warning(`Se encontraron ${comparison.differences.length} diferencias con el cálculo anterior`);
        console.warn('Diferencias encontradas:', comparison.differences);
      } else {
        success('Los cálculos coinciden con el sistema anterior');
      }
      
      return comparison;
    }
  );

  // Funciones públicas (sin dependencias problemáticas)
  const calculateDailySummary = useCallback(async (date: Date) => {
    try {
      await calculateDailyOperation(date);
    } catch (error) {
      notifyError('Error calculando resumen diario');
      console.error('Error en cálculo diario:', error);
    }
  }, [calculateDailyOperation, notifyError]);

  const calculateRangeSummary = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      await calculateRangeOperation(startDate, endDate);
    } catch (error) {
      notifyError('Error calculando resumen de rango');
      console.error('Error en cálculo de rango:', error);
    }
  }, [calculateRangeOperation, notifyError]);

  const getDiagnostics = useCallback(async () => {
    try {
      return await getDiagnosticsOperation();
    } catch (error) {
      notifyError('Error obteniendo diagnósticos');
      console.error('Error en diagnósticos:', error);
      return null;
    }
  }, [getDiagnosticsOperation, notifyError]);

  const compareLegacy = useCallback(async (date: Date) => {
    try {
      return await compareLegacyOperation(date);
    } catch (error) {
      notifyError('Error comparando con cálculo anterior');
      console.error('Error en comparación:', error);
      return null;
    }
  }, [compareLegacyOperation, notifyError]);

  // Utilidades de formato (estables)
  const formatCurrency = useCallback((amount: number): string => {
    return `$ ${amount.toLocaleString('es-CO', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  }, []);

  const getStatusColor = useCallback((status: string): string => {
    switch (status.toUpperCase()) {
      case 'PAID':
      case 'PAGADO':
        return '#51cf66'; // Verde
      case 'PENDING':
      case 'PENDIENTE':
        return '#ffd43b'; // Amarillo
      case 'CANCELED':
      case 'ANULADO':
        return '#ff6b6b'; // Rojo
      default:
        return '#ABBBC2'; // Gris
    }
  }, []);

  const getPaymentMethodIcon = useCallback((method: string): string => {
    switch (method.toUpperCase()) {
      case 'CASH':
      case 'EFECTIVO':
        return '💵';
      case 'TRANSFER':
      case 'TRANSFERENCIA':
        return '🏦';
      case 'MIXED':
      case 'MIXTO':
        return '💳💵';
      case 'OTHER':
        return '💳';
      default:
        return '❓';
    }
  }, []);

  // ELIMINADO: El useEffect problemático que causaba el bucle infinito
  // NO calcular automáticamente, solo cuando se llame explícitamente

  // Memoizar valores computados
  const loading = useMemo(() => dailyLoading || rangeLoading, [dailyLoading, rangeLoading]);

  return {
    // Datos principales
    dailySummary,
    rangeSummary,
    
    // Estados
    loading,
    error: null, // Los errores se manejan con notificaciones
    
    // Funciones
    calculateDailySummary,
    calculateRangeSummary,
    getDiagnostics,
    compareLegacy,
    
    // Utilidades
    formatCurrency,
    getStatusColor,
    getPaymentMethodIcon,
  };
}

/**
 * Hook simplificado para obtener solo el resumen diario (sin efectos secundarios)
 */
export function useDailyCashSummaryFixed(invoices: any[], date?: Date) {
  const targetDate = date || new Date();
  
  const summary = useMemo(() => {
    if (!invoices || invoices.length === 0) return null;
    return CashRegisterService.calculateDailySummary(invoices, targetDate);
  }, [invoices, targetDate]);

  return summary;
}

/**
 * Hook para validación rápida de datos (sin efectos secundarios)
 */
export function useCashRegisterValidationFixed(invoices: any[]) {
  const diagnostics = useMemo(() => {
    if (!invoices || invoices.length === 0) return null;
    return CashRegisterService.getDiagnostics(invoices);
  }, [invoices]);

  const hasIssues = diagnostics ? diagnostics.issues.length > 0 : false;
  const validationScore = diagnostics 
    ? Math.round((diagnostics.validInvoices / diagnostics.totalInvoices) * 100)
    : 0;

  return {
    diagnostics,
    hasIssues,
    validationScore,
    isHealthy: validationScore >= 95 && !hasIssues
  };
}