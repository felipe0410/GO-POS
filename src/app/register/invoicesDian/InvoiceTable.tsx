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
  Backdrop,
  CircularProgress,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getDianRecord } from "@/firebase/dian";
import { login } from "@/components/DIAN/loginToken";
import { useCookies } from "react-cookie";

const InvoiceTable = ({
  data,
  isDarkMode = true,
}: {
  data: any[];
  isDarkMode?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["invoice_token"]);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const handlePreviewPdf = async (url: string | undefined, qrDian: string) => {
    try {
      setLoading(true)
      let trackId = "";
      const match = qrDian.match(/documentkey=([a-f0-9]+)/i);
      if (match && match[1]) {
        trackId = match[1];
      } else {
        throw new Error("No se pudo extraer el trackId del QR DIAN");
      }

      if (url) {
        try {
          const response = await fetch(url, { method: "GET" });
          if (response.ok) {
            setPdfPreviewUrl(url);
            return;
          }
        } catch (err) {
          console.warn("El PDF original no está disponible. Se procederá a regenerarlo.");
        }
      }

      console.warn("PDF no disponible, se va a regenerar...");

      // Obtener o generar token
      let token = cookies.invoice_token;
      if (!token) {
        const dian = await getDianRecord();
        const password =
          dian?.email === "Sergiosua11@gmail.com" ? "Ab1007446687$" : "Ab1007446687";
        const loginResponse = await login(
          dian?.email ?? "demo@lopezsoft.net.co",
          password
        );

        if (loginResponse?.access_token) {
          token = loginResponse.access_token;
          const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
          setCookie("invoice_token", token, {
            path: "/",
            expires: expirationDate,
            secure: true,
            sameSite: "strict",
          });
        } else {
          throw new Error("No se pudo generar token.");
        }
      }

      // Regenerar PDF con el trackId
      const pdfResponse = await fetch(
        `https://api-v2.matias-api.com/api/ubl2.1/documents/pdf/${trackId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ regenerate: 1 }),
        }
      );

      if (!pdfResponse.ok) {
        throw new Error("No se pudo regenerar el PDF");
      }

      const data = await pdfResponse.json();

      if (data?.pdf?.url) {
        setPdfPreviewUrl(data.pdf.url);
      } else {
        throw new Error("No se recibió la URL del PDF");
      }

    } catch (error) {
      console.error("Error en la previsualización del PDF:", error);
    } finally {
      setLoading(false)
    }
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
              Fecha
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Total
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Prefijo
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Número
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? "#69EAE2" : "#000000" }}>
              Número DIAN
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
            const zipUrl = `https://api-v2.matias-api.com/attachments/${invoice.attachedDocument?.pathZip}`;
            console.log('invoice::>', invoice)
            return (
              <TableRow
                key={invoice.id}
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
                  {invoice.cliente?.name}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  {invoice?.date?.split(" ")[0] ?? ""}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  ${invoice.total.toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  {invoice.document_number_complete?.split("-")[0] ?? ""}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  {invoice.document_number}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  {invoice.document_number_complete}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
                  <CheckCircleIcon sx={{ color: "green" }} /> {invoice.status}
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    sx={{ color: isDarkMode ? "#69EAE2" : "#1E88E5" }}
                    onClick={() => handlePreviewPdf(invoice.pdfUrl, invoice.qrDian)}
                  >
                    <VisibilityIcon />
                  </Button>
                  <Button
                    variant="text"
                    sx={{ color: isDarkMode ? "#69EAE2" : "#1E88E5", ml: 1 }}
                    href={invoice.qrDian}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Consultar
                  </Button>
                  <Button
                    variant="text"
                    sx={{ color: isDarkMode ? "#69EAE2" : "#1E88E5", ml: 1 }}
                    href={zipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DownloadIcon />
                  </Button>
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" />
          <Typography variant="body1" mt={2}>
            Procesando solicitud, por favor espera...
          </Typography>
        </Box>
      </Backdrop>

    </Box>
  );
};

export default InvoiceTable;
