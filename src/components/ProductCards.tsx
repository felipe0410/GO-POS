import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import InventoryCard from "./InventoryCard";
import { getAllProductsData } from "@/firebase";

const ProductCards = () => {
  const [data, setData] = useState<undefined | any[]>(undefined);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const allProducts = await getAllProductsData();
        if (allProducts) {
          setData(allProducts);
        }
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
          height: "100%",
        }}
      >
        <InventoryCard data={data} />
      </Box>
    </Paper>
  );
};

export default ProductCards;
