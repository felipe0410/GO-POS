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
} from "@mui/material";
import axios from "axios";

const theme = createTheme({
  palette: {
    mode: "dark", // Activa el modo oscuro
    primary: {
      main: "#69EAE2", // Color principal
    },
    background: {
      default: "#121212", // Fondo oscuro
      paper: "#1E1E1E", // Fondo de componentes
    },
    text: {
      primary: "#FFFFFF", // Texto principal
      secondary: "#B3B3B3", // Texto secundario
    },
  },
});

const NewClientModal = ({
  open,
  onClose,
  onSave,
  newClient,
  setNewClient,
  isEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  newClient: any;
  setNewClient: React.Dispatch<React.SetStateAction<any>>;
  isEdit: boolean;
}) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [identityDocuments, setIdentityDocuments] = useState<any[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<any[]>([]);
  const [fiscalRegimes, setFiscalRegimes] = useState<any[]>([]);

  console.log("newClient::>", newClient);
  useEffect(() => {
    // Fetch data
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/countries`)
      .then((response) => setCountries(response.data.dataRecords?.data || []))
      .catch((error) => console.error("Error fetching countries:", error));

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/departments`)
      .then((response) => setDepartments(response.data.dataRecords?.data || []))
      .catch((error) => console.error("Error fetching departments:", error));

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/identity-documents`)
      .then((response) =>
        setIdentityDocuments(response.data.dataRecords?.data || [])
      )
      .catch((error) =>
        console.error("Error fetching identity documents:", error)
      );

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/organization-type`)
      .then((response) =>
        setOrganizationTypes(response.data.dataRecords?.data || [])
      )
      .catch((error) =>
        console.error("Error fetching organization types:", error)
      );

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/fiscal-regime`)
      .then((response) =>
        setFiscalRegimes(response.data.dataRecords?.data || [])
      )
      .catch((error) => console.error("Error fetching fiscal regimes:", error));
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
        .then((response) => {
          const data = response.data.dataRecords?.data || [];
          setCities(
            data.filter((city: any) => city.department.id === newValue.id)
          );
        })
        .catch((error) => console.error("Error fetching cities:", error));
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
        <Card>
          <CardHeader
            title={isEdit ? "Editar Cliente" : "Crear Nuevo Cliente"}
            subheader={
              isEdit
                ? "Modifique los datos del cliente para actualizar la información"
                : "Complete los datos del cliente para continuar"
            }
          />
          <CardContent>
            <Box>
              <Grid container spacing={3}>
                {/* Información Básica */}
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
                    variant="outlined"
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
                    variant="outlined"
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
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                {/* Tipo de Documento y Número de Identificación */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" gap={2}>
                    <Autocomplete
                      options={identityDocuments}
                      getOptionLabel={(option) =>
                        `${option.document_name} (${option.abbreviation})`
                      }
                      value={(() => {
                        const selectedDoc = identityDocuments.find(
                          (doc) => doc.abbreviation === newClient.tipoDocumento
                        );
                        console.log("Selected Document:", selectedDoc);
                        return selectedDoc;
                      })()}
                      onChange={(event, newValue) => {
                        setNewClient((prev: any) => ({
                          ...prev,
                          tipoDocumento: newValue?.abbreviation || "",
                          identity_document_id: newValue?.id || "",
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tipo de Documento"
                          size="small"
                          sx={{ width: "180px" }}
                        />
                      )}
                    />
                    <TextField
                      label="Identificación"
                      value={newClient.identificacion}
                      onChange={(e) => {
                        setNewClient((prev: any) => ({
                          ...prev,
                          identificacion: e.target.value,
                        }));
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Grid>

                {/* Ubicación */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => option.country_name || ""}
                    value={countries.find(
                      (country) => country.country_name === newClient.pais
                    )}
                    onChange={(event, newValue) => {
                      setNewClient((prev: any) => ({
                        ...prev,
                        pais: newValue?.country_name || "Colombia",
                        country_id: newValue?.id || null,
                      }));
                    }}
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
                    getOptionLabel={(option) => option.name_department || ""}
                    value={departments.find(
                      (department) =>
                        department.name_department === newClient.departamento
                    )}
                    onChange={(event, newValue) =>
                      handleDepartmentChange(newValue)
                    }
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
                    getOptionLabel={(option) => option.name_city || ""}
                    value={cities.find(
                      (city) => city.name_city === newClient.ciudad
                    )}
                    onChange={(event, newValue) =>
                      setNewClient((prev: any) => ({
                        ...prev,
                        ciudad: newValue?.name_city || "",
                        city_id: newValue?.id || null,
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
                {/* Dirección */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
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
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Grid>

                {/* Contribuyente */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={organizationTypes}
                    getOptionLabel={(option) => option.description || ""}
                    value={organizationTypes.find(
                      (type) => type.description === newClient.tipoContribuyente
                    )}
                    onChange={(event, newValue) =>
                      setNewClient((prev: any) => ({
                        ...prev,
                        tipoContribuyente: newValue?.description || "",
                        tax_regime_id: newValue?.id || "",
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
                    getOptionLabel={(option) => option.description || ""}
                    value={fiscalRegimes.find(
                      (regime) => regime.description === newClient.regimenFiscal
                    )}
                    onChange={(event, newValue) =>
                      setNewClient((prev: any) => ({
                        ...prev,
                        regimenFiscal: newValue?.description || "",
                        tax_level_id: newValue?.id || "",
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
            </Box>
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
