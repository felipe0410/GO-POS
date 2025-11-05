"use client";
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PrintIcon from '@mui/icons-material/Print';
import PaymentIcon from '@mui/icons-material/Payment';
import DownloadIcon from '@mui/icons-material/Download';

// Configuración
import { UI_CONFIG } from '@/config/constants';

// Hooks
import { useNotification } from '@/hooks/useNotification';

interface PendingInvoicesActionsProps {
  invoices: any[];
  selectedDebtors?: string[];
}

const PendingInvoicesActions: React.FC<PendingInvoicesActionsProps> = ({
  invoices,
  selectedDebtors = [],
}) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('recordatorio');
  const [emailSubject, setEmailSubject] = useState('Recordatorio de Pago Pendiente');
  const [emailMessage, setEmailMessage] = useState('');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');

  const { success, error } = useNotification();

  // Filtrar solo facturas pendientes
  const pendingInvoices = invoices.filter(invoice => 
    invoice.status?.toUpperCase() === 'PENDIENTE' || 
    invoice.status?.toUpperCase() === 'PENDING'
  );

  // Plantillas de email
  const emailTemplates = {
    recordatorio: {
      subject: 'Recordatorio de Pago Pendiente',
      message: `Estimado cliente,

Le recordamos que tiene una factura pendiente de pago por valor de [MONTO].

Número de factura: [NUMERO_FACTURA]
Fecha de emisión: [FECHA]
Días vencidos: [DIAS_VENCIDOS]

Por favor, proceda con el pago a la mayor brevedad posible.

Gracias por su atención.`,
    },
    urgente: {
      subject: 'URGENTE: Pago Vencido - Acción Requerida',
      message: `Estimado cliente,

Su factura número [NUMERO_FACTURA] por valor de [MONTO] se encuentra vencida desde hace [DIAS_VENCIDOS] días.

Es importante que regularice su situación a la mayor brevedad para evitar inconvenientes.

Por favor, contacte con nosotros para coordinar el pago.

Atentamente.`,
    },
    amigable: {
      subject: 'Recordatorio Amigable de Pago',
      message: `Hola,

Esperamos que se encuentre bien. Le escribimos para recordarle amablemente sobre su factura pendiente.

Detalles:
- Factura: [NUMERO_FACTURA]
- Monto: [MONTO]
- Fecha: [FECHA]

Si ya realizó el pago, por favor ignore este mensaje.

¡Gracias!`,
    },
  };

  const handleEmailTemplateChange = (template: string) => {
    setEmailTemplate(template);
    const selectedTemplate = emailTemplates[template as keyof typeof emailTemplates];
    setEmailSubject(selectedTemplate.subject);
    setEmailMessage(selectedTemplate.message);
  };

  const handleSendEmails = () => {
    // Aquí iría la lógica para enviar emails
    // Por ahora solo mostramos una notificación
    success(`Se enviarían ${pendingInvoices.length} recordatorios de pago`);
    setEmailDialogOpen(false);
  };

  const handleMarkAsPaid = () => {
    if (!selectedInvoiceForPayment || !paymentAmount) {
      error('Por favor complete todos los campos');
      return;
    }

    // Aquí iría la lógica para marcar como pagada
    success(`Factura ${selectedInvoiceForPayment.uid} marcada como pagada`);
    setPaymentDialogOpen(false);
    setSelectedInvoiceForPayment(null);
    setPaymentAmount('');
  };

  const handleExportReport = () => {
    // Aquí iría la lógica para exportar reporte
    success('Reporte de cartera exportado exitosamente');
  };

  const handlePrintStatements = () => {
    // Aquí iría la lógica para imprimir estados de cuenta
    success('Estados de cuenta enviados a impresión');
  };

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
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 'bold' }}>
        ⚡ Acciones Rápidas
      </Typography>

      <Grid container spacing={2}>
        {/* Enviar Recordatorios */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <EmailIcon sx={{ fontSize: 40, color: UI_CONFIG.theme.colors.primary, mb: 1 }} />
              <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1, fontWeight: 'bold' }}>
                Enviar Recordatorios
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2', mb: 2, display: 'block' }}>
                {pendingInvoices.length} facturas pendientes
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setEmailDialogOpen(true)}
                sx={{
                  backgroundColor: UI_CONFIG.theme.colors.primary,
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#5bc5bd',
                  },
                }}
              >
                Enviar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Marcar como Pagada */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <PaymentIcon sx={{ fontSize: 40, color: '#51cf66', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1, fontWeight: 'bold' }}>
                Registrar Pago
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2', mb: 2, display: 'block' }}>
                Marcar facturas como pagadas
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setPaymentDialogOpen(true)}
                sx={{
                  backgroundColor: '#51cf66',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#40c057',
                  },
                }}
              >
                Registrar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Imprimir Estados */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <PrintIcon sx={{ fontSize: 40, color: '#ffd43b', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1, fontWeight: 'bold' }}>
                Imprimir Estados
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2', mb: 2, display: 'block' }}>
                Estados de cuenta detallados
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handlePrintStatements}
                sx={{
                  backgroundColor: '#ffd43b',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#fcc419',
                  },
                }}
              >
                Imprimir
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Exportar Reporte */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyles}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <DownloadIcon sx={{ fontSize: 40, color: '#9c88ff', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1, fontWeight: 'bold' }}>
                Exportar Reporte
              </Typography>
              <Typography variant="caption" sx={{ color: '#ABBBC2', mb: 2, display: 'block' }}>
                Reporte completo de cartera
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleExportReport}
                sx={{
                  backgroundColor: '#9c88ff',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#8c7ae6',
                  },
                }}
              >
                Exportar
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para Enviar Emails */}
      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            color: '#fff',
          },
        }}
      >
        <DialogTitle>
          📧 Enviar Recordatorios de Pago
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Se enviarán recordatorios a {pendingInvoices.length} facturas pendientes
            </Alert>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#fff' }}>Plantilla de Email</InputLabel>
              <Select
                value={emailTemplate}
                onChange={(e) => handleEmailTemplateChange(e.target.value)}
                sx={{
                  color: '#fff',
                  backgroundColor: '#2C3248',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: '#69EAE2' },
                  '& .MuiSvgIcon-root': { color: '#69EAE2' },
                }}
              >
                <MenuItem value="recordatorio">Recordatorio Estándar</MenuItem>
                <MenuItem value="urgente">Urgente - Pago Vencido</MenuItem>
                <MenuItem value="amigable">Recordatorio Amigable</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Asunto"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  backgroundColor: '#2C3248',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: '#69EAE2' },
                },
                '& .MuiInputLabel-root': { color: '#fff' },
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={8}
              label="Mensaje"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  backgroundColor: '#2C3248',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: '#69EAE2' },
                },
                '& .MuiInputLabel-root': { color: '#fff' },
              }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                Variables disponibles: [MONTO], [NUMERO_FACTURA], [FECHA], [DIAS_VENCIDOS]
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)} sx={{ color: '#fff' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSendEmails}
            variant="contained"
            sx={{
              backgroundColor: UI_CONFIG.theme.colors.primary,
              color: '#000',
              fontWeight: 'bold',
            }}
          >
            Enviar Recordatorios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Registrar Pago */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            color: '#fff',
          },
        }}
      >
        <DialogTitle>
          💰 Registrar Pago de Factura
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel sx={{ color: '#fff' }}>Seleccionar Factura</InputLabel>
            <Select
              value={selectedInvoiceForPayment?.uid || ''}
              onChange={(e) => {
                const invoice = pendingInvoices.find(inv => inv.uid === e.target.value);
                setSelectedInvoiceForPayment(invoice);
                setPaymentAmount(invoice?.total?.toString() || '');
              }}
              sx={{
                color: '#fff',
                backgroundColor: '#2C3248',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: '#69EAE2' },
                '& .MuiSvgIcon-root': { color: '#69EAE2' },
              }}
            >
              {pendingInvoices.map((invoice) => (
                <MenuItem key={invoice.uid} value={invoice.uid}>
                  {invoice.uid} - {formatCurrency(invoice.total)} - {invoice.name || 'Sin nombre'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedInvoiceForPayment && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#2C3248', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Detalles de la Factura:
              </Typography>
              <Typography variant="body2">
                Cliente: {selectedInvoiceForPayment.name || 'Sin nombre'}
              </Typography>
              <Typography variant="body2">
                Monto Original: {formatCurrency(selectedInvoiceForPayment.total)}
              </Typography>
              <Typography variant="body2">
                Fecha: {new Date(selectedInvoiceForPayment.date).toLocaleDateString('es-CO')}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Monto Recibido"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                backgroundColor: '#2C3248',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: '#69EAE2' },
              },
              '& .MuiInputLabel-root': { color: '#fff' },
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ color: '#fff' }}>Método de Pago</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              sx={{
                color: '#fff',
                backgroundColor: '#2C3248',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: '#69EAE2' },
                '& .MuiSvgIcon-root': { color: '#69EAE2' },
              }}
            >
              <MenuItem value="EFECTIVO">Efectivo</MenuItem>
              <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
              <MenuItem value="TARJETA">Tarjeta</MenuItem>
              <MenuItem value="CHEQUE">Cheque</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)} sx={{ color: '#fff' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleMarkAsPaid}
            variant="contained"
            sx={{
              backgroundColor: '#51cf66',
              color: '#000',
              fontWeight: 'bold',
            }}
          >
            Registrar Pago
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingInvoicesActions;