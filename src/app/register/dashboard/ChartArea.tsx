import Chart from "react-apexcharts";

const ChartArea = ({
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

  return <Chart options={options} series={series} type='area' height={350} />;
};

export default ChartArea;
