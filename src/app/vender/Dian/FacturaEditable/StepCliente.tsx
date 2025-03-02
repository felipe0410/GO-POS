import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { getAllClientsData, createClient, deleteClient } from "@/firebase";
import NewClientModal from "./NewClientModal";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { FacturaProviderContext } from "../context";
import DeleteModal from "./DeleteModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StepCliente = ({ data, setData }: { data: any; setData: Function }) => {
  const { newClient, setNewClient, setLocalData } =
    useContext(FacturaProviderContext) || {};
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
  useEffect(() => {
    const unsubscribe = getAllClientsData(setClients);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleClientSelection = (client: any | null) => {
    if (client) {
      setSelectedClient(client);
      setData((prev: any) => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          ...client,
        },
      }));
    } else {
      setSelectedClient(null);
    }
  };

  const handleSaveNewClient: any = async () => {
    const uid = newClient.identificacion;
    const clientData = { ...newClient, uid };
    const result = await createClient(uid, clientData);
    if (result) {
      enqueueSnackbar("Cliente guardado exitosamente", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setClients((prev) => [...prev, clientData]);
      setIsDialogOpen(false);
      setNewClient({
        name: "",
        identificacion: "",
        telefono: "",
        correo: "",
        direccion: "",
        pais: "",
        departamento: "",
        ciudad: "",
        tipoDocumento: "",
        tipoContribuyente: "",
        regimenFiscal: "",
      });
    } else {
      enqueueSnackbar("Error al guardar el cliente", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  const handleEditClient = () => {
    if (selectedClient) {
      setNewClient(selectedClient);
      setIsEdit(true);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteClient = async () => {
    if (selectedClient) {
      const result = await deleteClient(selectedClient.uid);
      if (result) {
        enqueueSnackbar("Cliente eliminado exitosamente", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        setClients((prev) =>
          prev.filter((client) => client.uid !== selectedClient.uid)
        );
        setSelectedClient(null);
      } else {
        enqueueSnackbar("Error al eliminar el cliente", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    }
    setIsDeleteModalOpen(false);
  };
  useEffect(() => {
    if (selectedClient) {
      setLocalData((prev: any) => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          ...selectedClient,
        },
      }));
    }
  }, [selectedClient, setLocalData]);

  return (
    <Box sx={{ width: "100%", maxWidth: "1000px", margin: "auto", padding: 0 }}>
      <SnackbarProvider />
      <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
        Seleccionar Cliente
      </Typography>

      {/* Selector de clientes */}
      <Autocomplete
        options={clients}
        getOptionLabel={(option) => option.name || ""}
        value={selectedClient}
        onChange={(event, newValue) => handleClientSelection(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Buscar Cliente" fullWidth />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      {/* Botones de acción */}
      <Grid container spacing={1} justifyContent="center" mt={1}>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setIsEdit(false);
              setIsDialogOpen(true);
            }}
          >
            <AddCircleIcon />
            {!isSmallScreen && " Crear Cliente"}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleEditClient}
            disabled={!selectedClient}
          >
            <EditIcon />
            {!isSmallScreen && " Editar Cliente"}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={!selectedClient}
          >
            <DeleteIcon />
            {!isSmallScreen && " Eliminar Cliente"}
          </Button>
        </Grid>
      </Grid>

      {/* Información del Cliente */}
      <Grid container spacing={2} mt={3}>
        {[
          { label: "Nombre", value: data.cliente.name },
          { label: "Correo", value: data.cliente.correo },
          { label: "Teléfono", value: data.cliente.telefono },
          { label: "Dirección", value: data.cliente.direccion },
          { label: "Identificación", value: data.cliente.identificacion },
          { label: "País", value: data.cliente.pais },
          { label: "Departamento", value: data.cliente.departamento },
          { label: "Ciudad", value: data.cliente.ciudad },
          { label: "Tipo de Documento", value: data.cliente.tipoDocumento },
          {
            label: "Tipo de Contribuyente",
            value: data.cliente.tipoContribuyente,
          },
          { label: "Régimen Fiscal", value: data.cliente.regimenFiscal },
        ].map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              label={field.label}
              value={field.value || ""}
              InputProps={{ readOnly: true }}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
        ))}
      </Grid>

      {/* Modales */}
      <NewClientModal
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveNewClient}
        newClient={newClient}
        setNewClient={setNewClient}
        isEdit={false}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteClient}
        title="¿ESTÁS SEGURO QUE QUIERES ELIMINAR EL CLIENTE?"
        description={`Cliente: ${selectedClient?.name || ""}`}
      />
    </Box>
  );
};

export default StepCliente;
