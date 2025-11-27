"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Collapse,
  InputAdornment,
} from '@mui/material';
import DiscountIcon from '@mui/icons-material/Discount';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

// Hooks
import { useNotification } from '@/hooks/useNotification';

// Configuración
import { UI_CONFIG } from '@/config/constants';

interface DiscountSectionImprovedProps {
  subtotal: number;
  discount: number;
  onApplyDiscount: (discountValue: string) => void;
}

const DiscountSectionImproved: React.FC<DiscountSectionImprovedProps> = ({
  subtotal,
  discount,
  onApplyDiscount,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const { error: notifyError } = useNotification();

  const handleApplyDiscount = () => {
    if (!discountInput.trim()) {
      notifyError('Ingresa un valor de descuento');
      return;
    }

    // Validar formato
    const value = discountInput.trim();
    const isPercentage = value.includes('%');
    const numericValue = parseFloat(value.replace('%', ''));

    if (isNaN(numericValue) || numericValue < 0) {
      notifyError('Ingresa un valor de descuento válido');
      return;
    }

    if (isPercentage && numericValue > 100) {
      notifyError('El porcentaje no puede ser mayor a 100%');
      return;
    }

    if (!isPercentage && numericValue > subtotal) {
      notifyError('El descuento no puede ser mayor al subtotal');
      return;
    }

    onApplyDiscount(discountInput);
    setDiscountInput('');
    setExpanded(false);
  };

  const handleClearDiscount = () => {
    onApplyDiscount('0');
    setDiscountInput('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleApplyDiscount();
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Header del descuento */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          p: 1,
          borderRadius: '8px',
          backgroundColor: discount > 0 ? 'rgba(105, 234, 226, 0.1)' : 'transparent',
          '&:hover': {
            backgroundColor: discount > 0 ? 'rgba(105, 234, 226, 0.15)' : 'rgba(105, 234, 226, 0.05)',
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DiscountIcon
            sx={{
              color: discount > 0 ? UI_CONFIG.theme.colors.primary : '#ABBBC2',
              fontSize: '20px',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: discount > 0 ? UI_CONFIG.theme.colors.primary : '#ABBBC2',
              fontFamily: 'Nunito',
              fontWeight: discount > 0 ? 600 : 400,
            }}
          >
            {discount > 0 ? `Descuento aplicado: $${discount.toLocaleString()}` : 'Aplicar descuento'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {discount > 0 && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClearDiscount();
              }}
              sx={{
                color: UI_CONFIG.theme.colors.error,
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
          
          <IconButton
            size="small"
            sx={{
              color: '#ABBBC2',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Formulario de descuento */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 2, p: 2, backgroundColor: UI_CONFIG.theme.colors.background, borderRadius: '8px' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#ABBBC2',
              fontFamily: 'Nunito',
              display: 'block',
              mb: 1,
            }}
          >
            Ingresa el descuento en pesos o porcentaje (ej: 5000 o 10%)
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ej: 5000 o 10%"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DiscountIcon sx={{ color: '#ABBBC2', fontSize: '18px' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: '#fff',
                  backgroundColor: UI_CONFIG.theme.colors.secondary,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ABBBC2',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: UI_CONFIG.theme.colors.primary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: UI_CONFIG.theme.colors.primary,
                  },
                },
              }}
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  color: '#ABBBC2',
                  opacity: 1,
                },
              }}
            />

            <IconButton
              onClick={handleApplyDiscount}
              disabled={!discountInput.trim()}
              sx={{
                backgroundColor: UI_CONFIG.theme.colors.primary,
                color: UI_CONFIG.theme.colors.secondary,
                width: '40px',
                height: '40px',
                '&:hover': {
                  backgroundColor: '#5AD4CC',
                },
                '&:disabled': {
                  backgroundColor: UI_CONFIG.theme.colors.background,
                  color: '#ABBBC2',
                },
              }}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Ejemplos de descuento */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#ABBBC2',
                fontFamily: 'Nunito',
                display: 'block',
                mb: 1,
              }}
            >
              Descuentos rápidos:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['5%', '10%', '15%', '20%'].map((percentage) => (
                <Box
                  key={percentage}
                  onClick={() => {
                    setDiscountInput(percentage);
                    onApplyDiscount(percentage);
                    setExpanded(false);
                  }}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: UI_CONFIG.theme.colors.secondary,
                    color: UI_CONFIG.theme.colors.primary,
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontFamily: 'Nunito',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
                    '&:hover': {
                      backgroundColor: UI_CONFIG.theme.colors.primary,
                      color: UI_CONFIG.theme.colors.secondary,
                    },
                  }}
                >
                  {percentage}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DiscountSectionImproved;