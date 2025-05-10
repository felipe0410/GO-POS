import React, { useEffect, useState } from "react";
import {
  Dialog,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Autocomplete,
  Grid,
  createTheme,
  ThemeProvider,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";

type NewClientModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  newClient: any;
  setNewClient: React.Dispatch<React.SetStateAction<any>>;
  isEdit: boolean;
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#69EAE2" },
    background: { default: "#121212", paper: "#1E1E1E" },
    text: { primary: "#FFFFFF", secondary: "#B3B3B3" },
  },
});

const NewClientModal: React.FC<NewClientModalProps> = ({
  open,
  onClose,
  onSave,
  newClient,
  setNewClient,
  isEdit,
}) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [identityDocuments, setIdentityDocuments] = useState<any[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<any[]>([]);
  const [fiscalRegimes, setFiscalRegimes] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/countries`)
      .then((r) => setCountries(r.data.dataRecords?.data || []));
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/departments`)
      .then((r) => setDepartments(r.data.dataRecords?.data || []));
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/identity-documents`)
      .then((r) => setIdentityDocuments(r.data.dataRecords?.data || []));
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/organization-type`)
      .then((r) => setOrganizationTypes(r.data.dataRecords?.data || []));
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/fiscal-regime`)
      .then((r) => setFiscalRegimes(r.data.dataRecords?.data || []));
  }, []);

  const handleDepartmentChange = (newValue: any) => {
    if (newValue) {
      setNewClient((prev: any) => ({
        ...prev,
        departamento: newValue.name_department,
        department_id: newValue.id,
        ciudad: "",
      }));
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/cities`)
        .then((res) => {
          const data = res.data.dataRecords?.data || [];
          setCities(
            data.filter((city: any) => city.department.id === newValue.id)
          );
        });
    } else {
      setNewClient((prev: any) => ({
        ...prev,
        departamento: "",
        department_id: null,
        ciudad: "",
      }));
      setCities([]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 6,
            p: 2,
            backgroundColor: "#1e1e1e",
            overflowY: "auto",
          }}
        >
          <CardHeader
            title={isEdit ? "Editar Cliente" : "Crear Nuevo Cliente"}
            subheader={
              isEdit
                ? "Modifique los datos del cliente"
                : "Complete los datos del cliente"
            }
          />

          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
              mb={3}
            >
              <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  width: { xs: 60, sm: 70, lg: 80 },
                  height: { xs: 60, sm: 70, lg: 80 },
                  borderRadius: "50%",
                  backgroundColor: "#69EAE2",
                  // display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AccountCircleIcon
                  sx={{
                    fontSize: { xs: 32, sm: 40, lg: 48 },
                    color: "#1E1E1E",
                  }}
                />
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Box fontWeight="bold" fontSize={{ xs: 14, sm: 16, lg: 18 }}>
                  {newClient.name || "Nuevo Cliente"}
                </Box>
                <Box color="text.secondary" fontSize={{ xs: 12, sm: 14 }}>
                  {newClient.correo || "Correo no asignado"}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box mb={2} fontWeight="bold">
              Información Personal
            </Box>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient((prev: any) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Correo"
                  value={newClient.correo}
                  onChange={(e) =>
                    setNewClient((prev: any) => ({
                      ...prev,
                      correo: e.target.value,
                    }))
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={newClient.telefono}
                  onChange={(e) =>
                    setNewClient((prev: any) => ({
                      ...prev,
                      telefono: e.target.value,
                    }))
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  display="flex"
                  gap={2}
                  flexWrap="wrap"
                  justifyContent="space-between"
                >
                  <Autocomplete
                    options={identityDocuments}
                    getOptionLabel={(o) =>
                      `${o.document_name} (${o.abbreviation})`
                    }
                    value={
                      identityDocuments.find(
                        (doc) => doc.abbreviation === newClient.tipoDocumento
                      ) || null
                    }
                    onChange={(e, v) =>
                      setNewClient((prev: any) => ({
                        ...prev,
                        tipoDocumento: v?.abbreviation || "",
                        identity_document_id: v?.id || "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tipo de Documento"
                        size="small"
                        sx={{ minWidth: "180px", flexGrow: 1 }}
                      />
                    )}
                  />
                  <TextField
                    label="Identificación"
                    value={newClient.identificacion}
                    onChange={(e) =>
                      setNewClient((prev: any) => ({
                        ...prev,
                        identificacion: e.target.value,
                      }))
                    }
                    size="small"
                    sx={{ flexGrow: 2, minWidth: "200px" }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box mb={2} fontWeight="bold">
              Ubicación
            </Box>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={countries}
                  getOptionLabel={(o) => o.country_name || ""}
                  value={
                    countries.find((c) => c.country_name === newClient.pais) ||
                    null
                  }
                  onChange={(e, v) =>
                    setNewClient((prev: any) => ({
                      ...prev,
                      pais: v?.country_name || "Colombia",
                      country_id: v?.id || null,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="País"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={departments}
                  getOptionLabel={(o) => o.name_department || ""}
                  value={
                    departments.find(
                      (d) => d.name_department === newClient.departamento
                    ) || null
                  }
                  onChange={(e, v) => handleDepartmentChange(v)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Departamento"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(o) => o.name_city || ""}
                  value={
                    cities.find((c) => c.name_city === newClient.ciudad) || null
                  }
                  onChange={(e, v) =>
                    setNewClient((prev: any) => ({
                      ...prev,
                      ciudad: v?.name_city || "",
                      city_id: v?.id || null,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ciudad"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={newClient.direccion}
                  onChange={(e) =>
                    setNewClient((prev: any) => ({
                      ...prev,
                      direccion: e.target.value,
                    }))
                  }
                  size="small"
                />
              </Grid>
            </Grid>

            <Box mb={2} fontWeight="bold">
              Información Fiscal
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={organizationTypes}
                  getOptionLabel={(o) => o.description || ""}
                  value={
                    organizationTypes.find(
                      (t) => t.description === newClient.tipoContribuyente
                    ) || null
                  }
                  onChange={(e, v) =>
                    setNewClient((prev: any) => ({
                      ...prev,
                      tipoContribuyente: v?.description || "",
                      tax_regime_id: v?.id || "",
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de Contribuyente"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={fiscalRegimes}
                  getOptionLabel={(o) => o.description || ""}
                  value={
                    fiscalRegimes.find(
                      (r) => r.description === newClient.regimenFiscal
                    ) || null
                  }
                  onChange={(e, v) =>
                    setNewClient((prev: any) => ({
                      ...prev,
                      regimenFiscal: v?.description || "",
                      tax_level_id: v?.id || "",
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Régimen Fiscal"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>

          <Box display="flex" justifyContent="space-between" p={2}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" onClick={onSave}>
              {isEdit ? "Guardar Cambios" : "Crear Cliente"}
            </Button>
          </Box>
        </Card>
      </Dialog>
    </ThemeProvider>
  );
};

export default NewClientModal;
