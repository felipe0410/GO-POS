import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const SaveDraftDialog = ({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (draftName: string) => void;
}) => {
  const [draftName, setDraftName] = useState("");

  const handleSave = () => {
    if (!draftName.trim()) {
      alert("Por favor, ingresa un nombre válido para el borrador.");
      return;
    }
    onSave(draftName);
    setDraftName(""); // Limpiar el campo después de guardar
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Guardar Borrador</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre del Borrador"
          type="text"
          fullWidth
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDraftDialog;
