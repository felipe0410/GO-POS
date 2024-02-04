import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import InventoryCard from "./InventoryCard";

const ProductCards = ({ filteredData }: { filteredData: any }) => {
  const [isHovered, setIsHovered] = useState(false);
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
          display: "flex",
          flexWrap: 'wrap',
          height: "100%",
          justifyItems: "center",
          marginTop: "2.5rem",
          justifyContent: 'space-evenly'
        }}
      >
        <InventoryCard filteredData={filteredData} />
      </Box>
    </Paper>
  );
};

export default ProductCards;
