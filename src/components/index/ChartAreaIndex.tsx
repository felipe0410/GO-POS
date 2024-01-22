import Chart from "react-apexcharts";
import dynamic from "next/dynamic";

const ChartDynamic = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartAreaIndex = ({
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
      background: "transparent",
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
    colors: ["#2CD9FF", "#0075FF"],
  };
  const series = [
    {
      name: "Diciembre",
      data: totalVentasPorFecha?.length > 0 ? totalVentasPorFecha : [],
    },
    {
      name: "Enero",
      data: totalVentasPorFecha?.length > 0 ? totalVentasPorFecha : [],
    },
  ];

  return <ChartDynamic options={options} series={series} type='area' height={"350px"} />;
};

export default ChartAreaIndex;