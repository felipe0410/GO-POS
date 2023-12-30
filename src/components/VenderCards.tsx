import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import VenderCard from "./VenderCard";

const VenderCards = ({
  filteredData,
  setSelectedItems,
  selectedItems,
}: {
  filteredData: any;
  setSelectedItems: any;
  selectedItems: any;
}) => {
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
          gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", // Hace que las columnas se adapten al tamaño de la pantalla
          gridRowGap: "3rem", // Espacio entre las filas
          height: "100%",
          justifyItems: "center",
          marginTop: "1.5rem",
        }}
      >
        <VenderCard
          filteredData={filteredData}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />
      </Box>
    </Paper>
  );
};

export default VenderCards;
