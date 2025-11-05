"use client";

import React from 'react';
import { Box, Divider, Typography } from '@mui/material';

// Componentes
import OfflineIndicator from './OfflineIndicator';

// Configuración
import { UI_CONFIG } from '@/config/constants';

interface HeaderImprovedProps {
  title: string;
  txt?: any;
  showOfflineIndicator?: boolean;
}

const HeaderImproved: React.FC<HeaderImprovedProps> = ({ 
  title, 
  txt, 
  showOfflineIndicator = true 
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            color: UI_CONFIG.theme.colors.primary,
            fontFamily: 'Nunito',
            fontSize: { xs: '24px', sm: '40px' },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
          }}
        >
          <Box display="flex" alignItems="center">
            {title}
            {txt && <Box>{txt}</Box>}
          </Box>
        </Typography>

        {/* Indicadores del lado derecho */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {showOfflineIndicator && <OfflineIndicator />}
        </Box>
      </Box>
      
      <Divider 
        sx={{ 
          background: UI_CONFIG.theme.colors.primary, 
          width: '95%' 
        }} 
      />
    </Box>
  );
};

export default HeaderImproved;