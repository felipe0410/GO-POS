"use client";
import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Configuración
import { UI_CONFIG } from '@/config/constants';

interface DebtMetricsProps {
  invoices: any[];
}

interface AgeRange {
  label: string;
  min: number;
  max: number;
  count: number;
  amount: number;
  color: string;
  icon: React.ReactNode;
}

const DebtMetrics: React.FC<DebtMetricsProps> = ({ invoices }) => {
  // Filtrar solo facturas pendientes
  const pendingInvoices = useMemo(() => {
    return invoices.filter(invoice => 
      invoice.status?.toUpperCase() === 'PENDIENTE' || 
      invoice.status?.toUpperCase() === 'PENDING'
    );
  }, [invoices]);

  // Análisis por antigüedad de deuda
  const ageAnalysis = useMemo(() => {
    const ranges: AgeRange[] = [
      { label: 'Recientes (0-7 días)', min: 0, max: 7, count: 0, amount: 0, color: '#51cf66', icon: <InfoIcon /> },
      { label: 'Moderadas (8-30 días)', min: 8, max: 30, count: 0, amount: 0, color: '#ffd43b', icon: <WarningIcon /> },
      { label: 'Vencidas (31-60 días)', min: 31, max: 60, count: 0, amount: 0, color: '#ff8c42', icon: <WarningIcon /> },
      { label: 'Críticas (&gt;60 días)', min: 61, max: Infinity, count: 0, amount: 0, color: '#ff6b6b', icon: <ErrorIcon /> },
    ];

    pendingInvoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.date || invoice.fechaCreacion);
      const daysPending = Math.floor((new Date().getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
      const amount = invoice.total || 0;

      const range = ranges.find(r => daysPending >= r.min && daysPending <= r.max);
      if (range) {
        range.count += 1;
        range.amount += amount;
      }
    });

    return ranges;
  }, [pendingInvoices]);

  // Top 5 deudores
  const topDebtors = useMemo(() => {
    const debtorsMap = new Map<string, { name: string; amount: number; count: number }>();
    
    pendingInvoices.forEach(invoice => {
      const clientName = invoice.name || invoice.cliente?.name || 'Cliente Sin Nombre';
      const amount = invoice.total || 0;
      
      if (debtorsMap.has(clientName)) {
        const existing = debtorsMap.get(clientName)!;
        existing.amount += amount;
        existing.count += 1;
      } else {
        debtorsMap.set(clientName, { name: clientName, amount, count: 1 });
      }
    });

    return Array.from(debtorsMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [pendingInvoices]);

  // Estadísticas de riesgo
  const riskStats = useMemo(() => {
    const totalAmount = pendingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const criticalAmount = ageAnalysis[3].amount; // >60 días
    const moderateAmount = ageAnalysis[1].amount + ageAnalysis[2].amount; // 8-60 días
    const recentAmount = ageAnalysis[0].amount; // 0-7 días

    return {
      totalAmount,
      criticalPercentage: totalAmount > 0 ? (criticalAmount / totalAmount) * 100 : 0,
      moderatePercentage: totalAmount > 0 ? (moderateAmount / totalAmount) * 100 : 0,
      recentPercentage: totalAmount > 0 ? (recentAmount / totalAmount) * 100 : 0,
    };
  }, [pendingInvoices, ageAnalysis]);

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

  if (pendingInvoices.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {/* Análisis por Antigüedad */}
      <Grid item xs={12} md={8}>
        <Card sx={cardStyles}>
          <CardContent sx={{ color: '#fff', p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              📊 Análisis por Antigüedad de Deuda
            </Typography>
            
            {ageAnalysis.map((range, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {range.icon}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {range.label}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: range.color }}>
                      {formatCurrency(range.amount)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                      {range.count} facturas
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={riskStats.totalAmount > 0 ? (range.amount / riskStats.totalAmount) * 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: range.color,
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#ABBBC2', mt: 0.5, display: 'block' }}>
                  {riskStats.totalAmount > 0 ? ((range.amount / riskStats.totalAmount) * 100).toFixed(1) : 0}% del total
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Top Deudores y Métricas de Riesgo */}
      <Grid item xs={12} md={4}>
        <Grid container spacing={2}>
          {/* Indicador de Riesgo */}
          <Grid item xs={12}>
            <Card sx={cardStyles}>
              <CardContent sx={{ color: '#fff', p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  🚨 Indicador de Riesgo
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Deuda Crítica (&gt;60 días)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={riskStats.criticalPercentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ff6b6b',
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                    {riskStats.criticalPercentage.toFixed(1)}% del total
                  </Typography>
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">Total Cartera:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(riskStats.totalAmount)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">Facturas:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {pendingInvoices.length}
                  </Typography>
                </Box>

                {riskStats.criticalPercentage > 30 && (
                  <Chip
                    label="RIESGO ALTO"
                    size="small"
                    sx={{
                      backgroundColor: '#ff6b6b',
                      color: '#000',
                      fontWeight: 'bold',
                      mt: 1,
                    }}
                  />
                )}
                {riskStats.criticalPercentage <= 30 && riskStats.criticalPercentage > 10 && (
                  <Chip
                    label="RIESGO MODERADO"
                    size="small"
                    sx={{
                      backgroundColor: '#ffd43b',
                      color: '#000',
                      fontWeight: 'bold',
                      mt: 1,
                    }}
                  />
                )}
                {riskStats.criticalPercentage <= 10 && (
                  <Chip
                    label="RIESGO BAJO"
                    size="small"
                    sx={{
                      backgroundColor: '#51cf66',
                      color: '#000',
                      fontWeight: 'bold',
                      mt: 1,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Top 5 Deudores */}
          <Grid item xs={12}>
            <Card sx={cardStyles}>
              <CardContent sx={{ color: '#fff', p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  🏆 Top 5 Deudores
                </Typography>
                
                <List dense>
                  {topDebtors.map((debtor, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <TrendingUpIcon sx={{ color: UI_CONFIG.theme.colors.primary, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                            {debtor.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" sx={{ color: UI_CONFIG.theme.colors.error, fontWeight: 'bold' }}>
                              {formatCurrency(debtor.amount)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ABBBC2', ml: 1 }}>
                              ({debtor.count} facturas)
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                {topDebtors.length === 0 && (
                  <Typography variant="body2" sx={{ color: '#ABBBC2', textAlign: 'center', py: 2 }}>
                    No hay deudores registrados
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DebtMetrics;