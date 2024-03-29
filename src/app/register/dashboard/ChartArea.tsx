import Chart from "react-apexcharts";
import dynamic from "next/dynamic";

const ChartDynamic = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartArea = ({
  listaFechas,
  totalVentasPorFecha,
}: {
  listaFechas: any;
  totalVentasPorFecha: any;
}) => {
  const options = {
    theme: {
      mode: "dark" as const,
    },
    chart: {
      id: "basic-bar",
      background: "#1F1D2B",
      foreColor: "#FFF",
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#000"]
      },
    },
    xaxis: {
      categories: listaFechas ? listaFechas : [],
    },
    colors: ["#BF56DC", "#69EAE2", "#37FD3F"],
  };
  const series = [
    {
      name: "Ingresos",
      data: totalVentasPorFecha ? totalVentasPorFecha : [],
    },
    {
      name: "Ganancia",
      data: totalVentasPorFecha ? totalVentasPorFecha : [],
    },
    {
      name: "Gastos",
      data: [],
    },
  ];

  return <ChartDynamic options={options} series={series} type='area' height={350} />;
};

export default ChartArea;
