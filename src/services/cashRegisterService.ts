/**
 * Servicio robusto para cálculos de cierre de caja
 * Maneja todos los casos edge y normaliza datos inconsistentes
 */

import { format, parseISO, isValid, startOfDay, endOfDay } from 'date-fns';

// Tipos para mayor seguridad
export interface Invoice {
  id: string;
  date: string;
  total: number;
  status: string;
  paymentMethod?: string;
  vrMixta?: {
    efectivo?: number;
    transferencia?: number;
  };
  typeInvoice?: string;
  user?: string;
}

export interface CashRegisterSummary {
  totalSales: number;
  totalPending: number;
  totalCash: number;
  totalTransfer: number;
  totalMixed: number;
  totalCanceled: number;
  salesCount: number;
  pendingCount: number;
  canceledCount: number;
  mixedCount: number;
  dateRange: {
    start: string;
    end: string;
  };
  breakdown: {
    cash: Invoice[];
    transfer: Invoice[];
    mixed: Invoice[];
    pending: Invoice[];
    canceled: Invoice[];
  };
}

export class CashRegisterService {
  
  /**
   * Normalizar estado de factura
   */
  static normalizeStatus(status: string): 'PAID' | 'PENDING' | 'CANCELED' | 'UNKNOWN' {
    if (!status) return 'UNKNOWN';
    
    const normalized = status.toUpperCase().trim();
    
    // Estados de pagado
    if (['PAGADO', 'PAID', 'COMPLETADO', 'FINALIZADO'].includes(normalized)) {
      return 'PAID';
    }
    
    // Estados pendientes
    if (['PENDIENTE', 'PENDING', 'EN_PROCESO', 'PROCESO'].includes(normalized)) {
      return 'PENDING';
    }
    
    // Estados cancelados/anulados
    if (['ANULADO', 'CANCELADO', 'CANCELED', 'CANCELLED', 'VOID'].includes(normalized)) {
      return 'CANCELED';
    }
    
    return 'UNKNOWN';
  }

  /**
   * Normalizar método de pago
   */
  static normalizePaymentMethod(paymentMethod?: string): 'CASH' | 'TRANSFER' | 'MIXED' | 'OTHER' | 'UNKNOWN' {
    if (!paymentMethod) return 'UNKNOWN';
    
    const normalized = paymentMethod.toUpperCase().trim();
    
    // Efectivo
    if (['EFECTIVO', 'CASH', 'DINERO', 'CONTADO'].includes(normalized)) {
      return 'CASH';
    }
    
    // Transferencia
    if (['TRANSFERENCIA', 'TRANSFER', 'BANCARIA', 'BANCO', 'NEQUI', 'DAVIPLATA'].includes(normalized)) {
      return 'TRANSFER';
    }
    
    // Mixto
    if (['MIXTO', 'MIXED', 'COMBINADO'].includes(normalized)) {
      return 'MIXED';
    }
    
    // Otros (tarjeta, datáfono, etc.)
    if (['TARJETA', 'CARD', 'DATAFONO', 'DATAPHONE', 'CREDITO', 'DEBITO'].includes(normalized)) {
      return 'OTHER';
    }
    
    return 'UNKNOWN';
  }

  /**
   * Validar y normalizar fecha
   */
  private static normalizeDate(dateString: string): Date | null {
    if (!dateString) return null;
    
    try {
      // Intentar parsear como ISO string primero
      let date = parseISO(dateString);
      
      if (!isValid(date)) {
        // Intentar parsear formato "YYYY-MM-DD HH:mm:ss"
        const [datePart] = dateString.split(' ');
        date = parseISO(datePart);
      }
      
      if (!isValid(date)) {
        // Intentar otros formatos comunes
        date = new Date(dateString);
      }
      
      return isValid(date) ? date : null;
    } catch (error) {
      console.warn('Error parsing date:', dateString, error);
      return null;
    }
  }

  /**
   * Validar factura
   */
  private static validateInvoice(invoice: any): invoice is Invoice {
    return (
      invoice &&
      typeof invoice === 'object' &&
      typeof invoice.id === 'string' &&
      typeof invoice.date === 'string' &&
      typeof invoice.total === 'number' &&
      !isNaN(invoice.total) &&
      invoice.total >= 0
    );
  }

