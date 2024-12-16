import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

interface OptimalQuantityDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (quantity: number) => void;
  productName: string;
}

const OptimalQuantityDialog: React.FC<OptimalQuantityDialogProps> = ({
  open,
  onClose,
  onSave,
  productName,
}) => {
  const [quantity, setQuantity] = useState<number | string>("");

  const handleSave = () => {
    if (quantity) {
      onSave(Number(quantity));
      setQuantity("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#1F1D2B",
          color: "#FFF",
          borderRadius: "12px",
          padding: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.2rem",
          fontWeight: 600,
          color: "#69EAE2",
        }}
      >
        Configurar Cantidad Óptima
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={`Cantidad óptima para ${productName}`}
          type="number"
          fullWidth
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          InputLabelProps={{
            style: { color: "#BDBDBD" },
          }}
          InputProps={{
            style: {
              color: "#FFF", 
              backgroundColor: "#2C2A36",
              borderRadius: "4px",
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#FFF",
            borderColor: "#69EAE2",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#69EAE2",
              color: "#1F1D2B", 
            },
          }}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            backgroundColor: "#69EAE2",
            color: "#1F1D2B",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#56C5BE",
            },
          }}
          variant="contained"
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OptimalQuantityDialog;
