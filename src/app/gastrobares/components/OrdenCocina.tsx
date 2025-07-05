// src/components/OrdenCocina.tsx
import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { getEstablishmentData, getInvoiceData } from "@/firebase";
import { DocumentData } from "firebase/firestore";
import { useReactToPrint } from "react-to-print";

interface OrdenCocinaProps {
  facturaActiva: any;
  typeInvoice: string;
  setNextStep: (arg0: boolean) => void;
}

const OrdenCocina: React.FC<OrdenCocinaProps> = ({
  facturaActiva,
  typeInvoice,
  setNextStep,
}) => {
  const barCode = localStorage.getItem("uidInvoice");
  const numeroFactura = localStorage.getItem("invoice") ?? "0000000";
  const [facturaData, setFacturaData] = useState<null | DocumentData>(null);
  const [establishmentData, setEstablishmentData] = useState({
    nameEstablishment: "",
    name: "",
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const factura = await getInvoiceData(barCode);
        const establecimiento: any = await getEstablishmentData();
        setFacturaData(factura);
        setEstablishmentData(establecimiento ?? {});
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    getData();
  }, [barCode]);

  useEffect(() => {
    if (typeInvoice === "quickSale") setNextStep(false);
  }, [setNextStep, typeInvoice]);

  return (
    <Box>
      <Box
        ref={componentRef}
        sx={{
          maxWidth: "22.25rem",
          margin: "0 auto",
          background: "#fff",
          padding: 2,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "1.5rem",
            mb: 1,
          }}
        >
          {establishmentData?.nameEstablishment?.toUpperCase() || ""}
        </Typography>

        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
          ORDEN DE COCINA
        </Typography>

        <Typography sx={{ fontSize: "0.8rem", mt: 1 }}>
          Venta #{numeroFactura}
        </Typography>

        <Typography sx={{ fontSize: "0.8rem" }}>
          Fecha: {facturaData?.date || "—"}
        </Typography>

        <Typography sx={{ fontSize: "0.8rem" }}>
          Mesero: {establishmentData?.name || "—"}
        </Typography>

        <Box mt={2}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              mb: 1,
              borderBottom: "1px solid #000",
            }}
          >
            PLATOS A PREPARAR
          </Typography>
          {facturaData?.compra?.map((item: any, index: number) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              <span style={{ width: "2rem" }}>{item.cantidad}</span>
              <span style={{ width: "13rem", textTransform: "uppercase" }}>
                {item.productName}
              </span>
            </Box>
          ))}
        </Box>

        {facturaData?.nota?.length > 0 && (
          <Box mt={2}>
            <Typography sx={{ fontWeight: 700 }}>Nota especial:</Typography>
            <Typography sx={{ fontStyle: "italic", fontSize: "0.9rem" }}>
              {facturaData?.nota??'sin nota'}
            </Typography>
          </Box>
        )}
      </Box>

      <Box mt={2} display="flex" justifyContent="center">
        <button onClick={handlePrint} style={{ padding: "8px 16px" }}>
          IMPRIMIR ORDEN
        </button>
      </Box>
    </Box>
  );
};

export default OrdenCocina;
