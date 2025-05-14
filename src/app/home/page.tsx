"use client";
import { Box, Chip, Divider, Typography } from "@mui/material";
import * as React from "react";
import ChartAreaIndex from "@/components/index/ChartAreaIndex";
import { useEffect, useState } from "react";
import {
  getAllClientsData,
  getAllInvoicesData,
  getEstablishmentData,
  getProductData,
} from "@/firebase";
import { stat } from "fs";
interface Cliente {
  celular: string;
  email: string;
  identificacion: string;
  direccion: string;
  name: string;
}

interface Producto {
  productName: string;
  cantidad: number;
  acc: number;
  barCode: string;
}

interface Factura {
  id: string;
  user: string;
  descuento: number;
  status: string;
  uid: string;
  total: number;
  vendedor: string;
  cliente: Cliente;
  subtotal: number;
  compra: Producto[];
  date: string;
  invoice: string;
}

interface VentasPorFecha {
  [fecha: string]: number;
}

export default function Home() {
  const [topProductos, setTopProductos] = useState<
    { barCode: string; productName: string; cantidad: number; totalVentas: number; image?: string }[]
  >([]);
  const [invoicesData, setInvoicesData] = useState([]);
  const [arraySumInvoices, setArraySumInvoices] = useState<number[]>([]);
  const [arrayDate, setArrayDate] = useState<string[]>([]);
  const [total, setTotal] = useState("0");
  const [totalToday, setTotalToday] = useState("0");
  const [dataClient, setDataClient] = useState([]);
  const [establishmentData, setEstablishmentData] = useState<any>({});
  const [crecimientoPorcentual, setCrecimientoPorcentual] =
    useState<string>("");

  const dataUser = JSON.parse(localStorage?.getItem("dataUser") ?? "{}");
  const listJobs = dataUser?.jobs ?? [];
  const status = dataUser?.status ?? "";
  const validation = listJobs.length === 3 || status === "admin";
  const cardsHeader = [
    {
      tile: "Gananacias de hoy",
      count: `$ ${validation ? totalToday : "------------"}`,
      percentage: "+55%",
      img: "/dashboard_home/cash.svg",
    },
    {
      tile: "Clientes",
      count: `+ ${validation ? dataClient.length : "------------"}`,
      percentage: "-14%",
      img: "/dashboard_home/clients.svg",
    },
    {
      tile: "Ventas Totales",
      count: `$ ${validation ? total : "------------"}`,
      percentage: "+8%",
      img: "/dashboard_home/rocket.svg",
    },
  ];

  const obtenerTotalesPorMes = (
    invoicesData: Factura[],
    mes: number,
    anio: number
  ) => {
    const facturasDelMes = invoicesData.filter((factura) => {
      const [fecha] = factura.date.split(" ");
      const [facturaAnio, facturaMes] = fecha.split("-").map(Number);
      return facturaMes === mes && facturaAnio === anio;
    });

    const totalVentasMes = facturasDelMes.reduce((total, factura) => {
      return total + factura.total;
    }, 0);

    return totalVentasMes;
  };

  const calcularCrecimientoPorcentual = (
    totalMesAnterior: number,
    totalMesActual: number
  ) => {
    if (totalMesAnterior === 0) return "0"; // Evitar división por 0
    const crecimiento =
      ((totalMesActual - totalMesAnterior) / totalMesAnterior) * 100;
    return crecimiento.toFixed(2); // Redondear a dos decimales
  };


  const calcularTopProductos = async () => {
    const conteo: Record<string, {
      barCode: string;
      productName: string;
      cantidad: number;
      totalVentas: number;
    }> = {};

    invoicesData.forEach((factura: Factura) => {
      if (factura.status !== "CANCELADO") return;

      factura.compra.forEach((item: Producto) => {
        const key = item.barCode || item.productName;

        if (!conteo[key]) {
          conteo[key] = {
            barCode: item.barCode,
            productName: item.productName,
            cantidad: 0,
            totalVentas: 0,
          };
        }

        conteo[key].cantidad += item.cantidad;
        conteo[key].totalVentas += item.acc;
      });
    });

    const productosOrdenados = Object.values(conteo)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);

    // Consultar las imágenes de cada producto
    const productosConImagen = await Promise.all(
      productosOrdenados.map(async (producto) => {
        const data = await getProductData(producto.barCode);
        return {
          ...producto,
          image: data?.image || "/images/noImage.svg", // fallback si no tiene imagen
        };
      })
    );

    setTopProductos(productosConImagen);
  };
  const Container = ({ children }: { children: React.ReactNode }) => {
    return (
      <Box
        sx={{
          marginY: "20px",
          borderRadius: "20px",
          marginLeft: '5px',
          background: "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(24, 24, 42, 0.93) 61.61%, #1F1D2B 91.2%)",
          backdropFilter: "blur(60px)",
        }}
      >
        {children}
      </Box>
    );
  };

  useEffect(() => {
    const getData = async () => {
      await getAllInvoicesData(setInvoicesData);
      await getAllClientsData(setDataClient);
      const establishmentData = (await getEstablishmentData()) || {};
      setEstablishmentData(establishmentData);
    };
    getData();
  }, []);

  useEffect(() => {
    if (invoicesData.length > 0) {
      calcularTopProductos();
    }

  }, [invoicesData]);
  useEffect(() => {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // Mes actual (1-12)
    const anioActual = fechaActual.getFullYear();
    const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
    const anioMesAnterior = mesActual === 1 ? anioActual - 1 : anioActual;

    const totalVentasMesActual = obtenerTotalesPorMes(
      invoicesData,
      mesActual,
      anioActual
    );
    const totalVentasMesAnterior = obtenerTotalesPorMes(
      invoicesData,
      mesAnterior,
      anioMesAnterior
    );

    const crecimiento = calcularCrecimientoPorcentual(
      totalVentasMesAnterior,
      totalVentasMesActual
    );
    setCrecimientoPorcentual(crecimiento);

    const fechaInicio = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() - 1,
      21
    );
    const fechaFin = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      fechaActual.getDate()
    );
    const filterData = async () => {
      const facturasFiltradas = await invoicesData.filter((invoice: any) => {
        const fechaFactura = new Date(invoice.date);
        return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
      });
      const sumarVentasPorFecha = (
        facturas: Factura[]
      ): Record<string, number> => {
        const resultados: Record<string, number> = {};
        facturas.forEach((factura) => {
          const fecha = factura.date.split(" ")[0];
          if (!resultados[fecha]) {
            resultados[fecha] = 0;
          }
          resultados[fecha] += factura.total;
        });
        return resultados;
      };
      const result: VentasPorFecha = sumarVentasPorFecha(facturasFiltradas);
      if (result) {
        setArraySumInvoices(Object.values(result));
        setArrayDate(Object.keys(result));
      }
    };
    const totalVentas = invoicesData.reduce(
      (acumulador, factura: Factura) => acumulador + factura.total,
      0
    );
    const formatter = new Intl.NumberFormat("es-CO", {
      style: "decimal",
      maximumFractionDigits: 0, // Esto elimina los decimales, si necesitas decimales, ajusta este valor
    });
    const totalVentasFormateado = formatter.format(totalVentas);
    setTotal(`${totalVentasFormateado}`);
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0); // Establece la hora al inicio del día
    const sumaVentasHoy = invoicesData.reduce(
      (acumulador, factura: Factura) => {
        const fechaFactura = new Date(factura.date);
        fechaFactura.setHours(0, 0, 0, 0); // Establece la hora al inicio del día para comparar solo la fecha
        if (fechaFactura.getTime() === fechaHoy.getTime()) {
          return acumulador + factura.total;
        }
        return acumulador;
      },
      0
    );
    const totalVentasHoyFormateado = formatter.format(sumaVentasHoy);
    setTotalToday(totalVentasHoyFormateado);
    filterData();
  }, [invoicesData]);

  const obtenerMeses = () => {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
    return {
      mesActual: meses[mesActual],
      mesAnterior: meses[mesAnterior],
    };
  };

  const { mesActual, mesAnterior } = obtenerMeses();

  const sectionHeader = (
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
                    color: e.percentage.includes("+") ? "#01B574" : "#E31A1A",
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
  );


  return (
    <Box sx={{ width: { xs: "95%", sm: "98%" } }}>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>{sectionHeader}</Box>
      <Divider
        sx={{
          display: { xs: "none", sm: "block" },
          height: "1px",
          background: "#69EAE2",
          width: "100%",
          marginY: "20px",
        }}
      />
      <Box
        display={{ xs: "block", sm: "flex" }}
        sx={{ justifyContent: "space-between" }}
      >
        <Container>
          <Box sx={{ display: "flex", padding: "15px 40px" }}>
            <Box>
              <Typography
                sx={{
                  color: "#69EAE2",
                  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  fontFamily: "Nunito",
                  fontSize: { xs: "24px", sm: "30px" },
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Hola {establishmentData?.name ?? "user GO"} !
              </Typography>
              <Typography
                sx={{
                  color: "#69EAE2",
                  textShadow:
                    "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)",
                  fontFamily: "Nunito",
                  fontSize: { xs: "14px", sm: "20px" },
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Nos alegra verte de nuevo.
              </Typography>
            </Box>
            <Box sx={{ width: { xs: "60%", sm: "auto" } }}>
              <Box
                width={"100%"}
                component={"img"}
                src="/dashboard_home/fox.png"
              />
            </Box>
          </Box>
        </Container>
        <Divider
          sx={{
            display: { xs: "block", sm: "none" },
            height: "1px",
            background: "#69EAE2",
            width: "100%",
            marginY: "20px",
          }}
        />
        <Container>
          <Box sx={{ padding: "30px", maxHeight: "280px", overflowX:'none' }}>
            <Box>
              <Typography
                sx={{
                  color: "#69EAE2",
                  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  fontFamily: "Nunito",
                  fontSize: { xs: "20px", sm: "24px" },
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                {topProductos.length > 2 ? 'Top 10 de productos mas vendidos en Enero' : "Aun nos falta informacion, pronto se generara la lista de los productos mas vendidos"}
              </Typography>
            </Box>
            <Box sx={{ maxHeight: "180px", overflowY: "auto" }}>
              {topProductos.map((producto, i) => (
                <Box
                  key={producto.barCode}
                  display={"flex"}
                  sx={{
                    height: "50px",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    marginTop: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Gray-Gray-400, #A0AEC0)",
                      fontFamily: "Nunito",
                      fontSize: { xs: "14px", sm: "16px" },
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "100%",
                      textTransform: 'uppercase'
                    }}
                  >
                    {i + 1}. {producto.productName}
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={`${producto.cantidad} und`}
                        size="medium"
                        sx={{
                          fontSize: "13px",
                          backgroundColor: "#CBD5E0",
                          color: "#1A202C",
                          height: "20px",
                          fontWeight: '900'
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#01B574", // verde
                          fontWeight: 900,
                        }}
                      >
                        ${producto.totalVentas.toLocaleString("es-CO")}
                      </Typography>
                    </Box>
                  </Typography>
                  <Box
                    id='containe imagen product'
                    sx={{
                      height: "60px",
                      width: "60px",
                      background: "#000",
                      textAlignLast: "center",
                      borderRadius: "50%",
                      padding: '10px'
                    }}
                  >
                    <Box
                      height={"100%"}
                      component={"img"}
                      src={producto?.image && producto.image.length > 2 ? producto.image : "/images/noImage.svg"}
                    />

                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
        <Box sx={{ display: { sm: "none" } }}>{sectionHeader}</Box>
      </Box>
      <Divider
        sx={{
          display: { xs: "block", sm: "none" },
          height: "1px",
          background: "#69EAE2",
          width: "100%",
          marginY: "20px",
        }}
      />
      <Box
        sx={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "20px",
          background:
            "linear-gradient(127deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(20, 21, 41, 0.88) 54.06%, rgba(28, 27, 43, 0.97) 73.89%, #1F1D2B 91.2%)",
          backdropfilter: "blur(60px)",
          height: { sm: "482px" },
          marginBottom: "20px",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box>
            <Typography
              align="center"
              sx={{
                color: "var(--Secondary-Primary-White, #FFF)",
                fontFamily: "Nunito",
                fontSize: "36px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
              }}
            >
              Ventas Mensuales
            </Typography>
            <Typography
              sx={{
                color: "var(--Gray-Gray-400, #A0AEC0)",
                fontFamily: "Nunito",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
              }}
            >
              <span
                style={{
                  color: !crecimientoPorcentual.includes("-") ? "green" : "red",
                }}
              >
                {crecimientoPorcentual}%{" "}
                {crecimientoPorcentual.includes("-") ? "menos" : "mas"}
              </span>{" "}
              que en {mesAnterior}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            placeSelf: "center",
            width: "100%",
            textAlignLast: "center",
            marginTop: { sm: "-50px" },
          }}
        >
          <Typography
            sx={{
              color: "#69EAE2",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              fontFamily: "Nunito",
              fontSize: { xs: "24px", sm: "32px" },
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            {mesActual}
          </Typography>
        </Box>
        <Box
          id="container_chart"
          sx={{ filter: validation ? "blur(0px)" : "blur(100px)" }}
        >
          <ChartAreaIndex
            listaFechas={arrayDate}
            totalVentasPorFecha={arraySumInvoices}
          />
        </Box>
      </Box>
    </Box>
  );
}
