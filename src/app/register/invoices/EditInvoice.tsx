import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import React, { useEffect, useState } from "react";
import { editStyles, selectStyle } from "./styles";
import Factura from "./Factura";
import { updateInvoice } from "@/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import EditProducts from "./EditProducts";

const EditInvoice = ({
  rowData,
  setEditInvoice,
  setEditingInvoice,
}: {
  rowData: any;
  setEditInvoice: any;
  setEditingInvoice: any;
}) => {
  const [data, setData] = useState({
    invoice: "",
    date: "",
    status: "PENDIENTE",
    vendedor: "xxx",
    cliente: {
      name: "",
      direccion: "",
      email: "",
      identificacion: "",
      celular: "",
    },
    compra: [],
    subtotal: 0,
    descuento: 0,
    total: 0,
    cambio: 0,
    uid: "",
  });
  const [editProducts, setEditProducts] = useState(false);

  type ClienteKeys = keyof typeof data.cliente;
  console.log(data);

  type InvoiceInput = {
    name: string;
    type: string;
    width: string;
    field: keyof typeof data.cliente;
  };
  const invoicesInputs: InvoiceInput[] = [
    {
      name: "Nombre",
      type: "text",
      width: "100%",
      field: "name",
    },
    {
      name: "Dirección",
      type: "text",
      width: "100%",
      field: "direccion",
    },
    {
      name: "Correo",
      type: "mail",
      width: "100%",
      field: "email",
    },
    {
      name: "NIT/CC",
      type: "text",
      width: "45%",
      field: "identificacion",
    },

    {
      name: "Telefono",
      type: "number",
      width: "45%",
      field: "celular",
    },
  ];

  const handleBack = () => {
    setEditInvoice(false);
    setEditingInvoice(false);
  };

  const handleSelectChange = (event: any) => {
    setData({ ...data, status: event.target.value });
  };

  const inputOnChange = (field: ClienteKeys, value: string) => {
    setData((prevData) => ({
      ...prevData,
      cliente: {
        ...prevData.cliente,
        [field]: value,
      },
    }));
  };

  const handleUpdateInvoice = async (uid: string, invoiceData: any) => {
    try {
      await updateInvoice(uid, invoiceData);
      enqueueSnackbar("Cambios guardados con éxito", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      enqueueSnackbar("Error al guardar cambios", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.error(error);
    }
  };

  useEffect(() => {
    setData(rowData);
  }, [rowData]);

  return (
    <>
      <SnackbarProvider />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ width: "65%" }}>
          <Box sx={{ textAlign: "start" }}>
            <IconButton sx={{ paddingLeft: 0 }} onClick={handleBack}>
              <ChevronLeftIcon
                sx={{ color: "#69EAE2", width: "50px", height: "42px" }}
              />
              <Typography sx={editStyles.backTypography}>
                EDITAR FACTURA
              </Typography>
            </IconButton>
          </Box>
          {editProducts ? (
            <EditProducts data={data} />
          ) : (
            <Box>
              <Typography
                sx={editStyles.ventaTypography}
              >{`VENTA #${rowData.invoice}`}</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <Typography sx={editStyles.encabezadoTypography}>
                  DATOS DEL CLIENTE
                </Typography>
                <Typography sx={editStyles.encabezadoTypography}>
                  DATOS DE FACTURACION
                </Typography>
              </Box>
              <Divider sx={{ background: "#69EAE2", marginTop: "0.5rem" }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "1rem",
                  justifyContent: "space-around",
                }}
              >
                <Box sx={{ textAlign: "start", width: "45%" }}>
                  {invoicesInputs.map((input, index) => {
                    const style = {
                      width: input.width,
                      marginTop: "10px",
                      marginLeft: {
                        sm:
                          input.width === "45%" && [4].includes(index)
                            ? "10%"
                            : "0",
                      },
                    };

                    return (
                      <React.Fragment key={index * 123}>
                        <FormControl sx={style} variant='outlined'>
                          <Typography sx={editStyles.inputstypography}>
                            {input.name}
                          </Typography>
                          <OutlinedInput
                            value={data.cliente[input.field]}
                            onChange={(e) => {
                              inputOnChange(input.field, e.target.value);
                            }}
                            type={input.type}
                            sx={{
                              height: "44.9px",
                              borderRadius: "0.625rem",
                              background: "#2C3248",
                              boxShadow:
                                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                            style={{ color: "#FFF" }}
                          />
                        </FormControl>
                      </React.Fragment>
                    );
                  })}
                </Box>
                <Box sx={{ textAlign: "start", width: "45%" }}>
                  <Typography
                    sx={{ ...editStyles.inputstypography, marginTop: "10px" }}
                  >
                    Metodo de pago
                  </Typography>
                  <OutlinedInput
                    disabled
                    value='Efectivo'
                    type='text'
                    sx={{
                      width: "100%",
                      height: "44.9px",
                      borderRadius: "0.625rem",
                      background: "#2C3248",
                      boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    style={{ color: "#FFF" }}
                  />
                  <Typography
                    sx={{ ...editStyles.inputstypography, marginTop: "10px" }}
                  >
                    Estado de la compra
                  </Typography>
                  <Select
                    value={data.status ? data.status : "CANCELADO"}
                    style={{
                      color: data.status === "PENDIENTE" ? "red" : "green",
                    }}
                    sx={selectStyle}
                    onChange={handleSelectChange}
                  >
                    <MenuItem sx={{ color: "red" }} value='PENDIENTE'>
                      PENDIENTE
                    </MenuItem>
                    <MenuItem sx={{ color: "green" }} value='CANCELADO'>
                      CANCELADO
                    </MenuItem>
                  </Select>
                  <IconButton
                    sx={{ padding: "8px 3px", marginTop: "10px" }}
                    onClick={() => setEditProducts(true)}
                  >
                    <Box
                      component={"img"}
                      src={"/images/edit.svg"}
                      sx={{ width: "1.2rem", height: "1.2rem" }}
                    />
                    <Typography sx={editStyles.productosTypography}>
                      Editar productos facturados
                    </Typography>
                  </IconButton>
                </Box>
              </Box>
              <Button
                onClick={() => handleUpdateInvoice(data.uid, data)}
                sx={{
                  height: "2.5rem",
                  borderRadius: "0.625rem",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  background: "#69EAE2",
                  marginTop: "40px",
                  "&:hover": { backgroundColor: "#69EAE2" },
                }}
              >
                <Typography sx={editStyles.typographyButton}>
                  Guardar Cambios
                </Typography>
              </Button>
            </Box>
          )}
        </Box>
        <Box sx={{ width: "35%", textAlign: "start", marginLeft: "1rem" }}>
          <Factura data={data} />
        </Box>
      </Box>
    </>
  );
};

export default EditInvoice;
