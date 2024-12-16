import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface SummaryCardsProps {
  totalProductos: number;
  productosSinStock: number;
  productosStockBajo: number;
  productosBuenStock: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalProductos,
  productosSinStock,
  productosStockBajo,
  productosBuenStock,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "15px",
      }}
    >
      <Paper sx={cardStyles("#212121", "#69EAE2")}>
        <Typography variant="h6" sx={titleStyles}>
          Total Productos
        </Typography>
        <Typography variant="h3" sx={numberStyles}>
          {totalProductos}
        </Typography>
      </Paper>
      <Paper sx={cardStyles("#2C1E1E", "#D32F2F")}>
        <Typography variant="h6" sx={titleStyles}>
          Productos sin Stock
        </Typography>
        <Typography variant="h3" sx={numberStyles}>
          {productosSinStock}
        </Typography>
      </Paper>
      <Paper sx={cardStyles("#2E2720", "#FF9800")}>
        <Typography variant="h6" sx={titleStyles}>
          Productos con Stock Bajo
        </Typography>
        <Typography variant="h3" sx={numberStyles}>
          {productosStockBajo}
        </Typography>
      </Paper>
      <Paper sx={cardStyles("#1C2C1E", "#4CAF50")}>
        <Typography variant="h6" sx={titleStyles}>
          Productos con Buen Stock
        </Typography>
        <Typography variant="h3" sx={numberStyles}>
          {productosBuenStock}
        </Typography>
      </Paper>
    </Box>
  );
};

const cardStyles = (backgroundColor: string, borderColor: string) => ({
  padding: "20px",
  flex: "1 1 calc(25% - 15px)",
  background: backgroundColor,
  color: "#FFF",
  textAlign: "center",
  borderRadius: "12px",
  border: `2px solid ${borderColor}`,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
  },
});

const titleStyles = {
  fontSize: "1rem",
  fontWeight: 500,
  textTransform: "uppercase",
  color: "#BDBDBD",
};

const numberStyles = {
  fontSize: "2.5rem",
  fontWeight: 700,
  color: "#FFF",
};

export default SummaryCards;
