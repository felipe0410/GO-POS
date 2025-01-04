import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Tabs,
  Tab,
  TextField,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import InvoiceModal from "./InvoiceModal";

const ITEMS_PER_PAGE = 4;

const InvoicesView = ({ drafts, sentInvoices, onImportInvoice }: any) => {
  const [tab, setTab] = useState<"drafts" | "sent">("drafts");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: "drafts" | "sent") => {
    setTab(newValue);
    setPage(1); // Resetear a la primera página al cambiar de pestaña
  };

  const invoices = tab === "drafts" ? drafts : sentInvoices;

  // Filtrar facturas según el término de búsqueda
  const filteredInvoices = useMemo(() => {
    return invoices.filter(
      (invoice: any) =>
        invoice.document_number?.toString().includes(searchTerm) ||
        invoice.cliente?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Número</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedInvoices.map((invoice: any) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.document_number}</TableCell>
              <TableCell>{invoice.cliente?.name}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>${invoice.total.toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handlePreviewInvoice(invoice)}>
                  Previsualizar
                </Button>
                <Button variant="contained" onClick={() => onImportInvoice(invoice)} sx={{ ml: 1 }}>
                  Importar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

      <InvoiceModal invoice={previewInvoice} open={!!previewInvoice} onClose={handleClosePreview} />
    </Box>
  );
};

export default InvoicesView;
