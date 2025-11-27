import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
  Divider,
  Button,
  Grid,
  Alert,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Save as SaveIcon,
  RestoreFromTrash as RestoreIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

// Hooks
import { CashSessionConfig } from '@/services/cashSessionService';
import { LoadingButton } from './LoadingStates/LoadingButton';

// Configuración
import { UI_CONFIG } from '@/config/constants';

interface CashSessionConfigProps {
  config: CashSessionConfig;
  onConfigChange: (config: Partial<CashSessionConfig>) => void;
  onSave?: () => Promise<void>;
  loading?: boolean;
}

const CashSessionConfigComponent: React.FC<CashSessionConfigProps> = ({
  config,
  onConfigChange,
  onSave,
  loading = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tempConfig, setTempConfig] = useState<CashSessionConfig>(config);

  const handleChange = (field: keyof CashSessionConfig, value: any) => {
    const newConfig = { ...tempConfig, [field]: value };
    setTempConfig(newConfig);
    onConfigChange({ [field]: value });
  };

  const handleArrayChange = (field: keyof CashSessionConfig, value: string, isAdd: boolean) => {
    const currentArray = (tempConfig[field] as any[]) || [];
    let newArray;
    
    if (isAdd) {
      newArray = [...currentArray, parseFloat(value)];
    } else {
      newArray = currentArray.filter(item => item !== parseFloat(value));
    }
    
    handleChange(field, newArray);
  };

  const handleDaysChange = (day: number, checked: boolean) => {
    const currentDays = tempConfig.diasCierreProgramado || [];
    let newDays;
    
    if (checked) {
      newDays = [...currentDays, day].sort();
    } else {
      newDays = currentDays.filter(d => d !== day);
    }
    
    handleChange('diasCierreProgramado', newDays);
  };

  const resetToDefaults = () => {
    const defaultConfig = {
      cierreAutomaticoHabilitado: true,
      horasCierreAutomatico: 24,
      alertasHabilitadas: true,
      horasAlerta: [2, 1, 0.5],
      cierreProgramadoHabilitado: false,
      horaCierreProgramado: "23:59",
      diasCierreProgramado: [1, 2, 3, 4, 5],
      validarMontoMinimo: false,
      montoMinimoFinal: 0,
      validarFacturasPendientes: true,
      permitirCierreConPendientes: true,
    };
    
    setTempConfig(defaultConfig);
    onConfigChange(defaultConfig);
  };

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const cardStyles = {
    background: UI_CONFIG.theme.colors.secondary,
    borderRadius: '10px',
    border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
    boxShadow: `0px 4px 20px rgba(105, 234, 226, 0.1)`,
  };

  return (
    <Card sx={cardStyles}>
      <CardContent sx={{ color: '#fff', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon sx={{ color: UI_CONFIG.theme.colors.primary }} />
            <Typography variant="h6" sx={{ fontFamily: 'Nunito', fontWeight: 700 }}>
              Configuración de Cierres de Caja
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Restablecer valores por defecto">
              <IconButton onClick={resetToDefaults} sx={{ color: '#ABBBC2' }}>
                <RestoreIcon />
              </IconButton>
            </Tooltip>
            
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{ color: UI_CONFIG.theme.colors.primary }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Configuración básica (siempre visible) */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempConfig.cierreAutomaticoHabilitado}
                  onChange={(e) => handleChange('cierreAutomaticoHabilitado', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: UI_CONFIG.theme.colors.primary,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: UI_CONFIG.theme.colors.primary,
                    },
                  }}
                />
              }
              label="Cierre Automático Habilitado"
              sx={{ color: '#fff' }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Horas para Cierre Automático"
              type="number"
              value={tempConfig.horasCierreAutomatico}
              onChange={(e) => handleChange('horasCierreAutomatico', parseInt(e.target.value) || 24)}
              disabled={!tempConfig.cierreAutomaticoHabilitado}
              fullWidth
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
        </Grid>

        {/* Configuración avanzada (expandible) */}
        <Collapse in={expanded}>
          <Divider sx={{ borderColor: UI_CONFIG.theme.colors.background, my: 2 }} />
          
          {/* Alertas */}
          <Typography variant="subtitle1" sx={{ color: UI_CONFIG.theme.colors.primary, mb: 2, fontWeight: 600 }}>
            ⚠️ Configuración de Alertas
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tempConfig.alertasHabilitadas}
                    onChange={(e) => handleChange('alertasHabilitadas', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: UI_CONFIG.theme.colors.primary,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: UI_CONFIG.theme.colors.primary,
                      },
                    }}
                  />
                }
                label="Alertas Habilitadas"
                sx={{ color: '#fff' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                Horas de Alerta (antes del cierre):
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tempConfig.horasAlerta?.map((hora) => (
                  <Chip
                    key={hora}
                    label={`${hora}h`}
                    onDelete={() => handleArrayChange('horasAlerta', hora.toString(), false)}
                    sx={{
                      backgroundColor: UI_CONFIG.theme.colors.primary,
                      color: UI_CONFIG.theme.colors.secondary,
                      '& .MuiChip-deleteIcon': {
                        color: UI_CONFIG.theme.colors.secondary,
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Cierre Programado */}
          <Typography variant="subtitle1" sx={{ color: UI_CONFIG.theme.colors.primary, mb: 2, fontWeight: 600 }}>
            📅 Cierre Programado
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tempConfig.cierreProgramadoHabilitado}
                    onChange={(e) => handleChange('cierreProgramadoHabilitado', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: UI_CONFIG.theme.colors.primary,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: UI_CONFIG.theme.colors.primary,
                      },
                    }}
                  />
                }
                label="Cierre Programado"
                sx={{ color: '#fff' }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Hora de Cierre"
                type="time"
                value={tempConfig.horaCierreProgramado}
                onChange={(e) => handleChange('horaCierreProgramado', e.target.value)}
                disabled={!tempConfig.cierreProgramadoHabilitado}
                fullWidth
                InputProps={{
                  style: { color: '#fff' },
                }}
                InputLabelProps={{
                  style: { color: '#ABBBC2' },
                  shrink: true,
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
            
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: '#ABBBC2', mb: 1 }}>
                Días de la semana:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {diasSemana.map((dia, index) => (
                  <Chip
                    key={index}
                    label={dia}
                    clickable
                    onClick={() => handleDaysChange(index, !tempConfig.diasCierreProgramado?.includes(index))}
                    sx={{
                      backgroundColor: tempConfig.diasCierreProgramado?.includes(index)
                        ? UI_CONFIG.theme.colors.primary
                        : UI_CONFIG.theme.colors.background,
                      color: tempConfig.diasCierreProgramado?.includes(index)
                        ? UI_CONFIG.theme.colors.secondary
                        : '#ABBBC2',
                      '&:hover': {
                        backgroundColor: tempConfig.diasCierreProgramado?.includes(index)
                          ? '#5AD4CC'
                          : 'rgba(105, 234, 226, 0.1)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Validaciones */}
          <Typography variant="subtitle1" sx={{ color: UI_CONFIG.theme.colors.primary, mb: 2, fontWeight: 600 }}>
            ✅ Validaciones de Cierre
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tempConfig.validarFacturasPendientes}
                    onChange={(e) => handleChange('validarFacturasPendientes', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: UI_CONFIG.theme.colors.primary,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: UI_CONFIG.theme.colors.primary,
                      },
                    }}
                  />
                }
                label="Validar Facturas Pendientes"
                sx={{ color: '#fff' }}
              />
              
              {tempConfig.validarFacturasPendientes && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={tempConfig.permitirCierreConPendientes}
                      onChange={(e) => handleChange('permitirCierreConPendientes', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: UI_CONFIG.theme.colors.warning,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: UI_CONFIG.theme.colors.warning,
                        },
                      }}
                    />
                  }
                  label="Permitir Cierre con Pendientes"
                  sx={{ color: '#fff', ml: 2, display: 'block' }}
                />
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tempConfig.validarMontoMinimo}
                    onChange={(e) => handleChange('validarMontoMinimo', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: UI_CONFIG.theme.colors.primary,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: UI_CONFIG.theme.colors.primary,
                      },
                    }}
                  />
                }
                label="Validar Monto Mínimo"
                sx={{ color: '#fff' }}
              />
              
              {tempConfig.validarMontoMinimo && (
                <TextField
                  label="Monto Mínimo Final"
                  type="number"
                  value={tempConfig.montoMinimoFinal}
                  onChange={(e) => handleChange('montoMinimoFinal', parseFloat(e.target.value) || 0)}
                  fullWidth
                  sx={{ mt: 1 }}
                  InputProps={{
                    style: { color: '#fff' },
                    startAdornment: <Typography sx={{ color: '#ABBBC2', mr: 1 }}>$</Typography>,
                  }}
                  InputLabelProps={{
                    style: { color: '#ABBBC2' },
                  }}
                />
              )}
            </Grid>
          </Grid>

          {/* Información de configuración actual */}
          <Alert 
            severity="info" 
            sx={{ 
              backgroundColor: 'rgba(105, 234, 226, 0.1)',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: UI_CONFIG.theme.colors.primary,
              },
            }}
          >
            <Typography variant="body2">
              <strong>Configuración actual:</strong><br />
              • Cierre automático: {tempConfig.cierreAutomaticoHabilitado ? `Cada ${tempConfig.horasCierreAutomatico}h` : 'Deshabilitado'}<br />
              • Cierre programado: {tempConfig.cierreProgramadoHabilitado ? `${tempConfig.horaCierreProgramado} (${tempConfig.diasCierreProgramado?.length || 0} días)` : 'Deshabilitado'}<br />
              • Alertas: {tempConfig.alertasHabilitadas ? `${tempConfig.horasAlerta?.length || 0} configuradas` : 'Deshabilitadas'}
            </Typography>
          </Alert>
        </Collapse>

        {/* Botones de acción */}
        {onSave && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <LoadingButton
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={onSave}
              loading={loading}
              loadingText="Guardando..."
              sx={{
                backgroundColor: UI_CONFIG.theme.colors.primary,
                color: UI_CONFIG.theme.colors.secondary,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#5AD4CC',
                },
              }}
            >
              Guardar Configuración
            </LoadingButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CashSessionConfigComponent;