import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import { saveSettings, fetchAndStoreSettings } from '@/firebase'; // Importar funciones necesarias

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#1F1D2B', // Fondo oscuro
  border: '2px solid #69EAE2', // Borde estilizado
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
  color: '#69EAE2', // Texto claro
};

export default function ModalSettings() {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('quickSale'); // Valor por defecto
  const [isSaving, setIsSaving] = React.useState(false); // Estado para el guardado

  // Cargar configuración al abrir el modal
  const handleOpen = async () => {
    const success = await fetchAndStoreSettings();
    if (success) {
      const storedSettings = localStorage.getItem('settingsData');
      const settings = storedSettings ? JSON.parse(storedSettings) : null;
      if (settings && settings.defaultTypeInvoice) {
        setSelectedOption(settings.defaultTypeInvoice); // Establecer el tipo guardado
      } else {
        setSelectedOption('quickSale'); // Predeterminado
      }
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    setIsSaving(true);
    const settingsData = { defaultTypeInvoice: selectedOption };
    const success = await saveSettings(settingsData);
    setIsSaving(false);

    if (success) {
      console.log('Configuración guardada en Firebase');
      handleClose();
    } else {
      console.error('Error al guardar configuración');
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
      >
        <SettingsIcon fontSize="large" sx={{ color: '#69EAE2' }} />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign="center"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Configuración de Venta
          </Typography>
          <FormLabel
            component="legend"
            sx={{
              color: '#69EAE2',
              fontWeight: 700,
              mb: 2,
              display: 'block',
              textAlign: 'center',
            }}
          >
            Venta por defecto
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="radio-buttons-group"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            sx={{
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <FormControlLabel
              value="quickSale"
              control={<Radio sx={{ color: '#69EAE2' }} />}
              label={
                <Typography sx={{ color: '#69EAE2' }}>Venta Rápida</Typography>
              }
            />
            <FormControlLabel
              value="invoice"
              control={<Radio sx={{ color: '#69EAE2' }} />}
              label={
                <Typography sx={{ color: '#69EAE2' }}>Factura</Typography>
              }
            />
          </RadioGroup>
          <Box display="flex" justifyContent="space-between" gap={2}>
            <Button
              onClick={handleClose}
              sx={{
                backgroundColor: '#2C2A3D',
                color: '#69EAE2',
                flex: 1,
                '&:hover': {
                  backgroundColor: '#39374D',
                },
              }}
              disabled={isSaving} // Desactivar si está guardando
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              sx={{
                backgroundColor: '#69EAE2',
                color: '#1F1D2B',
                fontWeight: 700,
                flex: 1,
                '&:hover': {
                  backgroundColor: '#5ACBCC',
                },
              }}
              disabled={isSaving} // Desactivar si está guardando
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
