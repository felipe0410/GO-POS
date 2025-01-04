/* eslint-disable @next/next/no-img-element */
import React, { useContext, useRef } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceModal = ({ invoice, open, onClose }: any) => {
  const {
    localData,
    dataEstablishmentData,
    dianData,
  } = useContext(FacturaProviderContext);

  const logo = dataEstablishmentData?.img; 
  const pdfRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a2");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Factura-${invoice?.document_number ?? "sin-numero"}.pdf`);
  };

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
          {/* Información del Establecimiento */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              {logo && <img src={logo} alt="Logo" style={{ height: "50px", marginBottom: "10px" }} />}
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
            </Box>
            <Box textAlign="right">
              <Typography variant="h5" fontWeight="bold">
                FACTURA
              </Typography>
              <Typography variant="body2">
                Número: {invoice?.document_number ?? dianData?.Prefijo ?? "Sin número"}
              </Typography>
              <Typography variant="body2">Fecha: {invoice?.date ?? "Sin fecha"}</Typography>
              <Typography variant="body2">
                Vencimiento: {invoice?.due_date ?? "Sin fecha"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          {/* Información del Cliente */}
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              Información del Cliente
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                  <TableCell>{invoice?.cliente?.name ?? localData?.cliente?.name ?? "Sin información"}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Identificación</TableCell>
                  <TableCell>
                    {invoice?.cliente?.tipoDocumento || ""}:{" "}
                    {invoice?.cliente?.identificacion || "Sin información"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
                  <TableCell>{invoice?.cliente?.telefono ?? localData?.cliente?.telefono ?? "Sin información"}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Correo</TableCell>
                  <TableCell>{invoice?.cliente?.correo ?? localData?.cliente?.correo ?? "Sin información"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Dirección</TableCell>
                  <TableCell colSpan={3}>
                    {invoice?.cliente?.direccion ?? localData?.cliente?.direccion ?? "Sin información"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          {/* Detalles de los Ítems */}
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              Detalles de la Factura
            </Typography>
            <Table>
              {/* Encabezados */}
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
              {/* Cuerpo */}
              <TableBody>
                {(invoice?.items ?? localData?.items)?.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item?.codigo ?? "Sin código"}</TableCell>
                    <TableCell>{item?.detalle ?? "Sin detalle"}</TableCell>
                    <TableCell align="center">{item?.cantidad ?? 0}</TableCell>
                    <TableCell align="right">${item?.precio?.toLocaleString() ?? 0}</TableCell>
                    <TableCell align="right">${item?.total?.toLocaleString() ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Totales */}
          <Box textAlign="right">
            <Typography variant="body1">
              <strong>Subtotal:</strong> ${invoice?.subtotal?.toLocaleString() ?? localData?.subtotal?.toLocaleString() ?? 0}
            </Typography>
            <Typography variant="body1">
              <strong>IVA (19%):</strong> ${invoice?.iva?.toLocaleString() ?? localData?.iva?.toLocaleString() ?? 0}
            </Typography>
            <Typography variant="h5">
              <strong>Total:</strong> ${invoice?.total?.toLocaleString() ?? localData?.total?.toLocaleString() ?? 0}
            </Typography>
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
