"use client";
import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Configuración
import { UI_CONFIG } from '@/config/constants';

// Componentes adicionales
import DebtMetrics from './DebtMetrics';
import PendingInvoicesActions from './PendingInvoicesActions';
import FacturaModal from './FacturaModal';
import PendingInvoiceDetailModal from './PendingInvoiceDetailModal';

interface PendingInvoicesAnalysisProps {
  invoices: any[];
}

interface DebtorSummary {
  clientName: string;
  clientId?: string;
  totalDebt: number;
  invoiceCount: number;
  oldestInvoice: string;
  newestInvoice: string;
  invoices: any[];
  daysPending: number;
}

const PendingInvoicesAnalysis: React.FC<PendingInvoicesAnalysisProps> = ({
  invoices,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'debt' | 'count' | 'days'>('debt');
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  // Filtrar solo facturas pendientes
  const pendingInvoices = useMemo(() => {
    return invoices.filter(invoice => 
      invoice.status?.toUpperCase() === 'PENDIENTE' || 
      invoice.status?.toUpperCase() === 'PENDING'
    );
  }, [invoices]);

  // Análisis de deudores
  const debtorsAnalysis = useMemo(() => {
    const debtorsMap = new Map<string, DebtorSummary>();
    
    pendingInvoices.forEach(invoice => {
      const clientName = invoice.name || invoice.cliente?.name || 'Cliente Sin Nombre';
      const clientId = invoice.clientId || invoice.cliente?.uid || 'sin-id';
      const invoiceDate = new Date(invoice.date || invoice.fechaCreacion);
      const daysPending = Math.floor((new Date().getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (debtorsMap.has(clientName)) {
        const existing = debtorsMap.get(clientName)!;
        existing.totalDebt += invoice.total || 0;
        existing.invoiceCount += 1;
        existing.invoices.push(invoice);
        
        // Actualizar fechas más antigua y más nueva
        if (invoiceDate < new Date(existing.oldestInvoice)) {
          existing.oldestInvoice = invoice.date || invoice.fechaCreacion;
          existing.daysPending = Math.max(existing.daysPending, daysPending);
        }
        if (invoiceDate > new Date(existing.newestInvoice)) {
          existing.newestInvoice = invoice.date || invoice.fechaCreacion;
        }
      } else {
        debtorsMap.set(clientName, {
          clientName,
          clientId,
          totalDebt: invoice.total || 0,
          invoiceCount: 1,
          oldestInvoice: invoice.date || invoice.fechaCreacion,
          newestInvoice: invoice.date || invoice.fechaCreacion,
          invoices: [invoice],
          daysPending,
        });
      }
    });

    return Array.from(debtorsMap.values());
  }, [pendingInvoices]);

  // Filtrar y ordenar deudores
  const filteredAndSortedDebtors = useMemo(() => {
    let filtered = debtorsAnalysis.filter(debtor =>
      debtor.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar según criterio seleccionado
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'debt':
          return b.totalDebt - a.totalDebt;
        case 'count':
          return b.invoiceCount - a.invoiceCount;
        case 'days':
          return b.daysPending - a.daysPending;
        default:
          return b.totalDebt - a.totalDebt;
      }
    });

    return filtered;
  }, [debtorsAnalysis, searchTerm, sortBy]);

  // Estadísticas generales
  const generalStats = useMemo(() => {
    const totalDebt = debtorsAnalysis.reduce((sum, debtor) => sum + debtor.totalDebt, 0);
    const totalDebtors = debtorsAnalysis.length;
    const totalPendingInvoices = pendingInvoices.length;
    const averageDebtPerDebtor = totalDebtors > 0 ? totalDebt / totalDebtors : 0;
    const oldestDebt = Math.max(...debtorsAnalysis.map(d => d.daysPending));

    return {
      totalDebt,
      totalDebtors,
      totalPendingInvoices,
      averageDebtPerDebtor,
      oldestDebt,
    };
  }, [debtorsAnalysis, pendingInvoices]);

  // Función para formatear moneda
  const formatCurrency = (amount: number): string => {
    return `$ ${amount.toLocaleString('es-CO', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  };

  // Función para formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  };

  // Función para obtener color según días pendientes
  const getDaysColor = (days: number): string => {
    if (days <= 7) return '#51cf66'; // Verde
    if (days <= 30) return '#ffd43b'; // Amarillo
    if (days <= 60) return '#ff8c42'; // Naranja
    return '#ff6b6b'; // Rojo
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

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  if (pendingInvoices.length === 0) {
    return (
      <Box sx={{ width: '95%', marginTop: 2 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          🎉 ¡Excelente! No hay facturas pendientes en este momento.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '95%', marginTop: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontFamily: 'Nunito', fontWeight: 700, mb: 1 }}>
          📊 Análisis de Facturas Pendientes
        </Typography>
        <Typography variant="caption" sx={{ color: '#ABBBC2', display: 'block' }}>
          Control y seguimiento de cartera de clientes
        </Typography>
      </Box>

      {/* Estadísticas Generales */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={cardContentStyles}>
              <AttachMoneyIcon sx={{ fontSize: 40, color: UI_CONFIG.theme.colors.error, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: UI_CONFIG.theme.colors.error }}>
                {formatCurrency(generalStats.totalDebt)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                Total Cartera Pendiente
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={cardContentStyles}>
              <PersonIcon sx={{ fontSize: 40, color: UI_CONFIG.theme.colors.warning, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: UI_CONFIG.theme.colors.warning }}>
                {generalStats.totalDebtors}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                Clientes Deudores
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={cardContentStyles}>
              <TrendingUpIcon sx={{ fontSize: 40, color: UI_CONFIG.theme.colors.primary, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: UI_CONFIG.theme.colors.primary }}>
                {formatCurrency(generalStats.averageDebtPerDebtor)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                Promedio por Cliente
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={cardContentStyles}>
              <CalendarTodayIcon sx={{ fontSize: 40, color: getDaysColor(generalStats.oldestDebt), mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: getDaysColor(generalStats.oldestDebt) }}>
                {generalStats.oldestDebt}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                Días Deuda Más Antigua
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controles de Filtro y Búsqueda */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              backgroundColor: '#2C3248',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#69EAE2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#69EAE2',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#fff',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#69EAE2' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: '#fff' }}>Ordenar por</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'debt' | 'count' | 'days')}
            sx={{
              color: '#fff',
              backgroundColor: '#2C3248',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#69EAE2',
              },
              '& .MuiSvgIcon-root': {
                color: '#69EAE2',
              },
            }}
          >
            <MenuItem value="debt">Mayor Deuda</MenuItem>
            <MenuItem value="count">Más Facturas</MenuItem>
            <MenuItem value="days">Más Días Pendiente</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Acciones Rápidas */}
      <PendingInvoicesActions invoices={invoices} />

      {/* Métricas Avanzadas */}
      <DebtMetrics invoices={invoices} />

      {/* Lista de Deudores */}
      <Paper sx={{
        background: UI_CONFIG.theme.colors.secondary,
        borderRadius: '10px',
        border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
        boxShadow: `0px 4px 20px rgba(105, 234, 226, 0.1)`,
      }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            Detalle por Cliente ({filteredAndSortedDebtors.length} deudores)
          </Typography>

          {filteredAndSortedDebtors.map((debtor, index) => {
            const debtorKey = debtor.clientId || `debtor-${index}`;
            return (
            <Accordion
              key={debtorKey}
              expanded={expandedAccordion === debtorKey}
              onChange={handleAccordionChange(debtorKey)}
              sx={{
                backgroundColor: '#1F1D2B',
                color: '#fff',
                mb: 1,
                '&:before': {
                  display: 'none',
                },
                '& .MuiAccordionSummary-root': {
                  backgroundColor: '#2C3248',
                  borderRadius: '8px',
                  mb: expandedAccordion === debtor.clientId ? 1 : 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#69EAE2' }} />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                  <PersonIcon sx={{ color: '#69EAE2' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {debtor.clientName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                      {debtor.invoiceCount} facturas pendientes
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ color: UI_CONFIG.theme.colors.error, fontWeight: 'bold' }}>
                      {formatCurrency(debtor.totalDebt)}
                    </Typography>
                    <Chip
                      label={`${debtor.daysPending} días`}
                      size="small"
                      sx={{
                        backgroundColor: getDaysColor(debtor.daysPending),
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#69EAE2', fontWeight: 'bold' }}>Factura</TableCell>
                        <TableCell sx={{ color: '#69EAE2', fontWeight: 'bold' }}>Fecha</TableCell>
                        <TableCell sx={{ color: '#69EAE2', fontWeight: 'bold' }}>Valor</TableCell>
                        <TableCell sx={{ color: '#69EAE2', fontWeight: 'bold' }}>Días</TableCell>
                        <TableCell sx={{ color: '#69EAE2', fontWeight: 'bold' }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {debtor.invoices.map((invoice) => {
                        const invoiceDate = new Date(invoice.date || invoice.fechaCreacion);
                        const daysPending = Math.floor((new Date().getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <TableRow key={invoice.uid}>
                            <TableCell sx={{ color: '#fff' }}>{invoice.uid}</TableCell>
                            <TableCell sx={{ color: '#fff' }}>{formatDate(invoice.date || invoice.fechaCreacion)}</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                              {formatCurrency(invoice.total)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${daysPending}d`}
                                size="small"
                                sx={{
                                  backgroundColor: getDaysColor(daysPending),
                                  color: '#000',
                                  fontWeight: 'bold',
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <PendingInvoiceDetailModal invoice={invoice} />
                                <FacturaModal data={invoice} />
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            );
          })}

          {filteredAndSortedDebtors.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No se encontraron deudores que coincidan con la búsqueda.
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PendingInvoicesAnalysis;