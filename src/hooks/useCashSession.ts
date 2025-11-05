import { useState, useEffect, useCallback, useMemo } from 'react';
import { CashSessionService, CashSession, CashSessionConfig, CashSessionSummary } from '@/services/cashSessionService';
import { useAsyncOperation } from './useAsyncOperation';
import { useNotification } from './useNotification';

// Importar funciones de Firebase
import { 
  openCaja, 
  closeCaja, 
  getUltimaCaja, 
  getAllCierresCaja,
  getAllInvoicesDataOptimice 
} from '@/firebase';

interface UseCashSessionReturn {
  // Estado actual
  currentSession: CashSession | null;
  sessionSummary: CashSessionSummary | null;
  config: CashSessionConfig;
  
  // Estados de carga
  loading: boolean;
  loadingOpen: boolean;
  loadingClose: boolean;
  
  // Funciones principales
  openSession: (montoInicial: string, notas: string) => Promise<boolean>;
  closeSession: (montoFinal: string, notas: string, forzar?: boolean) => Promise<boolean>;
  autoCloseSession: () => Promise<boolean>;
  
  // Configuración
  updateConfig: (newConfig: Partial<CashSessionConfig>) => void;
  
  // Utilidades
  canClose: boolean;
  shouldAlert: boolean;
  nextAlert: Date | null;
  timeUntilAutoClose: number | null; // En horas
  
  // Validaciones
  validateClosure: (montoFinal: number) => { canClose: boolean; errors: string[]; warnings: string[] };
  
  // Datos históricos
  closedSessions: CashSession[];
  refreshData: () => Promise<void>;
}

/**
 * Hook para gestión completa de sesiones de caja
 */
