import dynamic from "next/dynamic";
const ChartDynamic = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartArea = ({
  listaFechas,
  totalVentasPorFecha,
  totalGananciasPorFecha,
}: {
  listaFechas: any[];
  totalVentasPorFecha: any[];
  totalGananciasPorFecha: any[];
}) => {
  // Encontrar el máximo valor de ventas y ganancias
  const maxVentas = Math.max(...totalVentasPorFecha);
  const maxGanancias = Math.max(...totalGananciasPorFecha);

  // Encontrar el índice del máximo en cada serie
  const maxVentasIndex = totalVentasPorFecha.indexOf(maxVentas);
  const maxGananciasIndex = totalGananciasPorFecha.indexOf(maxGanancias);

  const options = {
    theme: {
      mode: "dark" as const,
    },
    chart: {
      id: "area-chart",
      background: "#1F1D2B",
      foreColor: "#FFF",
    },
    
    dataLabels: {
      enabled: false,
      style: {
        colors: ["#000"],
        fontSize: "12px",
      },
      formatter: (val: number) => `$ ${val.toLocaleString("en-US")}`,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$ ${val.toLocaleString("en-US")}`,
      },
      x: {
        formatter: (val: number) => {
          return listaFechas[val] ? `Fecha: ${listaFechas[val]}` : "Fecha desconocida";
        },
      },
    },
    xaxis: {
      categories: listaFechas,
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
        },
      },
      tickAmount: Math.min(10, listaFechas.length || 1),
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$ ${val.toLocaleString("en-US")}`,
      },
    },
    colors: ["#BF56DC", "#69EAE2", "#37FD3F"],
    markers: {
      size: [4, 4], // Tamaño de los puntos normales
      discrete: [
        {
          seriesIndex: 0, // Índice de "Ingresos"
          dataPointIndex: maxVentasIndex, // Máximo de Ingresos
          fillColor: "#FF0000", // Color rojo
          strokeColor: "#FFF",
          size: 8, // Hacerlo más grande
        },
        {
          seriesIndex: 1, // Índice de "Ganancia"
          dataPointIndex: maxGananciasIndex, // Máximo de Ganancias
          fillColor: "#00FF00", // Color verde
          strokeColor: "#FFF",
          size: 8, // Hacerlo más grande
        },
      ],
    },
  };

  const series = [
    {
      name: "Ingresos",
      data: totalVentasPorFecha || [],
    },
    {
      name: "Ganancia",
      data: totalGananciasPorFecha || [],
    },
    {
      name: "Gastos",
      data: [],
    },
  ];

  return <ChartDynamic options={options} series={series} type="area" height={350} />;
};

export default ChartArea;
