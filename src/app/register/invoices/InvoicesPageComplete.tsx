"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import debounce from "debounce";

// Components
import Header from "@/components/Header";
import InvoicesTable from "./InvoicesTable";
import InvoicesTableResponsive from "./InvoicesTableResponsive";
import DateModal from "./DateModal";
import DashboardCardsSimplified from "./DashboardCardsSimplified";
import PendingInvoicesAnalysis from "./PendingInvoicesAnalysis";
import CashSessionManager from "@/components/CashSessionManager";
import CashSessionHistory from "@/components/CashSessionHistory";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Hooks
import { useAsyncOperation } from "@/hooks/useAsyncOperation";
import { useNotification } from "@/hooks/useNotification";


// Services
import { getAllInvoicesDataOptimice } from "@/firebase";

// Utils
import {
  isInRange,
  matchesSearchTerm,
  matchesStatus,
  matchesType,
  getVentasDelDia,
  getPendientesDelDia,
  calcularTotalesMetodoPago,
} from "./invoiceUtils";

// Styles
import {
  typographyPaperSearch,
  typographySubtitle,
  typographyTitle,
} from "./styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const InvoicesPageComplete = () => {
  // Estados para filtros y búsqueda
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [typeFilter, setTypeFilter] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>(""); // Para búsqueda de texto
  const [searchInput, setSearchInput] = useState<string>(""); // Para el input visual
  const [dateSearchTerm, setDateSearchTerm] = useState<any>(); // Para filtro de fechas
  const [editInvoice, setEditInvoice] = useState<boolean>(false);
  const [filter, setfilter] = useState<any>();
  const [data, setData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedDates, setSelectedDates] = useState<any>(null);

  // Estados para totales
  const [totalVentasHoy, setTotalVentasHoy] = useState<number>(0);
  const [totalVentasPendientesHoy, setTotalVentasPendientesHoy] = useState(0);
  const [totalVentasEfectivo, setTotalVentasEfectivo] = useState<number>(0);
  const [totalVentasTransferencia, setTotalVentasTransferencia] = useState<number>(0);

  // Estados para paginación
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDataPage = filter?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filter?.length / itemsPerPage);

  // Estados para tabs
  const [tabValue, setTabValue] = useState(0);

  // Hooks
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { handleAsyncError } = useNotification();


  // Operación asíncrona para cargar facturas
  const { execute: loadInvoices, loading: loadingInvoices } = useAsyncOperation(
    async () => {
      await getAllInvoicesDataOptimice(setData);
    }
  );

  // Manejo de búsqueda (solo con Enter)
  const handleSearchSubmit = (value: string) => {
    setSearchTerm(value.trim());
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Cargar facturas al montar el componente
  useEffect(() => {
    loadInvoices().catch(handleAsyncError);
  }, []);

  // Filtrar datos cuando cambien los filtros
  useEffect(() => {
    if (!data || data.length === 0) return;

    const currentDate = getCurrentDateTime();
    
    // Determinar si hay filtros aplicados
    const hasFilters = searchTerm || statusFilter !== "Todos" || typeFilter !== "Todos" || selectedDate;
    
    let filtered;
    
    if (!hasFilters) {
      // Sin filtros: mostrar todas las facturas
      filtered = data;
    } else {
      // Con filtros: aplicar filtrado
      const dateFilter = selectedDate ? dateSearchTerm : null;
      
      filtered = data.filter((factura) => {
        const [fecha] = factura.date.split(" ");
        return (
          (dateFilter ? isInRange(fecha, dateFilter) : true) &&
          matchesSearchTerm(factura, searchTerm) &&
          matchesStatus(factura, statusFilter) &&
          matchesType(factura, typeFilter)
        );
      });
    }

    setfilter(filtered);

    // Calcular totales: siempre del día actual cuando no hay filtros
    let facturasParaTotales;
    if (!hasFilters) {
      // Sin filtros: cálculos solo del día actual
      facturasParaTotales = getVentasDelDia(data, currentDate);
    } else {
      // Con filtros: cálculos de las facturas filtradas
      facturasParaTotales = filtered;
    }

    const ventasCalculadas = facturasParaTotales.filter(f => f.status.toUpperCase() !== "PENDIENTE" && f.status.toUpperCase() !== "CANCELADO");
    const pendientesCalculadas = facturasParaTotales.filter(f => f.status.toUpperCase() === "PENDIENTE");

    setTotalVentasHoy(ventasCalculadas.reduce((acc, f) => acc + f.total, 0));
    setTotalVentasPendientesHoy(pendientesCalculadas.reduce((acc, f) => acc + f.total, 0));

    const { efectivo, transferencia } = calcularTotalesMetodoPago(ventasCalculadas);
    setTotalVentasEfectivo(efectivo);
    setTotalVentasTransferencia(transferencia);
  }, [data, searchTerm, dateSearchTerm, statusFilter, typeFilter, selectedDate]);



  return (
    <ErrorBoundary>
      <Header title="CAJA" />
      <Typography sx={typographyTitle}>GESTIÓN DE CAJA</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#fff',
              '&.Mui-selected': {
                color: '#69EAE2',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#69EAE2',
            },
          }}
        >
          <Tab label="Facturas" />
          <Tab label="Facturas Pendientes" />
          <Tab label="Cierre de Caja" />
          <Tab label="Historial de Sesiones" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography sx={typographySubtitle}>
          Aquí encontrarás las facturas que ya han sido generadas, podrás
          editarlas y ver su estado.
        </Typography>

        <DashboardCardsSimplified
          invoices={(() => {
            const hasFilters = searchTerm || statusFilter !== "Todos" || typeFilter !== "Todos" || selectedDate;
            if (!hasFilters) {
              // Sin filtros: pasar solo facturas del día actual para cálculos
              const currentDate = getCurrentDateTime();
              return data.filter(f => f.date.split(" ")[0] === currentDate);
            } else {
              // Con filtros: pasar las facturas filtradas
              return filter || [];
            }
          })()}
          selectedDate={selectedDate}
          hasFilters={searchTerm || statusFilter !== "Todos" || typeFilter !== "Todos" || selectedDate}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
        />

        <Paper
          sx={{ width: "95%", height: "75%", marginTop: "2rem" }}
          style={{
            borderRadius: "0.625rem",
            background: "#1F1D2B",
            boxShadow: "0px 1px 100px -50px #69EAE2",
          }}
        >
          <Box
            sx={{
              padding: { xs: "20px 20px", sm: "40px 48px" },
              height: "100%",
              textAlign: "-webkit-center",
            }}
          >
            {!editInvoice && (
              <Box
                sx={{
                  justifyContent: { lg: "space-between" },
                  display: { lg: "flex", md: "block", xs: "block" },
                }}
              >
                <Paper
                  component="form"
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    handleSearchSubmit(searchInput);
                  }}
                  sx={typographyPaperSearch}
                >
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon sx={{ color: "#fff" }} />
                  </IconButton>
                  <InputBase
                    name="search"
                    sx={{
                      ml: 1,
                      flex: 1,
                      color: "#fff",
                    }}
                    placeholder="Buscar por cliente o # de venta (presiona Enter)"
                    value={searchInput}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchSubmit(searchInput);
                      }
                    }}
                  />
                  {(searchInput || searchTerm) && (
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="clear search"
                      onClick={clearSearch}
                    >
                      <ClearIcon sx={{ color: "#69EAE2" }} />
                    </IconButton>
                  )}
                  <DateModal
                    setSearchTerm={setDateSearchTerm}
                    setSelectedDate={setSelectedDate}
                    selectedDate={setSelectedDates}
                  />
                </Paper>

                {/* Filtro de Estado */}
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel sx={{ color: "#fff" }}>Estado</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      color: "#fff",
                      backgroundColor: "#2C3248",
                      borderRadius: "0.3125rem",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#69EAE2",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#69EAE2",
                      },
                    }}
                  >
                    <MenuItem value="Todos">Todos</MenuItem>
                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                  </Select>
                </FormControl>

                {/* Filtro de Tipo de Factura */}
                <FormControl sx={{ minWidth: 150, borderRadius: "0.3125rem" }}>
                  <InputLabel sx={{ color: "#fff" }}>Tipo de Factura</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    sx={{
                      color: "#fff",
                      backgroundColor: "#2C3248",
                      borderRadius: "0.3125rem",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#69EAE2",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#69EAE2",
                      },
                    }}
                  >
                    <MenuItem value="Todos">Todos</MenuItem>
                    <MenuItem value="VENTA RAPIDA">Venta Rápida</MenuItem>
                    <MenuItem value="FACTURA NORMAL">Factura Normal</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Indicador de resultados */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#ABBBC2' }}>
                {(() => {
                  const hasFilters = searchTerm || statusFilter !== "Todos" || typeFilter !== "Todos" || selectedDate;
                  if (!hasFilters) {
                    return `Mostrando todas las facturas (${filter?.length || 0}) • Cálculos del día actual`;
                  } else {
                    let result = `${filter?.length || 0} facturas encontradas`;
                    if (searchTerm) result += ` para "${searchTerm}"`;
                    if (statusFilter !== "Todos") result += ` • Estado: ${statusFilter}`;
                    if (typeFilter !== "Todos") result += ` • Tipo: ${typeFilter}`;
                    if (selectedDate) result += ` • Con filtro de fecha`;
                    return result;
                  }
                })()}
              </Typography>
            </Box>

            <Box sx={{ marginTop: "1.56rem", height: "80%" }}>
              <Box
                display={{ md: "none", lg: "block", xs: "none" }}
                sx={{ height: "100%" }}
              >
                <InvoicesTable
                  filteredData={currentDataPage}
                  setEditInvoice={setEditInvoice}
                />
              </Box>
              <Box
                display={{ lg: "none", md: "block", xs: "block" }}
                sx={{ height: "100%" }}
              >
                <InvoicesTableResponsive
                  filteredData={currentDataPage}
                  setEditInvoice={setEditInvoice}
                />
              </Box>
              <Box
                sx={{
                  filter: "invert(1)",
                  display: editInvoice ? "none" : "flex",
                  justifyContent: "center",
                  width: { xs: "115%", sm: "100%" },
                  marginLeft: { xs: "-15px", sm: "0" },
                }}
              >
                <Pagination
                  sx={{ color: "#fff" }}
                  onChange={(e, page) => setCurrentPage(page)}
                  count={totalPages}
                  shape="circular"
                  size={matches ? "large" : "small"}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography sx={typographySubtitle}>
          Análisis detallado de facturas pendientes y control de cartera de clientes.
        </Typography>
        <PendingInvoicesAnalysis invoices={data || []} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography sx={typographySubtitle}>
          Gestiona el cierre de caja y configura las sesiones de trabajo.
        </Typography>
        <CashSessionManager onSessionChange={() => {}} invoices={data || []} />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography sx={typographySubtitle}>
          Consulta el historial de todas las sesiones de caja.
        </Typography>
        <CashSessionHistory invoices={data || []} />
      </TabPanel>
    </ErrorBoundary>
  );
};

export default InvoicesPageComplete;