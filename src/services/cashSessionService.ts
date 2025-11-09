/**
 * Servicio mejorado para gestión de sesiones de caja
 * Permite cierres manuales, automáticos y configurables
 */

import { format, parseISO, isValid, startOfDay, endOfDay, addHours, differenceInHours } from 'date-fns';
import { CashRegisterService, CashRegisterSummary } from './cashRegisterService';

// Tipos para sesiones de caja
export interface CashSession {
  uid: string;
  user: string;
  
  // Apertura
  cajaAbierta: boolean;
  montoInicial: string;
  notasApertura: string;
  fechaApertura: string;
  timestampApertura: any;
  
  // Cierre
  cajaCerrada: boolean;
  montoFinal?: string;
  notasCierre?: string;
  fechaCierre?: string;
  timestampCierre?: any;
  consecutivo?: number;
  
  // Resumen financiero
  efectivo?: number;
  transferencias?: number;
  pendientes?: number;
  devoluciones?: number;
  totalCerrado?: number;
  facturasUIDs?: any[];
  
  // Nuevos campos para flexibilidad
  tiposCierre?: 'manual' | 'automatico' | 'programado';
  duracionHoras?: number;
  alertasCierre?: boolean;
  proximoCierreAutomatico?: string;
}

export interface CashSessionConfig {
  // Configuración de cierre automático
  cierreAutomaticoHabilitado: boolean;
  horasCierreAutomatico: number;        // Horas para cierre automático (default: 24)
  alertasHabilitadas: boolean;          // Alertas antes del cierre
  horasAlerta: number[];                // Horas antes del cierre para alertar [2, 1, 0.5]
  
  // Configuración de cierre programado
  cierreProgramadoHabilitado: boolean;
  horaCierreProgramado: string;         // "23:59" formato HH:mm
  diasCierreProgramado: number[];       // [0,1,2,3,4,5,6] (0=domingo)
  
  // Configuración de validaciones
  validarMontoMinimo: boolean;
  montoMinimoFinal: number;
  validarFacturasPendientes: boolean;
  permitirCierreConPendientes: boolean;
}

export interface CashSessionSummary extends CashRegisterSummary {
  // Información adicional de la sesión
  sessionId: string;
  montoInicial: number;
  montoFinal?: number;
  diferencia?: number;
  duracionSesion?: number;           // En horas
  facturasProcesadas: number;
  ultimaActividad?: string;
  
  // Alertas y recomendaciones
  alertas: string[];
  recomendaciones: string[];
  requiereCierre: boolean;
  puedeAutoCerrar: boolean;
}

export class CashSessionService {
  
  /**
   * Calcular resumen financiero directamente de facturas ya filtradas
   */
  private static calculateSummaryFromInvoices(invoices: any[]): any {
    let totalSales = 0;
    let totalPending = 0;
    let totalCash = 0;
    let totalTransfer = 0;
    let totalMixed = 0;
    let totalCanceled = 0;
    
    let salesCount = 0;
    let pendingCount = 0;
    let canceledCount = 0;
    let mixedCount = 0;

    const breakdown = {
      cash: [] as any[],
      transfer: [] as any[],
      mixed: [] as any[],
      pending: [] as any[],
      canceled: [] as any[]
    };

    for (const invoice of invoices) {
      const total = parseFloat(invoice.total?.toString() || '0');
      const status = (invoice.status || '').toUpperCase();
      const paymentMethod = (invoice.paymentMethod || '').toUpperCase();



      // Clasificar por estado
      if (status === 'ANULADO' || status === 'CANCELED') {
        totalCanceled += total;
        canceledCount++;
        breakdown.canceled.push(invoice);
      } else if (status === 'PENDIENTE' || status === 'PENDING') {
        totalPending += total;
        pendingCount++;
        breakdown.pending.push(invoice);
      } else {
        // Factura pagada
        totalSales += total;
        salesCount++;

        // Clasificar por método de pago
        if (paymentMethod === 'EFECTIVO' || paymentMethod === 'CASH') {
          totalCash += total;
          breakdown.cash.push(invoice);
        } else if (paymentMethod === 'TRANSFERENCIA' || paymentMethod === 'TRANSFER') {
          totalTransfer += total;
          breakdown.transfer.push(invoice);
        } else if (paymentMethod === 'MIXTO' || paymentMethod === 'MIXED') {
          totalMixed += total;
          mixedCount++;
          breakdown.mixed.push(invoice);
        } else {
          // Por defecto, asumir efectivo si no está especificado
          totalCash += total;
          breakdown.cash.push(invoice);
        }
      }
    }

    return {
      totalSales,
      totalPending,
      totalCash,
      totalTransfer,
      totalMixed,
      totalCanceled,
      salesCount,
      pendingCount,
      canceledCount,
      mixedCount,
      breakdown
    };
  }

