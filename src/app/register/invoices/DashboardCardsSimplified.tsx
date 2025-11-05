import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
} from '@mui/material';

// Configuración
import { UI_CONFIG } from '@/config/constants';

interface DashboardCardsSimplifiedProps {
  invoices: any[];
  selectedDate?: any; // Puede ser null, string[], o Date
  hasFilters?: boolean; // Indica si hay filtros aplicados
  searchTerm?: string; // Término de búsqueda aplicado
  statusFilter?: string; // Filtro de estado aplicado
  typeFilter?: string; // Filtro de tipo aplicado
}

const DashboardCardsSimplified: React.FC<DashboardCardsSimplifiedProps> = ({
  invoices,
  selectedDate,
  hasFilters = false,
  searchTerm = "",
  statusFilter = "Todos",
  typeFilter = "Todos",
}) => {
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('es-CO');
  };

  const getDateRangeText = () => {
    if (!hasFilters) {
      return {
        title: `Resumen del Día - ${getCurrentDate()}`,
        subtitle: `Cálculos del día actual (mostrando todas las facturas en la tabla)`
      };
    } else if (Array.isArray(selectedDate) && selectedDate.length === 2) {
      const startDate = new Date(selectedDate[0]);
      const endDate = new Date(selectedDate[1]);
      return {
        title: `Resumen del Período - ${startDate.toLocaleDateString('es-CO')} al ${endDate.toLocaleDateString('es-CO')}`,
        subtitle: `Ventas del ${startDate.toLocaleDateString('es-CO')} al ${endDate.toLocaleDateString('es-CO')}`
      };
    } else {
      let subtitle = "Resumen de facturas filtradas";
      if (searchTerm) subtitle += ` • Búsqueda: "${searchTerm}"`;
      if (statusFilter !== "Todos") subtitle += ` • Estado: ${statusFilter}`;
      if (typeFilter !== "Todos") subtitle += ` • Tipo: ${typeFilter}`;
      
      return {
        title: `Resumen de Filtros Aplicados`,
        subtitle
      };
    }
  };

  const dateInfo = getDateRangeText();

  // Calcular resumen basado en las facturas filtradas que recibe
  const summary = useMemo(() => {
    if (!invoices || invoices.length === 0) {
      return {
        totalSales: 0,
        totalPending: 0,
        totalCash: 0,
        totalTransfer: 0,
        totalCanceled: 0,
        salesCount: 0,
        pendingCount: 0,
        canceledCount: 0,
        cashCount: 0,
        transferCount: 0,
      };
    }

    // Usar TODAS las facturas recibidas (ya vienen correctamente filtradas desde el componente padre)
    const facturasParaCalculo = invoices;

    let totalSales = 0;
    let totalPending = 0;
    let totalCash = 0;
    let totalTransfer = 0;
    let totalCanceled = 0;
    let salesCount = 0;
    let pendingCount = 0;
    let canceledCount = 0;
    let cashCount = 0;
    let transferCount = 0;

    facturasParaCalculo.forEach(invoice => {
      const total = invoice.total || 0;
      const status = (invoice.status || '').toUpperCase();
      const paymentMethod = (invoice.paymentMethod || '').toUpperCase();

      // Clasificar por estado
      if (status === 'ANULADO' || status === 'CANCELED') {
        // Contar facturas canceladas pero no incluir en totales de ventas
        canceledCount++;
        totalCanceled += total;
      } else if (status === 'PENDIENTE' || status === 'PENDING') {
        totalPending += total;
        pendingCount++;
      } else {
        totalSales += total;
        salesCount++;

        // Clasificar por método de pago
        if (paymentMethod === 'EFECTIVO' || paymentMethod === 'CASH') {
          totalCash += total;
          cashCount++;
        } else if (paymentMethod === 'TRANSFERENCIA' || paymentMethod === 'TRANSFER') {
          totalTransfer += total;
          transferCount++;
        }
      }
    });



    return {
      totalSales,
      totalPending,
      totalCash,
      totalTransfer,
      totalCanceled,
      salesCount,
      pendingCount,
      canceledCount,
      cashCount,
      transferCount,
    };
  }, [invoices, selectedDate]);

  // Función para formatear moneda
  const formatCurrency = (amount: number): string => {
    return `$ ${amount.toLocaleString('es-CO', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  };

  // Estilos para las cards
  const cardStyles = {
    background: UI_CONFIG.theme.colors.secondary,
    borderRadius: '10px',
    border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
    boxShadow: `0px 4px 20px rgba(105, 234, 226, 0.1)`,
    height: '100%',
  };

  const cardContentStyles = {
    color: '#fff',
    textAlign: 'center' as const,
    padding: '20px',
    '&:last-child': {
      paddingBottom: '20px',
    },
  };

  if (!summary) {
    return (
      <Box sx={{ width: '95%', marginTop: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay facturas disponibles para mostrar el resumen.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '95%', marginTop: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontFamily: 'Nunito', fontWeight: 700 }}>
          {dateInfo.title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#ABBBC2', display: 'block' }}>
          {dateInfo.subtitle}
        </Typography>
      </Box>

      {/* Cards principales */}
      <Grid container spacing={2} justifyContent="center">
        {/* Total Ventas */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={cardContentStyles}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                💰 Total Ventas
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: UI_CONFIG.theme.colors.success }}>
                {formatCurrency(summary.totalSales)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2', mt: 1, display: 'block' }}>
                {summary.salesCount} facturas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Ventas Pendientes */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={cardContentStyles}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                ⏳ Pendientes
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: UI_CONFIG.theme.colors.warning }}>
                {formatCurrency(summary.totalPending)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2', mt: 1, display: 'block' }}>
                {summary.pendingCount} facturas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Ventas en Efectivo */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={cardContentStyles}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                💵 Efectivo
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: UI_CONFIG.theme.colors.primary }}>
                {formatCurrency(summary.totalCash)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2', mt: 1, display: 'block' }}>
                {summary.cashCount} facturas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Ventas por Transferencia */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={cardContentStyles}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                🏦 Transferencia
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#9c88ff' }}>
                {formatCurrency(summary.totalTransfer)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2', mt: 1, display: 'block' }}>
                {summary.transferCount} facturas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Información adicional */}
      {summary.salesCount === 0 && summary.pendingCount === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No se encontraron ventas para {Array.isArray(selectedDate) ? 'el período seleccionado' : 'el día actual'}. 
          {invoices?.length > 0 && ' Hay facturas en el sistema, pero ninguna corresponde a esta fecha.'}
        </Alert>
      )}
      
      {/* Debug info - remover en producción */}
      <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(105, 234, 226, 0.1)', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ color: '#69EAE2', display: 'block' }}>
          📊 Debug: Total facturas filtradas recibidas: {invoices?.length || 0}
        </Typography>
        <Typography variant="caption" sx={{ color: '#69EAE2', display: 'block' }}>
          📅 {Array.isArray(selectedDate) && selectedDate.length === 2 
            ? `Rango seleccionado: ${selectedDate[0]} al ${selectedDate[1]}`
            : `Fecha seleccionada: ${getCurrentDate()}`
          }
        </Typography>
        <Typography variant="caption" sx={{ color: '#69EAE2', display: 'block' }}>
          🎯 Facturas procesadas: {summary.salesCount + summary.pendingCount + summary.canceledCount}
        </Typography>
        <Typography variant="caption" sx={{ color: '#69EAE2', display: 'block' }}>
          💰 Ventas: {summary.salesCount} | ⏳ Pendientes: {summary.pendingCount} | ❌ Canceladas: {summary.canceledCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardCardsSimplified;