import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import InventoryCard from "./InventoryCard";
import { getAllProductsData } from "@/firebase";

const ProductCards = () => {
  const [data, setData] = useState<undefined | any[]>(undefined);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        getAllProductsData(setData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getAllProducts();
  }, []);

  return (
    <Paper
      id='paper'
      elevation={0}
      style={{
        height: "90%",
        overflowX: "auto",
        maxWidth: "100%",
        background: "#1F1D2B",
      }}
    >
      <Box
        id='container card'
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Hace que las columnas se adapten al tamaño de la pantalla
          gridRowGap: "3rem", // Espacio entre las filas
          gridColumnGap: "1rem", // Espacio entre las columnas
          height: "100%",
          justifyItems: "center",
          marginTop: "1.5rem",
        }}
      >
        <InventoryCard data={data} />
      </Box>
    </Paper>
  );
};

export default ProductCards;
