import React from "react";
import { Box, Paper } from "@mui/material";
import InventoryCard from "./InventoryCard";

const ProductCards = () => {
  const miArray = new Array(100).fill(1);
  return (
    <Paper
      id='paper'
      elevation={0}
      style={{
        height: '90%',
        overflowX: "auto",
        maxWidth: "100%",
        // maxHeight: "100%",
        background: "#1F1D2B",
      }}
    >
      <Box
        id='container card'
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridRowGap: "4rem", // Espacio entre las filas
          gridColumnGap: 2, // Espacio entre las columnas
          padding: 2, // Ajusta el relleno según sea necesario
          // maxHeight: "100%", // Evita que el contenedor sobresalga
          height: '100%'
        }}
      >
        {miArray.map((product, index) => {
          return (
            <Box key={index * 2}>
              <InventoryCard />
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default ProductCards;
