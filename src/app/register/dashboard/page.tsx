"use client";
import Header from "@/components/Header";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { selectStyle, typographyTitle } from "./style";
import { useEffect, useMemo, useState } from "react";
import { getAllInvoicesData } from "@/firebase";
import CalendarioMes from "./CalendarioMes";
import CalendarioAno from "./CalendarioAno";
import "react-datepicker/dist/react-datepicker.css";
import CalendarioDias from "./CalendarioDias";
import ChartBarline from "./ChartBarline";
import ChartArea from "./ChartArea";
import { getAllProductsData } from "@/firebase";

const Dashboard = () => {
  const [product, setProduct] = useState<undefined | any[]>(undefined);
  const [ingresos, setTotalIngresos] = useState<any>();
  const [ProductosSinReferencia, setProductosSinReferencia] = useState<any>();
  const [data, setData] = useState<undefined | any[]>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [totalVentasHoy, setTotalVentasHoy] = useState<number>(0);
  const [calendarioType, setCalendarioType] = useState<string>(" ");
  const [dateSearchTerm, setDateSearchTerm] = useState<string | string[]>("");
  const [filter, setFilter] = useState<any>();
  const [selectedDate, setSelectedDate] = useState<any>();
  const [listaFechas, setListaFechas] = useState<string[]>([]);
  const [totalVentasPorFecha, setTotalVentasPorFecha] = useState<string[]>([]);
  const [totalGananciasPorFecha, setTotalGananciasPorFecha] = useState<
    string[]
  >([]);
  const [totalGanancia, setTotalGanancia] = useState<number | null>(0);

  const handleSelectChange = (event: any) => {
    setCalendarioType(event.target.value);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  useEffect(() => {
    const getAllInvoices = async () => {
      try {
        await getAllProductsData(setProduct);
        await getAllInvoicesData(setData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getAllInvoices();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const generarListaFechas = (selectedDate: string[]): string[] => {
        const fechaInicio = new Date(selectedDate[0]);
        const fechaFin = new Date(selectedDate[1]);
        const listaFechas: string[] = [];

        let fechaActual = new Date(fechaInicio);
        while (fechaActual <= fechaFin) {
          listaFechas.push(fechaActual.toISOString().split("T")[0]); // Formato YYYY-MM-DD
          fechaActual.setDate(fechaActual.getDate() + 1);
        }
        return listaFechas;
      };
      setListaFechas(generarListaFechas(selectedDate));
    }
  }, [selectedDate]);

  useMemo(() => {
    if (!filter || !listaFechas || !product) return;

    setIsLoading(true);

    // Crear un mapa de productos con `barCode` como clave
    const productosMap = new Map();
    product.forEach((producto) => {
      if (producto.barCode && producto.price && producto.purchasePrice) {
        productosMap.set(producto.barCode, {
          price: parseFloat(producto.price.replace(/[^0-9.]/g, "")),
          purchasePrice: parseFloat(
            producto.purchasePrice.replace(/[^0-9.]/g, "")
          ),
        });
      }
    });

    let ingresos = 0;
    let ganancia = 0;
    let productosNoEncontrados: any[] = [];

    // Filtrar las facturas dentro del rango de fechas
    const facturasEnRango = filter.filter((factura: any) =>
      listaFechas.some((fecha) => factura.date.startsWith(fecha))
    );

    // Calcular ingresos netos (suma de `total` en facturas)
    ingresos = facturasEnRango.reduce(
      (acc: any, factura: { total: any }) => acc + (factura.total || 0),
      0
    );

    // Calcular ganancia de cada producto vendido
    facturasEnRango.forEach((factura: { compra: any[] }) => {
      factura.compra.forEach(
        (productoVendido: { barCode: any; cantidad: any }) => {
          const producto = productosMap.get(productoVendido.barCode);

          if (producto) {
            const gananciaProducto =
              (producto.price - producto.purchasePrice) *
              (productoVendido.cantidad || 1);
            ganancia += gananciaProducto;
          } else {
            productosNoEncontrados.push(productoVendido);
          }
        }
      );
    });

    const totalGananciasPorFechaTemp = listaFechas.map((fecha) => {
      const facturasEnRango = filter.filter((factura: any) =>
        factura.date.startsWith(fecha)
      );

      return facturasEnRango.reduce((gananciaTotal: number, factura: any) => {
        return (
          gananciaTotal +
          factura.compra.reduce(
            (gananciaFactura: number, productoVendido: any) => {
              const producto = productosMap.get(productoVendido.barCode);
              if (producto) {
                const gananciaProducto =
                  (producto.price - producto.purchasePrice) *
                  (productoVendido.cantidad || 1);
                return gananciaFactura + gananciaProducto;
              }
              return gananciaFactura;
            },
            0
          )
        );
      }, 0);
    });
    setTotalGananciasPorFecha(totalGananciasPorFechaTemp);
    setTotalIngresos(ingresos);
    setTotalGanancia(ganancia);
    setProductosSinReferencia(productosNoEncontrados);
    setIsLoading(false);
  }, [filter, listaFechas, product]);

  useEffect(() => {
    const filteredData = data?.filter((item) => {
      const [fecha, hora] = item.date.split(" ");
      if (listaFechas) {
        return listaFechas.some((listaFecha) => fecha.startsWith(listaFecha));
      }
      return false;
    });
    setFilter(filteredData);
    const ventasHoy = data?.filter((item) => {
      const [fecha, hora] = item.date.split(" ");
      const fechaHoy = getCurrentDateTime();
      return fecha === fechaHoy;
    });
    const totalVentas =
      ventasHoy?.reduce((total, factura) => total + factura.total, 0) || 0;

    setTotalVentasHoy(totalVentas);
  }, [data, listaFechas]);

  useEffect(() => {
    if (selectedDate) {
      const generarListaFechas = (selectedDate: string[]): string[] => {
        const fechaInicio = new Date(selectedDate[0]);
        const fechaFin = new Date(selectedDate[1]);
        //ajustar zona horaria para que no inicie con la fecha anterior
        const timeZoneOffset = fechaInicio.getTimezoneOffset();
        const fechaInicioLocal = new Date(
          fechaInicio.getTime() + timeZoneOffset * 60000
        );
        const fechaFinLocal = new Date(
          fechaFin.getTime() + timeZoneOffset * 60000
        );

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
      const listaNuevasFechas = generarListaFechas(selectedDate);
      setListaFechas(listaNuevasFechas);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (listaFechas) {
      const totalVentasPorFechaTemp = listaFechas.map((fecha) => {
        const [startDate, endDate] = Array.isArray(fecha)
          ? fecha
          : [fecha, fecha];

        const facturasEnRango = filter?.filter((item: any) => {
          const [itemFecha, hora] = item.date.split(" ");

          if (startDate.length === 4 && endDate.length === 4) {
            return (
              itemFecha.startsWith(startDate) || itemFecha.startsWith(endDate)
            );
          } else if (startDate.length === 7 && endDate.length === 7) {
            return (
              (itemFecha.startsWith(startDate) && itemFecha <= endDate) ||
              (itemFecha.startsWith(endDate) && itemFecha >= startDate)
            );
          } else if (startDate.length === 10 && endDate.length === 10) {
            return itemFecha >= startDate && itemFecha <= endDate;
          }
          return false;
        });

        const totalVentasFechaFilter =
          facturasEnRango?.reduce(
            (total: any, factura: any) => total + factura.total,
            0
          ) || 0;

        return totalVentasFechaFilter;
      });

      setTotalVentasPorFecha(totalVentasPorFechaTemp);
    }
  }, [filter, listaFechas]);

  const dataCards = [
    {
      title: "INGRESOS",
      styleBox: {
        background:
          "linear-gradient(231deg, #BF56DC -1.04%, rgba(191, 86, 220, 0.21) 34.27%, #00000047 55.3%)",
      },
      typographyStyle: { color: "#BF56DC" },
      icon: "/dashboardVender/ingresos.svg",
      value: `$ ${
        totalVentasPorFecha
          ? ingresos?.toLocaleString("en-US")
          : totalVentasHoy?.toLocaleString("en-US")
      }`,
    },
    {
      title: "GASTOS",
      styleBox: {
        background:
          "linear-gradient(233deg, #257881 0.35%, rgb(0 0 0 / 30%) 57.13%, #00000054 55.3%)",
      },
      typographyStyle: { color: "#61C897" },
      icon: "/dashboardVender/gastos.svg",
      value: "$ 0",
    },
    {
      title: "GANANCIA",
      styleBox: {
        background:
          "linear-gradient(233deg, #2EB0CC 14.83%, rgba(43, 86, 126, 0.42) 46.19%, rgba(43, 86, 126, 0.43) 46.66%, rgb(13 20 34 / 74%) 69.08%)",
      },
      typographyStyle: { color: "#2EB0CC" },
      icon: "/dashboardVender/ganancia.svg",
      value: `$ ${
        totalGanancia
          ? totalGanancia.toLocaleString("en-US")
          : totalVentasHoy.toLocaleString("en-US")
      }`,
    },
  ];
  const [calculations, setCalculations] = useState({
    formattedTotalInventoryValue: "0",
    formattedTotalInvestmentValue: "0",
    expectedProfit: "0",
    profitPercentage: "0",
  });
  console.log(calculations);

  const cardsHeader = [
    {
      tile: "Total inventario",
      count: `$ ${calculations.formattedTotalInventoryValue}`,
      // percentage: "+55%",
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
      count: `$ ${calculations.formattedTotalInvestmentValue} `,
      // percentage: "+8%",
      img: "/dashboard_home/rocket.svg",
    },
  ];
  useEffect(() => {
    if (Array.isArray(product) && product.length > 0) {
      const totalInventoryValue = product.reduce((acc, item) => {
        const price =
          item.price && typeof item.price === "string"
            ? Number(item.price.replace(/[$,]/g, ""))
            : 0;
        const cantidad =
          typeof item.cantidad === "number"
            ? item.cantidad
            : item.cantidad && !isNaN(parseFloat(item.cantidad))
            ? parseFloat(item.cantidad)
            : 0;
        const totalItemValue = price * cantidad;
        return acc + totalItemValue;
      }, 0);

      const totalInvestmentValue = product.reduce((acc, item) => {
        const purchasePrice =
          item.purchasePrice && typeof item.purchasePrice === "string"
            ? Number(item.purchasePrice.replace(/[$,]/g, ""))
            : 0;
        const cantidad =
          typeof item.cantidad === "number"
            ? item.cantidad
            : item.cantidad && !isNaN(parseFloat(item.cantidad))
            ? parseFloat(item.cantidad)
            : 0;
        const totalItemInvestment = purchasePrice * cantidad;
        return acc + totalItemInvestment;
      }, 0);

      console.log("totalInventoryValue:", totalInventoryValue);
      console.log("totalInvestmentValue:", totalInvestmentValue);

      const expectedProfit = totalInventoryValue - totalInvestmentValue;
      const profitPercentage =
        totalInvestmentValue > 0
          ? Math.round((totalInventoryValue / totalInvestmentValue - 1) * 100)
          : 0;

      const formattedTotalInventoryValue =
        totalInventoryValue.toLocaleString("es-ES");
      const formattedTotalInvestmentValue =
        totalInvestmentValue.toLocaleString("es-ES");
      const formattedExpectedProfit = expectedProfit.toLocaleString("es-ES");

      setCalculations({
        formattedTotalInventoryValue,
        formattedTotalInvestmentValue,
        expectedProfit: formattedExpectedProfit,
        profitPercentage: `${profitPercentage}%`,
      });
    }
  }, [product]);
  return (
    <>
      <Header title="CAJA" />
      <Box
        sx={{
          display: { lg: "flex", md: "flex", xs: "block" },
          flexDirection: "row",
        }}
      >
        <Typography sx={typographyTitle}>FLUJO DE CAJA </Typography>
        <Select
          style={{
            color: "#69EAE2",
          }}
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
        {`Fecha: ${
          dateSearchTerm === "" ? getCurrentDateTime() : dateSearchTerm
        }`}
      </Typography>
      <Box
        sx={{
          display: { xs: "block", sm: "flex" },
          justifyContent: "space-between",
        }}
      >
        {cardsHeader.map((e, i) => {
          return (
            <Box
              key={i * 98}
              width={{ sm: "31%" }}
              sx={{
                marginY: { xs: "20px", sm: "auto" },
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                borderRadius: "20px",
                background:
                  "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, #1F1D2B 91.2%)",
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
                <Box display={"flex"} sx={{ justifyContent: "space-between" }}>
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
                  <Typography
                    sx={{
                      color: e?.percentage?.includes("+")
                        ? "#01B574"
                        : "#E31A1A",
                    }}
                  >
                    {e.percentage}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Box component={"img"} src={e.img} />
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box>
        <Box>
          <Box
            sx={{
              textAlign: { xs: "-webkit-center" },
              display: { lg: "flex", md: "flex", xs: "block" },
              justifyContent: "space-around",
            }}
          >
            {dataCards.map((e, index) => {
              return (
                <Box
                  sx={{
                    width: { lg: "30%", md: "30%", xs: "90%" },
                    maxWidth: "330px",
                  }}
                  key={index * 99}
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
                      <Box component={"img"} src={e.icon} />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
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
              {
                <ChartBarline
                  listaFechas={listaFechas}
                  totalVentasPorFecha={totalVentasPorFecha}
                />
              }
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
              {
                <ChartArea
                  listaFechas={listaFechas}
                  totalVentasPorFecha={totalVentasPorFecha}
                  totalGananciasPorFecha={totalGananciasPorFecha}
                />
              }
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
