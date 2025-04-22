import React, { useState, useEffect, useMemo, useContext } from "react";
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
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Header from "../SlidebarVender/Header";
import ReactCalendar from "@/app/register/invoices/ReactCalendar";
import InvoiceCard from "./InvoiceCard";
import { DevolucionContext } from "./context";
import Factura from "@/app/register/invoices/Factura";

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
}

const SlidebarDevoluciones: React.FC<SlidebarDevolucionesProps> = ({
  open,
  onClose,
}) => {
  const { data, setData, invoices, setSelectedInvoice, selectedInvoice } =
    useContext(DevolucionContext) || {};

  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const invoicesPerPage = 20;

  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));

  const [calendarAnchorEl, setCalendarAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const filteredInvoices = useMemo(() => {
    let filtered = invoices || [];

    if (searchTerm) {
      const normalizedSearchTerm = searchTerm?.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice.includes(searchTerm) ||
          invoice?.cliente?.name?.toLowerCase().includes(normalizedSearchTerm)
      );
    }

    if (Array.isArray(selectedDate) && selectedDate.length === 2) {
      const [startDate, endDate] = selectedDate.map(
        (date) => new Date(date).toISOString().split("T")[0]
      );

      filtered = filtered.filter((invoice) => {
        const invoiceDate = invoice.date.split(" ")[0];
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [invoices, searchTerm, selectedDate, sortOrder]);

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * invoicesPerPage,
    currentPage * invoicesPerPage
  );

  return (
    <Box display={"flex"}>
      <IconButton
        sx={{ position: "absolute", top: "20px", right: "30px" }}
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
            width: { xs: "100%", sm: "50%", lg: "28rem" },
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
            <Box sx={{ display: selectedInvoice ? "none" : "block" }}>
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
              <Box id="contianer_calendar" sx={{ display: "flex" }}>
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
                    setSearchTerm={setSelectedDate}
                    handleClose={() => setCalendarAnchorEl(null)}
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                  />
                </Popover>
              </Box>
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
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Selecciona una factura:
              </Typography>
            </Box>

            {selectedInvoice ? (
              <Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "#69EAE2", color: "#000" }}
                  onClick={() => setSelectedInvoice(null)}
                >
                  Regresar
                </Button>
                <Factura data={data} setFacturaData={setData} />
              </Box>
            ) : (
              <>
                <List>
                  {paginatedInvoices.map((invoice) => (
                    <ListItem
                      button
                      key={invoice.uid}
                      selected={selectedInvoice === invoice.uid}
                      onClick={() => {
                        if (invoice) {
                          setData(invoice);
                        }
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

                <Box
                  sx={{ filter: "invert(1)" }}
                  display="flex"
                  justifyContent="center"
                  mt={2}
                >
                  <IconButton
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    ◀
                  </IconButton>
                  <Typography
                    sx={{ filter: "inherit", alignContent: "center" }}
                    mx={2}
                  >
                    {currentPage} / {totalPages}
                  </Typography>
                  <IconButton
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    ▶
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default SlidebarDevoluciones;
