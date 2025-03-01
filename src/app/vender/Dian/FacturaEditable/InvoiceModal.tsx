'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Divider,
  Button,
} from "@mui/material";
import { FacturaProviderContext } from "../context";
// @ts-ignore
import html2pdf from "html2pdf.js";

const cellStyle = { color: "#000" };
export const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Obtiene solo la parte de la fecha (YYYY-MM-DD)
};

// Función para obtener el último día del año en formato YYYY-MM-DD
export const getEndOfYearDate = () => {
  const endOfYear = new Date(new Date().getFullYear(), 11, 31); // Último día de diciembre
  return endOfYear.toISOString().split("T")[0];
};

const InvoiceModal = ({ invoice, open, onClose }: any) => {
  const { localData, dataEstablishmentData, dianData } = useContext(
    FacturaProviderContext
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);
  const logo = dataEstablishmentData?.img;
  const pdfRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;
  const handleDownloadPDF = async () => {
    if (!isClient || !pdfRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default; // Importa dinámicamente solo en el cliente

    pdfRef.current.classList.add("pdf-light-mode");

    const options = {
      margin: 10,
      filename: `factura-${invoice?.document_number ?? "sin-numero"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      await html2pdf().from(pdfRef.current).set(options).save();
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };
  if (!isClient) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Factura Detallada
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadPDF}
          sx={{ marginLeft: 2 }}
        >
          Descargar PDF
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box ref={pdfRef}>
          <Box sx={{ background: "#fff", padding: "10px" }}>
            {/* Información del Establecimiento */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              sx={{ color: "#000" }}
            >
              <Box>
                {logo && (
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ height: "50px", marginBottom: "10px" }}
                  />
                )}
                <Typography sx={{ textTransform: "uppercase", fontWeight:'900' }} variant="h6">
                  {dataEstablishmentData?.nameEstablishment ?? "Sin datos"}
                </Typography>
                <Typography variant="body2">
                  N.I.T: {dataEstablishmentData?.NIT_CC ?? "Sin datos"}
                </Typography>
                <Typography variant="body2">
                  {dataEstablishmentData?.email ?? "Sin datos"} |{" "}
                  {dataEstablishmentData?.phone ?? "Sin datos"}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="h5" fontWeight="bold">
                  FACTURA
                </Typography>
                <Typography variant="body2">
                  Número:{" "}
                  {invoice?.document_number ??
                    dianData?.Prefijo ??
                    "Sin número"}
                </Typography>
                <Typography variant="body2">
                  Fecha: {invoice?.date ?? getCurrentDate()}{" "}
                  {/* Usa la fecha actual si no hay fecha en la factura */}
                </Typography>
                <Typography variant="body2">
                  Vencimiento: {invoice?.due_date ?? getEndOfYearDate()}{" "}
                  {/* Usa el último día del año si no hay vencimiento */}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            {/* Información del Cliente */}
            <Box sx={{ color: "#000" }} mb={2}>
              <Typography variant="h6" gutterBottom>
                Información del Cliente
              </Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={cellStyle}>Nombre</TableCell>
                    <TableCell sx={cellStyle}>
                      {invoice?.cliente?.name ??
                        localData?.cliente?.name ??
                        "Sin información"}
                    </TableCell>
                    <TableCell sx={cellStyle}>Identificación</TableCell>
                    <TableCell sx={cellStyle}>
                      {invoice?.cliente?.tipoDocumento || ""}:{" "}
                      {invoice?.cliente?.identificacion || "Sin información"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={cellStyle}>Teléfono</TableCell>
                    <TableCell sx={cellStyle}>
                      {invoice?.cliente?.telefono ??
                        localData?.cliente?.telefono ??
                        "Sin información"}
                    </TableCell>
                    <TableCell sx={cellStyle}>Correo</TableCell>
                    <TableCell sx={cellStyle}>
                      {invoice?.cliente?.correo ??
                        localData?.cliente?.correo ??
                        "Sin información"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={cellStyle}>Dirección</TableCell>
                    <TableCell sx={cellStyle} colSpan={3}>
                      {invoice?.cliente?.direccion ??
                        localData?.cliente?.direccion ??
                        "Sin información"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            {/* Detalles de los Ítems */}
            <Box mb={2} sx={{ color: "#000" }}>
              <Typography variant="h6" gutterBottom>
                Detalles de la Factura
              </Typography>
              <Table>
                {/* Encabezados */}
                <TableHead>
                  <TableRow>
                    <TableCell sx={cellStyle}>#</TableCell>
                    <TableCell sx={cellStyle}>Código</TableCell>
                    <TableCell sx={cellStyle}>Detalle</TableCell>
                    <TableCell sx={cellStyle} align="center">
                      Cantidad
                    </TableCell>
                    <TableCell sx={cellStyle} align="right">
                      Precio
                    </TableCell>
                    <TableCell sx={cellStyle} align="right">
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                {/* Cuerpo */}
                <TableBody>
                  {(invoice?.items ?? localData?.items)?.map(
                    (item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell sx={cellStyle}>{index + 1}</TableCell>
                        <TableCell sx={cellStyle}>
                          {item?.codigo ?? "Sin código"}
                        </TableCell>
                        <TableCell sx={cellStyle}>
                          {item?.detalle ?? "Sin detalle"}
                        </TableCell>
                        <TableCell sx={cellStyle} align="center">
                          {item?.cantidad ?? 0}
                        </TableCell>
                        <TableCell sx={cellStyle} align="right">
                          ${item?.precio?.toLocaleString() ?? 0}
                        </TableCell>
                        <TableCell sx={cellStyle} align="right">
                          ${item?.total?.toLocaleString() ?? 0}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </Box>

            {/* Totales */}
            <Box textAlign="right">
              <Typography variant="body1">
                <strong>Subtotal:</strong> $
                {invoice?.subtotal?.toLocaleString() ??
                  localData?.subtotal?.toLocaleString() ??
                  0}
              </Typography>
              <Typography variant="body1">
                <strong>IVA (19%):</strong> $
                {invoice?.iva?.toLocaleString() ??
                  localData?.iva?.toLocaleString() ??
                  0}
              </Typography>
              <Typography variant="h5">
                <strong>Total:</strong> $
                {invoice?.total?.toLocaleString() ??
                  localData?.total?.toLocaleString() ??
                  0}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="contained" color="primary" onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
