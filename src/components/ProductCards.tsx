import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import InventoryCard from "./InventoryCard";
import { getAllProductsData } from "@/firebase";

const ProductCards = ({ filteredData }: { filteredData: any }) => {
  return (
    <Paper
      id='paper'
      elevation={0}
      style={{
        overflowX: "auto",
        maxWidth: "100%",
        background: "#1F1D2B",
      }}
      sx={{ height: { xs: "80%", sm: "80%", md: "90%" } }}
    >
      <Box
        id='container card'
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", // Hace que las columnas se adapten al tamaño de la pantalla
          gridRowGap: "3rem", // Espacio entre las filas
          gridColumnGap: "1rem", // Espacio entre las columnas
          height: "100%",
          justifyItems: "center",
          marginTop: "1.5rem",
        }}
      >
        <InventoryCard filteredData={filteredData} />
      </Box>
    </Paper>
  );
};

export default ProductCards;
