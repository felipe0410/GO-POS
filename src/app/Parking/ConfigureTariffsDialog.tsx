// Dialogo para configurar tarifas de parqueo
import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  OutlinedInput,
} from "@mui/material";
import { NumericFormat } from "react-number-format";

const ConfigureTariffsDialog = ({ open, onClose, tariffs, onSave }: any) => {
  const [localTariffs, setLocalTariffs] = useState(tariffs);

  const handleInputChange = (name: string, value: string) => {
    const numericValue = parseInt(value, 10);
    setLocalTariffs({
      ...localTariffs,
      [name]: numericValue > 0 ? numericValue : 0,
    });
  };

  const handleSave = () => {
    onSave(localTariffs);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configurar Tarifas</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <NumericFormat
            onValueChange={(values: { value: any }) =>
              handleInputChange("car", values.value)
            }
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            value={localTariffs.car}
            sx={{
              height: { xs: "30px", sm: "2.5rem" },
              fontSize: { xs: "16px", sm: "1rem" },
              width: "100%",
              color: "#FFF",
              borderRadius: "0.5rem",
              background: "#2C3248",
              marginBottom:'20px',
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          />
          <NumericFormat
            onValueChange={(values: { value: any }) =>
              handleInputChange("motorcycle", values.value)
            }
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            value={localTariffs.motorcycle}
            sx={{
              height: { xs: "30px", sm: "2.5rem" },
              fontSize: { xs: "16px", sm: "1rem" },
              width: "100%",
              color: "#FFF",
              borderRadius: "0.5rem",
              background: "#2C3248",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigureTariffsDialog;
