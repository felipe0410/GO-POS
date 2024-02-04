import React, { Dispatch, useContext, useEffect, useState } from "react";
import { Box, Pagination, Paper } from "@mui/material";
import VenderCard from "./VenderCard";
import { SelectedProduct } from "@/app/vender/interface";
import { VenderContext } from "@/app/vender/Context_vender";

const VenderCards = ({
  filteredData,
  setSelectedItems,
  selectedItems,
}: {
  filteredData: any;
  setSelectedItems: any,
  selectedItems: any,
}) => {


  return (
    <Paper
      id='paper'
      elevation={0}
      style={{
        height: "100%",
        overflowX: "auto",
        maxWidth: "100%",
        background: "#1F1D2B",
      }}
    >
      <Box
        id='container card'
        sx={{
          display: 'flex',
          justifyContent: "space-around",
          flexWrap: "wrap",
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
