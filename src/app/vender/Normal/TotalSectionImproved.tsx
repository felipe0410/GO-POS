"use client";

import React from 'react';
import {
  Box,
  Typography,
  Divider,
} from '@mui/material';

// Configuración
import { UI_CONFIG } from '@/config/constants';

interface TotalSectionImprovedProps {
  subtotal: number;
  discount: number;
  total: number;
}

const TotalSectionImproved: React.FC<TotalSectionImprovedProps> = ({
  subtotal,
  discount,
  total,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      {/* Subtotal */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#ABBBC2',
            fontFamily: 'Nunito',
          }}
        >
          Subtotal:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#fff',
            fontFamily: 'Nunito',
            fontWeight: 600,
          }}
        >
          ${subtotal.toLocaleString()}
        </Typography>
      </Box>

      {/* Descuento (si existe) */}
      {discount > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#ABBBC2',
              fontFamily: 'Nunito',
            }}
          >
            Descuento:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: UI_CONFIG.theme.colors.error,
              fontFamily: 'Nunito',
              fontWeight: 600,
            }}
          >
            -${discount.toLocaleString()}
          </Typography>
        </Box>
      )}

      {/* Divider */}
      <Divider 
        sx={{ 
          my: 1.5, 
          borderColor: UI_CONFIG.theme.colors.background,
          borderWidth: '1px',
        }} 
      />

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          variant="h5"
          sx={{
            color: UI_CONFIG.theme.colors.primary,
            fontFamily: 'Nunito',
            fontWeight: 700,
          }}
        >
          ${total.toLocaleString()}
        </Typography>
      </Box>

      {/* Información adicional */}
      {discount > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: UI_CONFIG.theme.colors.success,
              fontFamily: 'Nunito',
              fontStyle: 'italic',
            }}
          >
            ¡Ahorro de ${discount.toLocaleString()}!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TotalSectionImproved;