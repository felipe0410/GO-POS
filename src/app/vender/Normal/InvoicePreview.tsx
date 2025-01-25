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
  const [open, setOpen] = useState(false);
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
            maxHeight: isSmallScreen ? "90%" : "80%",
            overflowY: "auto",
            bgcolor: "#1F1D2B",
            color: "#69EAE2",
            borderRadius: "16px",
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography
            id="invoice-preview-title"
            variant={isSmallScreen ? "subtitle1" : "h6"}
            sx={{
              marginBottom: "16px",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: isSmallScreen ? "1rem" : "1.5rem",
            }}
          >
            Previsualización de Factura
          </Typography>

          <Box
            sx={{
              overflowX: "auto",
              maxWidth: "100%",
              maxHeight: isSmallScreen ? "50vh" : "60vh",
            }}
          >
            <Table sx={{ marginBottom: "16px" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#69EAE2", fontWeight: "bold" }}>Producto</TableCell>
                  <TableCell sx={{ color: "#69EAE2", fontWeight: "bold" }} align="center">
                    Cantidad
                  </TableCell>
                  <TableCell sx={{ color: "#69EAE2", fontWeight: "bold" }} align="right">
                    Acumulado
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "#fff", fontSize: isSmallScreen ? "0.9rem" : "1rem" }}>
                      {item.productName}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", textAlign: "center", fontSize: isSmallScreen ? "0.9rem" : "1rem" }}
                    >
                      {item.cantidad}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", textAlign: "right", fontSize: isSmallScreen ? "0.9rem" : "1rem" }}
                    >
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
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", fontSize: isSmallScreen ? "1rem" : "1.2rem" }}
            >
              Total:
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#fff", fontSize: isSmallScreen ? "1rem" : "1.2rem" }}
            >
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
                fontSize: isSmallScreen ? "0.9rem" : "1rem",
                padding: isSmallScreen ? "8px 16px" : "10px 20px",
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
