import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getInvoiceData } from "@/firebase"; // Importa tu función

interface ReturnSidebarProps {
  open: boolean;
  onClose: () => void;
  invoices: any[]; // Lista de facturas
}

const ReturnSidebar: React.FC<ReturnSidebarProps> = ({ open, onClose, invoices }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (selectedInvoice) {
      fetchInvoiceDetails(selectedInvoice);
    }
  }, [selectedInvoice]);

  const fetchInvoiceDetails = async (uid: string) => {
    setLoading(true);
    const data = await getInvoiceData(uid);
    setInvoiceData(data);
    setLoading(false);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleReturn = () => {
    const selectedProductList = Object.keys(selectedProducts).filter((id) => selectedProducts[id]);
    console.log("Productos a devolver:", selectedProductList);
    // Aquí puedes enviar los productos seleccionados a tu backend o procesarlos
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 350, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Devolución de Productos</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Selección de factura */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Selecciona una factura:
        </Typography>
        <List>
          {invoices.map((invoice) => (
            <ListItem
              button
              key={invoice.id}
              selected={selectedInvoice === invoice.id}
              onClick={() => setSelectedInvoice(invoice.id)}
            >
              <ListItemText primary={`Factura #${invoice.id}`} secondary={`Fecha: ${invoice.date}`} />
            </ListItem>
          ))}
        </List>

        {/* Detalles de la factura */}
        {loading && <CircularProgress sx={{ display: "block", margin: "10px auto" }} />}
        {invoiceData && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Productos en la Factura:
            </Typography>
            <List>
              {invoiceData.products.map((product: any) => (
                <ListItem key={product.id}>
                  <Checkbox
                    checked={!!selectedProducts[product.id]}
                    onChange={() => handleProductSelect(product.id)}
                  />
                  <ListItemText primary={product.name} secondary={`Cantidad: ${product.quantity}`} />
                </ListItem>
              ))}
            </List>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleReturn}
              sx={{ mt: 2 }}
              disabled={Object.values(selectedProducts).every((v) => !v)}
            >
              Confirmar Devolución
            </Button>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default ReturnSidebar;
