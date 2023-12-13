import Header from "@/components/Header";
import NewProduct from "@/components/NewProduct";
import NewProductSidebar from "@/components/NewProductSidebar";
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";

const Page = () => {
  return (
    <>
      <Typography
        id='title'
        sx={{
          color: '#69EAE2',
          fontFamily: 'Nunito',
          fontSize: { xs: '24px', sm: '40px' },
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal',
        }}>
        INVENTARIO
      </Typography>
      <Divider sx={{ background: '#69EAE2', width: '95%' }} />
      <Box sx={{ marginTop: "2rem" }}>
        <Box>
          <Typography sx={{
            color: '#FFF',
            fontFamily: 'Nunito Sans',
            fontSize: { xs: '16px', sm: '32px' },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
          }}>
            AGREGAR NUEVO PRODUCTO
          </Typography>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito",
              fontSize: { xs: "12px", sm: '16px' },
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
          <Box sx={{ width: {sm:"65%"} }}>
            <NewProduct />
          </Box>
          <Box display={{ xs: 'none', sm: 'block' }} sx={{ width: "35%" }}>
            <NewProductSidebar />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Page;
