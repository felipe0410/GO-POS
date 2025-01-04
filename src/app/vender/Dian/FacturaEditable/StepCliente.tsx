import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Button,
} from "@mui/material";
import { getAllClientsData, createClient, deleteClient } from "@/firebase";
import NewClientModal from "./NewClientModal";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { FacturaProviderContext } from "../context";
import DeleteModal from "./DeleteModal";

const StepCliente = ({ data, setData }: { data: any; setData: Function }) => {
  const { newClient, setNewClient, setLocalData } =
    useContext(FacturaProviderContext) || {};
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    <Box display="grid" gap={2}>
      <SnackbarProvider />
      <Typography variant="h6">Seleccionar Cliente</Typography>
      <Autocomplete
        options={clients}
        getOptionLabel={(option) => option.name || ""}
        value={selectedClient}
        onChange={(event, newValue) => handleClientSelection(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Buscar Cliente" />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
      <Box display="flex" gap={2} mt={2} sx={{ placeSelf: "center" }}>
        <Button
          variant="outlined"
          onClick={() => {
            setIsEdit(false);
            setIsDialogOpen(true);
          }}
        >
          Crear Nuevo Cliente
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditClient}
          disabled={!selectedClient}
        >
          Editar Cliente
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={!selectedClient}
        >
          Eliminar Cliente
        </Button>
      </Box>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={2}>
        <TextField
          label="Nombre"
          value={data.cliente.name || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, name: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Correo *"
          value={data.cliente.correo || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, correo: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Teléfono"
          value={data.cliente.telefono || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, telefono: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Dirección"
          value={data.cliente.direccion || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, direccion: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Identificación *"
          value={data.cliente.identificacion || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, identificacion: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="País"
          value={data.cliente.pais || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, pais: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Departamento"
          value={data.cliente.departamento || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, departamento: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Ciudad"
          value={data.cliente.ciudad || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, ciudad: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Tipo de Documento"
          value={data.cliente.tipoDocumento || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, tipoDocumento: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Tipo de Contribuyente"
          value={data.cliente.tipoContribuyente || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, tipoContribuyente: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Régimen Contable"
          value={data.cliente.tipoContribuyente || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, tipoContribuyente: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
        <TextField
          label="Tipo de Responsabilidad"
          value={data.cliente.regimenFiscal || ""}
          InputProps={{
            readOnly: true,
          }}
          onChange={(e) =>
            setData((prev: any) => ({
              ...prev,
              cliente: { ...prev.cliente, regimenFiscal: e.target.value },
            }))
          }
          variant="outlined"
          size="small"
        />
      </Box>
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
        title="¿ESTAS SEGURO QUE QUIERES ELIMINAR EL CLIENTE?"
        description={`Cliente: ${selectedClient?.name || ""}`}
      />
    </Box>
  );
};

export default StepCliente;
