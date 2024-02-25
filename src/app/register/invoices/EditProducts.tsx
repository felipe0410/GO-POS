"use client";
import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import { editStyles } from "./styles";
import ContainerCards from "./ContainerCards";

const styleViewActive = {
  borderRadius: "0.625rem",
  background: "#69EAE2",
  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  "&:hover": { backgroundColor: "#69EAE2" },
  padding: "0 5px 0 5px",
};

const EditProducts = ({ data }: { data: any }) => {
  const [isTable, setIsTable] = useState(false);

  const compras = data.compra;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "2rem",
        }}
      >
        <Typography
          sx={{ ...editStyles.ventaTypography, marginTop: "0.85rem" }}
        >{`VENTA #${data.invoice}`}</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => setIsTable(true)}
            sx={isTable ? { ...styleViewActive } : {}}
          >
            <Typography
              sx={{
                color: !isTable ? "#FFF" : "#1F1D2B",
                fontFamily: "Nunito",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "normal",
              }}
            >
              VISTA EN TABLA
            </Typography>
          </Button>
          <Button
            sx={!isTable ? { ...styleViewActive } : {}}
            onClick={() => setIsTable(false)}
          >
            <Typography
              sx={{
                color: isTable ? "#FFF" : "#1F1D2B",
                fontFamily: "Nunito",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "normal",
              }}
            >
              VISTA EN MENÚ
            </Typography>
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: "center",
          marginTop: "1.6rem",
        }}
      >
        <Typography sx={editStyles.encabezadoTypography}>
          PRODUCTOS FACTURADOS
        </Typography>
      </Box>
      <Divider sx={{ background: "#69EAE2", marginTop: "0.5rem" }} />
      <Box sx={{ marginTop: "1rem" }}>
        <ContainerCards filteredData={compras} />
      </Box>
    </Box>
  );
};

export default EditProducts;
