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
import { createClient } from "@/firebase";
import { getClientById } from "@/firebase";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

interface Props {
    onClose: () => void;
}

// Función para generar un número de 10 dígitos aleatorios
const generateNumericId = (): string => {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
};

export default function SlidebarAgregarCliente({ onClose }: Props) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        celular: "",
        direccion: "",
        identificacion: "",
    });

    const [nameError, setNameError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === "name" && value.trim() !== "") {
            setNameError(false);
        }
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            setNameError(true);
            enqueueSnackbar("El nombre es obligatorio", { variant: "warning" });
            return;
        }

        let idToUse = form.identificacion.trim() || generateNumericId();

        const existingClient = await getClientById(idToUse);
        if (existingClient) {
            enqueueSnackbar("Ya existe un cliente con esta identificación", { variant: "error" });
            return;
        }

        const dataToSave = {
            ...form,
            identificacion: idToUse,
        };

        const success = await createClient(idToUse, dataToSave);
        if (success) {
            enqueueSnackbar("Cliente creado exitosamente", { variant: "success" });
            onClose();
        } else {
            enqueueSnackbar("Error al crear cliente", { variant: "error" });
        }
    };

    return (
        <Box p={3}>
            <SnackbarProvider />
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: "#69EAE2", fontWeight: 700 }}>
                    Nuevo Cliente
                </Typography>
                <IconButton onClick={onClose} sx={{ color: "#69EAE2" }}>
                    <CloseIcon />
                </IconButton>
            </Stack>

            <Stack spacing={2}>
                <TextField
                    label="Nombre"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={nameError}
                    helperText={nameError ? "Este campo es obligatorio" : ""}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ sx: { color: "#69EAE2" } }}
                    InputProps={{ sx: { color: "#fff", background: "#2f324c" } }}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ sx: { color: "#69EAE2" } }}
                    InputProps={{ sx: { color: "#fff", background: "#2f324c" } }}
                />
                <TextField
                    label="Celular"
                    name="celular"
                    value={form.celular}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ sx: { color: "#69EAE2" } }}
                    InputProps={{ sx: { color: "#fff", background: "#2f324c" } }}
                />
                <TextField
                    label="Dirección"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ sx: { color: "#69EAE2" } }}
                    InputProps={{ sx: { color: "#fff", background: "#2f324c" } }}
                />
                <TextField
                    label="Identificación"
                    name="identificacion"
                    value={form.identificacion}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ sx: { color: "#69EAE2" } }}
                    InputProps={{ sx: { color: "#fff", background: "#2f324c" } }}
                />

                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                        backgroundColor: "#69EAE2",
                        color: "#1F1D2B",
                        fontWeight: 700,
                        mt: 2,
                    }}
                >
                    Guardar Cliente
                </Button>
            </Stack>
        </Box>
    );
}