  /**
   * Filtrar facturas por rango de fechas
   */
  private static filterByDateRange(invoices: Invoice[], startDate: Date, endDate: Date): Invoice[] {
    return invoices.filter(invoice => {
      const invoiceDate = this.normalizeDate(invoice.date);
      if (!invoiceDate) return false;
      
      return invoiceDate >= startOfDay(startDate) && invoiceDate <= endOfDay(endDate);
    });
  }

  /**
   * Calcular totales de una factura según su método de pago
   */
  static calculateInvoiceTotals(invoice: Invoice): {
    cash: number;
    transfer: number;
    total: number;
  } {
    const paymentMethod = this.normalizePaymentMethod(invoice.paymentMethod);
    const total = invoice.total || 0;
    
    switch (paymentMethod) {
      case 'CASH':
        return { cash: total, transfer: 0, total };
        
      case 'TRANSFER':
        return { cash: 0, transfer: total, total };
        
      case 'MIXED':
        const efectivo = invoice.vrMixta?.efectivo || 0;
        const transferencia = invoice.vrMixta?.transferencia || 0;
        
        // Validar que los montos mixtos sumen el total
        const mixedSum = efectivo + transferencia;
        if (Math.abs(mixedSum - total) > 0.01) {
          console.warn(`Inconsistencia en pago mixto. Factura ${invoice.id}: Total=${total}, Mixto=${mixedSum}`);
        }
        
        return { 
          cash: efectivo, 
          transfer: transferencia, 
          total: Math.max(total, mixedSum) // Usar el mayor para evitar pérdidas
        };
        
      case 'OTHER':
        // Tratamos otros métodos como transferencia por defecto
        return { cash: 0, transfer: total, total };
        
      default:
        // Si no sabemos el método, asumimos efectivo (comportamiento legacy)
        console.warn(`Método de pago desconocido en factura ${invoice.id}: ${invoice.paymentMethod}`);
        return { cash: total, transfer: 0, total };
    }
  }

