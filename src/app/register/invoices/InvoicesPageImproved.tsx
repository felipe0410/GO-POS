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
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  BugReport as BugReportIcon,
} from "@mui/icons-material";
import debounce from "debounce";

// Components
import Header from "@/components/Header";
import InvoicesTable from "./InvoicesTable";
import InvoicesTableResponsive from "./InvoicesTableResponsive";
import DateModal from "./DateModal";
import DashboardCardsSimplified from "./DashboardCardsSimplified";
import { LoadingButton } from "@/components/LoadingStates/LoadingButton";

// Hooks
import { useAsyncOperation } from "@/hooks/useAsyncOperation";
import { useNotification } from "@/hooks/useNotification";
import { useCashRegisterFixed } from "@/hooks/useCashRegisterFixed";

// Services
import { getAllInvoicesDataOptimice } from "@/firebase";

// Utils
import { 
  isInRange, 
  matchesSearchTerm, 
  matchesStatus, 
  matchesType 
} from "./invoiceUtils";

// Styles
import {
  typographyPaperSearch,
  typographySubtitle,
  typographyTitle,
} from "./styles";

const InvoicesPageImproved = () => {
  // Estados principales
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [editInvoice, setEditInvoice] = useState<boolean>(false);
  
  // Estados de filtros
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [typeFilter, setTypeFilter] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<any>();
  const [selectedDate, setSelectedDate] = useState<any>();

  
  // Estados de UI
  const [useImprovedCalculation, setUseImprovedCalculation] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Paginación
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDataPage = filteredData?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  
  // Hooks
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { success, error: notifyError, info } = useNotification();
  
  // Hook de caja mejorado (opcional para diagnósticos)
  const {
    getDiagnostics,
    compareLegacy,
  } = useCashRegisterFixed(data);

  // Operación para cargar facturas
  const { execute: loadInvoices, loading: loadingInvoices } = useAsyncOperation(
    async () => {
      return new Promise<void>((resolve, reject) => {
        try {
          const unsubscribe = getAllInvoicesDataOptimice((invoiceData: any[]) => {
            setData(invoiceData);
            info(`${invoiceData.length} facturas cargadas`);
            resolve();
          });
          
          // Cleanup function se maneja en useEffect
          return unsubscribe;
        } catch (error) {
          console.error("Error fetching invoices:", error);
          reject(error);
        }
      });
    }
  );

  // Operación para diagnósticos
  const { execute: runDiagnostics, loading: diagnosticsLoading } = useAsyncOperation(
    async () => {
      const diagnostics = await getDiagnostics();
      setShowDebugInfo(true);
      return diagnostics;
    }
  );

  // Debounced search
  const debouncedHandleSearchChange = debounce(() => {}, 300);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event);
    debouncedHandleSearchChange();
  };

  const handleRefresh = async () => {
    try {
      await loadInvoices();
      success('Facturas actualizadas');
    } catch (error) {
      notifyError('Error actualizando facturas');
    }
  };

  // Cargar facturas al montar el componente
  useEffect(() => {
    loadInvoices().catch(console.error);
  }, []);

  // Filtrar datos cuando cambian los filtros
  useEffect(() => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    const filtered = data.filter((factura) => {
      const [fecha] = factura.date?.split(" ") || [""];
      
      // Manejar filtros de fecha
      let dateMatches = true;
      
      if (selectedDate) {
        // Si selectedDate es un array (rango de fechas)
        if (Array.isArray(selectedDate) && selectedDate.length === 2) {
          dateMatches = isInRange(fecha, selectedDate);
        } 
        // Si selectedDate es una fecha única
        else if (selectedDate instanceof Date) {
          const selectedDateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
          dateMatches = fecha === selectedDateStr;
        }
        // Si selectedDate es un string o array de strings
        else if (typeof selectedDate === 'string') {
          dateMatches = fecha === selectedDate;
        }
      } else if (searchTerm && Array.isArray(searchTerm)) {
        // Si hay término de búsqueda como rango de fechas
        dateMatches = isInRange(fecha, searchTerm);
      }
      
      return (
        dateMatches &&
        matchesSearchTerm(factura, searchTerm) &&
        matchesStatus(factura, statusFilter) &&
        matchesType(factura, typeFilter)
      );
    });



    setFilteredData(filtered);
    setCurrentPage(1); // Reset pagination
  }, [data, searchTerm, statusFilter, typeFilter, selectedDate]);

  return (
    <>
      <Header title="CAJA" />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={typographyTitle}>FACTURAS</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Switch para cálculo mejorado */}
          <FormControlLabel
            control={
              <Switch
                checked={useImprovedCalculation}
                onChange={(e) => setUseImprovedCalculation(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#69EAE2',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#69EAE2',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: '#fff', fontSize: '0.875rem' }}>
                Cálculo Robusto
              </Typography>
            }
          />
          
          {/* Botón de diagnósticos */}
          <LoadingButton
            variant="outlined"
            startIcon={<BugReportIcon />}
            onClick={runDiagnostics}
            loading={diagnosticsLoading}
            loadingText="Analizando..."
            sx={{
              borderColor: '#69EAE2',
              color: '#69EAE2',
              '&:hover': {
                borderColor: '#5AD4CC',
                backgroundColor: 'rgba(105, 234, 226, 0.1)',
              },
            }}
          >
            Diagnósticos
          </LoadingButton>
          
          {/* Botón de actualizar */}
          <LoadingButton
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            loading={loadingInvoices}
            loadingText="Actualizando..."
            sx={{
              backgroundColor: '#69EAE2',
              color: '#1F1D2B',
              '&:hover': {
                backgroundColor: '#5AD4CC',
              },
            }}
          >
            Actualizar
          </LoadingButton>
        </Box>
      </Box>

      <Typography sx={typographySubtitle}>
        Aquí encontrarás las facturas que ya han sido generadas, podrás
        editarlas y ver su estado.
      </Typography>

      {/* Mostrar información de debug si está habilitada */}
      {showDebugInfo && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          onClose={() => setShowDebugInfo(false)}
        >
          <Typography variant="body2">
            Sistema de cálculo {useImprovedCalculation ? 'robusto' : 'legacy'} activo. 
            {data.length} facturas cargadas, {filteredData.length} facturas filtradas.
          </Typography>
        </Alert>
      )}

      {/* Dashboard Cards */}
      {useImprovedCalculation ? (
        <DashboardCardsSimplified 
          invoices={filteredData} // Usar filteredData para que se actualice con los filtros
          selectedDate={selectedDate} // Pasar selectedDate
        />
      ) : (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Usando cálculo legacy. Se recomienda activar el cálculo robusto para mayor precisión.
        </Alert>
      )}

      {/* Tabla de facturas */}
      <Paper
        id="paper"
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
                mb: 2,
              }}
            >
              {/* Barra de búsqueda */}
              <Paper
                component="form"
                onSubmit={(e: any) => {
                  e.preventDefault();
                  handleSearchChange(e.target[1].value);
                }}
                sx={typographyPaperSearch}
              >
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon sx={{ color: "#fff" }} />
                </IconButton>
                <InputBase
                  sx={{
                    ml: 1,
                    flex: 1,
                    color: "#fff",
                  }}
                  placeholder="Buscar"
                  onBlur={(e) => {
                    handleSearchChange(e.target.value);
                    e.preventDefault();
                  }}
                />
                <DateModal
                  setSearchTerm={setSearchTerm}
                  setSelectedDate={setSelectedDate}
                  selectedDate={selectedDate}
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
                  <MenuItem value="Pagado">Pagado</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>

              {/* Filtro de Tipo de Factura */}
              <FormControl sx={{ minWidth: 150 }}>
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

          {/* Contenido de la tabla */}
          <Box sx={{ marginTop: "1.56rem", height: "80%" }}>
            {loadingInvoices ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography sx={{ color: '#fff', mb: 2 }}>
                  Cargando facturas...
                </Typography>
              </Box>
            ) : (
              <>
                {/* Tabla desktop */}
                <Box
                  display={{ md: "none", lg: "block", xs: "none" }}
                  sx={{ height: "100%" }}
                >
                  <InvoicesTable
                    filteredData={currentDataPage}
                    setEditInvoice={setEditInvoice}
                  />
                </Box>

                {/* Tabla responsive */}
                <Box
                  display={{ lg: "none", md: "block", xs: "block" }}
                  sx={{ height: "100%" }}
                >
                  <InvoicesTableResponsive
                    filteredData={currentDataPage}
                    setEditInvoice={setEditInvoice}
                  />
                </Box>

                {/* Paginación */}
                <Box
                  id="pagination"
                  sx={{
                    filter: "invert(1)",
                    display: editInvoice ? "none" : "flex",
                    justifyContent: "center",
                    width: { xs: "115%", sm: "100%" },
                    marginLeft: { xs: "-15px", sm: "0" },
                    mt: 2,
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
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default InvoicesPageImproved;