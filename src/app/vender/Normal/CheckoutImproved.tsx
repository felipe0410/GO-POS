"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';

// Hooks
import { useNotification } from '@/hooks/useNotification';

// Componentes
import { LoadingButton } from '@/components/LoadingStates/LoadingButton';

// Configuración
import { UI_CONFIG } from '@/config/constants';

interface CheckoutImprovedProps {
  cart: any;
  total: number;
  subtotal: number;
  invoiceNumber: string;
  typeInvoice: string;
  onProcessSale: (paymentData: any) => void;
  onBack: () => void;
  loading: boolean;
}

const CheckoutImproved: React.FC<CheckoutImprovedProps> = ({
  cart,
  total,
  subtotal,
  invoiceNumber,
  typeInvoice,
  onProcessSale,
  onBack,
  loading,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerDocument, setCustomerDocument] = useState('');
  const [notes, setNotes] = useState('');
  
  const { error: notifyError } = useNotification();

  const receivedAmountNumber = parseFloat(receivedAmount) || 0;
  const change = receivedAmountNumber - total;

  const handleProcessSale = () => {
    // Validaciones
    if (paymentMethod === 'efectivo' && receivedAmountNumber < total) {
      notifyError('El monto recibido debe ser mayor o igual al total');
      return;
    }

    if (typeInvoice === 'invoice' && !customerName.trim()) {
      notifyError('El nombre del cliente es requerido para facturas');
      return;
    }

    const paymentData = {
      paymentMethod,
      receivedAmount: receivedAmountNumber,
      change: paymentMethod === 'efectivo' ? change : 0,
      customerName: customerName.trim(),
      customerDocument: customerDocument.trim(),
      notes: notes.trim(),
      timestamp: new Date().toISOString(),
    };

    onProcessSale(paymentData);
  };

  const paymentMethods = [
    {
      value: 'efectivo',
      label: 'Efectivo',
      icon: <AccountBalanceWalletIcon />,
      description: 'Pago en efectivo'
    },
    {
      value: 'tarjeta',
      label: 'Tarjeta',
      icon: <CreditCardIcon />,
      description: 'Débito o crédito'
    },
    {
      value: 'transferencia',
      label: 'Transferencia',
      icon: <PaymentIcon />,
      description: 'Transferencia bancaria'
    },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={onBack}
          sx={{
            color: '#ABBBC2',
            mr: 1,
            '&:hover': {
              backgroundColor: 'rgba(171, 187, 194, 0.1)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontFamily: 'Nunito',
            fontWeight: 700,
          }}
        >
          Procesar Pago
        </Typography>
      </Box>

      {/* Resumen de la venta */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: UI_CONFIG.theme.colors.background,
          borderRadius: '8px',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: UI_CONFIG.theme.colors.primary,
              fontFamily: 'Nunito',
              fontWeight: 600,
              mb: 2,
            }}
          >
            Resumen de Venta - Factura #{invoiceNumber}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
              Items ({cart.length}):
            </Typography>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              ${subtotal.toLocaleString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 1, borderColor: UI_CONFIG.theme.colors.secondary }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontFamily: 'Nunito',
                fontWeight: 700,
              }}
            >
              Total:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: UI_CONFIG.theme.colors.primary,
                fontFamily: 'Nunito',
                fontWeight: 700,
              }}
            >
              ${total.toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Método de pago */}
      <Box sx={{ mb: 3 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel
            component="legend"
            sx={{
              color: '#fff',
              fontFamily: 'Nunito',
              fontWeight: 600,
              mb: 2,
              '&.Mui-focused': {
                color: UI_CONFIG.theme.colors.primary,
              },
            }}
          >
            Método de Pago
          </FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {paymentMethods.map((method) => (
              <Card
                key={method.value}
                sx={{
                  mb: 1,
                  backgroundColor: paymentMethod === method.value 
                    ? 'rgba(105, 234, 226, 0.1)' 
                    : UI_CONFIG.theme.colors.secondary,
                  border: paymentMethod === method.value 
                    ? `1px solid ${UI_CONFIG.theme.colors.primary}` 
                    : '1px solid transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: paymentMethod === method.value 
                      ? 'rgba(105, 234, 226, 0.15)' 
                      : 'rgba(105, 234, 226, 0.05)',
                  },
                }}
                onClick={() => setPaymentMethod(method.value)}
              >
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <FormControlLabel
                    value={method.value}
                    control={
                      <Radio
                        sx={{
                          color: '#ABBBC2',
                          '&.Mui-checked': {
                            color: UI_CONFIG.theme.colors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: UI_CONFIG.theme.colors.primary }}>
                          {method.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#fff',
                              fontFamily: 'Nunito',
                              fontWeight: 600,
                            }}
                          >
                            {method.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#ABBBC2',
                              fontFamily: 'Nunito',
                            }}
                          >
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ margin: 0, width: '100%' }}
                  />
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Monto recibido (solo para efectivo) */}
      {paymentMethod === 'efectivo' && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Monto Recibido"
            type="number"
            value={receivedAmount}
            onChange={(e) => setReceivedAmount(e.target.value)}
            placeholder="0"
            InputProps={{
              sx: {
                color: '#fff',
                backgroundColor: UI_CONFIG.theme.colors.secondary,
              },
            }}
            InputLabelProps={{
              sx: {
                color: '#ABBBC2',
                '&.Mui-focused': {
                  color: UI_CONFIG.theme.colors.primary,
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ABBBC2',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: UI_CONFIG.theme.colors.primary,
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: UI_CONFIG.theme.colors.primary,
              },
            }}
          />
          
          {receivedAmountNumber > 0 && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: UI_CONFIG.theme.colors.background, borderRadius: '8px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                  Total a pagar:
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  ${total.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                  Monto recibido:
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  ${receivedAmountNumber.toLocaleString()}
                </Typography>
              </Box>
              <Divider sx={{ my: 1, borderColor: UI_CONFIG.theme.colors.secondary }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                  Cambio:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: change >= 0 ? UI_CONFIG.theme.colors.success : UI_CONFIG.theme.colors.error,
                    fontWeight: 600,
                  }}
                >
                  ${change.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Datos del cliente (para facturas) */}
      {typeInvoice === 'invoice' && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#fff',
              fontFamily: 'Nunito',
              fontWeight: 600,
              mb: 2,
            }}
          >
            Datos del Cliente
          </Typography>
          
          <TextField
            fullWidth
            label="Nombre del Cliente *"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                color: '#fff',
                backgroundColor: UI_CONFIG.theme.colors.secondary,
              },
            }}
            InputLabelProps={{
              sx: {
                color: '#ABBBC2',
                '&.Mui-focused': {
                  color: UI_CONFIG.theme.colors.primary,
                },
              },
            }}
          />
          
          <TextField
            fullWidth
            label="Documento (Opcional)"
            value={customerDocument}
            onChange={(e) => setCustomerDocument(e.target.value)}
            InputProps={{
              sx: {
                color: '#fff',
                backgroundColor: UI_CONFIG.theme.colors.secondary,
              },
            }}
            InputLabelProps={{
              sx: {
                color: '#ABBBC2',
                '&.Mui-focused': {
                  color: UI_CONFIG.theme.colors.primary,
                },
              },
            }}
          />
        </Box>
      )}

      {/* Notas adicionales */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Notas (Opcional)"
          multiline
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas adicionales sobre la venta..."
          InputProps={{
            sx: {
              color: '#fff',
              backgroundColor: UI_CONFIG.theme.colors.secondary,
            },
          }}
          InputLabelProps={{
            sx: {
              color: '#ABBBC2',
              '&.Mui-focused': {
                color: UI_CONFIG.theme.colors.primary,
              },
            },
          }}
        />
      </Box>

      {/* Botones de acción */}
      <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading}
          sx={{
            flex: 1,
            color: '#ABBBC2',
            borderColor: '#ABBBC2',
            '&:hover': {
              borderColor: UI_CONFIG.theme.colors.primary,
              color: UI_CONFIG.theme.colors.primary,
            },
          }}
        >
          Volver
        </Button>
        
        <LoadingButton
          variant="contained"
          onClick={handleProcessSale}
          loading={loading}
          loadingText="Procesando..."
          disabled={
            (paymentMethod === 'efectivo' && receivedAmountNumber < total) ||
            (typeInvoice === 'invoice' && !customerName.trim())
          }
          sx={{
            flex: 2,
            backgroundColor: UI_CONFIG.theme.colors.primary,
            color: UI_CONFIG.theme.colors.secondary,
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#5AD4CC',
            },
          }}
        >
          Procesar Venta
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default CheckoutImproved;