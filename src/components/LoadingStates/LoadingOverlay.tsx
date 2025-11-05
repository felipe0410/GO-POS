import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  backdrop?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  message = 'Cargando...',
  backdrop = true,
}) => {
  if (!loading) return null;

  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{
        position: backdrop ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: backdrop ? 9999 : 1,
        backgroundColor: backdrop ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
      }}
    >
      <CircularProgress size={40} sx={{ color: '#69EAE2' }} />
      <Typography sx={{ color: '#fff', fontFamily: 'Nunito', fontWeight: 600 }}>
        {message}
      </Typography>
    </Box>
  );

  return backdrop ? (
    <Backdrop open={loading} sx={{ zIndex: 9999 }}>
      {content}
    </Backdrop>
  ) : content;
};