  /**
   * Calcular resumen completo de una sesión de caja
   */
  static calculateSessionSummary(
    session: CashSession, 
    invoices: any[], 
    config: CashSessionConfig
  ): CashSessionSummary {
    
    // Obtener fechas de la sesión (usando zona horaria local)
    let fechaApertura: Date;
    let fechaCierre: Date;
    
    try {
      // Parsear fecha de apertura como fecha local
      if (typeof session.fechaApertura === 'string' && session.fechaApertura.includes(' ')) {
        const [datePart, timePart] = session.fechaApertura.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        fechaApertura = new Date(year, month - 1, day, hour, minute);
      } else {
        fechaApertura = new Date(session.fechaApertura);
      }
      
      // Parsear fecha de cierre como fecha local (si existe)
      if (session.fechaCierre) {
        if (typeof session.fechaCierre === 'string' && session.fechaCierre.includes(' ')) {
          const [datePart, timePart] = session.fechaCierre.split(' ');
          const [year, month, day] = datePart.split('-').map(Number);
          const [hour, minute] = timePart.split(':').map(Number);
          fechaCierre = new Date(year, month - 1, day, hour, minute);
        } else {
          fechaCierre = new Date(session.fechaCierre);
        }
      } else {
        fechaCierre = new Date(); // Fecha actual
      }
    } catch (error) {
      console.error('Error parsing session dates:', error);
      fechaApertura = new Date(session.fechaApertura);
      fechaCierre = session.fechaCierre ? new Date(session.fechaCierre) : new Date();
    }
    

    
    // Filtrar facturas de la sesión (usando zona horaria local)
    const invoicesSession = invoices.filter(invoice => {
      if (!invoice.date && !invoice.fechaCreacion) return false;
      
      // Usar el campo date que ya está en formato local
      const dateStr = invoice.date || invoice.fechaCreacion;
      let invoiceDate: Date;
      
      try {
        // Si el formato es "YYYY-MM-DD HH:mm", parsearlo como fecha local
        if (typeof dateStr === 'string' && dateStr.includes(' ')) {
          const [datePart, timePart] = dateStr.split(' ');
          const [year, month, day] = datePart.split('-').map(Number);
          const [hour, minute] = timePart.split(':').map(Number);
          invoiceDate = new Date(year, month - 1, day, hour, minute);
        } else {
          invoiceDate = new Date(dateStr);
        }
      } catch (error) {
        console.warn('Error parsing invoice date:', dateStr, error);
        return false;
      }
      
      // Debug: Log para verificar el filtrado
      const isInRange = invoiceDate >= fechaApertura && invoiceDate <= fechaCierre;
      if (isInRange) {

      }
      
      return isInRange;
    });
    

    
    // Calcular resumen financiero directamente (sin volver a filtrar por fecha)
    const financialSummary = this.calculateSummaryFromInvoices(invoicesSession);
    

    
    // Calcular información de sesión
    const montoInicial = parseFloat(session.montoInicial) || 0;
    const montoFinal = session.montoFinal ? parseFloat(session.montoFinal) : undefined;
    const diferencia = montoFinal !== undefined ? montoFinal - montoInicial : undefined;
    const duracionSesion = differenceInHours(fechaCierre, fechaApertura);
    
    // Generar alertas y recomendaciones
    const alertas: string[] = [];
    const recomendaciones: string[] = [];
    
    // Alertas de tiempo
    if (duracionSesion > config.horasCierreAutomatico) {
      alertas.push(`Sesión abierta por ${duracionSesion.toFixed(1)} horas (límite: ${config.horasCierreAutomatico}h)`);
    }
    
    // Alertas de dinero
    if (financialSummary.totalPending > 0) {
      alertas.push(`${financialSummary.pendingCount} facturas pendientes por $${financialSummary.totalPending.toLocaleString()}`);
    }
    
    if (diferencia !== undefined && Math.abs(diferencia) > 1000) {
      alertas.push(`Diferencia significativa: $${diferencia.toLocaleString()}`);
    }
    
    // Recomendaciones
    if (duracionSesion > config.horasCierreAutomatico * 0.8) {
      recomendaciones.push('Considere cerrar la caja pronto');
    }
    
    if (financialSummary.totalPending > 0 && !config.permitirCierreConPendientes) {
      recomendaciones.push('Resuelva las facturas pendientes antes del cierre');
    }
    
    // Determinar si requiere cierre
    const requiereCierre = 
      duracionSesion >= config.horasCierreAutomatico ||
      (config.cierreProgramadoHabilitado && this.shouldAutoClose(fechaApertura, config));
    
    const puedeAutoCerrar = 
      requiereCierre && 
      (config.permitirCierreConPendientes || financialSummary.totalPending === 0);
    
    return {
      ...financialSummary,
      sessionId: session.uid,
      montoInicial,
      montoFinal,
      diferencia,
      duracionSesion,
      facturasProcesadas: invoicesSession.length,
      ultimaActividad: invoicesSession.length > 0 
        ? invoicesSession[0].fechaCreacion 
        : session.fechaApertura,
      alertas,
      recomendaciones,
      requiereCierre,
      puedeAutoCerrar,
    };
  }
  
