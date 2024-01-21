import Chart from "react-apexcharts";

const ChartBarline = ({
  listaFechas,
  totalVentasPorFecha,
}: {
  listaFechas: any;
  totalVentasPorFecha: any;
}) => {
  const options = {
    chart: {
      id: "basic-bar",
      background: "#1F1D2B",
      foreColor: "#FFF",
    },
    dataLabels: {
      enabled: true,
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

  return <Chart options={options} series={series} type='bar' height={350} />;
};

export default ChartBarline;
