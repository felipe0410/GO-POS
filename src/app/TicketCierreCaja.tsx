import React, { forwardRef, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import JsBarcode from "jsbarcode";

interface TicketCierreCajaProps {
  // Datos del establecimiento
  establecimiento?: string;
  fecha?: string;
  consecutivo?: number;
  
  // Datos de la sesión de caja (nueva estructura)
  cajaData?: {
    uid?: string;
    montoInicial?: string | number;
    fechaApertura?: string;
    notasApertura?: string;
    estado?: string;
  };
  
  // Resumen de caja (nueva estructura)
  resumenCaja?: {
    efectivo: number;
    transferencias: number;
    total: number;
    facturas: number;
  };
  
  // Totales calculados
  producido?: number;
  totalEnCaja?: number;
  
  // Notas de cierre
  notasCierre?: string;
  
  // Props opcionales para compatibilidad
  montoInicial?: number;
  efectivo?: number;
  transferencias?: number;
  pendientes?: number;
  devoluciones?: number;
  totalCerrado?: number;
  montoFinal?: number;
  onImprimir?: () => void;
}

const format = (val: number | string) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(val));

const TicketCierreCaja = forwardRef<HTMLDivElement, TicketCierreCajaProps>(
  (props, ref) => {
    // Extraer props con valores por defecto
    const {
      establecimiento = "Establecimiento",
      fecha,
      consecutivo,
      cajaData,
      resumenCaja,
      producido,
      totalEnCaja,
      notasCierre = "",
      // Props de compatibilidad
      montoInicial,
      efectivo,
      transferencias,
      pendientes,
      devoluciones,
      totalCerrado,
      montoFinal,
      onImprimir,
    } = props;

    // Calcular valores usando la nueva estructura o fallback a la antigua
    const montoInicialFinal = cajaData?.montoInicial 
      ? Number(cajaData.montoInicial) 
      : (montoInicial || 0);
    
    const efectivoFinal = resumenCaja?.efectivo || efectivo || 0;
    const transferenciasFinal = resumenCaja?.transferencias || transferencias || 0;
    const producidoFinal = producido || (efectivoFinal + transferenciasFinal);
    const totalEnCajaFinal = totalEnCaja || (efectivoFinal + montoInicialFinal);
    const fechaFinal = fecha || new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const numeroFacturas = resumenCaja?.facturas || 0;
    // en SidebarBox.tsx
    const ticketRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
      if (!ticketRef.current) return;
      const printContents = ticketRef.current.innerHTML;
      const win = window.open("", "", "width=600,height=700");
      if (win) {
        win.document.write(`
      <html>
        <body>${printContents}</body>
      </html>
    `);
        win.document.close();
        win.focus();
        setTimeout(() => {
          win.print();
          win.close();
        }, 500);
      }
    };
    console.log("consecutivo", consecutivo);
    useEffect(() => {
      if (consecutivo) {
        JsBarcode("#barcode", `${consecutivo}`, {
          format: "CODE128",
          displayValue: true,
          width: 2,
          height: 50,
        });
      }
    }, [consecutivo]);
    return (
      <>
        <Box
          ref={ticketRef}
          sx={{
            backgroundColor: "white",
            color: "black",
            padding: 3,
            width: "100%",
            maxWidth: 400,
            fontFamily: "monospace",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" textAlign="center" mb={2} fontWeight="bold">
            🧾 Cierre de Caja
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            align="center"
            sx={{ fontWeight: 900, textTransform: "uppercase" }}
            variant="h6"
          >
            📍 {establecimiento}
          </Typography>
          <Typography
            align="center"
            sx={{ textTransform: "uppercase", fontWeight: 700 }}
            variant="subtitle1"
          >
            📅 {fechaFinal}
          </Typography>
          
          {cajaData?.uid && (
            <Typography
              align="center"
              sx={{ fontWeight: 600, color: "#666" }}
              variant="body2"
            >
              🏦 Sesión: {cajaData.uid}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>💰 Monto Inicial</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", fontWeight: 600 }}
                  align="right"
                >
                  {format(montoInicialFinal)}
                </TableCell>
              </TableRow>
              
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell colSpan={2} sx={{ fontWeight: 700, textAlign: "center" }}>
                  📊 VENTAS DEL DÍA
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>💵 Ventas en Efectivo</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem" }}
                  align="right"
                >
                  {format(efectivoFinal)}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>💳 Ventas en Transferencia</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem" }}
                  align="right"
                >
                  {format(transferenciasFinal)}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>📄 Número de Facturas</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem" }}
                  align="right"
                >
                  {numeroFacturas}
                </TableCell>
              </TableRow>
              
              <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                <TableCell sx={{ fontWeight: 700 }}>
                  📈 TOTAL PRODUCIDO
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1.1rem", fontWeight: 700 }}
                  align="right"
                >
                  {format(producidoFinal)}
                </TableCell>
              </TableRow>
              
              <TableRow sx={{ backgroundColor: "#e8f4fd" }}>
                <TableCell sx={{ fontWeight: 700 }}>
                  🏦 TOTAL EN CAJA
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1.1rem", fontWeight: 700 }}
                  align="right"
                >
                  {format(totalEnCajaFinal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />

          {notasCierre && (
            <>
              <Typography variant="subtitle2" fontWeight="bold">
                📝 Notas de Cierre:
              </Typography>
              <Typography variant="body2" mb={2} sx={{ fontStyle: "italic" }}>
                {notasCierre}
              </Typography>
            </>
          )}
          
          <Typography variant="caption" sx={{ textAlign: "center", display: "block", mt: 2, color: "#666" }}>
            🕒 Generado: {new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}
          </Typography>
          {consecutivo !== undefined && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <svg id="barcode" style={{ width: "100%" }} />
            </Box>
          )}
        </Box>
        {
          <Button fullWidth variant="contained" onClick={handlePrint}>
            🖨️ Imprimir Ticket
          </Button>
        }
      </>
    );
  }
);

TicketCierreCaja.displayName = "TicketCierreCaja";

export default TicketCierreCaja;
