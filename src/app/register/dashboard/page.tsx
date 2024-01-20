"use client";
import Header from "@/components/Header";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { selectStyle, typographyTitle } from "./style";
import { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { getAllInvoicesData } from "@/firebase";
import CalendarioMes from "./CalendarioMes";
import CalendarioAno from "./CalendarioAno";
import "react-datepicker/dist/react-datepicker.css";
import CalendarioDias from "./CalendarioDias";

const Dashboard = () => {
  const [data, setData] = useState<undefined | any[]>(undefined);
  const [totalVentasHoy, setTotalVentasHoy] = useState<number>(0);
  const [calendarioType, setCalendarioType] = useState<string>(" ");
  const [dateSearchTerm, setDateSearchTerm] = useState<string | string[]>("");
  const [filter, setFilter] = useState<any>();
  const [selectedDate, setSelectedDate] = useState<any>();
  const [totalVentasFecha, setTotalVentasFecha] = useState<any>();

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
        await getAllInvoicesData(setData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getAllInvoices();
  }, []);

  useEffect(() => {
    const [startDate, endDate] = Array.isArray(selectedDate)
      ? selectedDate
      : [selectedDate, selectedDate];

    const facturasEnRango = filter?.filter((item: any) => {
      const [fecha, hora] = item.date.split(" ");

      if (startDate?.length === 4 && endDate?.length === 4) {
        return fecha.startsWith(startDate) || fecha.startsWith(endDate);
      } else if (startDate?.length === 7 && endDate?.length === 7) {
        return (
          (fecha.startsWith(startDate) && fecha <= endDate) ||
          (fecha.startsWith(endDate) && fecha >= startDate)
        );
      } else if (startDate?.length === 10 && endDate?.length === 10) {
        return fecha >= startDate && fecha <= endDate;
      }
      return false;
    });

    const totalVentasFechaFilter =
      facturasEnRango?.reduce(
        (total: any, factura: any) => total + factura.total,
        0
      ) || 0;

    setTotalVentasFecha(totalVentasFechaFilter);
  }, [filter, selectedDate]);

  useEffect(() => {
    const [startDate, endDate] = Array.isArray(selectedDate)
      ? selectedDate
      : [selectedDate, selectedDate];

    const filteredData = data?.filter((item) => {
      if (!dateSearchTerm || dateSearchTerm.length === 0) {
        return true;
      }

      const [fecha, hora] = item.date.split(" ");

      if (startDate?.length === 4 && endDate?.length === 4) {
        return fecha.startsWith(startDate) || fecha.startsWith(endDate);
      } else if (startDate?.length === 7 && endDate?.length === 7) {
        return (
          (fecha.startsWith(startDate) && fecha <= endDate) ||
          (fecha.startsWith(endDate) && fecha >= startDate)
        );
      } else if (startDate?.length === 10 && endDate?.length === 10) {
        return fecha >= startDate && fecha <= endDate;
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
  }, [data, dateSearchTerm, selectedDate]);

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
        totalVentasFecha
          ? totalVentasFecha.toLocaleString("en-US")
          : totalVentasHoy.toLocaleString("en-US")
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
        totalVentasFecha
          ? totalVentasFecha.toLocaleString("en-US")
          : totalVentasHoy.toLocaleString("en-US")
      }`,
    },
  ];

  var options = {
    theme: { mode: "dark" },
    colors: ["#BF56DC", "#69EAE2", "#37FD3F"],
    series: [
      {
        name: "Ingresos",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "Egresos",
        data: [8, 20, 30, 32, 38, 5, 41],
      },
      {
        name: "Gastos",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    chart: {
      height: 350,
      type: "area",
      stacked: false,
      background: "#1F1D2B",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    grid: {
      yaxis: {
        lines: {
          offsetX: 0,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
      borderColor: "rgba(255, 255, 255, 0.26)",
    },
    fill: {
      opacity: 1,
    },
  };
  const chartRef = useRef(null);
  const chartRefLine = useRef(null);

  var optionsLine = {
    colors: ["#69EAE2", "#D9D9D947"],
    theme: { mode: "dark" },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "PRODUCT A",
        data: [44, 55, 41, 67, 22, 43, 21, 49],
      },
      {
        name: "PRODUCT C",
        data: [11, 17, 15, 15, 21, 14, 15, 13],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
      background: "#1F1D2B",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    xaxis: {
      categories: [
        "2011 Q1",
        "2011 Q2",
        "2011 Q3",
        "2011 Q4",
        "2012 Q1",
        "2012 Q2",
        "2012 Q3",
        "2012 Q4",
      ],
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "right",
      offsetX: 0,
      offsetY: 50,
    },
  };

  // useEffect(() => {
  //   if (
  //     typeof window !== "undefined" &&
  //     chartRef.current &&
  //     chartRefLine.current
  //   ) {
  //     var chart = new ApexCharts(chartRef.current, options);
  //     chart.render();
  //     var chartLine = new ApexCharts(chartRefLine.current, optionsLine);
  //     chartLine.render();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <Header title='CAJA' />
      <Box
        sx={{
          display: "flex",
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
          <MenuItem value=' '>Seleccione Calendario</MenuItem>
          <MenuItem value='year'>Calendario de Año</MenuItem>
          <MenuItem value='mes'>Calendario de Mes</MenuItem>
          <MenuItem value='dia'>Calendario de Día</MenuItem>
        </Select>
        {renderCalendario()}
      </Box>
      <Box>
        <Typography
          align='center'
          sx={{
            color: "#69EAE2",
            fontFamily: "Nunito",
            fontSize: "40px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          {`Fecha: ${
            dateSearchTerm === "" ? getCurrentDateTime() : dateSearchTerm
          }`}
        </Typography>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            {dataCards.map((e, index) => {
              return (
                <Box
                  sx={{
                    width: "30%",
                    maxWidth: "330px",
                  }}
                  key={index * 99}
                >
                  <Typography
                    align='center'
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
              width: "70%",
              height: "400px",
              borderRadius: "30px",
              background: "#1F1D2B",
              boxShadow: "0px 1px 100px -50px #69EAE2",
              padding: "25px",
            }}
          >
            <Box key={1} ref={chartRef} />
          </Box>
          <Box
            sx={{
              width: "70%",
              height: "400px",
              borderRadius: "30px",
              background: "#1F1D2B",
              boxShadow: "0px 1px 100px -50px #69EAE2",
              padding: "25px",
            }}
          >
            <Box key={1} ref={chartRefLine} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
