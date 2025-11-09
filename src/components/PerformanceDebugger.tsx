"use client";
import { useState, useEffect } from 'react';
import { Box, Button, Typography, Switch, FormControlLabel, Paper } from '@mui/material';
import { performanceLogger } from '@/utils/performanceLogger';

/**
 * Componente de debug para habilitar/deshabilitar logs de performance
 * Solo visible en desarrollo o cuando se activa manualmente
 */
export function PerformanceDebugger() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Verificar si está habilitado en localStorage
    const isEnabled = localStorage.getItem('enablePerformanceLog') === 'true';
    setEnabled(isEnabled);
    
    // Mostrar solo en desarrollo o si está habilitado
    const isDev = process.env.NODE_ENV === 'development';
    setVisible(isDev || isEnabled);
  }, []);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    performanceLogger.setEnabled(newValue);
    
    if (newValue) {
      console.log('✅ Performance logging habilitado');
      console.log('📊 Los logs aparecerán en la consola durante las operaciones');
    } else {
      console.log('❌ Performance logging deshabilitado');
    }
  };

  if (!visible) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        padding: 2,
        zIndex: 9999,
        background: '#1F1D2B',
        border: '2px solid #69EAE2',
        borderRadius: '0.5rem',
        minWidth: 250,
      }}
    >
      <Typography
        sx={{
          color: '#69EAE2',
          fontFamily: 'Nunito',
          fontSize: '0.875rem',
          fontWeight: 700,
          marginBottom: 1,
        }}
      >
        🔍 Performance Debugger
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={handleToggle}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#69EAE2',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#69EAE2',
              },
            }}
          />
        }
        label={
          <Typography sx={{ color: '#FFF', fontSize: '0.875rem' }}>
            {enabled ? 'Logs Activos' : 'Logs Inactivos'}
          </Typography>
        }
      />

      <Box sx={{ marginTop: 1 }}>
        <Typography
          sx={{
            color: '#ABBBC2',
            fontSize: '0.75rem',
            fontStyle: 'italic',
          }}
        >
          {enabled 
            ? 'Abre la consola para ver los logs de performance'
            : 'Activa para medir tiempos de operaciones'
          }
        </Typography>
      </Box>

      <Button
        onClick={() => {
          console.clear();
          console.log('🧹 Consola limpiada');
        }}
        sx={{
          marginTop: 1,
          width: '100%',
          background: '#2C3248',
          color: '#69EAE2',
          fontSize: '0.75rem',
          '&:hover': {
            background: '#3C4258',
          },
        }}
      >
        Limpiar Consola
      </Button>
    </Paper>
  );
}
