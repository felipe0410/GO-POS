"use client";

import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Badge,
} from '@mui/material';

// Hooks
import { useCart } from '@/hooks/useCart';
import { useNotification } from '@/hooks/useNotification';

// Configuración
import { UI_CONFIG } from '@/config/constants';

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  '&:last-child': {
    paddingBottom: '5px',
  },
}));

interface VenderCardImprovedProps {
  filteredData: any[];
}

const VenderCardImproved: React.FC<VenderCardImprovedProps> = ({
  filteredData,
}) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { success, error: notifyError } = useNotification();

  const getItemQuantity = (barCode: string) => {
    const item = cart.find((item: any) => item.product.barCode === barCode);
    return item ? item.quantity : 0;
  };

  const handleIncrement = (product: any) => {
    try {
      // Verificar stock disponible
      const currentQuantity = getItemQuantity(product.barCode);
      const availableStock = parseInt(product.cantidad) || 0;
      
      if (currentQuantity >= availableStock) {
        notifyError(`Stock insuficiente. Disponible: ${availableStock}`);
        return;
      }

      const cleanedPrice = Number(product.price.replace(/[$,]/g, ''));
      const newQuantity = currentQuantity + 1;

      if (currentQuantity === 0) {
        // Agregar nuevo producto
        addToCart(product, 1, cleanedPrice);
      } else {
        // Actualizar cantidad existente
        updateQuantity(product.uid, newQuantity);
      }
    } catch (error) {
      notifyError('Error al agregar producto al carrito');
    }
  };

  const handleDecrement = (product: any) => {
    try {
      const currentQuantity = getItemQuantity(product.barCode);
      
      if (currentQuantity <= 0) return;

      if (currentQuantity === 1) {
        removeFromCart(product.uid);
      } else {
        updateQuantity(product.uid, currentQuantity - 1);
      }
    } catch (error) {
      notifyError('Error al actualizar producto en el carrito');
    }
  };

  return (
    <>
      {filteredData?.map((product: any) => {
        const currentQuantity = getItemQuantity(product.barCode);
        const availableStock = parseInt(product.cantidad) || 0;
        const isOutOfStock = availableStock === 0;
        const isMaxQuantity = currentQuantity >= availableStock;

        return (
          <Card
            key={product.uid}
            sx={{
              width: { xs: '130px', sm: '190px' },
              maxHeight: '17.52rem',
              borderRadius: '0.32rem',
              background: UI_CONFIG.theme.colors.background,
              overflow: 'visible',
              textAlign: '-webkit-center',
              marginTop: '50px',
              position: 'relative',
              '&:hover': {
                border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
              },
              ...(isOutOfStock && {
                opacity: 0.6,
                '&:hover': {
                  border: '1px solid #666',
                },
              }),
            }}
          >
            {/* Badge de cantidad en el carrito */}
            {currentQuantity > 0 && (
              <Badge
                badgeContent={currentQuantity}
                color="primary"
                sx={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  zIndex: 10,
                  '& .MuiBadge-badge': {
                    backgroundColor: UI_CONFIG.theme.colors.primary,
                    color: UI_CONFIG.theme.colors.secondary,
                    fontWeight: 700,
                    fontSize: '12px',
                    minWidth: '20px',
                    height: '20px',
                  },
                }}
              />
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                zIndex: 4,
              }}
            >
              {/* Botón decrementar */}
              <Button
                sx={{ 
                  padding: 0, 
                  minWidth: 0, 
                  minHeight: 0,
                  opacity: currentQuantity > 0 ? 1 : 0.3,
                }}
                onClick={() => handleDecrement(product)}
                disabled={currentQuantity === 0}
              >
                <Box
                  component="img"
                  src="/images/minus.svg"
                  sx={{
                    width: '30px',
                    filter: currentQuantity > 0 ? 'none' : 'grayscale(100%)',
                  }}
                />
              </Button>

              {/* Imagen del producto */}
              <Box
                sx={{
                  position: 'relative',
                  width: '60%',
                  height: { xs: '70px', sm: '120px' },
                  top: { xs: '-10px', sm: '-30px' },
                }}
              >
                <Box
                  component="img"
                  src={
                    ['', null].includes(product.image)
                      ? 'images/noImage.svg'
                      : product.image
                  }
                  alt={`imagen del producto ${product.productName}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: isOutOfStock
                      ? 'grayscale(100%) brightness(0.5)'
                      : 'none',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: isOutOfStock ? 'none' : 'scale(1.7)',
                    },
                  }}
                  loading="lazy"
                />

                {/* Overlay de producto agotado */}
                {isOutOfStock && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      padding: '5px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    Producto agotado
                  </Box>
                )}

                {/* Overlay de stock máximo */}
                {!isOutOfStock && isMaxQuantity && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      color: UI_CONFIG.theme.colors.warning,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      padding: '5px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 212, 59, 0.1)',
                    }}
                  >
                    Stock máximo
                  </Box>
                )}
              </Box>

              {/* Botón incrementar */}
              <Button
                sx={{ 
                  padding: 0, 
                  minWidth: 0, 
                  minHeight: 0,
                  opacity: isOutOfStock || isMaxQuantity ? 0.3 : 1,
                }}
                onClick={() => handleIncrement(product)}
                disabled={isOutOfStock || isMaxQuantity}
              >
                <Box
                  component="img"
                  src="/images/plus.svg"
                  sx={{
                    width: '30px',
                    filter: (isOutOfStock || isMaxQuantity) ? 'grayscale(100%)' : 'none',
                  }}
                />
              </Button>
            </Box>

            <StyledCardContent
              sx={{
                marginTop: { xs: '-10px', sm: '-35px' },
                padding: '5px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Nombre del producto */}
              <Typography
                sx={{
                  color: UI_CONFIG.theme.colors.primary,
                  textAlign: 'center',
                  fontFamily: 'Nunito',
                  fontSize: { xs: '10px', sm: '14px' },
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '130%',
                }}
              >
                {product.productName}
              </Typography>

              {/* Código de barras */}
              <Typography
                sx={{
                  marginTop: '1px',
                  color: 'var(--text-light, #ABBBC2)',
                  textAlign: 'center',
                  fontFamily: 'Nunito',
                  fontSize: '13px',
                  fontStyle: 'normal',
                  fontWeight: 200,
                  lineHeight: '140%',
                }}
              >
                {product.barCode}
              </Typography>

              {/* Precio */}
              <Typography
                sx={{
                  marginTop: '2px',
                  color: 'var(--White, #FFF)',
                  textAlign: 'center',
                  fontFamily: 'Nunito',
                  fontSize: { xs: '10px', sm: '14px' },
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '140%',
                }}
              >
                {product.price}
              </Typography>

              {/* Existencias */}
              <Typography
                sx={{
                  marginTop: '1px',
                  color: 'var(--text-light, #ABBBC2)',
                  textAlign: 'center',
                  fontFamily: 'Nunito',
                  fontSize: { xs: '10px', sm: '14px' },
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%',
                }}
              >
                Existencias:{' '}
                <span 
                  style={{ 
                    fontWeight: '700', 
                    color: availableStock > 0 ? '#fff' : UI_CONFIG.theme.colors.error 
                  }}
                >
                  {availableStock}
                </span>
              </Typography>

              {/* Categoría */}
              <Typography
                sx={{
                  color: '#ABBBC2',
                  textAlign: 'center',
                  fontFamily: 'Nunito',
                  fontSize: { xs: '10px', sm: '14px' },
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%',
                }}
              >
                {product.category}
              </Typography>

              {/* Indicador de cantidad en carrito */}
              {currentQuantity > 0 && (
                <Box
                  sx={{
                    mt: 1,
                    px: 1,
                    py: 0.5,
                    backgroundColor: UI_CONFIG.theme.colors.primary,
                    color: UI_CONFIG.theme.colors.secondary,
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'Nunito',
                  }}
                >
                  En carrito: {currentQuantity}
                </Box>
              )}
            </StyledCardContent>
          </Card>
        );
      })}
    </>
  );
};

export default VenderCardImproved;