import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function cleanHtml(html: string | null | undefined): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || html;
}

const InvoiceTable = ({
  data,
  isDarkMode = true,
}: {
  data: any[];
  isDarkMode?: boolean;
}) => {
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const handlePreviewPdf = (url: string) => {
    setPdfPreviewUrl(url);
  };

  const handleClosePdfPreview = () => {
    setPdfPreviewUrl(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: isDarkMode ? "#1F1D2B" : "#FFFFFF",
        color: isDarkMode ? "#FFFFFF" : "#000000",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: isDarkMode
          ? "0px 4px 8px rgba(0, 0, 0, 0.5)"
          : "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: isDarkMode ? "#333333" : "#F5F5F5",
            }}
          >
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              #
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Cliente
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Fecha de Pago
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Total
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Cedula
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Referencia
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Estado
            </TableCell>
            <TableCell
              sx={{
                color: isDarkMode ? "#69EAE2" : "#000000",
                textAlign: "center",
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((invoice, index) => {
            const pdfUrl = `https://wisphub.io/facturas/editar/teleconexionesjyjsas/${invoice.id_factura}/`;

            return (
              <TableRow
                key={invoice.id_factura}
                sx={{
                  backgroundColor: isDarkMode ? "#1F1D2B" : "#FFFFFF",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#333333" : "#F5F5F5",
                  },
                }}
              >
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  {cleanHtml(invoice.cliente)}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  {invoice.fecha_pago}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  ${parseFloat(invoice.total).toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  {invoice.cliente__perfilusuario__cedula}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  {invoice.referencia}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  <CheckCircleIcon sx={{ color: "green" }} />{" "}
                  {cleanHtml(invoice.estado)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    sx={{ color: isDarkMode ? "#69EAE2" : "#1E88E5" }}
                    onClick={() => handlePreviewPdf(pdfUrl)}
                  >
                    <VisibilityIcon />
                  </Button>
                  <Button
                    variant="text"
                    sx={{ color: isDarkMode ? "#69EAE2" : "#1E88E5", ml: 1 }}
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Editar
                  </Button>
                  {/* Agrega aquí un botón de descarga si en el futuro tienes ZIP */}
                  {/* <Button ...> <DownloadIcon /> </Button> */}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {pdfPreviewUrl && (
        <Dialog
          open={!!pdfPreviewUrl}
          onClose={handleClosePdfPreview}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent>
            <iframe
              src={pdfPreviewUrl}
              title="PDF Preview"
              style={{ width: "100%", height: "600px", border: "none" }}
            ></iframe>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePdfPreview} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default InvoiceTable;
