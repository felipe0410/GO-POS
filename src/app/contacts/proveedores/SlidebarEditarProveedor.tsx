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
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { updateProveedor, deleteProveedor } from "@/firebase"; // Asegúrate de que estas funciones estén disponibles
import { enqueueSnackbar, SnackbarProvider } from "notistack";

interface Props {
    proveedor: any;
    onClose: () => void;
}

export default function SlidebarEditarProveedor({ proveedor, onClose }: Props) {
    const [form, setForm] = useState({
        nombre: proveedor.nombre ?? "",
        email: proveedor.email ?? "",
        telefono: proveedor.telefono ?? "",
        direccion: proveedor.direccion ?? "",
        nit: proveedor.nit ?? "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleActualizar = async () => {
        try {
            await updateProveedor(proveedor.uid, form);
            enqueueSnackbar("Proveedor actualizado correctamente", { variant: "success" });
            onClose();
        } catch (error) {
            console.error("Error actualizando proveedor:", error);
            enqueueSnackbar("Error al actualizar el proveedor", { variant: "error" });
        }
    };

    const handleEliminar = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar este proveedor?")) return;

        try {
            await deleteProveedor(proveedor.uid);
            enqueueSnackbar("Proveedor eliminado correctamente", { variant: "success" });
            onClose();
        } catch (error) {
            console.error("Error eliminando proveedor:", error);
            enqueueSnackbar("Error al eliminar el proveedor", { variant: "error" });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <SnackbarProvider />
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: "#69EAE2", fontWeight: 700 }}>
                    Editar proveedor
                </Typography>
                <IconButton onClick={onClose} sx={{ color: "#69EAE2" }}>
                    <CloseIcon />
                </IconButton>
            </Stack>

            <Divider sx={{ borderColor: "#69EAE2", mb: 2 }} />

            <Stack spacing={2}>
                {["nombre", "email", "telefono", "direccion"].map((campo) => (
                    <TextField
                        key={campo}
                        fullWidth
                        name={campo}
                        label={campo.charAt(0).toUpperCase() + campo.slice(1)}
                        value={(form as any)[campo]}
                        onChange={handleChange}
                        sx={{ input: { color: "#fff" } }}
                        InputLabelProps={{ style: { color: "#69EAE2" } }}
                        InputProps={{ style: { backgroundColor: "#2f324c" } }}
                    />
                ))}

                <TextField
                    fullWidth
                    name="nit"
                    label="NIT"
                    value={form.nit}
                    disabled
                    sx={{ input: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#69EAE2" } }}
                    InputProps={{ style: { backgroundColor: "#2f324c" } }}
                />

                <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ backgroundColor: "#69EAE2", color: "#1F1D2B", fontWeight: 700 }}
                        onClick={handleActualizar}
                    >
                        Guardar cambios
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleEliminar}
                    >
                        Eliminar
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
