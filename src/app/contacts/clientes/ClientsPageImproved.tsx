"use client";

import React, { useState, useMemo } from "react";
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
  InputAdornment,
  Chip,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// Nuevos hooks y componentes
import { useClients } from "@/hooks/useClients";
import { useNotification } from "@/hooks/useNotification";
import { LoadingOverlay } from "@/components/LoadingStates/LoadingOverlay";
import { LoadingButton } from "@/components/LoadingStates/LoadingButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppLayout } from "@/components/Layout/AppLayout";
import { UI_CONFIG } from "@/config/constants";

// Componentes de formulario (mantenemos los existentes por ahora)
import SlidebarAgregarCliente from "./SlidebarAgregarCliente";
import SlidebarEditarCliente from "./SlidebarEditarCliente";

export default function ClientsPageImproved() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Usar el nuevo hook de clientes
  const {
    clients,
    loading,
    error,
    deleteClient,
    searchClients,
    deleting,
  } = useClients();

  const { success, handleAsyncError } = useNotification();

  // Filtrar clientes con el nuevo método
  const filteredClients = useMemo(() => {
    return searchClients(searchTerm);
  }, [clients, searchTerm, searchClients]);

  // Paginación
  const paginatedClients = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredClients.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredClients, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteClient = async (uid: string) => {
    try {
      await deleteClient(uid);
      setClientToDelete(null);
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedClient(null);
  };

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const totalClients = clients.length;
    const clientsWithEmail = clients.filter(c => c.email).length;
    const clientsWithPhone = clients.filter(c => c.phone).length;
    
    return {
      total: totalClients,
      withEmail: clientsWithEmail,
      withPhone: clientsWithPhone,
    };
  }, [clients]);

  if (error) {
    return (
      <AppLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Error al cargar clientes: {error}
          </Alert>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ErrorBoundary>
        <Box sx={{ width: "95%", mx: "auto", py: 3 }}>
          <LoadingOverlay loading={loading} message="Cargando clientes..." backdrop={false} />
          
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: UI_CONFIG.theme.colors.primary,
                  fontWeight: 800,
                  fontFamily: UI_CONFIG.theme.fonts.primary,
                  mb: 1,
                }}
              >
                CLIENTES
              </Typography>
              
              {/* Stats */}
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<PersonIcon />}
                  label={`${stats.total} clientes`}
                  size="small"
                  sx={{
                    backgroundColor: UI_CONFIG.theme.colors.background,
                    color: UI_CONFIG.theme.colors.text,
                  }}
                />
                <Chip
                  label={`${stats.withEmail} con email`}
                  size="small"
                  sx={{
                    backgroundColor: UI_CONFIG.theme.colors.background,
                    color: UI_CONFIG.theme.colors.text,
                  }}
                />
                <Chip
                  label={`${stats.withPhone} con teléfono`}
                  size="small"
                  sx={{
                    backgroundColor: UI_CONFIG.theme.colors.background,
                    color: UI_CONFIG.theme.colors.text,
                  }}
                />
              </Stack>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDrawer(true)}
              sx={{
                backgroundColor: UI_CONFIG.theme.colors.primary,
                color: UI_CONFIG.theme.colors.secondary,
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: UI_CONFIG.theme.colors.primary,
                  opacity: 0.9,
                },
              }}
            >
              Agregar Cliente
            </Button>
          </Stack>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Buscar por nombre, email, teléfono o NIT..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: UI_CONFIG.theme.colors.primary }} />
                </InputAdornment>
              ),
              style: {
                backgroundColor: UI_CONFIG.theme.colors.background,
                color: UI_CONFIG.theme.colors.text,
              },
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: UI_CONFIG.theme.colors.primary },
                "&:hover fieldset": { borderColor: UI_CONFIG.theme.colors.primary },
                "&.Mui-focused fieldset": { borderColor: UI_CONFIG.theme.colors.primary },
              },
            }}
          />

          {/* Table */}
          <Card sx={{ background: UI_CONFIG.theme.colors.secondary, p: 2 }}>
            <Divider sx={{ borderColor: UI_CONFIG.theme.colors.primary, mb: 2 }} />

            {filteredClients.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <PersonIcon sx={{ fontSize: 64, color: UI_CONFIG.theme.colors.background, mb: 2 }} />
                <Typography sx={{ color: "#AAA", mb: 1 }}>
                  {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
                </Typography>
                {!searchTerm && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDrawer(true)}
                    sx={{
                      borderColor: UI_CONFIG.theme.colors.primary,
                      color: UI_CONFIG.theme.colors.primary,
                    }}
                  >
                    Agregar primer cliente
                  </Button>
                )}
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: UI_CONFIG.theme.colors.primary, background: UI_CONFIG.theme.colors.secondary }}>
                          Cliente
                        </TableCell>
                        <TableCell sx={{ color: UI_CONFIG.theme.colors.primary, background: UI_CONFIG.theme.colors.secondary }}>
                          Email
                        </TableCell>
                        <TableCell sx={{ color: UI_CONFIG.theme.colors.primary, background: UI_CONFIG.theme.colors.secondary }}>
                          Teléfono
                        </TableCell>
                        <TableCell sx={{ color: UI_CONFIG.theme.colors.primary, background: UI_CONFIG.theme.colors.secondary }}>
                          Dirección
                        </TableCell>
                        <TableCell sx={{ color: UI_CONFIG.theme.colors.primary, background: UI_CONFIG.theme.colors.secondary }}>
                          NIT
                        </TableCell>
                        <TableCell sx={{ background: UI_CONFIG.theme.colors.secondary, width: 120 }}>
                          Acciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedClients.map((client) => (
                        <TableRow key={client.uid} hover>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ bgcolor: UI_CONFIG.theme.colors.primary }}>
                                {client.name?.charAt(0)?.toUpperCase() || "?"}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ color: UI_CONFIG.theme.colors.text, fontWeight: 600 }}>
                                  {client.name || "Sin nombre"}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ color: UI_CONFIG.theme.colors.text }}>
                            {client.email || "-"}
                          </TableCell>
                          <TableCell sx={{ color: UI_CONFIG.theme.colors.text }}>
                            {client.phone || "-"}
                          </TableCell>
                          <TableCell sx={{ color: UI_CONFIG.theme.colors.text }}>
                            {client.address || "-"}
                          </TableCell>
                          <TableCell sx={{ color: UI_CONFIG.theme.colors.text }}>
                            {client.nit || "-"}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditClient(client)}
                                sx={{ color: UI_CONFIG.theme.colors.primary }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <LoadingButton
                                loading={deleting && clientToDelete === client.uid}
                                onClick={() => {
                                  setClientToDelete(client.uid);
                                  handleDeleteClient(client.uid);
                                }}
                                sx={{
                                  minWidth: 'auto',
                                  p: 1,
                                  color: UI_CONFIG.theme.colors.error,
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </LoadingButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredClients.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    color: UI_CONFIG.theme.colors.primary,
                    "& .MuiTablePagination-selectIcon": {
                      color: UI_CONFIG.theme.colors.primary,
                    },
                  }}
                />
              </>
            )}
          </Card>

          {/* Drawer */}
          <Drawer
            anchor="right"
            open={openDrawer}
            onClose={handleCloseDrawer}
            PaperProps={{
              sx: {
                width: { xs: "100%", sm: 400 },
                backgroundColor: UI_CONFIG.theme.colors.secondary,
              },
            }}
          >
            {selectedClient ? (
              <SlidebarEditarCliente
                cliente={selectedClient}
                onClose={handleCloseDrawer}
              />
            ) : (
              <SlidebarAgregarCliente onClose={handleCloseDrawer} />
            )}
          </Drawer>
        </Box>
      </ErrorBoundary>
    </AppLayout>
  );
}