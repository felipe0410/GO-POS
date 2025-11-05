import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  PlayArrow as OpenIcon,
  Stop as CloseIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  AutoMode as AutoIcon,
} from '@mui/icons-material';

// Components
import { LoadingButton } from './LoadingStates/LoadingButton';
import CashSessionConfigComponent from './CashSessionConfig';

// Hooks
import { useCashSession } from '@/hooks/useCashSession';

// Configuración
import { UI_CONFIG } from '@/config/constants';

interface CashSessionManagerProps {
  invoices: any[];
  onSessionChange?: (session: any) => void;
}

const CashSessionManager: React.FC<CashSessionManagerProps> = ({
  invoices,
  onSessionChange,
}) => {
  // Estados locales
  const [openDialog, setOpenDialog] = useState<'open' | 'close' | 'config' | null>(null);
  const [montoInicial, setMontoInicial] = useState('');
  const [montoFinal, setMontoFinal] = useState('');
  const [notas, setNotas] = useState('');
  const [forzarCierre, setForzarCierre] = useState(false);

  // Hook de sesión de caja
  const {
    currentSession,
    sessionSummary,
    config,
    loading,
    loadingOpen,
    loadingClose,
    openSession,
    closeSession,
    autoCloseSession,
    updateConfig,
    canClose,
    shouldAlert,
    nextAlert,
    timeUntilAutoClose,
    validateClosure,
    refreshData,
  } = useCashSession(invoices);

  // Manejar apertura de sesión
  const handleOpenSession = async () => {
    if (!montoInicial || parseFloat(montoInicial) <= 0) {
      return;
    }

    const success = await openSession(montoInicial, notas);
    if (success) {
      setOpenDialog(null);
      setMontoInicial('');
      setNotas('');
      onSessionChange?.(currentSession);
    }
  };

  // Manejar cierre de sesión
  const handleCloseSession = async () => {
    if (!montoFinal || parseFloat(montoFinal) <= 0) {
      return;
    }

    const success = await closeSession(montoFinal, notas, forzarCierre);
    if (success) {
      setOpenDialog(null);
      setMontoFinal('');
      setNotas('');
      setForzarCierre(false);
      onSessionChange?.(null);
    }
  };

  // Manejar cierre automático
  const handleAutoClose = async () => {
    const success = await autoCloseSession();
    if (success) {
      onSessionChange?.(null);
    }
  };

  // Formatear tiempo
  const formatTime = (hours: number | null): string => {
    if (hours === null) return 'N/A';
    
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }
    
    return `${hours.toFixed(1)} h`;
  };

  // Formatear moneda
  const formatCurrency = (amount: number): string => {
    return `$ ${amount.toLocaleString('es-CO')}`;
  };

  // Estilos para las cards
  const cardStyles = {
    background: UI_CONFIG.theme.colors.secondary,
    borderRadius: '10px',
    border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
    boxShadow: `0px 4px 20px rgba(105, 234, 226, 0.1)`,
  };

  // Validación para cierre
  const closureValidation = montoFinal ? validateClosure(parseFloat(montoFinal) || 0) : null;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Estado actual de la sesión */}
      <Card sx={cardStyles}>
        <CardContent sx={{ color: '#fff', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Nunito', fontWeight: 700 }}>
              {currentSession && !currentSession.cajaCerrada ? '🟢 Sesión Activa' : '🔴 Sin Sesión Activa'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => setOpenDialog('config')}
                sx={{
                  borderColor: UI_CONFIG.theme.colors.primary,
                  color: UI_CONFIG.theme.colors.primary,
                  '&:hover': {
                    borderColor: '#5AD4CC',
                    backgroundColor: 'rgba(105, 234, 226, 0.1)',
                  },
                }}
              >
                Configurar
              </Button>
              
              {currentSession && !currentSession.cajaCerrada ? (
                <LoadingButton
                  variant="contained"
                  disabled
                  startIcon={<CloseIcon />}
                  onClick={() => setOpenDialog('close')}
                  loading={loadingClose}
                  sx={{
                    backgroundColor: UI_CONFIG.theme.colors.error,
                    '&:hover': {
                      backgroundColor: '#e55555',
                    },
                  }}
                >
                  Cerrar Caja
                </LoadingButton>
              ) : (
                <LoadingButton
                  variant="contained"
                  startIcon={<OpenIcon />}
                  onClick={() => setOpenDialog('open')}
                  loading={loadingOpen}
                  sx={{
                    backgroundColor: UI_CONFIG.theme.colors.success,
                    '&:hover': {
                      backgroundColor: '#45b049',
                    },
                  }}
                >
                  Abrir Caja
                </LoadingButton>
              )}
            </Box>
          </Box>

          {/* Información de la sesión actual */}
          {currentSession && !currentSession.cajaCerrada && sessionSummary && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ color: '#ABBBC2' }}>Monto Inicial:</Typography>
                <Typography variant="h6" sx={{ color: UI_CONFIG.theme.colors.primary, fontWeight: 600 }}>
                  {formatCurrency(sessionSummary.montoInicial)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ color: '#ABBBC2' }}>Producido:</Typography>
                <Typography variant="h6" sx={{ color: UI_CONFIG.theme.colors.success, fontWeight: 600 }}>
                  {formatCurrency(sessionSummary.totalCash + sessionSummary.totalTransfer)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ color: '#ABBBC2' }}>Duración:</Typography>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  {formatTime(sessionSummary.duracionSesion ?? null)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ color: '#ABBBC2' }}>Facturas:</Typography>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  {sessionSummary.salesCount}
                </Typography>
              </Grid>
            </Grid>
          )}

          {/* Alertas y estado */}
          {currentSession && !currentSession.cajaCerrada && sessionSummary && (
            <Box sx={{ mt: 2 }}>
              {/* Alertas */}
              {sessionSummary.alertas.length > 0 && (
                <Alert severity="warning" sx={{ mb: 1, backgroundColor: 'rgba(255, 212, 59, 0.1)' }}>
                  <Typography variant="body2">
                    <strong>Alertas:</strong>
                  </Typography>
                  {sessionSummary.alertas.map((alerta, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 1 }}>
                      • {alerta}
                    </Typography>
                  ))}
                </Alert>
              )}

              {/* Información de cierre automático */}
              {config.cierreAutomaticoHabilitado && timeUntilAutoClose !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Chip
                    icon={<ScheduleIcon />}
                    label={`Cierre automático en: ${formatTime(timeUntilAutoClose)}`}
                    color={timeUntilAutoClose < 1 ? 'warning' : 'info'}
                    variant="outlined"
                  />
                  
                  {sessionSummary.puedeAutoCerrar && (
                    <LoadingButton
                      size="small"
                      variant="outlined"
                      startIcon={<AutoIcon />}
                      onClick={handleAutoClose}
                      sx={{
                        borderColor: UI_CONFIG.theme.colors.warning,
                        color: UI_CONFIG.theme.colors.warning,
                      }}
                    >
                      Cerrar Ahora
                    </LoadingButton>
                  )}
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para abrir sesión */}
      <Dialog 
        open={openDialog === 'open'} 
        onClose={() => setOpenDialog(null)}
        PaperProps={{
          sx: {
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            color: '#fff',
            border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
          },
        }}
      >
        <DialogTitle>🟢 Abrir Sesión de Caja</DialogTitle>
        <DialogContent>
          <TextField
            label="Monto Inicial"
            type="number"
            value={montoInicial}
            onChange={(e) => setMontoInicial(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              style: { color: '#fff' },
              startAdornment: <Typography sx={{ color: '#ABBBC2', mr: 1 }}>$</Typography>,
            }}
            InputLabelProps={{
              style: { color: '#ABBBC2' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: UI_CONFIG.theme.colors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: UI_CONFIG.theme.colors.primary,
                },
              },
            }}
          />
          
          <TextField
            label="Notas de Apertura"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            InputProps={{
              style: { color: '#fff' },
            }}
            InputLabelProps={{
              style: { color: '#ABBBC2' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: UI_CONFIG.theme.colors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: UI_CONFIG.theme.colors.primary,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)} sx={{ color: '#ABBBC2' }}>
            Cancelar
          </Button>
          <LoadingButton
            onClick={handleOpenSession}
            loading={loadingOpen}
            disabled={!montoInicial || parseFloat(montoInicial) <= 0}
            sx={{
              backgroundColor: UI_CONFIG.theme.colors.success,
              color: '#fff',
              '&:hover': {
                backgroundColor: '#45b049',
              },
            }}
          >
            Abrir Caja
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Dialog para cerrar sesión */}
      <Dialog 
        open={openDialog === 'close'} 
        onClose={() => setOpenDialog(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            color: '#fff',
            border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
          },
        }}
      >
        <DialogTitle>🔴 Cerrar Sesión de Caja</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Monto Final en Caja"
                type="number"
                value={montoFinal}
                onChange={(e) => setMontoFinal(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                  style: { color: '#fff' },
                  startAdornment: <Typography sx={{ color: '#ABBBC2', mr: 1 }}>$</Typography>,
                }}
                InputLabelProps={{
                  style: { color: '#ABBBC2' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: UI_CONFIG.theme.colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: UI_CONFIG.theme.colors.primary,
                    },
                  },
                }}
              />
              
              <TextField
                label="Notas de Cierre"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                InputProps={{
                  style: { color: '#fff' },
                }}
                InputLabelProps={{
                  style: { color: '#ABBBC2' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: UI_CONFIG.theme.colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: UI_CONFIG.theme.colors.primary,
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              {sessionSummary && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: UI_CONFIG.theme.colors.primary, mb: 1 }}>
                    Resumen de la Sesión:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary={`Monto Inicial: ${formatCurrency(sessionSummary.montoInicial)}`}
                        sx={{ color: '#fff' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={`Ventas en Efectivo: ${formatCurrency(sessionSummary.totalCash)}`}
                        sx={{ color: '#fff' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={`Esperado en Caja: ${formatCurrency(sessionSummary.montoInicial + sessionSummary.totalCash)}`}
                        sx={{ color: UI_CONFIG.theme.colors.success }}
                      />
                    </ListItem>
                  </List>
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Validaciones de cierre */}
          {closureValidation && (
            <Box sx={{ mt: 2 }}>
              {closureValidation.errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  <Typography variant="body2"><strong>Errores:</strong></Typography>
                  {closureValidation.errors.map((error, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 1 }}>
                      • {error}
                    </Typography>
                  ))}
                </Alert>
              )}
              
              {closureValidation.warnings.length > 0 && (
                <Alert severity="warning" sx={{ mb: 1 }}>
                  <Typography variant="body2"><strong>Advertencias:</strong></Typography>
                  {closureValidation.warnings.map((warning, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 1 }}>
                      • {warning}
                    </Typography>
                  ))}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)} sx={{ color: '#ABBBC2' }}>
            Cancelar
          </Button>
          
          {closureValidation && !closureValidation.canClose && (
            <Button
              onClick={() => setForzarCierre(!forzarCierre)}
              sx={{ color: UI_CONFIG.theme.colors.warning }}
            >
              {forzarCierre ? 'Cancelar Forzado' : 'Forzar Cierre'}
            </Button>
          )}
          
          <LoadingButton
            onClick={handleCloseSession}
            loading={loadingClose}
            disabled={!montoFinal || parseFloat(montoFinal) <= 0 || (!closureValidation?.canClose && !forzarCierre)}
            sx={{
              backgroundColor: UI_CONFIG.theme.colors.error,
              color: '#fff',
              '&:hover': {
                backgroundColor: '#e55555',
              },
            }}
          >
            {forzarCierre ? 'Forzar Cierre' : 'Cerrar Caja'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Dialog de configuración */}
      <Dialog 
        open={openDialog === 'config'} 
        onClose={() => setOpenDialog(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            color: '#fff',
            border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
          },
        }}
      >
        <DialogTitle>⚙️ Configuración de Cierres de Caja</DialogTitle>
        <DialogContent>
          <CashSessionConfigComponent
            config={config}
            onConfigChange={updateConfig}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)} sx={{ color: '#ABBBC2' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CashSessionManager;