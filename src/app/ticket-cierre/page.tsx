// pages/ticket-cierre.tsx (o en /components si usas routing manual)
"use client";
import { useEffect, useState } from "react";

const TicketCierreCaja = () => {
  const [datos, setDatos] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("datosCierreCaja");
    if (stored) {
      setDatos(JSON.parse(stored));
    }
  }, []);

  if (!datos) return <p>Cargando ticket...</p>;

  const format = (val: number | string) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(val));

  return (
    <div style={{ fontFamily: "monospace", padding: 20, width: 300 }}>
      <h2 style={{ textAlign: "center" }}>🧾 Cierre de Caja</h2>
      <hr />
      <div>📍 {datos.establecimiento}</div>
      <div>📅 {datos.fecha}</div>
      <hr />
      <div>💰 Monto Inicial: {format(datos.montoInicial)}</div>
      <div>💵 Efectivo: {format(datos.efectivo)}</div>
      <div>💳 Transferencias: {format(datos.transferencias)}</div>
      <div>↩️ Devoluciones: {format(datos.devoluciones)}</div>
      <div>⏳ Pendientes: {format(datos.pendientes)}</div>
      <div>🧾 Total Vendido: {format(datos.totalCerrado)}</div>
      <div>📈 Producido: {format(datos.producido)}</div>
      <div>🏦 Monto Final: {format(datos.montoFinal)}</div>
      <hr />
      <div>📝 Notas:</div>
      <div>{datos.notasCierre || "N/A"}</div>
      <hr />
      <button onClick={() => window.print()}>🖨️ Imprimir</button>
    </div>
  );
};

export default TicketCierreCaja;
