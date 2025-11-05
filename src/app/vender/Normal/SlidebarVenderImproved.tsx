"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  IconButton,
  SwipeableDrawer,
  Badge,
  BadgeProps,
  styled,
  useMediaQuery,
  useTheme,
  Typography,
  Divider,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Hooks mejorados
import { useCart } from '@/hooks/useCart';
import { useNotification } from '@/hooks/useNotification';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { useSalesWithCashSession, useCashSessionValidation } from '@/hooks/useSalesWithCashSession';

// Componentes
import { LoadingButton } from '@/components/LoadingStates/LoadingButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Header from '../SlidebarVender/Header';
import ProductListImproved from '@/app/vender/Normal/ProductListImproved';
import DiscountSectionImproved from '@/app/vender/Normal/DiscountSectionImproved';
import TotalSectionImproved from '@/app/vender/Normal/TotalSectionImproved';
import CheckoutImproved from '@/app/vender/Normal/CheckoutImproved';

// Servicios y configuración
import { UI_CONFIG } from '@/config/constants';
import { getNextInvoiceNumber } from '@/firebase';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    padding: '0 4px',
  },
}));

interface SlidebarVenderImprovedProps {
  typeInvoice: string;
  activeInvoice: string;
}

const SlidebarVenderImproved: React.FC<SlidebarVenderImprovedProps> = ({
  typeInvoice,
  activeInvoice,
}) => {
  // Hooks
  const { cart, cartTotal, cartSubtotal, cartDiscount, applyDiscount, clearCart, getCartItemCount } = useCart();
  const cartItemsCount = getCartItemCount();
  const { success, error: notifyError, warning, info } = useNotification();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Hook para ventas con sesión de caja
  const { saveSale, loading: savingSale, activeCashSession, validateCashSession } = useSalesWithCashSession();
  const { validateBeforeSale, hasActiveSession, getSessionStatus } = useCashSessionValidation();

  // Estados locales
  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState({
    lastNumber: '00001',
    nextNumber: '00002'
  });

  // Función estable para obtener número de factura
  const fetchInvoiceNumberOperation = useCallback(async () => {
    try {
      const data = await getNextInvoiceNumber();
      setNextInvoiceNumber(data);
    } catch (error) {
      notifyError('Error al obtener número de factura');
      throw error;
    }
  }, [notifyError]);

  // Operación asíncrona para obtener número de factura
  const { execute: fetchInvoiceNumber, loading: loadingInvoiceNumber } = useAsyncOperation(fetchInvoiceNumberOperation);

  // Función estable para procesar venta
  const processSaleOperation = useCallback(async (paymentData: any) => {
    try {
      // Validar sesión de caja antes de procesar
      const sessionValid = await validateCashSession();
      
      if (!sessionValid) {
        warning('No hay sesión de caja activa');
        info('La venta se guardará sin asociación a sesión de caja');
      }
      
      // Preparar datos de la venta
      const saleData = {
        uid: nextInvoiceNumber.nextNumber,
        user: localStorage.getItem('user') || 'unknown', // ID del establecimiento
        total: cartTotal,
        subtotal: cartSubtotal,
        descuento: cartDiscount,
        compra: cart.map(item => ({
          productName: item.product.productName,
          barCode: item.product.barCode,
          cantidad: item.quantity,
          price: item.unitPrice,
          total: item.subtotal
        })),
        paymentMethod: normalizePaymentMethod(paymentData.paymentMethod),
        status: 'PAGADO',
        timestamp: new Date(),
        fechaCreacion: new Date().toISOString(),
        date: new Date().toLocaleString('sv-SE').replace('T', ' ').substring(0, 16),
        
        // Datos del cliente (si aplica)
        name: paymentData.customerName || null,
        clientId: null, // Se puede agregar lógica para buscar cliente
        
        // Datos de pago
        montoRecibido: paymentData.receivedAmount || cartTotal,
        cambio: paymentData.change || 0,
        notas: paymentData.notes || null,
        
        // Metadatos
        typeInvoice,
        activeInvoice,
        source: 'vender-module'
      };
      
      console.log('💰 Procesando venta:', {
        facturaId: saleData.uid,
        total: saleData.total,
        paymentMethod: saleData.paymentMethod,
        hasActiveSession: sessionValid,
        sessionId: activeCashSession?.id
      });
      
      // Guardar venta (se asociará automáticamente con sesión de caja)
      const invoiceId = await saveSale(saleData);
      
      if (invoiceId) {
        success(`✅ Venta procesada: ${saleData.uid}`);
        
        if (sessionValid) {
          info(`🏦 Asociada a sesión de caja: ${activeCashSession?.uid}`);
        }
        
        // Limpiar carrito y cerrar checkout
        clearCart();
        setShowCheckout(false);
        setOpen(false);
        
        // Actualizar número de factura para la siguiente venta
        await fetchInvoiceNumber();
      } else {
        throw new Error('No se pudo guardar la venta');
      }
    } catch (error) {
      console.error('❌ Error procesando venta:', error);
      notifyError('Error al procesar la venta');
      throw error;
    }
  }, [
    validateCashSession, 
    warning, 
    info, 
    nextInvoiceNumber.nextNumber, 
    cartTotal, 
    cartSubtotal, 
    cartDiscount, 
    cart, 
    typeInvoice, 
    activeInvoice, 
    activeCashSession, 
    saveSale, 
    success, 
    clearCart, 
    fetchInvoiceNumber, 
    notifyError
  ]);

  // Operación asíncrona para procesar venta
  const { execute: processSale, loading: processingSale } = useAsyncOperation(processSaleOperation);
  
  // Función para normalizar método de pago
  const normalizePaymentMethod = (method: string): string => {
    const normalized = (method || '').toLowerCase();
    
    switch (normalized) {
      case 'efectivo':
      case 'cash':
        return 'EFECTIVO';
      case 'tarjeta':
      case 'card':
        return 'TARJETA';
      case 'transferencia':
      case 'transfer':
        return 'TRANSFERENCIA';
      default:
        return 'EFECTIVO';
    }
  };

  // Manejar descuento
  const handleApplyDiscount = (discountValue: string) => {
    try {
      const value = discountValue.trim() || '0';
      
      const discountAmount = value.includes('%')
        ? Math.ceil((parseFloat(value.replace('%', '')) / 100) * cartSubtotal)
        : parseFloat(value) || 0;

      applyDiscount(discountAmount);
    } catch (error) {
      notifyError('Error al aplicar descuento');
    }
  };

  // Manejar checkout
  const handleCheckout = () => {
    if (cartItemsCount === 0) {
      notifyError('El carrito está vacío');
      return;
    }
    
    // Validar sesión de caja (opcional, solo informativo)
    const sessionStatus = getSessionStatus();
    if (!sessionStatus.hasActiveSession) {
      warning('⚠️ No hay sesión de caja activa');
      info('💡 Recomendación: Abrir sesión de caja para mejor control');
    } else {
      info(`🏦 Sesión activa: ${sessionStatus.sessionUid}`);
    }
    
    setShowCheckout(true);
  };

  // Manejar venta
  const handleProcessSale = (paymentData: any) => {
    processSale(paymentData);
  };

  // Efectos
  useEffect(() => {
    fetchInvoiceNumber();
  }, []); // Sin dependencias para ejecutar solo una vez

  useEffect(() => {
    if (!matchesSM) {
      setOpen(true);
    }
  }, [matchesSM]);

  return (
    <ErrorBoundary>
      <Box display="flex">
        {/* Botón flotante del carrito (solo móvil) */}
        <IconButton
          sx={{
            position: 'absolute',
            top: '20px',
            right: '30px',
            display: { xs: 'block', lg: 'none' },
          }}
          onClick={() => setOpen(true)}
          aria-label="cart"
        >
          <StyledBadge
            badgeContent={cartItemsCount}
            sx={{ color: '#fff' }}
            color="error"
          >
            <ShoppingCartIcon />
          </StyledBadge>
        </IconButton>

        {/* Drawer del carrito */}
        <SwipeableDrawer
          open={open}
          id="drawer"
          variant={matchesSM ? 'persistent' : 'permanent'}
          anchor="right"
          PaperProps={{
            style: {
              background: 'transparent',
              border: 'none',
              width: !matchesSM ? '510px' : '95%',
            },
          }}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Box
            sx={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              position: 'absolute',
              paddingTop: '8px',
              paddingBottom: '8px',
              background: UI_CONFIG.theme.colors.secondary,
              height: '100%',
              overflow: 'hidden',
              top: 0,
              right: 0,
              width: { xs: '100%', sm: '50%', lg: '24rem' },
              borderRadius: '10px 0px 0px 10px',
            }}
          >
            {/* Header del carrito */}
            <Header
              setOpen={setOpen}
              generarNumeroFactura={nextInvoiceNumber.nextNumber}
              totalUnidades={cartItemsCount}
            />
            
            {/* Indicador de sesión de caja */}
            <Box
              sx={{
                mx: 2,
                mb: 1,
                p: 1.5,
                backgroundColor: hasActiveSession 
                  ? 'rgba(81, 207, 102, 0.1)' 
                  : 'rgba(255, 107, 107, 0.1)',
                border: `1px solid ${hasActiveSession 
                  ? UI_CONFIG.theme.colors.success 
                  : UI_CONFIG.theme.colors.error}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: hasActiveSession 
                    ? UI_CONFIG.theme.colors.success 
                    : UI_CONFIG.theme.colors.error,
                  animation: hasActiveSession ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 }
                  }
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: hasActiveSession 
                    ? UI_CONFIG.theme.colors.success 
                    : UI_CONFIG.theme.colors.error,
                  fontWeight: 600,
                  fontSize: '11px'
                }}
              >
                {hasActiveSession 
                  ? `🏦 Caja Activa: ${activeCashSession?.uid || 'N/A'}`
                  : '⚠️ Sin Sesión de Caja'
                }
              </Typography>
            </Box>

            {/* Contenido principal */}
            <Box
              id="principal container"
              padding={3}
              sx={{ 
                height: '92%', 
                width: '100%', 
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {showCheckout ? (
                <CheckoutImproved
                  cart={cart}
                  total={cartTotal}
                  subtotal={cartSubtotal}
                  invoiceNumber={nextInvoiceNumber.nextNumber}
                  typeInvoice={typeInvoice}
                  onProcessSale={handleProcessSale}
                  onBack={() => setShowCheckout(false)}
                  loading={processingSale || savingSale}
                />
              ) : (
                <>
                  {/* Lista de productos */}
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <ProductListImproved />
                  </Box>

                  {/* Sección de descuento */}
                  <DiscountSectionImproved
                    subtotal={cartSubtotal}
                    discount={cartDiscount}
                    onApplyDiscount={handleApplyDiscount}
                  />

                  <Divider sx={{ my: 2, borderColor: UI_CONFIG.theme.colors.background }} />

                  {/* Resumen de totales */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                        Subtotal:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        ${cartSubtotal.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    {cartDiscount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                          Descuento:
                        </Typography>
                        <Typography variant="body2" sx={{ color: UI_CONFIG.theme.colors.error }}>
                          -${cartDiscount.toLocaleString()}
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 1, borderColor: UI_CONFIG.theme.colors.background }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                        Total:
                      </Typography>
                      <Typography variant="h6" sx={{ color: UI_CONFIG.theme.colors.primary, fontWeight: 700 }}>
                        ${cartTotal.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Botón de checkout */}
                  <LoadingButton
                    fullWidth
                    variant="contained"
                    onClick={handleCheckout}
                    disabled={cartItemsCount === 0}
                    loading={loadingInvoiceNumber}
                    loadingText="Preparando venta..."
                    sx={{
                      backgroundColor: UI_CONFIG.theme.colors.primary,
                      color: UI_CONFIG.theme.colors.secondary,
                      fontWeight: 700,
                      fontSize: '16px',
                      height: '48px',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: UI_CONFIG.theme.colors.primary,
                        opacity: 0.9,
                      },
                      '&:disabled': {
                        backgroundColor: UI_CONFIG.theme.colors.background,
                        color: '#ABBBC2',
                      },
                    }}
                  >
                    {cartItemsCount === 0 ? 'Carrito Vacío' : `Proceder al Pago (${cartItemsCount} items)`}
                  </LoadingButton>
                </>
              )}
            </Box>
          </Box>
        </SwipeableDrawer>
      </Box>
    </ErrorBoundary>
  );
};

export default SlidebarVenderImproved;