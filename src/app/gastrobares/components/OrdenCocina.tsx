import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { getEstablishmentData, getInvoiceData } from "@/firebase";
import { DocumentData } from "firebase/firestore";
import { useReactToPrint } from "react-to-print";

interface OrdenCocinaProps {
  facturaActiva: any;
  typeInvoice: string;
  setNextStep: () => void;
  numeroFactura: string;
}

const OrdenCocina: React.FC<OrdenCocinaProps> = ({
  setNextStep,
  numeroFactura
}) => {
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
        const factura = await getInvoiceData(numeroFactura);
        const establecimiento: any = await getEstablishmentData();
        setFacturaData(factura);
        setEstablishmentData(establecimiento ?? {});
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    getData();
  }, [numeroFactura]);


  // ✅ Extrae y agrupa los productos desde facturaData.compra
  const productos = Array.isArray(facturaData?.compra) ? facturaData.compra : [];

  const productosPorCategoria = productos.reduce((acc: any, producto: any) => {
    const categoria = producto.category?.toUpperCase() || "OTROS";
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(producto);
    return acc;
  }, {});

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
            fontSize: "2rem", // 🔥 MÁS GRANDE
            mb: 2,
          }}
        >
          {establishmentData?.nameEstablishment?.toUpperCase() || ""}
        </Typography>

        <Typography
          sx={{
            fontWeight: 900,
            fontSize: "1.5rem", // 📢 TÍTULO GRANDE
            textAlign: "center",
            mb: 1,
          }}
        >
          ORDEN DE COCINA
        </Typography>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.2rem", // 🧾 Número de venta más grande
            textAlign: "center",
            mb: 0.5,
          }}
        >
          Venta #{facturaData?.uid || numeroFactura}
        </Typography>

        <Typography
          sx={{
            fontSize: "1rem", // 📆 Fecha más grande
            textAlign: "center",
            mb: 0.5,
          }}
        >
          Fecha:{" "}
          {facturaData?.fechaCreacion
            ? new Date(facturaData.fechaCreacion).toLocaleString()
            : "—"}
        </Typography>

        <Typography
          sx={{
            fontSize: "1rem", // 👨‍🍳 Mesero más grande
            textAlign: "center",
            mb: 1,
          }}
        >
          Mesero: {establishmentData?.name.toUpperCase() || "—"}
        </Typography>

        <Box
          sx={{
            display: "inline-block",
            backgroundColor: "#000", // fondo negro
            color: "#fff",          // texto blanco
            fontWeight: 700,
            fontSize: "1rem",
            padding: "4px 12px",
            borderRadius: "20px",   // borde redondeado tipo tag
            textAlign: "center",
            mb: 1,
            width: '100%'
          }}
        >
          Mesa: {facturaData?.mesa || "—"}
        </Box>


        {Object.keys(productosPorCategoria).map((categoria) => (
          <Box key={categoria} mt={3}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                mb: 1,
                borderBottom: "1px solid #000",
                textTransform: "uppercase",
              }}
            >
              {categoria}
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table size="small" sx={{ border: "1px solid #000" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      Cantidad
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      Producto
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosPorCategoria[categoria].map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        {item.cantidad}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid #000",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.productName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        {facturaData?.nota?.length > 0 && (
          <Paper
            elevation={2}
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#fcefe3",
              borderLeft: "6px solid #f5a623",
            }}
          >
            <Typography sx={{ fontWeight: 700, mb: 1 }}>NOTA ESPECIAL:</Typography>
            <Typography sx={{ fontStyle: "italic", fontSize: "1rem", fontWeight: 300, textTransform: 'uppercase' }}>
              {facturaData?.nota ?? 'sin nota'}
            </Typography>
          </Paper>
        )}

      </Box>

      <Box
        mt={2}
        display="flex"
        justifyContent="center"
        gap={2}
      >
        <button
          onClick={handlePrint}
          style={{
            padding: "10px 20px",
            backgroundColor: "#00f4e3bd",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          IMPRIMIR ORDEN
        </button>

        <button
          onClick={() => setNextStep()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#004403",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          NUEVA FACTURA
        </button>
      </Box>

    </Box>
  );
};

export default OrdenCocina;
