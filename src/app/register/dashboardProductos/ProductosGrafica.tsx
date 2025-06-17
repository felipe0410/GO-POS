"use client";

import dynamic from "next/dynamic";
import { useProductosContext } from "./context/ProductosContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ProductosGrafica() {
  const { datosProducto, metric } = useProductosContext();

  const categorias = datosProducto.map((d: { x: any; }) => d.x);

  const options:any = {
    theme: { mode: "dark" as const },
    chart: {
      id: "area-chart",
      background: "#2C3248",
      foreColor: "#FFF",
    },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val: number) =>
          metric === "ventas"
            ? `$ ${val.toLocaleString("es-CO")}`
            : `${val.toLocaleString("es-CO")} uds`,
      },
      x: {
        formatter: (_val: number, opts?: any) => {
          return `Fecha: ${categorias[opts?.dataPointIndex] || ""}`;
        },
      },
    },
    xaxis: {
      type: "category", // 👈 ESTO ES CLAVE
      categories: categorias,
      labels: {
        rotate: -45,
        style: { fontSize: "12px" },
      },
      tickAmount: Math.min(10, datosProducto.length || 1),
    },
    yaxis: {
      labels: {
        formatter: (val: number) =>
          metric === "ventas"
            ? `$ ${val.toLocaleString("es-CO")}`
            : `${val.toLocaleString("es-CO")} uds`,
      },
    },
    colors: ["#BF56DC"],
  };

  const series = [
    {
      name: metric === "ventas" ? "Valor vendido" : "Unidades vendidas",
      data: datosProducto.map((d: { y: any; }) => d.y),
    },
  ];

  return <Chart type="area" height={350} options={options} series={series} />;
}
