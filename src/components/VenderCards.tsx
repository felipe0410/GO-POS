import React, { Dispatch, useContext, useEffect, useState } from "react";
import { Box, Pagination, Paper } from "@mui/material";
import VenderCard from "./VenderCard";
import { SelectedProduct } from "@/app/vender/interface";
import { VenderContext } from "@/app/vender/Context_vender";
import DevolutionCard from "@/app/vender/Devolucion/DevolutionCard";

const VenderCards = ({
  filteredData,
  setSelectedItems,
  selectedItems,
  type = false,
  facturaActiva,
  invoice,
}: {
  filteredData: any;
  setSelectedItems: any;
  selectedItems: any;
  type?: boolean;
  facturaActiva: any;
  invoice?:any
}) => {
  return (
    <Paper
      id="paper"
      elevation={0}
      style={{
        height: "90%",
        overflowX: "auto",
        maxWidth: "100%",
        background: "#1F1D2B",
      }}
      sx={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#2C3248",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray",
          borderRadius: "10px",
          boxShadow: "0px 4px 4px 0px #00000040",
        },
      }}
    >
      <Box
        id="container card"
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          height: "100%",
          justifyItems: "center",
          marginTop: "1.5rem",
        }}
      >
        {type ? (
          <DevolutionCard
            filteredData={filteredData}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            facturaActiva={facturaActiva}
            invoice={invoice}
          />
        ) : (
          <VenderCard
            filteredData={filteredData}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            facturaActiva={facturaActiva}
          />
        )}
      </Box>
    </Paper>
  );
};

export default VenderCards;
