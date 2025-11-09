"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';

// Configuración
import { UI_CONFIG } from '@/config/constants';

// Componentes
import FacturaModal from './FacturaModal';

interface PendingInvoiceDetailModalProps {
  invoice: any;
}

const PendingInvoiceDetailModal: React.FC<PendingInvoiceDetailModalProps> = ({
  invoice,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  // Función para calcular días pendientes
  const getDaysPending = (dateString: string): number => {
    const invoiceDate = new Date(dateString);
    return Math.floor((new Date().getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Función para obtener color según días pendientes
  const getDaysColor = (days: number): string => {
    if (days <= 7) return '#51cf66'; // Verde
    if (days <= 30) return '#ffd43b'; // Amarillo
    if (days <= 60) return '#ff8c42'; // Naranja
    return '#ff6b6b'; // Rojo
  };

  const daysPending = getDaysPending(invoice.date || invoice.fechaCreacion);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: UI_CONFIG.theme.colors.primary,
          '&:hover': {
            backgroundColor: 'rgba(105, 234, 226, 0.1)',
          },
        }}
      >
        <VisibilityIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            color: '#fff',
            borderRadius: '10px',
            border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon sx={{ color: UI_CONFIG.theme.colors.primary }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Detalle de Factura Pendiente
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Información Principal */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={{
                backgroundColor: '#2C3248',
                border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
                borderRadius: '8px',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon sx={{ color: UI_CONFIG.theme.colors.primary }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                      Información del Cliente
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                    Nombre:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                    {invoice.name || invoice.cliente?.name || 'Cliente Sin Nombre'}
                  </Typography>
                  
                  {invoice.cliente?.phone && (
                    <>
                      <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                        Teléfono:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
                        {invoice.cliente.phone}
                      </Typography>
                    </>
                  )}
                  
                  {invoice.cliente?.email && (
                    <>
                      <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                        Email:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#fff' }}>
                        {invoice.cliente.email}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{
                backgroundColor: '#2C3248',
                border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
                borderRadius: '8px',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ReceiptIcon sx={{ color: UI_CONFIG.theme.colors.primary }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                      Información de la Factura
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                    Número de Factura:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                    {invoice.uid}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                    Fecha de Emisión:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
                    {formatDate(invoice.date || invoice.fechaCreacion)}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                    Estado:
                  </Typography>
                  <Chip
                    label={invoice.status?.toUpperCase() || 'PENDIENTE'}
                    sx={{
                      backgroundColor: UI_CONFIG.theme.colors.warning,
                      color: '#000',
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Información Financiera */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={{
                backgroundColor: '#2C3248',
                border: `1px solid ${UI_CONFIG.theme.colors.error}`,
                borderRadius: '8px',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AttachMoneyIcon sx={{ color: UI_CONFIG.theme.colors.error }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                      Información Financiera
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                    Monto Total:
                  </Typography>
                  <Typography variant="h5" sx={{ color: UI_CONFIG.theme.colors.error, fontWeight: 'bold', mb: 2 }}>
                    {formatCurrency(invoice.total || 0)}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                    Método de Pago:
                  </Typography>
                  <Chip
                    label={invoice.paymentMethod?.toUpperCase() || 'EFECTIVO'}
                    sx={{
                      backgroundColor: UI_CONFIG.theme.colors.primary,
                      color: '#000',
                      fontWeight: 'bold',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{
                backgroundColor: '#2C3248',
                border: `1px solid ${getDaysColor(daysPending)}`,
                borderRadius: '8px',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarTodayIcon sx={{ color: getDaysColor(daysPending) }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                      Estado de Vencimiento
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                    Días Pendientes:
                  </Typography>
                  <Typography variant="h4" sx={{ color: getDaysColor(daysPending), fontWeight: 'bold', mb: 2 }}>
                    {daysPending} días
                  </Typography>
                  
                  <Chip
                    label={
                      daysPending <= 7 ? 'RECIENTE' :
                      daysPending <= 30 ? 'MODERADO' :
                      daysPending <= 60 ? 'VENCIDO' : 'CRÍTICO'
                    }
                    sx={{
                      backgroundColor: getDaysColor(daysPending),
                      color: '#000',
                      fontWeight: 'bold',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Productos de la Factura */}
          {invoice.compra && invoice.compra.length > 0 && (
            <Card sx={{
              backgroundColor: '#2C3248',
              border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
              borderRadius: '8px',
              mb: 2,
            }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff', mb: 2 }}>
                  📦 Productos de la Factura
                </Typography>
                
                <TableContainer component={Paper} sx={{ backgroundColor: '#1F1D2B' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: UI_CONFIG.theme.colors.primary, fontWeight: 'bold' }}>
                          Producto
                        </TableCell>
                        <TableCell sx={{ color: UI_CONFIG.theme.colors.primary, fontWeight: 'bold' }} align="center">
                          Cantidad
                        </TableCell>
                        <TableCell sx={{ color: UI_CONFIG.theme.colors.primary, fontWeight: 'bold' }} align="right">
                          Precio Unit.
                        </TableCell>
                        <TableCell sx={{ color: UI_CONFIG.theme.colors.primary, fontWeight: 'bold' }} align="right">
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoice.compra.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell sx={{ color: '#fff' }}>
                            {item.productName || item.name || 'Producto'}
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }} align="center">
                            {item.cantidad || item.quantity || 1}
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }} align="right">
                            {formatCurrency(item.price || item.precio || 0)}
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">
                            {formatCurrency((item.price || item.precio || 0) * (item.cantidad || item.quantity || 1))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: '#fff',
              borderColor: '#fff',
              '&:hover': {
                borderColor: UI_CONFIG.theme.colors.primary,
                color: UI_CONFIG.theme.colors.primary,
              },
            }}
            variant="outlined"
          >
            Cerrar
          </Button>
          
          <FacturaModal data={invoice} />
          
          <Button
            variant="contained"
            sx={{
              backgroundColor: UI_CONFIG.theme.colors.primary,
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#5bc5bd',
              },
            }}
            onClick={() => {
              // Aquí se podría agregar lógica para marcar como pagada
              // TODO: Implementar funcionalidad de marcar como pagada
            }}
          >
            Marcar como Pagada
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PendingInvoiceDetailModal;