  /**
   * Determinar si debe cerrarse automáticamente según configuración
   */
  static shouldAutoClose(fechaApertura: Date, config: CashSessionConfig): boolean {
    if (!config.cierreAutomaticoHabilitado && !config.cierreProgramadoHabilitado) {
      return false;
    }
    
    const now = new Date();
    const duracion = differenceInHours(now, fechaApertura);
    
    // Cierre por duración
    if (config.cierreAutomaticoHabilitado && duracion >= config.horasCierreAutomatico) {
      return true;
    }
    
    // Cierre programado
    if (config.cierreProgramadoHabilitado) {
      const [hora, minuto] = config.horaCierreProgramado.split(':').map(Number);
      const diaSemana = now.getDay();
      
      if (config.diasCierreProgramado.includes(diaSemana)) {
        const horaCierre = new Date(now);
        horaCierre.setHours(hora, minuto, 0, 0);
        
        // Si ya pasó la hora de cierre programado
        if (now >= horaCierre && fechaApertura < horaCierre) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Calcular próxima alerta de cierre
   */
  static getNextAlert(session: CashSession, config: CashSessionConfig): Date | null {
    if (!config.alertasHabilitadas || session.cajaCerrada) {
      return null;
    }
    
    const fechaApertura = parseISO(session.fechaApertura);
    const now = new Date();
    
    // Calcular alertas por duración
    if (config.cierreAutomaticoHabilitado) {
      const cierreAutomatico = addHours(fechaApertura, config.horasCierreAutomatico);
      
      for (const horasAntes of config.horasAlerta.sort((a, b) => b - a)) {
        const tiempoAlerta = addHours(cierreAutomatico, -horasAntes);
        
        if (tiempoAlerta > now) {
          return tiempoAlerta;
        }
      }
    }
    
    // Calcular alertas por horario programado
    if (config.cierreProgramadoHabilitado) {
      const [hora, minuto] = config.horaCierreProgramado.split(':').map(Number);
      const hoy = new Date();
      hoy.setHours(hora, minuto, 0, 0);
      
      if (hoy > now && config.diasCierreProgramado.includes(hoy.getDay())) {
        for (const horasAntes of config.horasAlerta.sort((a, b) => b - a)) {
          const tiempoAlerta = addHours(hoy, -horasAntes);
          
          if (tiempoAlerta > now) {
            return tiempoAlerta;
          }
        }
      }
    }
    
    return null;
  }
  
  /**
   * Validar si se puede cerrar la caja
   */
  static validateClosure(
    session: CashSession, 
    summary: CashSessionSummary, 
    config: CashSessionConfig,
    montoFinal: number
  ): { canClose: boolean; errors: string[]; warnings: string[] } {
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validar monto mínimo
    if (config.validarMontoMinimo && montoFinal < config.montoMinimoFinal) {
      errors.push(`El monto final debe ser al menos $${config.montoMinimoFinal.toLocaleString()}`);
    }
    
    // Validar facturas pendientes
    if (config.validarFacturasPendientes && summary.totalPending > 0) {
      if (config.permitirCierreConPendientes) {
        warnings.push(`Hay ${summary.pendingCount} facturas pendientes por $${summary.totalPending.toLocaleString()}`);
      } else {
        errors.push(`No se puede cerrar con facturas pendientes. Resuelva ${summary.pendingCount} facturas primero.`);
      }
    }
    
    // Validar diferencias significativas
    const diferencia = montoFinal - summary.montoInicial;
    const diferenciaEsperada = summary.totalCash;
    const variacion = Math.abs(diferencia - diferenciaEsperada);
    
    if (variacion > 5000) { // Más de $5,000 de diferencia
      warnings.push(`Diferencia inesperada: Esperado $${diferenciaEsperada.toLocaleString()}, Reportado $${diferencia.toLocaleString()}`);
    }
    
    return {
      canClose: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Generar datos para cierre automático
   */
  static generateAutoCloseData(
    session: CashSession, 
    summary: CashSessionSummary
  ): any {
    
    return {
      montoFinal: (summary.montoInicial + summary.totalCash).toString(),
      notasCierre: `Cierre automático - ${summary.salesCount} ventas procesadas`,
      efectivo: summary.totalCash,
      transferencias: summary.totalTransfer,
      pendientes: summary.totalPending,
      devoluciones: 0, // TODO: Calcular devoluciones
      totalCerrado: summary.totalSales,
      facturasUIDs: summary.breakdown.cash
        .concat(summary.breakdown.transfer)
        .concat(summary.breakdown.mixed)
        .map(invoice => invoice.id),
      tiposCierre: 'automatico' as const,
      duracionHoras: summary.duracionSesion,
    };
  }
  
  /**
   * Configuración por defecto
   */
  static getDefaultConfig(): CashSessionConfig {
    return {
      // Cierre automático
      cierreAutomaticoHabilitado: true,
      horasCierreAutomatico: 24,
      alertasHabilitadas: true,
      horasAlerta: [2, 1, 0.5], // 2h, 1h, 30min antes
      
      // Cierre programado
      cierreProgramadoHabilitado: false,
      horaCierreProgramado: "23:59",
      diasCierreProgramado: [1, 2, 3, 4, 5], // Lunes a viernes
      
      // Validaciones
      validarMontoMinimo: false,
      montoMinimoFinal: 0,
      validarFacturasPendientes: true,
      permitirCierreConPendientes: true,
    };
  }
}