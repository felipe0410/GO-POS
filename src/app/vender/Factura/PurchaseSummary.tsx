import React from "react";
import { Box, Typography, Divider } from "@mui/material";

interface PurchaseSummaryProps {
  compra: {
    barCode: string;
    productName: string;
    cantidad: number;
    acc: number;
  }[];
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({ compra }) => (
  <Box mt={1}>
    <Typography
      sx={{
        color: "#000",
        textAlign: "center",
        fontSize: "0.8rem",
        fontStyle: "normal",
        fontWeight: 900,
        lineHeight: "140%",
        marginTop: "1rem",
      }}
    >
      RESUMEN DE COMPRA
    </Typography>
    <Box mt={1} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <Typography
        sx={{
          color: "#000",
          textAlign: "center",
          fontSize: "0.7rem",
          fontStyle: "normal",
          fontWeight: 900,
          lineHeight: "140%",
        }}
      >
        PRODUCTO
      </Typography>
      <Typography
        sx={{
          color: "#000",
          textAlign: "center",
          fontSize: "0.7rem",
          fontStyle: "normal",
          fontWeight: 900,
          lineHeight: "140%",
          marginLeft: "75px",
        }}
      >
        UND
      </Typography>
      <Typography
        sx={{
          color: "#000",
          textAlign: "center",
          fontSize: "0.7rem",
          fontStyle: "normal",
          fontWeight: 900,
          lineHeight: "140%",
          marginRight: "5px",
        }}
      >
        $VALOR
      </Typography>
    </Box>
    {compra.map((product) => (
      <Box
        key={product.barCode}
        sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", mt: 1 }}
      >
        <Typography
          sx={{
            color: "#000",
            fontSize: "0.8rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%",
            width: "10.2rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.productName}
        </Typography>
        <Typography
          sx={{
            color: "#000",
            textAlign: "center",
            fontSize: "0.8rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%",
          }}
        >
          {product.cantidad}
        </Typography>
        <Typography
          sx={{
            width: "70px",
            color: "#000",
            textAlign: "center",
            fontSize: "0.8rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%",
          }}
        >
          {`$ ${product.acc.toLocaleString("en-US")}`}
        </Typography>
      </Box>
    ))}
    <Divider sx={{ color: "#000", marginTop: "8px" }} />
  </Box>
);

export default PurchaseSummary;
