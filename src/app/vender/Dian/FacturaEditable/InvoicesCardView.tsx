import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Pagination,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import InvoiceModal from "./InvoiceModal";
import { Visibility, FileDownload } from "@mui/icons-material";

const ITEMS_PER_PAGE = 4;

const InvoicesCardView = ({ drafts, sentInvoices, onImportInvoice }: any) => {
  console.log("drafts:::>", drafts);
  const [tab, setTab] = useState<"drafts" | "sent">("drafts");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: "drafts" | "sent"
  ) => {
    setTab(newValue);
    setPage(1);
  };

  const invoices = tab === "drafts" ? drafts : sentInvoices;

  const filteredInvoices = useMemo(() => {
    return invoices.filter(
      (invoice: any) =>
        invoice.document_number?.toString().includes(searchTerm) ||
        invoice.cliente?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.date?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);

  // Obtener las facturas para la página actual
  const paginatedInvoices = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInvoices, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Resetear a la primera página al buscar
  };

  const handlePreviewInvoice = (invoice: any) => {
    setPreviewInvoice(invoice);
  };

  const handleClosePreview = () => {
    setPreviewInvoice(null);
  };

  return (
    <Box>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Borradores" value="drafts" />
        <Tab label="Facturas Enviadas" value="sent" />
      </Tabs>

      <TextField
        label="Buscar Facturas"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* 📌 Presentación en tarjetas */}
      <Grid container spacing={2}>
        {paginatedInvoices.map((invoice: any) => (
          <Grid item xs={12} sm={6} md={4} key={invoice.id}>
            <Card
              sx={{
                backgroundColor: "#1E1E1E",
                color: "#fff",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#69EAE2" }}
                >
                  Factura #{invoice.document_number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cliente: {invoice.cliente?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {invoice.date}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
                  Total: ${invoice.total.toLocaleString()}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <IconButton
                    onClick={() => handlePreviewInvoice(invoice)}
                    sx={{ color: "#69EAE2" }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => onImportInvoice(invoice)}
                    sx={{ color: "#69EAE2" }}
                  >
                    <FileDownload />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredInvoices.length === 0 && (
        <Typography variant="body2" textAlign="center" mt={2}>
          No se encontraron facturas.
        </Typography>
      )}

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <InvoiceModal
        invoice={previewInvoice}
        open={!!previewInvoice}
        onClose={handleClosePreview}
      />
    </Box>
  );
};

export default InvoicesCardView;
