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
      // categories: [
      //   "2024-01-14",
      //   "2024-01-15",
      //   "2024-01-16",
      //   "2024-01-17",
      //   "2024-01-18",
      //   "2024-01-19",
      //   "2024-01-20",
      //   "2024-01-21"
      // ] 
      categories: listaFechas ? listaFechas : [],
    },
    colors: ["#2CD9FF", "#0075FF"],
  };
  const series = [
    {
      name: "Diciembre",
      // data: [0, 111000, 0, 360500, 0, 0, 292500, 0]
      data: totalVentasPorFecha?.length > 0 ? totalVentasPorFecha : [],
    },
    {
      name: "Enero",
      // data: [0, 111000, 0, 360500, 0, 0, 292500, 0]
      data: totalVentasPorFecha?.length > 0 ? totalVentasPorFecha : [],
    },
  ];

  return <ChartDynamic options={options} series={series} type='area' height={"350px"} />;
};

export default ChartAreaIndex;