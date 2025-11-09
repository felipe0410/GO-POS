import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  TextField,
  Chip,
  Badge,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCart } from '@/hooks/useCart';
import { useUI } from '@/store/useAppStore';
import { LoadingButton } from '@/components/LoadingStates/LoadingButton';
import { useNotification } from '@/hooks/useNotification';
import { UI_CONFIG } from '@/config/constants';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ open, onClose }) => {
  const {
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    isEmpty,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount,
    processInvoice,
    getCartStats,
    validateCartAvailability,
    processingInvoice,
  } = useCart();

  const { success } = useNotification();
  const [discountInput, setDiscountInput] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  const stats = getCartStats();
  const availability = validateCartAvailability();

  const handleApplyDiscount = () => {
    const discount = parseFloat(discountInput) || 0;
    applyDiscount(discount);
    setDiscountInput('');
  };

  const handleProcessInvoice = async () => {
    try {
      await processInvoice(
        customerName ? { name: customerName } : undefined,
        paymentMethod
      );
      setCustomerName('');
      setDiscountInput('');
      onClose();
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleClearCart = () => {
    clearCart();
    success('Carrito limpiado');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          backgroundColor: UI_CONFIG.theme.colors.secondary,
          color: UI_CONFIG.theme.colors.text,
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={stats.itemCount} color="primary">
              <CartIcon sx={{ color: UI_CONFIG.theme.colors.primary }} />
            </Badge>
            <Typography variant="h6" sx={{ fontFamily: UI_CONFIG.theme.fonts.primary, fontWeight: 700 }}>
              Carrito
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: UI_CONFIG.theme.colors.text }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Stats */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${stats.uniqueProducts} productos`}
              size="small"
              sx={{ backgroundColor: UI_CONFIG.theme.colors.background }}
            />
            <Chip
              label={`${stats.itemCount} unidades`}
              size="small"
              sx={{ backgroundColor: UI_CONFIG.theme.colors.background }}
            />
          </Box>
        </Box>

        {isEmpty ? (
          /* Carrito vacío */
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <CartIcon sx={{ fontSize: 64, color: UI_CONFIG.theme.colors.background }} />
            <Typography sx={{ color: UI_CONFIG.theme.colors.text, textAlign: 'center' }}>
              El carrito está vacío
            </Typography>
          </Box>
        ) : (
          <>
            {/* Lista de productos */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <List>
                {cart.map((item) => (
                  <ListItem
                    key={item.product.uid}
                    sx={{
                      backgroundColor: UI_CONFIG.theme.colors.background,
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {item.product.productName}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" sx={{ color: UI_CONFIG.theme.colors.text }}>
                            ${item.unitPrice.toLocaleString()} x {item.quantity}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: UI_CONFIG.theme.colors.primary }}>
                            ${item.subtotal.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.uid, item.quantity - 1)}
                          sx={{ color: UI_CONFIG.theme.colors.text }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        
                        <Typography sx={{ minWidth: 30, textAlign: 'center', fontSize: '0.9rem' }}>
                          {item.quantity}
                        </Typography>
                        
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.uid, item.quantity + 1)}
                          sx={{ color: UI_CONFIG.theme.colors.text }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.product.uid)}
                          sx={{ color: UI_CONFIG.theme.colors.error, ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Descuento */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  label="Descuento"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  type="number"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: UI_CONFIG.theme.colors.background,
                    },
                    '& .MuiInputLabel-root': {
                      color: UI_CONFIG.theme.colors.text,
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleApplyDiscount}
                  disabled={!discountInput}
                  sx={{
                    borderColor: UI_CONFIG.theme.colors.primary,
                    color: UI_CONFIG.theme.colors.primary,
                  }}
                >
                  Aplicar
                </Button>
              </Box>
            </Box>

            {/* Cliente */}
            <Box sx={{ mb: 2 }}>
              <TextField
                size="small"
                label="Cliente (opcional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: UI_CONFIG.theme.colors.background,
                  },
                  '& .MuiInputLabel-root': {
                    color: UI_CONFIG.theme.colors.text,
                  },
                }}
              />
            </Box>

            {/* Totales */}
            <Box sx={{ mb: 2 }}>
              <Divider sx={{ backgroundColor: UI_CONFIG.theme.colors.primary, mb: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${cartSubtotal.toLocaleString()}</Typography>
              </Box>
              
              {cartDiscount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: UI_CONFIG.theme.colors.error }}>Descuento:</Typography>
                  <Typography sx={{ color: UI_CONFIG.theme.colors.error }}>
                    -${cartDiscount.toLocaleString()}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: UI_CONFIG.theme.colors.primary }}>
                  ${cartTotal.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Validación de disponibilidad */}
            {!availability.isValid && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: UI_CONFIG.theme.colors.error }}>
                  Productos sin stock suficiente:
                </Typography>
                {availability.unavailableItems.map((item, index) => (
                  <Typography key={index} variant="caption" sx={{ display: 'block', color: UI_CONFIG.theme.colors.error }}>
                    • {item}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Acciones */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleClearCart}
                sx={{
                  flex: 1,
                  borderColor: UI_CONFIG.theme.colors.error,
                  color: UI_CONFIG.theme.colors.error,
                }}
              >
                Limpiar
              </Button>
              
              <LoadingButton
                loading={processingInvoice}
                loadingText="Procesando..."
                onClick={handleProcessInvoice}
                disabled={!availability.isValid || cartTotal <= 0}
                sx={{
                  flex: 2,
                  backgroundColor: UI_CONFIG.theme.colors.primary,
                  color: UI_CONFIG.theme.colors.secondary,
                  '&:hover': {
                    backgroundColor: UI_CONFIG.theme.colors.primary,
                    opacity: 0.9,
                  },
                }}
              >
                Procesar Venta
              </LoadingButton>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};