  /**
   * Calcular resumen de caja para un día específico
   */
  static calculateDailySummary(invoices: any[], targetDate: Date): CashRegisterSummary {
    // Validar y filtrar facturas
    const validInvoices = invoices
      .filter(this.validateInvoice)
      .filter(invoice => {
        const invoiceDate = this.normalizeDate(invoice.date);
        return invoiceDate && 
               invoiceDate >= startOfDay(targetDate) && 
               invoiceDate <= endOfDay(targetDate);
      });

    // Inicializar contadores
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

    // Breakdown por categoría
    const breakdown = {
      cash: [] as Invoice[],
      transfer: [] as Invoice[],
      mixed: [] as Invoice[],
      pending: [] as Invoice[],
      canceled: [] as Invoice[]
    };

    // Procesar cada factura
    for (const invoice of validInvoices) {
      const status = this.normalizeStatus(invoice.status);
      const paymentMethod = this.normalizePaymentMethod(invoice.paymentMethod);
      const totals = this.calculateInvoiceTotals(invoice);

      switch (status) {
        case 'PAID':
          totalSales += totals.total;
          totalCash += totals.cash;
          totalTransfer += totals.transfer;
          salesCount++;
          
          if (paymentMethod === 'MIXED') {
            totalMixed += totals.total;
            mixedCount++;
            breakdown.mixed.push(invoice);
          } else if (paymentMethod === 'CASH') {
            breakdown.cash.push(invoice);
          } else {
            breakdown.transfer.push(invoice);
          }
          break;
          
        case 'PENDING':
          totalPending += invoice.total;
          pendingCount++;
          breakdown.pending.push(invoice);
          break;
          
        case 'CANCELED':
          totalCanceled += invoice.total;
          canceledCount++;
          breakdown.canceled.push(invoice);
          break;
          
        default:
          console.warn(`Estado desconocido en factura ${invoice.id}: ${invoice.status}`);
          // Por defecto, tratamos como venta pagada
          totalSales += totals.total;
          totalCash += totals.cash;
          totalTransfer += totals.transfer;
          salesCount++;
          breakdown.cash.push(invoice);
          break;
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
      dateRange: {
        start: format(startOfDay(targetDate), 'yyyy-MM-dd HH:mm:ss'),
        end: format(endOfDay(targetDate), 'yyyy-MM-dd HH:mm:ss')
      },
      breakdown
    };
  }

  /**
   * Calcular resumen para un rango de fechas
   */
  static calculateRangeSummary(invoices: any[], startDate: Date, endDate: Date): CashRegisterSummary {
    // Validar y filtrar facturas
    const validInvoices = invoices
      .filter(this.validateInvoice)
      .filter(invoice => {
        const invoiceDate = this.normalizeDate(invoice.date);
        return invoiceDate && 
               invoiceDate >= startOfDay(startDate) && 
               invoiceDate <= endOfDay(endDate);
      });

    // Usar la misma lógica que el resumen diario pero con rango
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
      cash: [] as Invoice[],
      transfer: [] as Invoice[],
      mixed: [] as Invoice[],
      pending: [] as Invoice[],
      canceled: [] as Invoice[]
    };

    for (const invoice of validInvoices) {
      const status = this.normalizeStatus(invoice.status);
      const paymentMethod = this.normalizePaymentMethod(invoice.paymentMethod);
      const totals = this.calculateInvoiceTotals(invoice);

      switch (status) {
        case 'PAID':
          totalSales += totals.total;
          totalCash += totals.cash;
          totalTransfer += totals.transfer;
          salesCount++;
          
          if (paymentMethod === 'MIXED') {
            totalMixed += totals.total;
            mixedCount++;
            breakdown.mixed.push(invoice);
          } else if (paymentMethod === 'CASH') {
            breakdown.cash.push(invoice);
          } else {
            breakdown.transfer.push(invoice);
          }
          break;
          
        case 'PENDING':
          totalPending += invoice.total;
          pendingCount++;
          breakdown.pending.push(invoice);
          break;
          
        case 'CANCELED':
          totalCanceled += invoice.total;
          canceledCount++;
          breakdown.canceled.push(invoice);
          break;
          
        default:
          totalSales += totals.total;
          totalCash += totals.cash;
          totalTransfer += totals.transfer;
          salesCount++;
          breakdown.cash.push(invoice);
          break;
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
      dateRange: {
        start: format(startOfDay(startDate), 'yyyy-MM-dd HH:mm:ss'),
        end: format(endOfDay(endDate), 'yyyy-MM-dd HH:mm:ss')
      },
      breakdown
    };
  }

  /**
   * Obtener diagnóstico de datos para debugging
   */
  static getDiagnostics(invoices: any[]): {
    totalInvoices: number;
    validInvoices: number;
    invalidInvoices: number;
    statusDistribution: Record<string, number>;
    paymentMethodDistribution: Record<string, number>;
    dateRange: { earliest: string | null; latest: string | null };
    issues: string[];
  } {
    const issues: string[] = [];
    const statusDistribution: Record<string, number> = {};
    const paymentMethodDistribution: Record<string, number> = {};
    
    let validCount = 0;
    let earliestDate: Date | null = null;
    let latestDate: Date | null = null;

    for (const invoice of invoices) {
      // Validar factura
      if (this.validateInvoice(invoice)) {
        validCount++;
        
        // Analizar fecha
        const date = this.normalizeDate(invoice.date);
        if (date) {
          if (!earliestDate || date < earliestDate) earliestDate = date;
          if (!latestDate || date > latestDate) latestDate = date;
        } else {
          issues.push(`Fecha inválida en factura ${invoice.id}: ${invoice.date}`);
        }
        
        // Analizar estado
        const status = this.normalizeStatus(invoice.status);
        statusDistribution[status] = (statusDistribution[status] || 0) + 1;
        
        // Analizar método de pago
        const paymentMethod = this.normalizePaymentMethod(invoice.paymentMethod);
        paymentMethodDistribution[paymentMethod] = (paymentMethodDistribution[paymentMethod] || 0) + 1;
        
        // Validar pagos mixtos
        if (paymentMethod === 'MIXED') {
          const efectivo = invoice.vrMixta?.efectivo || 0;
          const transferencia = invoice.vrMixta?.transferencia || 0;
          const mixedSum = efectivo + transferencia;
          
          if (Math.abs(mixedSum - invoice.total) > 0.01) {
            issues.push(`Inconsistencia en pago mixto - Factura ${invoice.id}: Total=${invoice.total}, Mixto=${mixedSum}`);
          }
        }
      } else {
        issues.push(`Factura inválida: ${JSON.stringify(invoice)}`);
      }
    }

    return {
      totalInvoices: invoices.length,
      validInvoices: validCount,
      invalidInvoices: invoices.length - validCount,
      statusDistribution,
      paymentMethodDistribution,
      dateRange: {
        earliest: earliestDate ? format(earliestDate, 'yyyy-MM-dd HH:mm:ss') : null,
        latest: latestDate ? format(latestDate, 'yyyy-MM-dd HH:mm:ss') : null
      },
      issues
    };
  }

  /**
   * Comparar con cálculo legacy para validación
   */
  static compareLegacyCalculation(invoices: any[], targetDate: Date): {
    newCalculation: CashRegisterSummary;
    legacyCalculation: any;
    differences: string[];
  } {
    const newCalc = this.calculateDailySummary(invoices, targetDate);
    
    // Simular cálculo legacy
    const currentDateStr = format(targetDate, 'yyyy-MM-dd');
    
    const ventasHoy = invoices.filter(
      (f: any) =>
        f.date?.split(" ")[0] === currentDateStr &&
        f.status?.toUpperCase() !== "PENDIENTE"
    );
    
    const pendientesHoy = invoices.filter(
      (f: any) =>
        f.date?.split(" ")[0] === currentDateStr &&
        f.status?.toUpperCase() === "PENDIENTE"
    );
    
    let legacyEfectivo = 0;
    let legacyTransferencia = 0;
    
    for (const f of ventasHoy) {
      const metodo = f.paymentMethod?.toUpperCase();
      
      if (!metodo || metodo === "EFECTIVO") {
        legacyEfectivo += f.total;
      } else if (metodo === "TRANSFERENCIA") {
        legacyTransferencia += f.total;
      } else if (metodo === "MIXTO") {
        legacyEfectivo += f.vrMixta?.efectivo || 0;
        legacyTransferencia += f.vrMixta?.transferencia || 0;
      }
    }
    
    const legacyCalc = {
      totalVentasHoy: ventasHoy.reduce((acc: number, f: any) => acc + f.total, 0),
      totalVentasPendientesHoy: pendientesHoy.reduce((acc: number, f: any) => acc + f.total, 0),
      totalVentasEfectivo: legacyEfectivo,
      totalVentasTransferencia: legacyTransferencia
    };
    
    // Identificar diferencias
    const differences: string[] = [];
    
    if (Math.abs(newCalc.totalSales - legacyCalc.totalVentasHoy) > 0.01) {
      differences.push(`Total ventas: Nuevo=${newCalc.totalSales}, Legacy=${legacyCalc.totalVentasHoy}`);
    }
    
    if (Math.abs(newCalc.totalPending - legacyCalc.totalVentasPendientesHoy) > 0.01) {
      differences.push(`Total pendientes: Nuevo=${newCalc.totalPending}, Legacy=${legacyCalc.totalVentasPendientesHoy}`);
    }
    
    if (Math.abs(newCalc.totalCash - legacyCalc.totalVentasEfectivo) > 0.01) {
      differences.push(`Total efectivo: Nuevo=${newCalc.totalCash}, Legacy=${legacyCalc.totalVentasEfectivo}`);
    }
    
    if (Math.abs(newCalc.totalTransfer - legacyCalc.totalVentasTransferencia) > 0.01) {
      differences.push(`Total transferencia: Nuevo=${newCalc.totalTransfer}, Legacy=${legacyCalc.totalVentasTransferencia}`);
    }
    
    return {
      newCalculation: newCalc,
      legacyCalculation: legacyCalc,
      differences
    };
  }
}