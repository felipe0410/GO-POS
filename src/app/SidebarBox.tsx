"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  OutlinedInput,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NumericFormat } from "react-number-format";
import {
  closeCaja,
  getFilteredInvoicesData,
  getUltimaCaja,
  getUltimaCajaCerrada,
  openCaja,
} from "@/firebase";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import TicketCierreCaja from "./TicketCierreCaja";

interface SidebarProps {
  onClose: () => void;
  isOpeningCaja: boolean;
  establecimiento: any;
  cajaData: any;
}

const SidebarBox: React.FC<SidebarProps> = ({
  onClose,
  isOpeningCaja,
  establecimiento,
  cajaData,
}) => {
  const [ultimaCaja, setUltimaCaja] = useState<any | null>(null);
  const [consecutivo, setconsecutivo] = useState(0);
  const [initialAmount, setInitialAmount] = useState("0");
  const [finalAmount, setFinalAmount] = useState("0");
  const [totalTransferencias, setTotalTransferencias] = useState("0");
  const [notes, setNotes] = useState("");
  const [totalEfectivo, setTotalEfectivo] = useState("0");
  const [baseCajaFinal, setBaseCajaFinal] = useState("0");
  const [notasCierre, setNotasCierre] = useState("");
  const [invoicesClose, setInvoicesClose] = useState<any>([]);
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [resumenCaja, setResumenCaja] = useState<any>(null);

  const calcularResumenCaja = () => {
    return invoicesClose.reduce(
      (
        acc: {
          transferencias: number;
          efectivo: number;
          totalCerrado: number;
          pendientes: number;
          devoluciones: any;
        },
        factura: {
          total: any;
          paymentMethod: any;
          status: any;
          Devolucion: any[];
        }
      ) => {
        const total = Number(factura.total || 0);
        const metodo = (factura.paymentMethod || "").toLowerCase();
        const status = factura.status;

        const esCerrada = status === "CANCELADO";

        if (esCerrada) {
          if (metodo === "transferencia") {
            acc.transferencias += total;
          } else {
            acc.efectivo += total;
          }
          acc.totalCerrado += total;
        } else {
          acc.pendientes += total;
        }

        if (Array.isArray(factura.Devolucion)) {
          const totalDev = factura.Devolucion.reduce(
            (sum: number, item: { acc: any }) => sum + (Number(item.acc) || 0),
            0
          );
          acc.devoluciones += totalDev;
        }

        return acc;
      },
      {
        efectivo: 0,
        transferencias: 0,
        totalCerrado: 0,
        pendientes: 0,
        devoluciones: 0,
      }
    );
  };

  const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const handleConfirmOpenCaja = async () => {
    if (!initialAmount || Number(initialAmount) <= 0) {
      enqueueSnackbar("El monto inicial debe ser mayor a $0", {
        variant: "warning",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      return;
    }

    const sessionCajaID = await openCaja(initialAmount, notes);

    if (sessionCajaID) {
      localStorage.setItem("sessionCajaID", sessionCajaID);
      localStorage.setItem("montoInicial", initialAmount);
      localStorage.setItem("notasApertura", notes);

      enqueueSnackbar("Caja abierta con éxito!", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      onClose();
    } else {
      enqueueSnackbar("Error al abrir la caja. Inténtalo de nuevo.", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  const handleConfirmCloseCaja = async () => {
    if (!finalAmount || Number(finalAmount) <= 0) {
      enqueueSnackbar("El monto final debe ser mayor a $0", {
        variant: "warning",
      });
      return;
    }

    if (!ultimaCaja) {
      enqueueSnackbar("No hay una caja abierta para cerrar.", {
        variant: "error",
      });
      return;
    }

    const resumen = calcularResumenCaja();

    const success: any = await closeCaja(ultimaCaja.uid, {
      montoFinal: finalAmount,
      notasCierre,
      efectivo: resumen.efectivo,
      transferencias: resumen.transferencias,
      pendientes: resumen.pendientes,
      devoluciones: resumen.devoluciones,
      totalCerrado: resumen.totalCerrado,
      facturasUIDs,
    });

    if (success) {
      enqueueSnackbar("Caja cerrada con éxito!", { variant: "success" });
      setconsecutivo(success.consecutivo);
      setMostrarTicket(true);
    } else {
      enqueueSnackbar("Error al cerrar la caja. Inténtalo de nuevo.", {
        variant: "error",
      });
    }
  };

  // Producido = Efectivo + Transferencias (total de ventas)
  const producido = Number(totalEfectivo) + Number(totalTransferencias);
  useEffect(() => {
    const fetchUltimaCaja = async () => {
      const data = await getUltimaCaja();
      const ultimaCerrada = await getUltimaCajaCerrada();
      const consecutivo =
        ultimaCerrada?.consecutivoCaja != null
          ? ultimaCerrada.consecutivoCaja + 1
          : 1;
      setconsecutivo(consecutivo);
      setUltimaCaja(data);
    };

    if (!isOpeningCaja) {
      fetchUltimaCaja();
    }
  }, [isOpeningCaja]);

  useEffect(() => {
    getFilteredInvoicesData(
      cajaData?.timestampApertura ?? "",
      setInvoicesClose
    );
  }, [cajaData?.timestampApertura]);

  useEffect(() => {
    if (!isOpeningCaja) {
      const result = calcularResumenCaja();
      setTotalEfectivo(result.efectivo);
      setTotalTransferencias(result.transferencias);
      setFinalAmount(ultimaCaja?.montoInicial ?? 0);
      setBaseCajaFinal(ultimaCaja?.montoInicial ?? 0);
      setResumenCaja(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoicesClose, ultimaCaja]);
  const facturasUIDs = invoicesClose.map(
    (factura: { uid: any }) => factura.uid
  );

  return (
    <Box
      sx={{
        width: 350,
        height: "100%",
        backgroundColor: "#1F1D2B",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <SnackbarProvider />
      {/* Header del Sidebar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #444",
          paddingBottom: 1,
        }}
      >
        <Typography variant="h6">
          {isOpeningCaja ? "Abrir Caja" : "Opciones"}
        </Typography>
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>

      {mostrarTicket ? (
        <TicketCierreCaja
          establecimiento={establecimiento?.nameEstablishment || "Establecimiento"}
          cajaData={{
            uid: cajaData?.uid,
            montoInicial: cajaData?.montoInicial,
            fechaApertura: cajaData?.fechaApertura,
            notasApertura: cajaData?.notasApertura,
            estado: cajaData?.estado
          }}
          resumenCaja={{
            efectivo: Number(totalEfectivo),
            transferencias: Number(totalTransferencias),
            total: Number(totalEfectivo) + Number(totalTransferencias),
            facturas: invoicesClose.length
          }}
          producido={Number(totalEfectivo) + Number(totalTransferencias)}
          totalEnCaja={Number(totalEfectivo) + Number(baseCajaFinal)}
          notasCierre={notasCierre}
          consecutivo={consecutivo}
        />
      ) : isOpeningCaja ? (
        // 🟢 Formulario para abrir caja dentro del Sidebar
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            Ingrese el monto inicial en caja y agregue notas si es necesario.
          </Typography>

          {/* Input de dinero con `react-number-format` */}
          <NumericFormat
            value={initialAmount}
            onValueChange={(values) => setInitialAmount(values.value)}
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            sx={{
              width: "100%",
              height: "44.9px",
              borderRadius: "0.625rem",
              background: "#2C3248",
              color: "#FFF",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              marginBottom: 2,
            }}
          />

          {/* Input de notas */}
          <OutlinedInput
            placeholder="Notas importantes"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{
              borderRadius: "0.625rem",
              background: "#2C3248",
              color: "#FFF",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              marginBottom: 2,
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{ marginRight: "10px" }}
              onClick={onClose}
              variant="contained"
              color="error"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmOpenCaja}
              sx={{
                background: "#69EAE2",
                color: "#000",
                "&:hover": { filter: "grayscale(1)" },
              }}
              variant="contained"
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      ) : (
        // 🟢 Opciones normales del Sidebar
        <Box sx={{ mt: 2 }}>
          <Box sx={{ textAlign: "center", marginBottom: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {establecimiento?.nameEstablishment || "Establecimiento"}
            </Typography>
            <Typography variant="subtitle1">
              📅{" "}
              {new Date().toLocaleString("es-CO", {
                timeZone: "America/Bogota",
              })}
            </Typography>
          </Box>

          <Divider sx={{ backgroundColor: "white", marginY: 1 }} />

          <Box sx={{ textAlign: "left" }}>
            <Typography variant="subtitle1">
              🕒 Fecha de apertura:{" "}
              <Chip
                sx={{
                  color: "#fff",
                  background: "#004944",
                  textTransform: "uppercase",
                  fontWeight: 900,
                }}
                // variant="outlined"
                color="primary"
                label={
                  cajaData?.fechaApertura
                    ? new Date(cajaData.fechaApertura).toLocaleString("es-CO", {
                        timeZone: "America/Bogota",
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Sin datos"
                }
              />
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "900" }}>
              💰 Monto inicial: {formatCurrency(cajaData?.montoInicial) || "0"}
            </Typography>
            <Typography variant="subtitle1">
              📝 Notas: {cajaData?.notasApertura || "N/A"}
            </Typography>
          </Box>

          <Divider sx={{ backgroundColor: "white", marginY: 1 }} />

          <Typography variant="subtitle1">💵 Total Efectivo</Typography>
          <NumericFormat
            value={totalEfectivo}
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            inputProps={{ readOnly: true }}
            sx={{
              width: "100%",
              background: "#2C3248",
              color: "#FFF",
              marginBottom: 1,
              "& input": {
                color: "#FFF", // asegura que el texto sea blanco
                cursor: "default",
              },
            }}
          />

          <Typography variant="subtitle1">💳 Total Transferencias</Typography>
          <NumericFormat
            value={totalTransferencias}
            // onValueChange={(values) => setTotalTransferencias(values.value)}
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            inputProps={{ readOnly: true }}
            sx={{
              width: "100%",
              background: "#2C3248",
              color: "#FFF",
              marginBottom: 1,
            }}
          />

          <Typography variant="subtitle1">📌 Base Caja Final</Typography>
          <NumericFormat
            value={baseCajaFinal}
            // onValueChange={(values) => setBaseCajaFinal(values.value)}
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            inputProps={{ readOnly: true }}
            sx={{
              width: "100%",
              background: "#2C3248",
              color: "#FFF",
              marginBottom: 1,
            }}
          />

          <Divider sx={{ backgroundColor: "white", marginY: 1 }} />

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#69EAE2" }}
          >
            📈 Producido:
            <Chip
              sx={{
                color: "#fff",
                background: "#004944",
                textTransform: "uppercase",
                fontWeight: 900,
                fontSize: "1rem",
                marginBottom: "10px",
              }}
              // variant="outlined"
              color="primary"
              label={formatCurrency(producido)}
            />
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#69EAE2" }}
          >
            🏦 Total en Caja:
            <Chip
              sx={{
                color: "#fff",
                background: "#004944",
                textTransform: "uppercase",
                fontWeight: 900,
                fontSize: "1rem",
              }}
              // variant="outlined"
              color="primary"
              label={formatCurrency(
                Number(totalEfectivo) + Number(baseCajaFinal)
              )}
            />
          </Typography>

          <Divider sx={{ backgroundColor: "white", marginY: 1 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#69EAE2", mb: 1 }}>
            📋 Resumen de la Sesión:
          </Typography>
          
          <Box sx={{ backgroundColor: "#2C3248", p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <span>Monto Inicial:</span>
              <span>{formatCurrency(cajaData?.montoInicial || 0)}</span>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <span>Ventas en Efectivo:</span>
              <span>{formatCurrency(totalEfectivo)}</span>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <span>Ventas en Transferencia:</span>
              <span>{formatCurrency(totalTransferencias)}</span>
            </Typography>
            <Divider sx={{ backgroundColor: "#69EAE2", my: 1 }} />
            <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <span>Esperado en Caja:</span>
              <span>{formatCurrency(Number(totalEfectivo) + Number(baseCajaFinal))}</span>
            </Typography>
          </Box>

          <Typography variant="subtitle1">📝 Notas de Cierre</Typography>
          <OutlinedInput
            placeholder="Notas de cierre"
            multiline
            rows={2}
            fullWidth
            value={notasCierre}
            onChange={(e) => setNotasCierre(e.target.value)}
            sx={{ background: "#2C3248", color: "#FFF", marginBottom: 2 }}
          />

          <Divider sx={{ backgroundColor: "white", marginY: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={onClose} variant="contained" color="error">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmCloseCaja}
              variant="contained"
              sx={{ background: "#69EAE2", color: "#000" }}
            >
              GUARDAR
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SidebarBox;
