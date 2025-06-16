"use client";

import {
    Box,
    Button,
    Card,
    Divider,
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Avatar,
    Drawer,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { getAllProveedores, suscribeToProveedores } from "@/firebase";
import SlidebarAgregarProveedor from "./SlidebarAgregarProveedor";
import SlidebarEditarProveedor from "./SlidebarEditarProveedor";

export default function TablaProveedores() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [filtro, setFiltro] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState<any>(null);

    useEffect(() => {
        const cargarProveedores = async () => {
            suscribeToProveedores(setProveedores);
        };
        cargarProveedores();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const proveedoresFiltrados = proveedores.filter((prov) => {
        const texto = filtro.toLowerCase().trim();
        return (
            prov.nombre?.toLowerCase().includes(texto) ||
            prov.email?.toLowerCase().includes(texto) ||
            prov.telefono?.toLowerCase().includes(texto) ||
            prov.nit?.toLowerCase().includes(texto)
        );
    });

    return (
        <Box sx={{ width: "95%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography
                    variant="h4"
                    sx={{ color: "#69EAE2", fontWeight: 800, fontFamily: "Nunito" }}
                >
                    PROVEEDORES
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: "#69EAE2", color: "#1F1D2B", fontWeight: 700 }}
                    onClick={() => {
                        setSelectedProveedor(null);
                        setOpenDrawer(true);
                    }}
                >
                    Agregar
                </Button>
            </Stack>

            <TextField
                fullWidth
                placeholder="Buscar por nombre, email, teléfono o NIT"
                variant="outlined"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                sx={{
                    mb: 2,
                    input: { color: "#fff" },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#69EAE2" },
                        "&:hover fieldset": { borderColor: "#69EAE2" },
                        "&.Mui-focused fieldset": { borderColor: "#69EAE2" },
                    },
                }}
                InputProps={{
                    style: { backgroundColor: "#2f324c" },
                }}
            />

            <Card sx={{ background: "#1F1D2B", p: 2 }}>
                <Divider sx={{ borderColor: "#69EAE2", mb: 2 }} />

                {proveedoresFiltrados.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 5 }}>
                        <Typography sx={{ color: "#AAA" }}>
                            No hay proveedores disponibles.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>
                                            Proveedor
                                        </TableCell>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>Email</TableCell>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>Teléfono</TableCell>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>Dirección</TableCell>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>NIT</TableCell>
                                        <TableCell sx={{ background: "#1F1D2B" }} />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {proveedoresFiltrados
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((prov) => (
                                            <TableRow key={prov.uid} hover>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar src="/avatar-placeholder.png" />
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ color: "#fff" }}>{prov.nombre}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{prov.email || "-"}</TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{prov.telefono || "-"}</TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{prov.direccion || "-"}</TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{prov.nit || "-"}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        sx={{ color: "#69EAE2" }}
                                                        onClick={() => {
                                                            setSelectedProveedor(prov);
                                                            setOpenDrawer(true);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={proveedoresFiltrados.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ color: "#69EAE2" }}
                        />
                    </>
                )}
            </Card>

            <Drawer
                anchor="right"
                open={openDrawer}
                onClose={() => {
                    setOpenDrawer(false);
                    setSelectedProveedor(null);
                }}
                PaperProps={{ sx: { width: { xs: "100%", sm: 400 }, backgroundColor: "#1F1D2B" } }}
            >
                {selectedProveedor ? (
                    <SlidebarEditarProveedor
                        proveedor={selectedProveedor}
                        onClose={() => {
                            setOpenDrawer(false);
                            setSelectedProveedor(null);
                        }}
                    />
                ) : (
                    <SlidebarAgregarProveedor onClose={() => setOpenDrawer(false)} />
                )}
            </Drawer>
        </Box>
    );
}
