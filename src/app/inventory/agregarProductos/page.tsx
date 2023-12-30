"use client";
import NewProduct from "@/components/NewProduct";
import NewProductSidebar from "@/components/NewProductSidebar";
import { Box, Divider, Typography } from "@mui/material";
import ComponentModal from "./Modal";
import Header from "@/components/Header";

const Page = () => {
  return (
    <>
      <Header title='INVENTARIO' />
      <Box sx={{ marginTop: "2rem" }}>
        <Box>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito Sans",
              fontSize: { xs: "16px", sm: "32px" },
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
              fontSize: { xs: "12px", sm: "16px" },
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
            display: { xs: "flex", sm: "none" },
            justifyContent: "flex-end",
            width: "95%",
          }}
        >
          <ComponentModal />
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
          <Box sx={{ width: { sm: "65%" } }}>
            <NewProduct />
          </Box>
          <Box id='NewProductSidebar' display={{ xs: "none", sm: "block" }} sx={{ width: "35%", height: '100%' }}>
            <NewProductSidebar />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Page;
