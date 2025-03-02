/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  TableContainer,
} from "@mui/material";
import { FacturaProviderContext } from "../context";
import { sendInvoiceToDian2 } from "../slidebar-dian/sendInvoiceToDian";
import { useCookies } from "react-cookie";
import {
  createInvoiceDian,
  createInvoiceDraft,
  getDianRecord,
} from "@/firebase/dian";
import SaveDraftDialog from "./SaveDraftDialog";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { login } from "@/components/DIAN/loginToken";
import { getCurrentDate, getEndOfYearDate } from "./InvoiceModal";

interface DianRecord {
  RangoInicio: string;
  TechnicalKey: string;
  name: string;
  phone: string;
  email: string;
  ValidDateTo: string;
  direction: string;
  Prefijo: string;
  Resolucion: string;
  ValidDateFrom: string;
  RangoFin: string;
  user: string;
  NIT: string;
  establishment: string;
}

const InvoicePreview = () => {
  const [cookies, setCookie] = useCookies(["invoice_token"]);
  const {
    localData,
    dataEstablishmentData,
    dianData,
    setLocalData,
    setActiveStep,
  } = useContext(FacturaProviderContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const localStorageDian: DianRecord | null = (() => {
    const storedValue = localStorage.getItem("dianRecord");
    try {
      return storedValue ? (JSON.parse(storedValue) as DianRecord) : null;
    } catch (error) {
      console.error(
        "Error al parsear el registro DIAN de localStorage:",
        error
      );
      return null;
    }
  })();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const userData = localStorage.getItem("dataUser");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setLogo(parsedData.img || null);
    }
  }, []);

  if (!localData) return <Typography>Cargando datos...</Typography>;

  const toggleMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return {
      date: `${year}-${month}-${day}`,
      hour: `${hours}:${minutes}:${seconds}`,
    };
  };

  const { date, hour } = getCurrentDateTime();

  const handleSendToDian = async () => {
    try {
      setIsSubmitting(true);

      // Obtener o generar el token
      let token = cookies.invoice_token;
      if (!token) {
        console.warn(
          "No se encontró el token. Iniciando sesión para obtener uno nuevo..."
        );

        // Generar un nuevo token
        const dian = await getDianRecord();
        const password = "Ab1007446687"; // Cambiar por una contraseña segura en producción
        const loginResponse = await login(
          dian?.email ?? "demo@lopezsoft.net.co",
          password
        );

        if (loginResponse?.access_token) {
          token = loginResponse.access_token;

          // Configurar la cookie con el nuevo token
          const expirationDate = new Date();
          expirationDate.setTime(
            expirationDate.getTime() + 24 * 60 * 60 * 1000
          ); // 1 día

          setCookie("invoice_token", token, {
            path: "/",
            expires: expirationDate,
            secure: true,
            sameSite: "strict",
          });

          console.log(
            "%cNuevo token generado y almacenado en cookies.",
            "color:green"
          );
        } else {
          throw new Error("Error al generar el token de autenticación.");
        }
      }

      // Enviar la factura a la DIAN
      const send = await sendInvoiceToDian2(localData, token);

      // Enriquecer los datos de la factura con la respuesta de la DIAN
      const enrichedData = {
        ...localData,
        attachedDocument: {
          pathZip: send?.AttachedDocument?.pathZip ?? "",
          path: send?.AttachedDocument?.path ?? "",
          url: send?.AttachedDocument?.url ?? "",
        },
        qrDian: send?.qr?.qrDian ?? "",
        qrUrl: send?.qr?.url ?? "",
        pdfUrl: send?.pdf?.url ?? "",
        date,
        hour,
      };

      // Crear la factura en el sistema local
      await createInvoiceDian(String(localData.document_number), enrichedData);

      // Actualizar la URL del PDF generado
      setPdfUrl(send?.pdf?.url ?? "");

      // Notificar éxito
      enqueueSnackbar("Factura enviada con éxito.", { variant: "success" });

      // Restablecer los datos locales de la factura
      setLocalData({
        cliente: {
          tipoDocumento: "",
          numeroDocumento: "",
          telefono: "",
          correo: "",
          nombre: "",
          pais: "",
          departamento: "",
          ciudad: "",
          direccion: "",
        },
        items: [],
        total: 0,
        document_number: 0,
        document_number_complete: "",
      });
    } catch (error) {
      console.error("Error al enviar la factura a la DIAN:", error);
      enqueueSnackbar(
        "Error al enviar la factura a la DIAN. Por favor, inténtelo nuevamente.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setOpenDialog(true);
  };

  const tableStyles = {
    backgroundColor: isDarkMode ? "#2E2E2E" : "#F9F9F9",
    color: isDarkMode ? "#FFFFFF" : "#000000",
    borderColor: isDarkMode ? "#444" : "#DDD",
  };

  const handleDraftSave = async (draftName: string) => {
    try {
      const draftData = {
        ...localData,
        draftName,
      };
      await createInvoiceDraft(draftName, draftData);
      setOpenDialog(false);
      enqueueSnackbar("Factura guardada como borrador", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setLocalData({
        cliente: {
          tipoDocumento: "",
          numeroDocumento: "",
          telefono: "",
          correo: "",
          nombre: "",
          pais: "",
          departamento: "",
          ciudad: "",
          direccion: "",
        },
        items: [],
        total: 0,
        document_number: 0,
        document_number_complete: "",
      });
      setActiveStep(0);
    } catch (error) {
      enqueueSnackbar("Error al guardar el borrador", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  const handleFinalize = () => {
    setPdfUrl(null);
    setActiveStep(0);
  };

  if (pdfUrl) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          padding: "20px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Contenedor de botones */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            display: "flex",
            gap: 1,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {/* Botón para finalizar */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#115293" },
            }}
            onClick={handleFinalize}
          >
            Finalizar
          </Button>

          {/* Botón para descargar el PDF */}
          <Button
            variant="contained"
            color="success"
            onClick={() => window.open(pdfUrl, "_blank")}
          >
            Descargar
          </Button>
        </Box>

        {/* Mensaje de éxito */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", mt: 4 }}
        >
          Factura enviada con éxito
        </Typography>

        {/* Contenedor del PDF */}
        <Box
          sx={{
            width: "100%",
            height: "calc(100vh - 80px)", // Resta la altura de los botones para que no lo cubran
            border: "1px solid #ccc",
            overflow: "hidden",
          }}
        >
          <iframe
            src={pdfUrl}
            title="Factura"
            width="100%"
            height="100%"
            style={{
              border: "none",
            }}
          />
        </Box>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "auto",
        backgroundColor: "#FFFFFF",
        padding: isMobile ? "12px" : "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <SnackbarProvider />

      {/* Botones de Acción */}
      <Grid container spacing={2} mb={2} justifyContent="center">
        <Grid item xs={12} sm="auto">
          <Button
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            onClick={handleSendToDian}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Enviar a la DIAN"}
          </Button>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button
            variant="contained"
            fullWidth={isMobile}
            onClick={handleSaveDraft}
          >
            Guardar Borrador
          </Button>
        </Grid>
      </Grid>
      <SaveDraftDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleDraftSave}
      />

      {/* Encabezado Factura */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} sm={6}>
          <Typography sx={{ textTransform: "uppercase" }} variant="h6">
            {dataEstablishmentData?.nameEstablishment ?? "Sin datos"}
          </Typography>
          <Typography variant="body2">
            N.I.T: {dataEstablishmentData?.NIT_CC ?? "Sin datos"}
          </Typography>
          <Typography variant="body2">
            {dataEstablishmentData?.email ?? "Sin datos"} |{" "}
            {dataEstablishmentData?.phone ?? "Sin datos"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} textAlign={isMobile ? "center" : "right"}>
          <Typography variant="h5" fontWeight="bold">
            FACTURA
          </Typography>
          <Typography variant="body2">
            Número: {localData?.document_number ?? "Sin número"}
          </Typography>
          <Typography variant="body2">
            Fecha: {new Date().toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ marginY: 2 }} />

      {/* Información del Cliente */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Información del Cliente:
        </Typography>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell>
                  {localData.cliente?.name || "Sin información"}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Identificación
                </TableCell>
                <TableCell>
                  {localData.cliente?.tipoDocumento || ""}:{" "}
                  {localData.cliente?.identificacion || "Sin información"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
                <TableCell>
                  {localData.cliente?.telefono || "Sin información"}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Correo</TableCell>
                <TableCell>
                  {localData.cliente?.correo || "Sin información"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Dirección</TableCell>
                <TableCell colSpan={3}>
                  {localData.cliente?.direccion || "Sin información"},{" "}
                  {localData.cliente?.ciudad}, {localData.cliente?.departamento}
                  , {localData.cliente?.pais}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Detalles de la Factura */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Detalles de la Factura:
        </Typography>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Detalle</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localData.items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>{item.detalle}</TableCell>
                  <TableCell align="center">{item.cantidad}</TableCell>
                  <TableCell align="right">
                    ${item.precio.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ${item.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Totales */}
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Box>
          <Typography variant="body1">
            <strong>Subtotal:</strong> ${localData.total.toLocaleString()}
          </Typography>
          <Typography variant="body1">
            <strong>IVA (19%):</strong> $
            {/* {Math.round(localData.total * 0.19).toLocaleString()} */}0
          </Typography>
          <Typography variant="h5">
            <strong>Total:</strong> $
            {Math.round(localData.total).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoicePreview;
