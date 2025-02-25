import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  IconButton,
  SwipeableDrawer,
  List,
  ListItem,
  Typography,
  TextField,
  MenuItem,
  styled,
  Badge,
  BadgeProps,
  useMediaQuery,
  useTheme,
  Popover,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getInvoiceData } from "@/firebase";
import Header from "../SlidebarVender/Header";
import ReactCalendar from "@/app/register/invoices/ReactCalendar";
import InvoiceCard from "./InvoiceCard";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    padding: "0 4px",
  },
}));

interface SlidebarDevolucionesProps {
  open: boolean;
  onClose: () => void;
  invoices: any[];
  selectedItems: any;
  setSelectedItems: any;
}

const SlidebarDevoluciones: React.FC<SlidebarDevolucionesProps> = ({
  open,
  onClose,
  invoices,
  selectedItems,
  setSelectedItems,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  console.log("selectedItems:::>", selectedItems);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));

  // Estado para manejar el popover del calendario
  const [calendarAnchorEl, setCalendarAnchorEl] = useState<null | HTMLElement>(
    null
  );

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

  // 🔍 Filtrar facturas por búsqueda o fecha seleccionada
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    // 🔍 Filtrar por búsqueda en número de factura o nombre del cliente
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice.includes(searchTerm) ||
          invoice?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 📅 Filtrar por rango de fechas si se han seleccionado dos fechas
    if (Array.isArray(selectedDate) && selectedDate.length === 2) {
      const [startDate, endDate] = selectedDate.map(
        (date) => new Date(date).toISOString().split("T")[0]
      );

      filtered = invoices.filter((invoice) => {
        // Extraemos solo la parte de fecha sin la hora
        const invoiceDate = invoice.date.split(" ")[0];

        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    }

    // 📌 Ordenar por fecha ascendente o descendente
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [invoices, searchTerm, selectedDate, sortOrder]);

  return (
    <Box display={"flex"}>
      <IconButton
        sx={{
          position: "absolute",
          top: "20px",
          right: "30px",
        }}
        onClick={onClose}
        aria-label="devoluciones"
      >
        <StyledBadge
          badgeContent={Object.values(selectedProducts).filter((v) => v).length}
          color="error"
        >
          <ShoppingCartIcon />
        </StyledBadge>
      </IconButton>
      <SwipeableDrawer
        open={open}
        id="drawer"
        variant={matchesSM ? "persistent" : "permanent"}
        anchor="right"
        PaperProps={{
          style: {
            background: "transparent",
            border: "none",
            width: !matchesSM ? "510px" : "95%",
          },
        }}
        onClose={onClose}
        onOpen={() => {}}
      >
        <Box
          sx={{
            position: "absolute",
            paddingTop: "8px",
            paddingBottom: "8px",
            background: "#1F1D2B",
            height: "100%",
            overflow: "hidden",
            top: 0,
            right: 0,
            width: { xs: "100%", sm: "50%", lg: "24rem" },
            borderRadius: "10px 0px 0px 10px",
            color: "#fff",
          }}
        >
          <Header
            setOpen={onClose}
            generarNumeroFactura={() => ""}
            totalUnidades={0}
          />

          <Box
            padding={3}
            sx={{ height: "92%", width: "100%", overflow: "auto" }}
          >
            {/* 🔍 Búsqueda y Filtros */}
            <TextField
              label="Buscar factura o cliente"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mb: 2, background: "#fff", borderRadius: "5px" }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* 📆 Selector de Fecha con Popover */}
            <TextField
              label="Filtrar por fecha"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mb: 2, background: "#fff", borderRadius: "5px" }}
              value={selectedDate || ""}
              onClick={(e) => setCalendarAnchorEl(e.currentTarget)}
              //readOnly
            />

            <Popover
              open={Boolean(calendarAnchorEl)}
              anchorEl={calendarAnchorEl}
              onClose={() => setCalendarAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <ReactCalendar
                setSearchTerm={setSearchTerm}
                handleClose={() => setCalendarAnchorEl(null)}
                setSelectedDate={setSelectedDate}
              />
            </Popover>

            <TextField
              select
              label="Ordenar por fecha"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mt: 2, background: "#fff", borderRadius: "5px" }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <MenuItem value="asc">Más antigua</MenuItem>
              <MenuItem value="desc">Más reciente</MenuItem>
            </TextField>

            {/* 📄 Selección de factura */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Selecciona una factura:
            </Typography>
            <List>
              {filteredInvoices.map((invoice) => (
                <ListItem
                  button
                  key={invoice.uid}
                  selected={selectedInvoice === invoice.uid}
                  onClick={() => {
                    setSelectedInvoice(invoice.uid);
                    setSelectedItems(invoice.compra);
                  }}
                >
                  <InvoiceCard
                    invoice={invoice}
                    onSelect={() => setSelectedInvoice(invoice.uid)}
                    isSelected={selectedInvoice === invoice.uid}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default SlidebarDevoluciones;
