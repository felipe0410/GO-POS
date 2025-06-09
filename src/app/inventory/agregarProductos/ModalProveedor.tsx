"use client";

import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    IconButton,
    Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createProveedor } from "@/firebase";
import { enqueueSnackbar, SnackbarProvider } from "notistack";


const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 500 },
    bgcolor: "#1F1D2B",
    boxShadow: 24,
    borderRadius: "12px",
    p: 3,
};


interface ModalProveedorProps {
    open: boolean;
    onClose: () => void;
    proveedores?: any;
}

export default function ModalProveedor({ open, onClose, proveedores = [] }: ModalProveedorProps) {
    const [proveedor, setProveedor] = useState({
        nombre: "",
        nit: "",
        telefono: "",
        email: "",
        direccion: "",
    });

    const handleSaveProveedor = async (proveedor: any) => {
        const uid = proveedor.nit || crypto.randomUUID();
        const result = await createProveedor(uid, proveedor);
        enqueueSnackbar(result ? "Proveedor guardado exitosamente" : "Error al guardar el proveedor", {
            variant: result ? "success" : "error",
        });
    };

    const handleChange = (field: string, value: string) => {
        setProveedor((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        handleSaveProveedor(proveedor);
        setProveedor({
            nombre: "",
            nit: "",
            telefono: "",
            email: "",
            direccion: "",
        });
        onClose();
    };

    return (
        <>
            <SnackbarProvider />
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Card sx={{ backgroundColor: "#2C3248", color: "#fff" }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Registrar o editar proveedor</Typography>
                                <IconButton onClick={onClose} sx={{ color: "#fff" }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Autocomplete
                                options={proveedores}
                                getOptionLabel={(option: any) =>
                                    typeof option === "string" ? option : `${option.nombre} - ${option.nit}`
                                }
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setProveedor(newValue);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Buscar proveedor"
                                        sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 1 }}
                                    />
                                )}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Nombre"
                                variant="filled"
                                value={proveedor.nombre}
                                onChange={(e) => handleChange("nombre", e.target.value)}
                                sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="NIT o Documento"
                                variant="filled"
                                value={proveedor.nit}
                                onChange={(e) => handleChange("nit", e.target.value)}
                                sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Teléfono"
                                variant="filled"
                                value={proveedor.telefono}
                                onChange={(e) => handleChange("telefono", e.target.value)}
                                sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                variant="filled"
                                value={proveedor.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Dirección"
                                variant="filled"
                                value={proveedor.direccion}
                                onChange={(e) => handleChange("direccion", e.target.value)}
                                sx={{ mb: 3, backgroundColor: "#fff", borderRadius: 1 }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    backgroundColor: "#69EAE2",
                                    color: "#1F1D2B",
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                }}
                            >
                                Guardar proveedor
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </>
    );
}
