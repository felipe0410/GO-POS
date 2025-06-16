// TablaClientes.tsx
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
import { getAllClientsData } from "@/firebase";
import SlidebarAgregarCliente from "./SlidebarAgregarCliente";
import SlidebarEditarCliente from "./SlidebarEditarCliente";

export default function TablaClientes() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [clientes, setClientes] = useState<any[]>([]);
    const [filtro, setFiltro] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<any>(null);

    useEffect(() => {
        const unsubscribe: any = getAllClientsData((data: any[]) => {
            if (data) setClientes(data);
        });
        unsubscribe();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const clientesFiltrados = clientes.filter((cliente) => {
        const texto = filtro.toLowerCase().trim();
        return (
            cliente.name?.toLowerCase().includes(texto) ||
            cliente.email?.toLowerCase().includes(texto) ||
            cliente.celular?.toLowerCase().includes(texto) ||
            cliente.identificacion?.toLowerCase().includes(texto)
        );
    });

    return (
        <Box sx={{ width: '95%' }} >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography
                    variant="h4"
                    sx={{ color: "#69EAE2", fontWeight: 800, fontFamily: "Nunito" }}
                >
                    CLIENTES
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: "#69EAE2", color: "#1F1D2B", fontWeight: 700 }}
                    onClick={() => setOpenDrawer(true)}
                >
                    Agregar
                </Button>
            </Stack>

            <TextField
                fullWidth
                placeholder="Buscar por nombre, email, celular o identificación"
                variant="outlined"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                sx={{
                    mb: 2,
                    input: { color: "#fff" },
                    label: { color: "#69EAE2" },
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

                {clientesFiltrados.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 5 }}>
                        <Typography sx={{ color: "#AAA" }}>
                            No hay clientes disponibles.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>
                                            Cliente
                                        </TableCell>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>Email</TableCell>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>Celular</TableCell>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>Dirección</TableCell>
                                        <TableCell sx={{ color: "#69EAE2", background: "#1F1D2B" }}>Identificación</TableCell>
                                        <TableCell sx={{ background: "#1F1D2B" }} />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clientesFiltrados
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((cliente) => (
                                            <TableRow key={cliente.id} hover>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar src={cliente.avatar ?? "/avatar-placeholder.png"} />
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ color: "#fff" }}>{cliente.name}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{cliente.email ?? "-"}</TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{cliente.celular ?? "-"}</TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{cliente.direccion ?? "-"}</TableCell>
                                                <TableCell sx={{ color: "#fff" }}>{cliente.identificacion ?? "-"}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        sx={{ color: "#69EAE2" }}
                                                        onClick={() => {
                                                            setSelectedCliente(cliente);
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
                            count={clientesFiltrados.length}
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
                    setSelectedCliente(null);
                }}
                PaperProps={{ sx: { width: { xs: "100%", sm: 400 }, backgroundColor: "#1F1D2B" } }}
            >
                {selectedCliente ? (
                    <SlidebarEditarCliente
                        cliente={selectedCliente}
                        onClose={() => {
                            setOpenDrawer(false);
                            setSelectedCliente(null);
                        }}
                    />
                ) : (
                    <SlidebarAgregarCliente onClose={() => setOpenDrawer(false)} />
                )}
            </Drawer>
        </Box>
    );
}
