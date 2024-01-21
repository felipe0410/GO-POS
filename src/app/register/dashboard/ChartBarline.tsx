import dynamic from "next/dynamic";
import Chart from "react-apexcharts";

const ChartDynamic = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartBarline = ({
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
      enabled: false,
      style: {
        colors: ["#000"]
      },
    },
    xaxis: {
      categories: listaFechas ? listaFechas : [],
    },
    colors: ["#69EAE2"],
  };
  const series = [
    {
      name: "Sales",
      data: totalVentasPorFecha ? totalVentasPorFecha : [],
    },
  ];

  return <ChartDynamic options={options} series={series} type='bar' height={350} />;
};

export default ChartBarline;
