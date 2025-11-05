"use client";
import React, { useEffect, useState, useCallback } from "react";
import { 
  Box, 
  MenuItem, 
  Select, 
  Typography, 
  Alert,
  Chip
} from "@mui/material";
import { Schedule } from "@mui/icons-material";

// Components
import Header from "@/components/Header";
import CalendarioMes from "./CalendarioMes";
import CalendarioAno from "./CalendarioAno";
import CalendarioDias from "./CalendarioDias";
import ChartBarline from "./ChartBarline";
import ChartArea from "./ChartArea";
import CashSessionManager from "@/components/CashSessionManager";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Hooks
import { useAsyncOperation } from "@/hooks/useAsyncOperation";
import { useNotification } from "@/hooks/useNotification";
import { useCashSession } from "@/hooks/useCashSession";

// Services
import { getAllInvoicesData, getAllProductsData } from "@/firebase";

// Styles
import { selectStyle, typographyTitle } from "./style";
import "react-datepicker/dist/react-datepicker.css";

const DashboardSimplified = () => {
  // Estados principales
  const [product, setProduct] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [totalVentasHoy, setTotalVentasHoy] = useState<number>(0);
  const [calendarioType, setCalendarioType] = useState<string>(" ");
  const [dateSearchTerm, setDateSearchTerm] = useState<string | string[]>("");
  const [selectedDate, setSelectedDate] = useState<any>();
  const [listaFechas, setListaFechas] = useState<string[]>([]);
  const [totalVentasPorFecha, setTotalVentasPorFecha] = useState<number[]>([]);
  const [totalGananciasPorFecha, setTotalGananciasPorFecha] = useState<number[]>([]);

  // Estados de cálculos de inventario
  const [calculations, setCalculations] = useState({
    formattedTotalInventoryValue: "0",
    formattedTotalInvestmentValue: "0",
    expectedProfit: "0",
    profitPercentage: "0%",
  });

  // Hooks
  const { handleAsyncError } = useNotification();
  const { currentSession } = useCashSession();

  // Operaciones asíncronas
  const { execute: loadData, loading } = useAsyncOperation(
    async () => {
      await getAllProductsData(setProduct);
      await getAllInvoicesData(setData);
    }
  );

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSelectChange = (event: any) => {
    setCalendarioType(event.target.value);
  };

  const renderCalendario = () => {
    switch (calendarioType) {
      case "year":
        return (
          <CalendarioAno
            setDateSearchTerm={setDateSearchTerm}
            setSelectedDate={setSelectedDate}
          />
        );
      case "mes":
        return (
          <CalendarioMes
            setDateSearchTerm={setDateSearchTerm}
            setSelectedDate={setSelectedDate}
          />
        );
      case "dia":
        return (
          <CalendarioDias
            setDateSearchTerm={setDateSearchTerm}
            setSelectedDate={setSelectedDate}
          />
        );
      default:
        return null;
    }
  };

  // Calcular ventas del día actual
  const calculateTodaySales = useCallback(() => {
    if (!data.length) return;
    
    const fechaHoy = getCurrentDateTime();
    const ventasHoy = data.filter((item) => {
      const [fecha] = item.date.split(" ");
      return fecha === fechaHoy;
    });
    
    const total = ventasHoy.reduce((acc, factura) => acc + (factura.total || 0), 0);
    setTotalVentasHoy(total);
  }, [data]);

  // Calcular valores de inventario
  const calculateInventoryValues = useCallback(() => {
    if (!product.length) return;

    const totalInventoryValue = product.reduce((acc, item) => {
      const price = item.price && typeof item.price === "string"
        ? Number(item.price.replace(/[$,]/g, ""))
        : 0;
      const cantidad = typeof item.cantidad === "number"
        ? item.cantidad
        : item.cantidad && !isNaN(parseFloat(item.cantidad))
          ? parseFloat(item.cantidad)
          : 0;
      return acc + (price * cantidad);
    }, 0);

    const totalInvestmentValue = product.reduce((acc, item) => {
      const purchasePrice = item.purchasePrice && typeof item.purchasePrice === "string"
        ? Number(item.purchasePrice.replace(/[$,]/g, ""))
        : 0;
      const cantidad = typeof item.cantidad === "number"
        ? item.cantidad
        : item.cantidad && !isNaN(parseFloat(item.cantidad))
          ? parseFloat(item.cantidad)
          : 0;
      return acc + (purchasePrice * cantidad);
    }, 0);

    const expectedProfit = totalInventoryValue - totalInvestmentValue;
    const profitPercentage = totalInvestmentValue > 0
      ? Math.round((totalInventoryValue / totalInvestmentValue - 1) * 100)
      : 0;

    setCalculations({
      formattedTotalInventoryValue: totalInventoryValue.toLocaleString("es-ES"),
      formattedTotalInvestmentValue: totalInvestmentValue.toLocaleString("es-ES"),
      expectedProfit: expectedProfit.toLocaleString("es-ES"),
      profitPercentage: `${profitPercentage}%`,
    });
  }, [product]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData().catch(handleAsyncError);
  }, []);

  // Calcular ventas cuando cambian los datos
  useEffect(() => {
    calculateTodaySales();
  }, [calculateTodaySales]);

  // Calcular inventario cuando cambian los productos
  useEffect(() => {
    calculateInventoryValues();
  }, [calculateInventoryValues]);

  // Generar lista de fechas cuando cambia selectedDate
  useEffect(() => {
    if (!selectedDate) return;
    
    const generarListaFechas = (selectedDate: string[]): string[] => {
      const fechaInicio = new Date(selectedDate[0]);
      const fechaFin = new Date(selectedDate[1]);
      const timeZoneOffset = fechaInicio.getTimezoneOffset();
      const fechaInicioLocal = new Date(fechaInicio.getTime() + timeZoneOffset * 60000);
      const fechaFinLocal = new Date(fechaFin.getTime() + timeZoneOffset * 60000);

      const listaFechas: string[] = [];
      let fechaActual = new Date(fechaInicioLocal);

      while (fechaActual <= fechaFinLocal) {
        const year = fechaActual.getFullYear();
        const month = fechaActual.getMonth() + 1;
        const day = fechaActual.getDate();

        let fechaStr = `${year}`;

        if (selectedDate[0].length > 4) {
          fechaStr += `-${month.toString().padStart(2, "0")}`;
          if (selectedDate[0].length > 7) {
            fechaStr += `-${day.toString().padStart(2, "0")}`;
          }
        }
        
        listaFechas.push(fechaStr);
        
        if (selectedDate[0].length === 4) {
          fechaActual.setFullYear(fechaActual.getFullYear() + 1);
        } else if (selectedDate[0].length === 7) {
          fechaActual.setMonth(fechaActual.getMonth() + 1);
        } else {
          fechaActual.setDate(fechaActual.getDate() + 1);
        }
      }
      return listaFechas;
    };
    
    setListaFechas(generarListaFechas(selectedDate));
  }, [selectedDate]);

  // Calcular totales por fecha cuando cambian las fechas o datos
  useEffect(() => {
    if (!listaFechas.length || !data.length) return;

    const ventasPorFecha = listaFechas.map((fecha) => {
      const facturasEnRango = data.filter((item: any) => {
        const [itemFecha] = item.date.split(" ");
        return itemFecha.startsWith(fecha);
      });

      return facturasEnRango.reduce((total: number, factura: any) => 
        total + (factura.total || 0), 0
      );
    });

    setTotalVentasPorFecha(ventasPorFecha);

    // Calcular ganancias (simplificado)
    const gananciasPorFecha = ventasPorFecha.map(venta => venta * 0.3); // Asumiendo 30% de ganancia
    setTotalGananciasPorFecha(gananciasPorFecha);
  }, [listaFechas, data]);

  // Datos para las cards principales
  const dataCards = [
    {
      title: "INGRESOS",
      styleBox: {
        background: "linear-gradient(231deg, #BF56DC -1.04%, rgba(191, 86, 220, 0.21) 34.27%, #00000047 55.3%)",
      },
      typographyStyle: { color: "#BF56DC" },
      icon: "/dashboardVender/ingresos.svg",
      value: `$ ${totalVentasHoy.toLocaleString("en-US")}`,
    },
    {
      title: "GASTOS",
      styleBox: {
        background: "linear-gradient(233deg, #257881 0.35%, rgb(0 0 0 / 30%) 57.13%, #00000054 55.3%)",
      },
      typographyStyle: { color: "#61C897" },
      icon: "/dashboardVender/gastos.svg",
      value: "$ 0",
    },
    {
      title: "GANANCIA",
      styleBox: {
        background: "linear-gradient(233deg, #2EB0CC 14.83%, rgba(43, 86, 126, 0.42) 46.19%, rgba(43, 86, 126, 0.43) 46.66%, rgb(13 20 34 / 74%) 69.08%)",
      },
      typographyStyle: { color: "#2EB0CC" },
      icon: "/dashboardVender/ganancia.svg",
      value: `$ ${Math.round(totalVentasHoy * 0.3).toLocaleString("en-US")}`,
    },
  ];

  const cardsHeader = [
    {
      tile: "Total inventario",
      count: `$ ${calculations.formattedTotalInventoryValue}`,
      img: "/dashboard_home/cash.svg",
    },
    {
      tile: "Ganancia esperada",
      count: `$ ${calculations.expectedProfit}`,
      percentage: `+ ${calculations.profitPercentage}`,
      img: "/dashboard_home/clients.svg",
    },
    {
      tile: "Total inversión",
      count: `$ ${calculations.formattedTotalInvestmentValue}`,
      img: "/dashboard_home/rocket.svg",
    },
  ];

  if (loading) {
    return (
      <ErrorBoundary>
        <Header title="CAJA" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Cargando datos...</Typography>
        </Box>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Header title="CAJA" />
      
      {/* Información de sesión actual */}
      {currentSession && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2, 
            backgroundColor: 'rgba(105, 234, 226, 0.1)',
            color: '#69EAE2',
            '& .MuiAlert-icon': {
              color: '#69EAE2'
            }
          }}
          icon={<Schedule />}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>
              Sesión activa desde: {new Date(currentSession.fechaApertura || Date.now()).toLocaleString()}
            </Typography>
            <Chip 
              label="Activa"
              size="small"
              sx={{ 
                backgroundColor: '#69EAE2', 
                color: '#1F1D2B',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Alert>
      )}

      {/* Gestión de Caja */}
      <Box sx={{ mb: 3 }}>
        <CashSessionManager onSessionChange={() => {}} invoices={data} />
      </Box>

      {/* Selector de calendario */}
      <Box
        sx={{
          display: { lg: "flex", md: "flex", xs: "block" },
          flexDirection: "row",
        }}
      >
        <Typography sx={typographyTitle}>FLUJO DE CAJA </Typography>
        <Select
          style={{ color: "#69EAE2" }}
          sx={selectStyle}
          value={calendarioType}
          onChange={handleSelectChange}
        >
          <MenuItem value=" ">Seleccione Calendario</MenuItem>
          <MenuItem value="year">Calendario de Año</MenuItem>
          <MenuItem value="mes">Calendario de Mes</MenuItem>
          <MenuItem value="dia">Calendario de Día</MenuItem>
        </Select>
        {renderCalendario()}
      </Box>

      {/* Fecha actual */}
      <Typography
        align="center"
        sx={{
          marginTop: "1rem",
          color: "#69EAE2",
          fontFamily: "Nunito",
          fontSize: { xs: "20px", sm: "40px" },
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "normal",
        }}
      >
        {`Fecha: ${dateSearchTerm === "" ? getCurrentDateTime() : dateSearchTerm}`}
      </Typography>

      {/* Cards de inventario */}
      <Box
        sx={{
          display: { xs: "block", sm: "flex" },
          justifyContent: "space-between",
        }}
      >
        {cardsHeader.map((e, i) => (
          <Box
            key={i}
            width={{ sm: "31%" }}
            sx={{
              marginY: { xs: "20px", sm: "auto" },
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              borderRadius: "20px",
              background: "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, #1F1D2B 91.2%)",
              backdropFilter: "blur(60px)",
            }}
          >
            <Box sx={{ width: "60%" }}>
              <Typography
                sx={{
                  color: "#A0AEC0",
                  fontFamily: "Nunito",
                  fontSize: { xs: "16px", sm: "18px" },
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "100%",
                }}
              >
                {e.tile}
              </Typography>
              <Box display="flex" sx={{ justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    color: "#FFF",
                    fontFamily: "Nunito",
                    fontSize: { xs: "16px", sm: "20px" },
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                  }}
                >
                  {e.count}
                </Typography>
                {e.percentage && (
                  <Typography
                    sx={{
                      color: e.percentage.includes("+") ? "#01B574" : "#E31A1A",
                    }}
                  >
                    {e.percentage}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Box component="img" src={e.img} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Cards de flujo de caja */}
      <Box
        sx={{
          textAlign: { xs: "-webkit-center" },
          display: { lg: "flex", md: "flex", xs: "block" },
          justifyContent: "space-around",
        }}
      >
        {dataCards.map((e, index) => (
          <Box
            sx={{
              width: { lg: "30%", md: "30%", xs: "90%" },
              maxWidth: "330px",
            }}
            key={index}
          >
            <Typography
              align="center"
              sx={{
                ...e.typographyStyle,
                fontFamily: "Nunito",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
                marginY: "20px",
              }}
            >
              {e.title}
            </Typography>
            <Box
              sx={{
                borderRadius: "30px",
                ...e.styleBox,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "130px",
              }}
            >
              <Typography
                sx={{
                  color: "#FFF",
                  fontFamily: "Nunito",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                {e.value}
              </Typography>
              <Box sx={{ marginTop: "60px", marginLeft: "10px" }}>
                <Box component="img" src={e.icon} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Gráficos */}
      <Box
        sx={{
          display: { lg: "flex", md: "flex", sm: "block", xs: "block" },
          flexDirection: "row",
          marginTop: "2rem",
          justifyContent: "space-evenly",
          textAlign: { sm: "-webkit-center", xs: "-webkit-center" },
        }}
      >
        <Box
          sx={{
            width: { lg: "35%", md: "35%", sm: "85%", xs: "85%" },
            height: "400px",
            borderRadius: "30px",
            background: "#1F1D2B",
            boxShadow: "0px 1px 100px -50px #69EAE2",
            padding: "25px",
            marginBottom: { sm: "1.5rem", xs: "1.5rem" },
          }}
        >
          <ChartBarline
            listaFechas={listaFechas}
            totalVentasPorFecha={totalVentasPorFecha}
          />
        </Box>
        <Box
          sx={{
            width: { lg: "55%", md: "55%", sm: "85%", xs: "85%" },
            height: "400px",
            borderRadius: "30px",
            background: "#1F1D2B",
            boxShadow: "0px 1px 100px -50px #69EAE2",
            padding: "25px",
          }}
        >
          <ChartArea
            listaFechas={listaFechas}
            totalVentasPorFecha={totalVentasPorFecha}
            totalGananciasPorFecha={totalGananciasPorFecha}
          />
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default DashboardSimplified;