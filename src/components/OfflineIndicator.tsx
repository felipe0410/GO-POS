"use client";

import React from 'react';
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Sync as SyncIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

// Hooks
import { useOfflineSales } from '@/hooks/useOfflineSales';
import { useConnectivity } from '@/hooks/useConnectivity';
import { LoadingButton } from './LoadingStates/LoadingButton';

// Configuración
import { UI_CONFIG } from '@/config/constants';

const OfflineIndicator: React.FC = () => {
  const { 
    syncStats, 
    syncPendingSales, 
    loading: syncLoading,
  } = useOfflineSales();
  
  const {
    isOnline,
    status,
    checkConnectivity,
    getDiagnostics,
    loading: connectivityLoading
  } = useConnectivity();
  
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [diagnostics, setDiagnostics] = React.useState<any>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSyncClick = () => {
    syncPendingSales();
    handleClose();
  };

  const handleConnectivityCheck = async () => {
    try {
      const [connectivityResult, diagnosticsResult] = await Promise.all([
        checkConnectivity(true), // Con notificaciones
        getDiagnostics()
      ]);
      
      setDiagnostics(diagnosticsResult);
    } catch (error) {
      console.error('Error en verificación manual:', error);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'offline-popover' : undefined;

  // Determinar el estado y color
  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        color: 'warning' as const,
        icon: <WifiOffIcon />,
        label: 'Offline',
        description: 'Sin conexión a internet',
      };
    }

    if (syncStats.pendingSales > 0) {
      return {
        color: 'info' as const,
        icon: <ScheduleIcon />,
        label: `${syncStats.pendingSales} pendientes`,
        description: 'Ventas esperando sincronización',
      };
    }

    if (syncStats.failedSales > 0) {
      return {
        color: 'error' as const,
        icon: <WarningIcon />,
        label: `${syncStats.failedSales} fallidas`,
        description: 'Ventas con errores de sincronización',
      };
    }

    // Mostrar información detallada de conectividad
    const connectionDetails = [];
    if (status.firebaseAccessible) connectionDetails.push('Firebase');
    if (status.generalConnectivity) connectionDetails.push('Internet');
    if (status.latency) connectionDetails.push(`${status.latency}ms`);

    return {
      color: 'success' as const,
      icon: <WifiIcon />,
      label: 'Online',
      description: connectionDetails.length > 0 
        ? `Conectado (${connectionDetails.join(', ')})` 
        : 'Conectado y sincronizado',
    };
  };

  const statusInfo = getStatusInfo();
  const hasPendingOrFailed = syncStats.pendingSales > 0 || syncStats.failedSales > 0;

  return (
    <>
      <Tooltip title={statusInfo.description}>
        <IconButton
          onClick={handleClick}
          sx={{
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Badge
            badgeContent={hasPendingOrFailed ? syncStats.pendingSales + syncStats.failedSales : 0}
            color={statusInfo.color}
            max={99}
          >
            {statusInfo.icon}
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            color: '#fff',
            border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
            borderRadius: '8px',
            minWidth: '300px',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ color: UI_CONFIG.theme.colors.primary, mr: 1 }}>
              {statusInfo.icon}
            </Box>
            <Typography variant="h6" sx={{ fontFamily: 'Nunito', fontWeight: 700 }}>
              Estado de Conexión
            </Typography>
          </Box>

          {/* Estado actual */}
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={statusInfo.icon}
              label={statusInfo.label}
              color={statusInfo.color}
              variant="outlined"
              sx={{
                color: '#fff',
                borderColor: UI_CONFIG.theme.colors.primary,
                '& .MuiChip-icon': {
                  color: UI_CONFIG.theme.colors.primary,
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: '#ABBBC2',
                fontFamily: 'Nunito',
                mt: 1,
              }}
            >
              {statusInfo.description}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: UI_CONFIG.theme.colors.background, mb: 2 }} />

          {/* Estadísticas */}
          <List dense sx={{ py: 0 }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                      Ventas pendientes:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                      {syncStats.pendingSales}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                      Ventas sincronizadas:
                    </Typography>
                    <Typography variant="body2" sx={{ color: UI_CONFIG.theme.colors.success, fontWeight: 600 }}>
                      {syncStats.syncedSales}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            {syncStats.failedSales > 0 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                        Ventas fallidas:
                      </Typography>
                      <Typography variant="body2" sx={{ color: UI_CONFIG.theme.colors.error, fontWeight: 600 }}>
                        {syncStats.failedSales}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            )}

            {syncStats.lastSync && (
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#ABBBC2' }}>
                        Última sincronización:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                        {new Date(syncStats.lastSync).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            )}

            {/* Información de conectividad detallada */}
            {diagnostics && (
              <>
                <Divider sx={{ borderColor: UI_CONFIG.theme.colors.background, my: 1 }} />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                        Diagnóstico de Conectividad:
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="caption" sx={{ color: diagnostics.navigator ? UI_CONFIG.theme.colors.success : UI_CONFIG.theme.colors.error }}>
                          • Navegador: {diagnostics.navigator ? 'Online' : 'Offline'}
                        </Typography>
                        <br />
                        <Typography variant="caption" sx={{ color: diagnostics.general ? UI_CONFIG.theme.colors.success : UI_CONFIG.theme.colors.error }}>
                          • Internet: {diagnostics.general ? 'Accesible' : 'No accesible'}
                        </Typography>
                        <br />
                        <Typography variant="caption" sx={{ color: diagnostics.firebase ? UI_CONFIG.theme.colors.success : UI_CONFIG.theme.colors.error }}>
                          • Firebase: {diagnostics.firebase ? 'Accesible' : 'No accesible'}
                        </Typography>
                        {diagnostics.latency && (
                          <>
                            <br />
                            <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                              • Latencia: {diagnostics.latency}ms
                            </Typography>
                          </>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </>
            )}
          </List>

          {/* Acciones */}
          <Divider sx={{ borderColor: UI_CONFIG.theme.colors.background, my: 2 }} />
          
          {/* Botón de verificar conectividad */}
          <LoadingButton
            fullWidth
            variant="outlined"
            onClick={handleConnectivityCheck}
            loading={connectivityLoading}
            loadingText="Verificando..."
            startIcon={<WifiIcon />}
            sx={{
              borderColor: UI_CONFIG.theme.colors.primary,
              color: UI_CONFIG.theme.colors.primary,
              fontWeight: 600,
              mb: 1,
              '&:hover': {
                borderColor: '#5AD4CC',
                backgroundColor: 'rgba(105, 234, 226, 0.1)',
              },
            }}
          >
            Verificar Conexión
          </LoadingButton>

          {/* Botón de sincronizar */}
          {(syncStats.pendingSales > 0 || syncStats.failedSales > 0) && (
            <LoadingButton
              fullWidth
              variant="contained"
              onClick={handleSyncClick}
              loading={syncLoading}
              loadingText="Sincronizando..."
              disabled={!isOnline}
              startIcon={<SyncIcon />}
              sx={{
                backgroundColor: UI_CONFIG.theme.colors.primary,
                color: UI_CONFIG.theme.colors.secondary,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#5AD4CC',
                },
                '&:disabled': {
                  backgroundColor: UI_CONFIG.theme.colors.background,
                  color: '#ABBBC2',
                },
              }}
            >
              {!isOnline ? 'Sin conexión' : 'Sincronizar Ahora'}
            </LoadingButton>
          )}

          {/* Información adicional */}
          {!isOnline && (
            <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'rgba(255, 193, 7, 0.1)', borderRadius: '4px' }}>
              <Typography
                variant="caption"
                sx={{
                  color: UI_CONFIG.theme.colors.warning,
                  fontFamily: 'Nunito',
                  display: 'block',
                  textAlign: 'center',
                }}
              >
                ⚠️ Modo Offline Activo
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#ABBBC2',
                  fontFamily: 'Nunito',
                  display: 'block',
                  textAlign: 'center',
                  mt: 0.5,
                }}
              >
                Las ventas se guardarán localmente y se sincronizarán cuando regrese la conexión
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default OfflineIndicator;