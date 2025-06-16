"use client";

import {
    Box,
    Button,
    IconButton,
    TextField,
    Typography,
    Stack,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { createProveedor } from "@/firebase";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

interface Props {
    onClose: () => void;
}

function generarNIT() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export default function SlidebarAgregarProveedor({ onClose }: Props) {
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        nit: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async () => {
        if (!form.nombre.trim()) {
            enqueueSnackbar("El nombre del proveedor es obligatorio", { variant: "warning" });
            return;
        }

        const nit = form.nit.trim() !== "" ? form.nit : generarNIT();
        const uid = nit;

        const proveedorData = {
            ...form,
            nit,
            uid,
        };

        const result = await createProveedor(uid, proveedorData);

        if (result) {
            enqueueSnackbar("Proveedor creado correctamente", { variant: "success" });
            onClose();
        } else {
            enqueueSnackbar("Error al crear proveedor", { variant: "error" });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <SnackbarProvider />
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: "#69EAE2", fontWeight: 700 }}>
                    Agregar proveedor
                </Typography>
                <IconButton onClick={onClose} sx={{ color: "#69EAE2" }}>
                    <CloseIcon />
                </IconButton>
            </Stack>

            <Divider sx={{ borderColor: "#69EAE2", mb: 2 }} />

            <Stack spacing={2}>
                <TextField
                    fullWidth
                    name="nombre"
                    label="Nombre del proveedor *"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    sx={{ input: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#69EAE2" } }}
                    InputProps={{ style: { backgroundColor: "#2f324c" } }}
                />

                <TextField
                    fullWidth
                    name="email"
                    label="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    sx={{ input: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#69EAE2" } }}
                    InputProps={{ style: { backgroundColor: "#2f324c" } }}
                />

                <TextField
                    fullWidth
                    name="telefono"
                    label="Teléfono"
                    value={form.telefono}
                    onChange={handleChange}
                    sx={{ input: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#69EAE2" } }}
                    InputProps={{ style: { backgroundColor: "#2f324c" } }}
                />

                <TextField
                    fullWidth
                    name="direccion"
                    label="Dirección"
                    value={form.direccion}
                    onChange={handleChange}
                    sx={{ input: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#69EAE2" } }}
                    InputProps={{ style: { backgroundColor: "#2f324c" } }}
                />

                <TextField
                    fullWidth
                    name="nit"
                    label="NIT (opcional)"
                    value={form.nit}
                    onChange={handleChange}
                    sx={{ input: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#69EAE2" } }}
                    InputProps={{ style: { backgroundColor: "#2f324c" } }}
                />

                <Button
                    variant="contained"
                    sx={{
                        mt: 2,
                        backgroundColor: "#69EAE2",
                        color: "#1F1D2B",
                        fontWeight: 700,
                    }}
                    onClick={handleGuardar}
                >
                    Guardar proveedor
                </Button>
            </Stack>
        </Box>
    );
}
