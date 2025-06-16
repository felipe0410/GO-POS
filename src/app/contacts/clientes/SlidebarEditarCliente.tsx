"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { deleteClient, updateClient } from "@/firebase";
import { enqueueSnackbar } from "notistack";

interface Props {
  cliente: any;
  onClose: () => void;
}

export default function SlidebarEditarCliente({ cliente, onClose }: Props) {
  const [form, setForm] = useState({ ...cliente });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    await updateClient(form.identificacion, form);
    enqueueSnackbar("Cliente actualizado", { variant: "success" });
    onClose();
  };

  const handleDelete = async () => {
    await deleteClient(form.identificacion);
    enqueueSnackbar("Cliente eliminado", { variant: "warning" });
    onClose();
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ color: "#69EAE2", fontWeight: 700 }}>
          Editar Cliente
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#69EAE2" }}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Stack spacing={2}>
        <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} fullWidth
          InputLabelProps={{ sx: { color: "#69EAE2" } }}
          InputProps={{ sx: { color: "#fff", background: "#2f324c" } }} />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth
          InputLabelProps={{ sx: { color: "#69EAE2" } }}
          InputProps={{ sx: { color: "#fff", background: "#2f324c" } }} />
        <TextField label="Celular" name="celular" value={form.celular} onChange={handleChange} fullWidth
          InputLabelProps={{ sx: { color: "#69EAE2" } }}
          InputProps={{ sx: { color: "#fff", background: "#2f324c" } }} />
        <TextField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} fullWidth
          InputLabelProps={{ sx: { color: "#69EAE2" } }}
          InputProps={{ sx: { color: "#fff", background: "#2f324c" } }} />
        <TextField label="Identificación" name="identificacion" value={form.identificacion} disabled fullWidth
          InputLabelProps={{ sx: { color: "#69EAE2" } }}
          InputProps={{ sx: { color: "#fff", background: "#2f324c" } }} />

        <Button variant="contained" onClick={handleUpdate}
          sx={{ backgroundColor: "#69EAE2", color: "#1F1D2B", fontWeight: 700 }}>
          Actualizar Cliente
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Eliminar Cliente
        </Button>
      </Stack>
    </Box>
  );
}
