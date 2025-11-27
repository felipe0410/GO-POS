import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Aquí podrías enviar el error a un servicio de logging
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          p={3}
        >
          <Paper
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center',
              background: '#1F1D2B',
              border: '1px solid #69EAE2',
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, color: '#ff6b6b', mb: 2 }} />
            
            <Typography
              variant="h5"
              sx={{ color: '#fff', fontFamily: 'Nunito', fontWeight: 700, mb: 2 }}
            >
              ¡Oops! Algo salió mal
            </Typography>
            
            <Typography
              sx={{ color: '#fff', fontFamily: 'Nunito', mb: 3 }}
            >
              Ha ocurrido un error inesperado. Puedes intentar recargar la página o contactar soporte.
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: '#2C3248',
                  borderRadius: 1,
                  textAlign: 'left',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: '#ff6b6b', fontFamily: 'monospace' }}
                >
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={this.handleReset}
                sx={{ borderColor: '#69EAE2', color: '#69EAE2' }}
              >
                Intentar de nuevo
              </Button>
              
              <Button
                variant="contained"
                onClick={this.handleReload}
                startIcon={<Refresh />}
                sx={{ backgroundColor: '#69EAE2', color: '#1F1D2B' }}
              >
                Recargar página
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Hook para usar con componentes funcionales
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}