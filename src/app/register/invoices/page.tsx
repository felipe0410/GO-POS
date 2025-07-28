"use client";
import Header from "@/components/Header";
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
} from "@mui/material";
import {
  typographyPaperSearch,
  typographySubtitle,
  typographyTitle,
} from "./styles";
import debounce from "debounce";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import InvoicesTable from "./InvoicesTable";
import { getAllInvoicesDataOptimice } from "@/firebase";
import InvoicesTableResponsive from "./InvoicesTableResponsive";
import DateModal from "./DateModal";
import DashboardCards from "./DashboardCards";
import { isInRange, matchesSearchTerm, matchesStatus, matchesType, getVentasDelDia, getPendientesDelDia, calcularTotalesMetodoPago } from "./invoiceUtils";

const Invoices = () => {
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [typeFilter, setTypeFilter] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<any>();
  const [editInvoice, setEditInvoice] = useState<boolean>(false);
  const [filter, setfilter] = useState<any>();
  const [data, setData] = useState<any[]>([]);
  const [totalVentasHoy, setTotalVentasHoy] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<any>();
  const [totalVentasFecha, setTotalVentasFecha] = useState<number>(0);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDataPage = filter?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filter?.length / itemsPerPage);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [totalVentasPendientesHoy, setTotalVentasPendientesHoy] = useState(0);
  const [totalVentasEfectivo, setTotalVentasEfectivo] = useState<number>(0);
  const [selectedDates, setSelectedDates] = useState<any>(null);

  const [totalVentasTransferencia, setTotalVentasTransferencia] =
    useState<number>(0);

  const debouncedHandleSearchChange = debounce(() => { }, 300);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event);
    debouncedHandleSearchChange();
  };

  const dataUser = JSON.parse(localStorage?.getItem("dataUser") ?? "{}");
  useEffect(() => {
    const getAllInvoices = async () => {
      try {
        await getAllInvoicesDataOptimice(setData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getAllInvoices();
  }, []);
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const currentDate = getCurrentDateTime();

    const filtered = data.filter((factura) => {
      const [fecha] = factura.date.split(" ");
      return (
        isInRange(fecha, searchTerm) &&
        matchesSearchTerm(factura, searchTerm) &&
        matchesStatus(factura, statusFilter) &&
        matchesType(factura, typeFilter)
      );
    });

    setfilter(filtered);

    const ventasHoy = getVentasDelDia(data, currentDate);
    setTotalVentasHoy(ventasHoy.reduce((acc, f) => acc + f.total, 0));

    const pendientesHoy = getPendientesDelDia(data, currentDate);
    setTotalVentasPendientesHoy(
      pendientesHoy.reduce((acc, f) => acc + f.total, 0)
    );

    const { efectivo, transferencia } = calcularTotalesMetodoPago(ventasHoy);
    setTotalVentasEfectivo(efectivo);
    setTotalVentasTransferencia(transferencia);
  }, [data, searchTerm, statusFilter, typeFilter]);


  useEffect(() => {
    const [fechaInicio, fechaFin] = Array.isArray(selectedDate)
      ? selectedDate
      : [selectedDate, selectedDate];

    const facturasEnRango = filter?.filter((item: any) => {
      const [fecha, hora] = item.date.split(" ");
      const fechaFactura = fecha;

      return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
    });

    const totalVentasFechaFilter =
      facturasEnRango?.reduce(
        (total: any, factura: any) => total + factura.total,
        0
      ) || 0;

    setTotalVentasFecha(totalVentasFechaFilter);
  }, [filter, selectedDate]);

  return (
    <>
      <Header title="CAJA" />
      <Typography sx={typographyTitle}>FACTURAS</Typography>
      <Box>
        <Typography sx={typographySubtitle}>
          Aqui encontraras las facturas que ya han sido generadas, podras
          editarlas y ver su estado.
        </Typography>
        <>

          {
            <DashboardCards
              totalVentasHoy={totalVentasHoy}
              totalVentasPendientesHoy={totalVentasPendientesHoy}
              totalVentasFecha={totalVentasFecha}
              selectedDate={selectedDate}
              getCurrentDateTime={getCurrentDateTime}
              totalVentasEfectivo={totalVentasEfectivo}
              totalVentasTransferencia={totalVentasTransferencia}
            />
          }
        </>
      </Box>
      <Paper
        id={"paper"}
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
                  selectedDate={setSelectedDates} />
              </Paper>
              {/* Filtro de Estado */}
              <FormControl
                sx={{
                  minWidth: 150,
                }}
              >
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
              <FormControl
                sx={{
                  minWidth: 150,
                  borderRadius: "0.3125rem",
                }}
              >
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
              </FormControl>{" "}
            </Box>
          )}
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
              id="pagination"
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
    </>
  );
};

export default Invoices;
