"use client";
import Header from "@/components/Header";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import StickyHeadTable from "@/components/StickyHeadTable";
import ProductCards from "@/components/ProductCards";

const Page = () => {
  const [isTable, setIsTable] = useState(false);
  const styleViewActive = {
    borderRadius: "0.625rem",
    background: "#69EAE2",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  };
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
            PRODUCTOS
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
            Aqui encontraras tus productos en stock y su numero de existencias.
          </Typography>
        </Box>
        <Paper
          id={"paper"}
          sx={{ width: "95%", height: "100%", marginTop: "2rem" }}
          style={{
            borderRadius: "0.625rem",
            background: "#1F1D2B",
            boxShadow: "0px 1px 100px -50px #69EAE2",
          }}
        >
          <Box sx={{ padding: "40px 48px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box display={"flex"}>
                <Paper
                  component='form'
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#fff",
                    width: "15.875rem",
                    height: "2rem",
                    borderRadius: "0.3125rem",
                    background: "#2C3248",
                  }}
                >
                  <IconButton
                    type='button'
                    sx={{ p: "10px" }}
                    aria-label='search'
                  >
                    <SearchIcon sx={{ color: "#fff" }} />
                  </IconButton>
                  <InputBase
                    sx={{
                      ml: 1,
                      flex: 1,
                      color: "#fff",
                    }}
                    placeholder='Buscar'
                  />
                </Paper>
                <IconButton sx={{ paddingTop: "0px", marginBottom: "4px" }}>
                  <Box component={"img"} src={"/images/scan.svg"} />
                </IconButton>
              </Box>
              <Box sx={{ width: "19rem" }}>
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
                <Divider sx={{ background: "#69EAE2", marginTop: "12px" }} />
              </Box>
            </Box>
            <Box sx={{ marginTop: "1.56rem" }}>
              {isTable ? <StickyHeadTable /> : <ProductCards />}
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Page;
