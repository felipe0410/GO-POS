import React from "react";
import { Box, Paper } from "@mui/material";
import InventoryCard from "./InventoryCard";

const ProductCards = () => {
  return (
    <Paper
      elevation={0}
      style={{
        overflowX: "auto",
        maxWidth: "100%",
        maxHeight: "100%",
        background: "#1F1D2B",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridRowGap: "4rem", // Espacio entre las filas
          gridColumnGap: 2, // Espacio entre las columnas
          padding: 2, // Ajusta el relleno según sea necesario
          overflowY: "auto", // Agrega desplazamiento vertical si es necesario
          maxHeight: "100%", // Evita que el contenedor sobresalga
        }}
      >
        <InventoryCard />
        <InventoryCard />
        <InventoryCard />
        <InventoryCard />
      </Box>
    </Paper>
  );
};

export default ProductCards;
