"use client";

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Hooks
import { useCart } from '@/hooks/useCart';
import { useNotification } from '@/hooks/useNotification';

// Configuración
import { UI_CONFIG } from '@/config/constants';

const ProductListImproved: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { success } = useNotification();

  const handleQuantityChange = (productUid: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productUid);
      success('Producto eliminado del carrito');
    } else {
      updateQuantity(productUid, newQuantity);
    }
  };

  const handleRemoveItem = (productUid: string, productName: string) => {
    removeFromCart(productUid);
    success(`${productName} eliminado del carrito`);
  };

  if (cart.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          textAlign: 'center',
        }}
      >
        <Box
          component="img"
          src="/images/empty-cart.svg"
          alt="Carrito vacío"
          sx={{
            width: '80px',
            height: '80px',
            opacity: 0.5,
            mb: 2,
          }}
        />
        <Typography
          variant="body1"
          sx={{
            color: '#ABBBC2',
            fontFamily: 'Nunito',
          }}
        >
          Tu carrito está vacío
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#ABBBC2',
            fontFamily: 'Nunito',
            mt: 1,
          }}
        >
          Agrega productos para comenzar
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      id="items-list"
      sx={{
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: UI_CONFIG.theme.colors.background,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'gray',
          borderRadius: '10px',
        },
      }}
    >
      {cart.map((item, index) => (
        <Card
          key={item.product.uid}
          sx={{
            mb: 2,
            backgroundColor: UI_CONFIG.theme.colors.background,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#3A4158',
            },
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* Imagen del producto */}
              <Box
                component="img"
                src={
                  ['', null, undefined].includes(item.product.image)
                    ? '/images/noImage.svg'
                    : item.product.image
                }
                alt={item.product.productName}
                sx={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  backgroundColor: UI_CONFIG.theme.colors.secondary,
                  p: 0.5,
                }}
              />

              {/* Información del producto */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: UI_CONFIG.theme.colors.primary,
                    fontWeight: 600,
                    fontFamily: 'Nunito',
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.product.productName}
                </Typography>
                
                <Typography
                  variant="caption"
                  sx={{
                    color: '#ABBBC2',
                    fontFamily: 'Nunito',
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  Código: {item.product.barCode}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontWeight: 600,
                    fontFamily: 'Nunito',
                  }}
                >
                  {item.product.price}
                </Typography>
              </Box>

              {/* Botón eliminar */}
              <IconButton
                size="small"
                onClick={() => handleRemoveItem(item.product.uid, item.product.productName)}
                sx={{
                  color: UI_CONFIG.theme.colors.error,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>

            <Divider sx={{ my: 1.5, borderColor: UI_CONFIG.theme.colors.secondary }} />

            {/* Controles de cantidad y total */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Controles de cantidad */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(item.product.uid, item.quantity - 1)}
                  sx={{
                    backgroundColor: UI_CONFIG.theme.colors.secondary,
                    color: '#fff',
                    width: '28px',
                    height: '28px',
                    '&:hover': {
                      backgroundColor: '#0F0D15',
                    },
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontWeight: 600,
                    minWidth: '30px',
                    textAlign: 'center',
                    fontFamily: 'Nunito',
                  }}
                >
                  {item.quantity}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(item.product.uid, item.quantity + 1)}
                  sx={{
                    backgroundColor: UI_CONFIG.theme.colors.primary,
                    color: UI_CONFIG.theme.colors.secondary,
                    width: '28px',
                    height: '28px',
                    '&:hover': {
                      backgroundColor: '#5AD4CC',
                    },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Total del item */}
              <Typography
                variant="body1"
                sx={{
                  color: UI_CONFIG.theme.colors.primary,
                  fontWeight: 700,
                  fontFamily: 'Nunito',
                }}
              >
                ${(item.quantity * item.unitPrice).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ProductListImproved;