export function useCashSession(invoices: any[] = []): UseCashSessionReturn {
  // Estados principales
  const [currentSession, setCurrentSession] = useState<CashSession | null>(null);
  const [closedSessions, setClosedSessions] = useState<CashSession[]>([]);
  const [config, setConfig] = useState<CashSessionConfig>(CashSessionService.getDefaultConfig());
  
  const { success, error: notifyError, warning, info } = useNotification();

  // Operación para abrir sesión
  const { execute: openSessionOperation, loading: loadingOpen } = useAsyncOperation(
    async (montoInicial: string, notas: string) => {
      // Verificar que no haya sesión abierta
      if (currentSession && !currentSession.cajaCerrada) {
        throw new Error('Ya hay una sesión de caja abierta');
      }

      const sessionId = await openCaja(montoInicial, notas);
      
      if (!sessionId) {
        throw new Error('Error al abrir la sesión de caja');
      }

      // Actualizar datos
      await refreshCurrentSession();
      success(`Caja abierta con $${parseFloat(montoInicial).toLocaleString()}`);
      
      return true;
    }
  );

  // Operación para cerrar sesión
  const { execute: closeSessionOperation, loading: loadingClose } = useAsyncOperation(
    async (montoFinal: string, notas: string, forzar = false) => {
      if (!currentSession || currentSession.cajaCerrada) {
        throw new Error('No hay sesión de caja abierta para cerrar');
      }

      // Calcular resumen
      const summary = sessionSummary;
      if (!summary) {
        throw new Error('No se pudo calcular el resumen de la sesión');
      }

      // Validar cierre si no es forzado
      if (!forzar) {
        const validation = CashSessionService.validateClosure(
          currentSession, 
          summary, 
          config, 
          parseFloat(montoFinal)
        );

        if (!validation.canClose) {
          throw new Error(`No se puede cerrar la caja: ${validation.errors.join(', ')}`);
        }

        // Mostrar advertencias
        validation.warnings.forEach(warn => warning(warn));
      }

      // Preparar datos de cierre
      const resumenCierre = {
        montoFinal,
        notasCierre: notas,
        efectivo: summary.totalCash,
        transferencias: summary.totalTransfer,
        pendientes: summary.totalPending,
        devoluciones: 0, // TODO: Implementar devoluciones
        totalCerrado: summary.totalSales,
        facturasUIDs: [
          ...summary.breakdown.cash,
          ...summary.breakdown.transfer,
          ...summary.breakdown.mixed
        ].map(invoice => invoice.id),
      };

      const result = await closeCaja(currentSession.uid, resumenCierre);
      
      if (!result.success) {
        throw new Error('Error al cerrar la sesión de caja');
      }

      // Actualizar datos
      await refreshData();
      success(`Caja cerrada. Consecutivo: ${result.consecutivo}`);
      
      return true;
    }
  );

  // Operación para cierre automático
  const { execute: autoCloseOperation } = useAsyncOperation(
    async () => {
      if (!currentSession || currentSession.cajaCerrada) {
        throw new Error('No hay sesión abierta para cierre automático');
      }

      const summary = sessionSummary;
      if (!summary) {
        throw new Error('No se pudo calcular el resumen para cierre automático');
      }

      if (!summary.puedeAutoCerrar) {
        throw new Error('La sesión no puede cerrarse automáticamente');
      }

      // Generar datos de cierre automático
      const autoCloseData = CashSessionService.generateAutoCloseData(currentSession, summary);
      
      const result = await closeCaja(currentSession.uid, autoCloseData);
      
      if (!result.success) {
        throw new Error('Error en cierre automático');
      }

      await refreshData();
      info(`Cierre automático completado. Consecutivo: ${result.consecutivo}`);
      
      return true;
    }
  );

  // Función para actualizar sesión actual
  const refreshCurrentSession = useCallback(async () => {
    try {
      const session = await getUltimaCaja();
      setCurrentSession(session);
    } catch (error) {
      console.error('Error obteniendo sesión actual:', error);
    }
  }, []);

  // Función para actualizar datos completos
  const refreshData = useCallback(async () => {
    try {
      const [session, closed] = await Promise.all([
        getUltimaCaja(),
        getAllCierresCaja()
      ]);
      
      setCurrentSession(session);
      setClosedSessions(closed);
    } catch (error) {
      console.error('Error actualizando datos de caja:', error);
    }
  }, []);

  // Calcular resumen de sesión actual
  const sessionSummary = useMemo(() => {
    if (!currentSession || !invoices.length) return null;
    
    return CashSessionService.calculateSessionSummary(currentSession, invoices, config);
  }, [currentSession, invoices, config]);

  // Calcular próxima alerta
  const nextAlert = useMemo(() => {
    if (!currentSession) return null;
    return CashSessionService.getNextAlert(currentSession, config);
  }, [currentSession, config]);

  // Calcular tiempo hasta cierre automático
  const timeUntilAutoClose = useMemo(() => {
    if (!currentSession || currentSession.cajaCerrada || !config.cierreAutomaticoHabilitado) {
      return null;
    }

    const fechaApertura = new Date(currentSession.fechaApertura);
    const tiempoCierre = new Date(fechaApertura.getTime() + (config.horasCierreAutomatico * 60 * 60 * 1000));
    const ahora = new Date();
    
    const horasRestantes = (tiempoCierre.getTime() - ahora.getTime()) / (1000 * 60 * 60);
    return Math.max(0, horasRestantes);
  }, [currentSession, config]);

  // Determinar si puede cerrar
  const canClose = useMemo(() => {
    if (!currentSession || !sessionSummary) return false;
    
    return sessionSummary.puedeAutoCerrar || 
           (config.permitirCierreConPendientes || sessionSummary.totalPending === 0);
  }, [currentSession, sessionSummary, config]);

  // Determinar si debe alertar
  const shouldAlert = useMemo(() => {
    if (!sessionSummary || !config.alertasHabilitadas) return false;
    
    return sessionSummary.requiereCierre || 
           (timeUntilAutoClose !== null && timeUntilAutoClose <= 1); // Menos de 1 hora
  }, [sessionSummary, config, timeUntilAutoClose]);

  // Funciones públicas
  const openSession = useCallback(async (montoInicial: string, notas: string) => {
    try {
      return await openSessionOperation(montoInicial, notas);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Error abriendo sesión');
      return false;
    }
  }, [openSessionOperation, notifyError]);

  const closeSession = useCallback(async (montoFinal: string, notas: string, forzar = false) => {
    try {
      return await closeSessionOperation(montoFinal, notas, forzar);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Error cerrando sesión');
      return false;
    }
  }, [closeSessionOperation, notifyError]);

  const autoCloseSession = useCallback(async () => {
    try {
      return await autoCloseOperation();
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Error en cierre automático');
      return false;
    }
  }, [autoCloseOperation, notifyError]);

  const updateConfig = useCallback((newConfig: Partial<CashSessionConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    info('Configuración de caja actualizada');
  }, [info]);

  const validateClosure = useCallback((montoFinal: number) => {
    if (!currentSession || !sessionSummary) {
      return { canClose: false, errors: ['No hay sesión activa'], warnings: [] };
    }
    
    return CashSessionService.validateClosure(currentSession, sessionSummary, config, montoFinal);
  }, [currentSession, sessionSummary, config]);

  // Cargar datos iniciales
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Verificar cierre automático periódicamente
  useEffect(() => {
    if (!config.cierreAutomaticoHabilitado || !currentSession || currentSession.cajaCerrada) {
      return;
    }

    const checkAutoClose = () => {
      if (sessionSummary?.requiereCierre && sessionSummary?.puedeAutoCerrar) {
        info('Iniciando cierre automático...');
        autoCloseSession();
      }
    };

    // Verificar cada 5 minutos
    const interval = setInterval(checkAutoClose, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [config, currentSession, sessionSummary, autoCloseSession, info]);

  return {
    // Estado actual
    currentSession,
    sessionSummary,
    config,
    
    // Estados de carga
    loading: loadingOpen || loadingClose,
    loadingOpen,
    loadingClose,
    
    // Funciones principales
    openSession,
    closeSession,
    autoCloseSession,
    
    // Configuración
    updateConfig,
    
    // Utilidades
    canClose,
    shouldAlert,
    nextAlert,
    timeUntilAutoClose,
    
    // Validaciones
    validateClosure,
    
    // Datos históricos
    closedSessions,
    refreshData,
  };
}