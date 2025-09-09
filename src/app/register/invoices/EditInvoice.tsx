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
import React, { useEffect, useRef, useState } from "react";
import { editStyles, selectStyle } from "./styles";
import Factura from "./Factura";
import { updateInvoice } from "@/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import EditProducts from "./EditProducts";
import { getHoraColombia } from "@/components/Hooks/hooks";
import { Timestamp } from "firebase/firestore";

const setDeep = (obj: any, path: string, value: any) => {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
};
const formatDateColString = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day} ${h}:${min}`;
};

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
    paymentMethod: "",
    lastModified: ""
  });
  const [editProducts, setEditProducts] = useState(false);
  const originalRef = useRef<any>(null);
  type ClienteKeys = keyof typeof data.cliente;

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
    const newStatus = event.target.value;
    setData((prev) => {
      let next = { ...prev, status: newStatus };
      // PENDIENTE -> CANCELADO: fecha actual
      if (prev.status !== "CANCELADO" && newStatus === "CANCELADO") {
        const now = getHoraColombia();
        next.date = formatDateColString(now);
      }
      return next;
    });
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
  useEffect(() => {
    setData(rowData);
    originalRef.current = rowData; // <-- snapshot original
  }, [rowData]);


  const handleUpdateInvoice = async (uid: string, invoiceData: any) => {
    try {
      const prev = originalRef.current ?? {};
      const next = invoiceData;

      // 1) Calcula diffs como ya lo haces
      const changes: any[] = diffInvoice(prev, next);
      if (changes.length === 0) {
        enqueueSnackbar("Sin cambios por guardar", {
          variant: "info",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          onExited: handleBack,
        });
        return;
      }

      // 2) Hora local (tu util) y "quién" desde localStorage
      const tsDate = getHoraColombia();
      const ts = Timestamp.fromDate(tsDate);
      const who =
        JSON.parse(localStorage.getItem("dataUser") || "{}")?.name ?? "sistema";

      // 3) Construye lastModified nuevo (respetando el existente si lo hay)
      const lastModifiedNext = JSON.parse(
        JSON.stringify(data?.lastModified || {})
      );
      for (const ch of changes) {
        // Marca la última fecha por cada campo cambiado
        setDeep(lastModifiedNext, ch.field, ts);
      }

      // 4) Construye el nuevo manifest (append)
      const manifestPrev = Array.isArray((data as any).manifest)
        ? (data as any).manifest
        : [];
      const manifestEntry = { by: who, at: ts, changes };
      const manifestNext = [...manifestPrev, manifestEntry];

      // 5) Arma el payload final SIN tocar tu lógica interna (tu updateInvoice lo envía tal cual)
      const payload = {
        ...next,
        modifiedAt: ts,
        lastModifiedBy: who,
        lastModified: lastModifiedNext,
        manifest: manifestNext,
      };

      // 6) Llama tu MISMA función (sin modificarla)
      await updateInvoice(uid, payload);

      // Actualiza el original para próximos diffs
      originalRef.current = payload;

      enqueueSnackbar("Cambios guardados con éxito", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        onExited: handleBack,
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error al guardar cambios", {
        variant: "error",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };


  const get = (obj: any, path: string) =>
    path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
  const diffInvoice = (prev: any, next: any) => {
    const FIELDS = [
      "status",
      "paymentMethod",
      "cliente.name",
      "cliente.direccion",
      "cliente.email",
      "cliente.identificacion",
      "cliente.celular",
      "subtotal",
      "descuento",
      "total",
      "cambio",
      // Si luego habilitas edición de productos, puedes registrar un resumen:
      // "compra"  // y haces una comparación custom (ver tip abajo)
    ];
    const normalize = (v: any) => (typeof v === "string" ? v.trim() : v);
    const changes: any[] = [];

    for (const path of FIELDS) {
      const before = get(prev ?? {}, path);
      const after = get(next ?? {}, path);
      if (JSON.stringify(normalize(before)) !== JSON.stringify(normalize(after))) {
        changes.push({ field: path, from: before ?? null, to: after ?? null });
      }
    }
    return changes;
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
                        <FormControl sx={style} variant="outlined">
                          <Typography sx={editStyles.inputstypography}>
                            {input.name}
                          </Typography>
                          <OutlinedInput
                            value={data?.cliente?.[input?.field] ?? ""}
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
                  <Select
                    value={data.paymentMethod ?? "Efectivo"}
                    style={{
                      color:
                        data?.paymentMethod === "Transferencia"
                          ? "blue"
                          : "yellow",
                      fontWeight: 900,
                    }}
                    sx={selectStyle}
                    onChange={(event: any) => {
                      setData({ ...data, paymentMethod: event.target.value });
                    }}
                  >
                    <MenuItem sx={{ color: "red" }} value="Efectivo">
                      Efectivo
                    </MenuItem>
                    <MenuItem sx={{ color: "blue" }} value="Transferencia">
                      Transferencia
                    </MenuItem>
                  </Select>
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
                    <MenuItem sx={{ color: "red" }} value="PENDIENTE">
                      PENDIENTE
                    </MenuItem>
                    <MenuItem sx={{ color: "green" }} value="CANCELADO">
                      CANCELADO
                    </MenuItem>
                  </Select>
                  <Typography
                    sx={{
                      ...editStyles.productosTypography,
                      color: "#FFF",
                    }}
                  >
                    Disponible pronto
                  </Typography>
                  <IconButton
                    sx={{ padding: "8px 3px" }}
                    onClick={() => setEditProducts(true)}
                    disabled
                  >
                    <Box
                      component={"img"}
                      src={"/images/editGray.svg"}
                      sx={{ width: "1.2rem", height: "1.2rem" }}
                    />
                    <Typography
                      sx={{
                        ...editStyles.productosTypography,
                        textAlign: "center",
                      }}
                    >
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
          <Factura
            data={data}
            setFacturaData={function (value: any): void {
              // throw new Error("Function not implemented.");
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default EditInvoice;
