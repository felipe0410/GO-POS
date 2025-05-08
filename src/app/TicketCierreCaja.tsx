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
  establecimiento: string;
  fecha: string;
  montoInicial: number;
  efectivo: number;
  transferencias: number;
  pendientes: number;
  devoluciones: number;
  totalCerrado: number;
  producido: number;
  montoFinal: number;
  notasCierre: string;
  onImprimir?: () => void;
  consecutivo: number;
}

const format = (val: number | string) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(val));

const TicketCierreCaja = forwardRef<HTMLDivElement, TicketCierreCajaProps>(
  (
    {
      establecimiento,
      fecha,
      montoInicial,
      efectivo,
      transferencias,
      pendientes,
      devoluciones,
      totalCerrado,
      producido,
      montoFinal,
      notasCierre,
      onImprimir,
      consecutivo,
    },
    ref
  ) => {
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
            📅 {fecha}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Monto Inicial</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", textTransform: "uppercase" }}
                  align="right"
                >
                  {format(montoInicial)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Efectivo</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", textTransform: "uppercase" }}
                  align="right"
                >
                  {format(efectivo)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Transferencias</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", textTransform: "uppercase" }}
                  align="right"
                >
                  {format(transferencias)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Devoluciones</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", textTransform: "uppercase" }}
                  align="right"
                >
                  {format(devoluciones)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pendientes</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", textTransform: "uppercase" }}
                  align="right"
                >
                  {format(pendientes)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Vendido</TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", textTransform: "uppercase" }}
                  align="right"
                >
                  {format(totalCerrado)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Producido</strong>
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", textTransform: "uppercase" }}
                  align="right"
                >
                  {format(producido)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Monto Final</strong>
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", textTransform: "uppercase" }}
                  align="right"
                >
                  {format(montoFinal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight="bold">
            📝 Notas de Cierre:
          </Typography>
          <Typography variant="body2" mb={2}>
            {notasCierre || "N/A"}
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
