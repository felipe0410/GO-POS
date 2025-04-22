import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  OutlinedInput,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NumericFormat } from "react-number-format";
import {
  closeCaja,
  getFilteredInvoicesData,
  getUltimaCaja,
  openCaja,
} from "@/firebase";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

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
  const [initialAmount, setInitialAmount] = useState("0");
  const [finalAmount, setFinalAmount] = useState("0");
  const [totalTransferencias, setTotalTransferencias] = useState("0");
  const [notes, setNotes] = useState("");
  const [totalEfectivo, setTotalEfectivo] = useState("0");
  const [baseCajaFinal, setBaseCajaFinal] = useState("0");
  const [notasCierre, setNotasCierre] = useState("");
  const [invoicesClose, setInvoicesClose] = useState([]);
  console.log("invoicesClose:::>", invoicesClose);
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

    const success = await closeCaja(ultimaCaja.id, finalAmount, notes);

    if (success) {
      enqueueSnackbar("Caja cerrada con éxito!", { variant: "success" });
      onClose();
    } else {
      enqueueSnackbar("Error al cerrar la caja. Inténtalo de nuevo.", {
        variant: "error",
      });
    }
  };
  const producido =
    Number(totalEfectivo) +
    Number(totalTransferencias) -
    Number(cajaData?.montoInicial || 0);
  useEffect(() => {
    const fetchUltimaCaja = async () => {
      const data = await getUltimaCaja();
      setUltimaCaja(data);
    };

    if (!isOpeningCaja) {
      fetchUltimaCaja();
    }
  }, [isOpeningCaja]);

  useEffect(() => {
    getFilteredInvoicesData(cajaData?.timestampApertura??'', setInvoicesClose);
  }, [cajaData?.timestampApertura]);

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

      {isOpeningCaja ? (
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
            <Typography variant="subtitle2">
              📍 {establecimiento?.direction || "Dirección no disponible"}
            </Typography>
            <Typography variant="subtitle2">
              📅{" "}
              {new Date().toLocaleString("es-CO", {
                timeZone: "America/Bogota",
              })}
            </Typography>
          </Box>

          <Divider sx={{ backgroundColor: "white", marginY: 1 }} />

          <Box sx={{ textAlign: "left" }}>
            <Typography variant="subtitle2">
              🕒 Fecha de apertura: {cajaData?.fechaApertura || "Sin datos"}
            </Typography>
            <Typography variant="subtitle2">
              💰 Monto inicial: ${cajaData?.montoInicial || "0"}
            </Typography>
            <Typography variant="subtitle2">
              📝 Notas: {cajaData?.notasApertura || "N/A"}
            </Typography>
          </Box>

          <Divider sx={{ backgroundColor: "white", marginY: 1 }} />

          <Typography variant="subtitle2">💵 Total Efectivo</Typography>
          <NumericFormat
            value={totalEfectivo}
            onValueChange={(values) => setTotalEfectivo(values.value)}
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            sx={{
              width: "100%",
              background: "#2C3248",
              color: "#FFF",
              marginBottom: 1,
            }}
          />

          <Typography variant="subtitle2">💳 Total Transferencias</Typography>
          <NumericFormat
            value={totalTransferencias}
            onValueChange={(values) => setTotalTransferencias(values.value)}
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            sx={{
              width: "100%",
              background: "#2C3248",
              color: "#FFF",
              marginBottom: 1,
            }}
          />

          <Typography variant="subtitle2">📌 Base Caja Final</Typography>
          <NumericFormat
            value={baseCajaFinal}
            onValueChange={(values) => setBaseCajaFinal(values.value)}
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            sx={{
              width: "100%",
              background: "#2C3248",
              color: "#FFF",
              marginBottom: 1,
            }}
          />

          <Divider sx={{ backgroundColor: "white", marginY: 1 }} />

          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "#69EAE2" }}
          >
            📈 Producido: ${producido}
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "#69EAE2" }}
          >
            🏦 Total en Caja: $
            {Number(totalEfectivo) + Number(totalTransferencias)}
          </Typography>

          <Typography variant="subtitle2">📝 Notas de Cierre</Typography>
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
