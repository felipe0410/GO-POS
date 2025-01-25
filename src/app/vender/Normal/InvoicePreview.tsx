import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";

interface InvoicePreviewProps {
  selectedItems: {
    productName: string;
    cantidad: number;
    acc: number;
  }[];
}

const InvoicePreviewModal: React.FC<InvoicePreviewProps> = ({ selectedItems }) => {
  const [open, setOpen] = useState(false); // Estado para controlar el modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const totalFactura = selectedItems.reduce((total, item) => total + item.acc, 0);

  // Responsive design
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {/* Botón con ícono para abrir el modal */}
      <Button onClick={handleOpen} sx={{ minWidth: "40px", padding: 0 }}>
        <PreviewIcon fontSize="large" sx={{ color: "#69EAE2" }} />
      </Button>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="invoice-preview-title"
        aria-describedby="invoice-preview-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isSmallScreen ? "90%" : "600px",
            bgcolor: "#1F1D2B",
            color: "#69EAE2",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="invoice-preview-title"
            variant="h6"
            sx={{ marginBottom: "16px", fontWeight: "bold", textAlign: "center" }}
          >
            Previsualización de Factura
          </Typography>

          <Box sx={{ overflow: "auto", maxWidth: "100%", height:'50vh' }}>
            <Table sx={{ marginBottom: "16px", minWidth: "10px" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#69EAE2" }}>Producto</TableCell>
                  <TableCell sx={{ color: "#69EAE2" }} align="center">
                    Cantidad
                  </TableCell>
                  <TableCell sx={{ color: "#69EAE2" }} align="right">
                    Acumulado
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "#fff" }}>{item.productName}</TableCell>
                    <TableCell sx={{ color: "#fff" }} align="center">
                      {item.cantidad}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }} align="right">
                      ${item.acc.toLocaleString("es-CO")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderTop: "1px solid #69EAE2",
              marginTop: "16px",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Total:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#fff" }}>
              ${totalFactura.toLocaleString("es-CO")}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", marginTop: "16px" }}>
            <Button
              onClick={handleClose}
              sx={{
                background: "#69EAE2",
                color: "#1F1D2B",
                fontWeight: "bold",
                "&:hover": {
                  background: "#5ACBCC",
                },
              }}
            >
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default InvoicePreviewModal;
