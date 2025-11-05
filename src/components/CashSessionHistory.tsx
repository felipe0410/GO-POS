import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  Receipt,
  Print,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

// Hooks
import { useCashSession } from '@/hooks/useCashSession';
import { LoadingButton } from './LoadingStates/LoadingButton';

// Componentes
import TicketCierreCaja from '@/app/TicketCierreCaja';

// Configuración
import { UI_CONFIG } from '@/config/constants';

interface CashSessionHistoryProps {
  invoices: any[];
  onViewSession?: (session: any) => void;
}

const CashSessionHistory: React.FC<CashSessionHistoryProps> = ({
  invoices,
  onViewSession,
}) => {
  // Estados locales
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [ticketSession, setTicketSession] = useState<any>(null);

  // Hook de sesiones de caja
  const { closedSessions, refreshData, loading } = useCashSession(invoices);

  // Formatear moneda
  const formatCurrency = (amount: number): string => {
    return `$ ${amount.toLocaleString('es-CO')}`;
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calcular duración de sesión
  const calculateDuration = (start: string, end?: string): string => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return `${Math.round(diffHours * 60)} min`;
    }
    return `${diffHours.toFixed(1)} h`;
  };

  // Obtener color del estado
  const getStatusColor = (session: any): 'success' | 'warning' | 'error' | 'info' => {
    if (!session.cajaCerrada) return 'warning';
    
    const diferencia = session.montoFinal ? 
      parseFloat(session.montoFinal) - parseFloat(session.montoInicial) : 0;
    
    if (Math.abs(diferencia) > 10000) return 'error';
    return 'success';
  };

  // Obtener icono del estado
  const getStatusIcon = (session: any) => {
    if (!session.cajaCerrada) return <ScheduleIcon />;
    
    const diferencia = session.montoFinal ? 
      parseFloat(session.montoFinal) - parseFloat(session.montoInicial) : 0;
    
    if (Math.abs(diferencia) > 10000) return <ErrorIcon />;
    return <CheckCircleIcon />;
  };
  
  // Función para generar ticket
  const handleGenerateTicket = (session: any) => {
    setTicketSession(session);
    setShowTicketDialog(true);
  };

  // Filtrar y buscar sesiones
  const filteredSessions = useMemo(() => {
    let filtered = closedSessions;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.notasApertura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.notasCierre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => {
        switch (statusFilter) {
          case 'open':
            return !session.cajaCerrada;
          case 'closed':
            return session.cajaCerrada;
          case 'issues':
            const diferencia = session.montoFinal ? 
              parseFloat(session.montoFinal) - parseFloat(session.montoInicial) : 0;
            return Math.abs(diferencia) > 10000;
          default:
            return true;
        }
      });
    }

    // Ordenar por fecha más reciente
    return filtered.sort((a, b) => 
      new Date(b.fechaApertura).getTime() - new Date(a.fechaApertura).getTime()
    );
  }, [closedSessions, searchTerm, statusFilter]);

  // Paginación
  const paginatedSessions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredSessions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSessions, page, rowsPerPage]);

  // Estadísticas generales
  const stats = useMemo(() => {
    const total = closedSessions.length;
    const closed = closedSessions.filter(s => s.cajaCerrada).length;
    const withIssues = closedSessions.filter(s => {
      const diferencia = s.montoFinal ? 
        parseFloat(s.montoFinal) - parseFloat(s.montoInicial) : 0;
      return Math.abs(diferencia) > 10000;
    }).length;

    const totalVentas = closedSessions.reduce((sum, s) => 
      sum + (s.totalCerrado || 0), 0
    );

    return { total, closed, withIssues, totalVentas };
  }, [closedSessions]);

  // Estilos para las cards
  const cardStyles = {
    background: UI_CONFIG.theme.colors.secondary,
    borderRadius: '10px',
    border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
    boxShadow: `0px 4px 20px rgba(105, 234, 226, 0.1)`,
  };

  const tableStyles = {
    '& .MuiTableCell-root': {
      borderColor: UI_CONFIG.theme.colors.background,
      color: '#fff',
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      backgroundColor: UI_CONFIG.theme.colors.background,
      fontWeight: 700,
      color: UI_CONFIG.theme.colors.primary,
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: 'rgba(105, 234, 226, 0.05)',
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Estadísticas generales */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: UI_CONFIG.theme.colors.primary, fontWeight: 900 }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                Total Sesiones
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: UI_CONFIG.theme.colors.success, fontWeight: 900 }}>
                {stats.closed}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                Cerradas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: UI_CONFIG.theme.colors.error, fontWeight: 900 }}>
                {stats.withIssues}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                Con Diferencias
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: UI_CONFIG.theme.colors.primary, fontWeight: 900 }}>
                {formatCurrency(stats.totalVentas)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                Total Ventas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de sesiones */}
      <Card sx={cardStyles}>
        <CardContent sx={{ color: '#fff', p: 0 }}>
          {/* Header con filtros */}
          <Box sx={{ p: 3, pb: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: 'Nunito', fontWeight: 700 }}>
                📋 Historial de Cierres de Caja
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ color: UI_CONFIG.theme.colors.primary }}
                >
                  <FilterIcon />
                </IconButton>
                
                <LoadingButton
                  variant="outlined"
                  onClick={refreshData}
                  loading={loading}
                  sx={{
                    borderColor: UI_CONFIG.theme.colors.primary,
                    color: UI_CONFIG.theme.colors.primary,
                  }}
                >
                  Actualizar
                </LoadingButton>
              </Box>
            </Box>

            {/* Filtros expandibles */}
            <Collapse in={showFilters}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por ID, notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#ABBBC2' }} />
                        </InputAdornment>
                      ),
                      style: { color: '#fff' },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: UI_CONFIG.theme.colors.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: UI_CONFIG.theme.colors.primary,
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#ABBBC2' }}>Estado</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: UI_CONFIG.theme.colors.primary,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: UI_CONFIG.theme.colors.primary,
                        },
                        '& .MuiSvgIcon-root': {
                          color: UI_CONFIG.theme.colors.primary,
                        },
                      }}
                    >
                      <MenuItem value="all">Todas</MenuItem>
                      <MenuItem value="open">Abiertas</MenuItem>
                      <MenuItem value="closed">Cerradas</MenuItem>
                      <MenuItem value="issues">Con Diferencias</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Collapse>
          </Box>

          {/* Tabla */}
          <TableContainer>
            <Table sx={tableStyles}>
              <TableHead>
                <TableRow>
                  <TableCell>ID Sesión</TableCell>
                  <TableCell>Fecha Apertura</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Monto Inicial</TableCell>
                  <TableCell>Monto Final</TableCell>
                  <TableCell>Diferencia</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSessions.map((session) => {
                  const diferencia = session.montoFinal ? 
                    parseFloat(session.montoFinal) - parseFloat(session.montoInicial) : 0;
                  const isExpanded = expandedRow === session.uid;

                  return (
                    <React.Fragment key={session.uid}>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {session.uid.slice(-8)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(session.fechaApertura)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {calculateDuration(session.fechaApertura, session.fechaCierre)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(parseFloat(session.montoInicial))}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {session.montoFinal ? formatCurrency(parseFloat(session.montoFinal)) : '-'}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {diferencia > 0 ? (
                              <TrendingUpIcon sx={{ color: UI_CONFIG.theme.colors.success, fontSize: 16 }} />
                            ) : diferencia < 0 ? (
                              <TrendingDownIcon sx={{ color: UI_CONFIG.theme.colors.error, fontSize: 16 }} />
                            ) : null}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                color: diferencia > 0 ? UI_CONFIG.theme.colors.success : 
                                       diferencia < 0 ? UI_CONFIG.theme.colors.error : '#fff'
                              }}
                            >
                              {diferencia !== 0 ? formatCurrency(Math.abs(diferencia)) : '-'}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(session)}
                            label={session.cajaCerrada ? 'Cerrada' : 'Abierta'}
                            color={getStatusColor(session)}
                            size="small"
                            variant="outlined"
                            sx={{
                              color: '#fff',
                              borderColor: 'currentColor',
                            }}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                onClick={() => setExpandedRow(isExpanded ? null : session.uid)}
                                sx={{ color: UI_CONFIG.theme.colors.primary }}
                              >
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                            </Tooltip>
                            
                            {onViewSession && (
                              <Tooltip title="Ver sesión completa">
                                <IconButton
                                  size="small"
                                  onClick={() => onViewSession(session)}
                                  sx={{ color: UI_CONFIG.theme.colors.primary }}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {session.cajaCerrada && (
                              <Tooltip title="Generar Ticket">
                                <IconButton
                                  size="small"
                                  onClick={() => handleGenerateTicket(session)}
                                  sx={{ color: UI_CONFIG.theme.colors.success }}
                                >
                                  <Receipt />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Fila expandible con detalles */}
                      <TableRow>
                        <TableCell colSpan={8} sx={{ py: 0, border: 'none' }}>
                          <Collapse in={isExpanded}>
                            <Box sx={{ p: 2, backgroundColor: 'rgba(105, 234, 226, 0.05)' }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" sx={{ color: UI_CONFIG.theme.colors.primary, mb: 1 }}>
                                    📝 Información de Apertura
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Fecha:</strong> {formatDate(session.fechaApertura)}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Monto Inicial:</strong> {formatCurrency(parseFloat(session.montoInicial))}
                                  </Typography>
                                  {session.notasApertura && (
                                    <Typography variant="body2">
                                      <strong>Notas:</strong> {session.notasApertura}
                                    </Typography>
                                  )}
                                </Grid>
                                
                                {session.cajaCerrada && (
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ color: UI_CONFIG.theme.colors.primary, mb: 1 }}>
                                      🔒 Información de Cierre
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Fecha:</strong> {formatDate(session.fechaCierre || '')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Monto Final:</strong> {formatCurrency(parseFloat(session.montoFinal || '0'))}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Consecutivo:</strong> #{session.consecutivo}
                                    </Typography>
                                    {session.notasCierre && (
                                      <Typography variant="body2">
                                        <strong>Notas:</strong> {session.notasCierre}
                                      </Typography>
                                    )}
                                  </Grid>
                                )}

                                {/* Resumen financiero */}
                                {session.cajaCerrada && (
                                  <Grid item xs={12}>
                                    <Divider sx={{ borderColor: UI_CONFIG.theme.colors.background, my: 1 }} />
                                    <Typography variant="subtitle2" sx={{ color: UI_CONFIG.theme.colors.primary, mb: 1 }}>
                                      💰 Resumen Financiero
                                    </Typography>
                                    <Grid container spacing={2}>
                                      <Grid item xs={6} sm={3}>
                                        <Typography variant="body2">
                                          <strong>Efectivo:</strong> {formatCurrency(session.efectivo || 0)}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={3}>
                                        <Typography variant="body2">
                                          <strong>Transferencias:</strong> {formatCurrency(session.transferencias || 0)}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={3}>
                                        <Typography variant="body2">
                                          <strong>Pendientes:</strong> {formatCurrency(session.pendientes || 0)}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={3}>
                                        <Typography variant="body2">
                                          <strong>Total:</strong> {formatCurrency(session.totalCerrado || 0)}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            component="div"
            count={filteredSessions.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
            sx={{
              color: '#fff',
              borderTop: `1px solid ${UI_CONFIG.theme.colors.background}`,
              '& .MuiTablePagination-selectIcon': {
                color: UI_CONFIG.theme.colors.primary,
              },
              '& .MuiTablePagination-select': {
                color: '#fff',
              },
              '& .MuiIconButton-root': {
                color: UI_CONFIG.theme.colors.primary,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Mensaje si no hay datos */}
      {filteredSessions.length === 0 && (
        <Alert 
          severity="info" 
          sx={{ 
            mt: 2,
            backgroundColor: 'rgba(105, 234, 226, 0.1)',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: UI_CONFIG.theme.colors.primary,
            },
          }}
        >
          {searchTerm || statusFilter !== 'all' 
            ? 'No se encontraron sesiones con los filtros aplicados.'
            : 'No hay sesiones de caja registradas aún.'
          }
        </Alert>
      )}
      
      {/* Dialog para mostrar ticket */}
      <Dialog
        open={showTicketDialog}
        onClose={() => setShowTicketDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            color: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff', borderBottom: `1px solid ${UI_CONFIG.theme.colors.primary}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Receipt sx={{ color: UI_CONFIG.theme.colors.primary }} />
            Ticket de Cierre de Caja - {ticketSession?.uid?.slice(-8)}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {ticketSession && (
            <TicketCierreCaja
              establecimiento="GO-POS"
              cajaData={{
                uid: ticketSession.uid,
                montoInicial: ticketSession.montoInicial,
                fechaApertura: ticketSession.fechaApertura,
                estado: ticketSession.cajaCerrada ? 'cerrada' : 'abierta'
              }}
              resumenCaja={{
                efectivo: ticketSession.efectivo || 0,
                transferencias: ticketSession.transferencias || 0,
                total: ticketSession.totalCerrado || 0,
                facturas: ticketSession.facturasUIDs?.length || 0
              }}
              producido={(ticketSession.efectivo || 0) + (ticketSession.transferencias || 0)}
              totalEnCaja={(ticketSession.efectivo || 0) + parseFloat(ticketSession.montoInicial || '0')}
              notasCierre={ticketSession.notasCierre || ''}
              consecutivo={ticketSession.consecutivo}
            />
          )}
        </DialogContent>
        
        <DialogActions sx={{ borderTop: `1px solid ${UI_CONFIG.theme.colors.primary}`, p: 2 }}>
          <Button
            onClick={() => setShowTicketDialog(false)}
            sx={{ color: '#fff' }}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={() => {
              window.print();
            }}
            sx={{
              backgroundColor: UI_CONFIG.theme.colors.primary,
              '&:hover': {
                backgroundColor: UI_CONFIG.theme.colors.primary,
                opacity: 0.8
              }
            }}
          >
            Imprimir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CashSessionHistory;