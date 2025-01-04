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
} from "@mui/material";
import { FacturaProviderContext } from "../context";
import { sendInvoiceToDian2 } from "../slidebar-dian/sendInvoiceToDian";
import { useCookies } from "react-cookie";
import { createInvoiceDian, createInvoiceDraft } from "@/firebase/dian";
import SaveDraftDialog from "./SaveDraftDialog";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

const InvoicePreview = () => {
  const [cookies] = useCookies(["invoice_token"]);
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
      const token = cookies.invoice_token;
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }
      const send = await sendInvoiceToDian2(localData, token);
      if (
        send &&
        send.response &&
        send.qr &&
        send.pdf
      ) {
        const enrichedData = {
          ...localData,
          attachedDocument: {
            pathZip: send?.AttachedDocument?.pathZip??'',
            path: send?.AttachedDocument?.path??'',
            url: send?.AttachedDocument?.url??'',
          },
          qrDian: send.qr.qrDian,
          qrUrl: send.qr.url,
          pdfUrl: send.pdf.url,
          date,
          hour,
        };

        await createInvoiceDian(
          String(localData.document_number),
          enrichedData
        );
        setPdfUrl(send.pdf.url);
        enqueueSnackbar("Factura enviada con éxito.", { variant: "success" });
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
        //setActiveStep(0);
      }
    } catch (error) {
      console.error("Error al enviar la factura a la DIAN:", error);
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
          height: "60vh",
          width: "100%",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          <Typography variant="h5" gutterBottom>
            Factura enviada con éxito
          </Typography>
          <Button
            variant="contained"
            sx={{ marginTop: 2, marginLeft: "15px" }}
            onClick={handleFinalize}
          >
            Finalizar
          </Button>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "80%",
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
        backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
        color: isDarkMode ? "#FFFFFF" : "#000000",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <SnackbarProvider />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendToDian}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Enviar a la DIAN"}
        </Button>
        <SaveDraftDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleDraftSave}
        />
        <Button variant="contained" onClick={handleSaveDraft}>
          Guardar Borrador
        </Button>
        <Button variant="contained" onClick={toggleMode}>
          Cambiar a {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
        </Button>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          {logo && <img src={logo} alt="Logo" style={{ height: "50px" }} />}
          <Typography sx={{ textTransform: "uppercase" }} variant="h6">
            {dataEstablishmentData?.nameEstablishment ?? "sin datos"}
          </Typography>{" "}
          <Typography variant="body2">
            N.I.T: {dataEstablishmentData?.NIT_CC ?? "sin datos"}
          </Typography>
          <Typography variant="body2">
            {dataEstablishmentData?.email ?? "sin datos"} |{" "}
            {dataEstablishmentData?.phone ?? "sin datos"}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h5" fontWeight="bold">
            FACTURA
          </Typography>
          <Typography variant="body2">
            Número: {dianData?.Prefijo ?? "sin prefijo"}-
            {localData?.document_number ?? "sin numero"}
          </Typography>
          <Typography variant="body2">Fecha: 24 Dic 2024</Typography>
          <Typography variant="body2">Vencimiento: 31 Dic 2024</Typography>
        </Box>
      </Box>
      <Divider sx={{ marginY: 2 }} />
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Información del Cliente:
        </Typography>
        <Table
          sx={{
            border: `1px solid ${tableStyles.borderColor}`,
            backgroundColor: tableStyles.backgroundColor,
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: tableStyles.color }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: tableStyles.color }}>
                {localData.cliente.name}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: tableStyles.color }}>
                Identificación
              </TableCell>
              <TableCell sx={{ color: tableStyles.color }}>
                {localData?.cliente?.tipoDocumento || ""}:{" "}
                {localData?.cliente?.identificacion || "Sin información"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: tableStyles.color }}>
                Teléfono
              </TableCell>
              <TableCell sx={{ color: tableStyles.color }}>
                {localData.cliente.telefono}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: tableStyles.color }}>
                Correo
              </TableCell>
              <TableCell sx={{ color: tableStyles.color }}>
                {localData?.cliente?.correo || "Sin información"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: tableStyles.color }}>
                Dirección
              </TableCell>
              <TableCell sx={{ color: tableStyles.color }} colSpan={3}>
                {localData.cliente.direccion}, {localData.cliente.ciudad},{" "}
                {localData.cliente.departamento}, {localData.cliente.pais}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Detalles de la factura */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Detalles de la Factura:
        </Typography>
        <Table sx={{ border: `1px solid ${tableStyles.borderColor}` }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: tableStyles.backgroundColor }}>
              <TableCell sx={{ color: tableStyles.color }}>#</TableCell>
              <TableCell sx={{ color: tableStyles.color }}>Código</TableCell>
              <TableCell sx={{ color: tableStyles.color }}>Detalle</TableCell>
              <TableCell align="center" sx={{ color: tableStyles.color }}>
                Cantidad
              </TableCell>
              <TableCell align="right" sx={{ color: tableStyles.color }}>
                Precio
              </TableCell>
              <TableCell align="right" sx={{ color: tableStyles.color }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localData.items.map((item: any, index: number) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#2A2A2A" : "#F1F1F1",
                  },
                }}
              >
                <TableCell sx={{ color: tableStyles.color }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ color: tableStyles.color }}>
                  {item.codigo}
                </TableCell>
                <TableCell sx={{ color: tableStyles.color }}>
                  {item.detalle}
                </TableCell>
                <TableCell sx={{ color: tableStyles.color }} align="center">
                  {item.cantidad}
                </TableCell>
                <TableCell sx={{ color: tableStyles.color }} align="right">
                  ${item.precio.toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: tableStyles.color }} align="right">
                  ${item.total.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Box>
          <Typography variant="body1">
            <strong>Subtotal:</strong> ${localData.total.toLocaleString()}
          </Typography>
          <Typography variant="body1">
            <strong>IVA (19%):</strong> $
            {Math.round(localData.total * 0).toLocaleString()}
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
