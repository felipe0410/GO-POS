"use client";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./globalContex";
import { Box, Typography } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import { keyframes } from "@emotion/react";
import HeaderAppBar from "./AppBar";
//import PrimarySearchAppBar from "./PrimarySearchAppBar";

const ContainerChildren = ({
  childrenn,
  validationRoutes,
}: {
  childrenn: any;
  validationRoutes: any;
}) => {
  const { isOpen, setIsOpen, cookies } = useContext(GlobalContext) || {};
  const [validation, setValidation] = useState(false);
  const validationCookie = cookies?.user?.length > 0;
  useEffect(() => {
    if (validationCookie) {
      if (validationRoutes) {
        //(window.location.href = "/inventory/productos")
        setTimeout(() => {
          setValidation(true);
        }, 2000);
      } else {
        setValidation(true);
      }
    } else {
      if (!validationRoutes) {
        window.location.href = "/sign_in";
        setTimeout(() => {
          setValidation(true);
        }, 2000);
      } else {
        setValidation(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const myAnim = keyframes`
    0% {
      transform: scale(0.3);
    }
  
    100% {
      transform: scale(1);
    }
  `;
  return (
    <>
      {validation ? (
        <>
          <Box sx={{ display: "block" }}>
            <HeaderAppBar />
          </Box>
          <Box
            id="Container Sidebar"
            sx={{
              display: validationRoutes ? "none" : "block",
              zIndex: validationRoutes ? "" : "10",
              position: validationRoutes ? "" : "fixed",
              top: 0,
              left: 0,
              height: "100%",
            }}
          >
            <Sidebar open={isOpen} setOpen={setIsOpen} />
          </Box>
          <Box
            id="container children layout"
            sx={{
              height: "100%",
              marginTop: validationRoutes ? "" : "80px",
              marginLeft: validationRoutes
                ? ""
                : { xs: "20px", sm: isOpen ? "250px" : "140px" },
            }}
          >
            {childrenn}
          </Box>
        </>
      ) : (
        <Box
          id="false"
          sx={{
            flexDirection: "column",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            align="center"
            sx={{
              color: "#FFF",
              textShadow: "0px 0px 20px #69EAE2",
              fontFamily: "Nunito",
              fontSize: { xs: "8rem", sm: "12.75rem" },
              fontStyle: "normal",
              fontWeight: 800,
              lineHeight: "normal",
              animation: `${myAnim} 2s ease 0s 1 normal forwards`,
            }}
          >
            GO
            <Typography
              align="center"
              sx={{
                color: "#69EAE2",
                fontFamily: "Nunito",
                fontSize: { xs: "4rem", sm: "8rem" },
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "normal",
                animation: `${myAnim} 2s ease 0s 1 normal forwards`,
              }}
            >
              Bienvenido
            </Typography>
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ContainerChildren;
