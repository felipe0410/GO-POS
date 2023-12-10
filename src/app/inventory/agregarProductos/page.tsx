import Header from "@/components/Header";
import NewProduct from "@/components/NewProduct";
import NewProductSidebar from "@/components/NewProductSidebar";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";

const Page = () => {
  return (
    <>
      <Header title={"INVENTARIO"} />
      <Box sx={{ marginTop: "2rem" }}>
        <Box>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito Sans",
              fontSize: "2rem",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            AGREGAR NUEVO PRODUCTO
          </Typography>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito",
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              marginTop: "0.6rem",
            }}
          >
            Completa los campos para añadir nuevos productos a tu inventario.
          </Typography>
        </Box>
        <Box
          sx={{
            width: "95%",
            height: "100%",
            marginTop: "2rem",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box sx={{ width: "65%" }}>
            <NewProduct />
          </Box>
          <Box sx={{ width: "35%" }}>
            <NewProductSidebar />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Page;
