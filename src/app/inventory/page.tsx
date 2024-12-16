"use client";
import Header from "@/components/Header";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import StickyHeadTable from "@/components/StickyHeadTable";
import ProductCards from "@/components/ProductCards";
import TableResponsive from "@/components/TableResponsive";
import { getAllProductsData } from "@/firebase";
import debounce from "debounce";

const Page = () => {
  const [isTable, setIsTable] = useState(false);
  const [data, setData] = React.useState<undefined | any[]>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setfilter] = useState<any>()
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDataPage = filter?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filter?.length / itemsPerPage);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const styleViewActive = {
    borderRadius: "0.625rem",
    background: "#69EAE2",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  };
  const debouncedHandleSearchChange = debounce(() => {

  }, 300);
  const handleSearchChange = (event: any) => {
    let value = event
    value = value.replace(/\s+/g, '');
    value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    setSearchTerm(value);
    debouncedHandleSearchChange();
  };


  React.useEffect(() => {
    const getAllProducts = async () => {
      try {
        await getAllProductsData(setData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getAllProducts();
  }, []);



  const filteredData = async (event: any) => {
    try {
      const resolvedData = await data;
      const filterSearch: any = resolvedData?.filter((item) => {
        if (searchTerm === "") {
          return true;
        }
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setfilter(filterSearch);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    const filteredData = data?.filter((item) => {
      if (searchTerm === "") {
        return true;
      }
      console.log(Object.values(item))
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setfilter(filteredData)
  }, [data, searchTerm])



  return (
    <Box id='page products' sx={{ height: "78%" }}>
      hola
      <Header title='INVENTARIO' />
      <Box sx={{ marginTop: "2rem", height: "100%" }}>
        <Box>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito Sans",
              fontSize: { sm: "20px", md: "32px" },
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
            Aqui encontraras tus productos en stock y su numero de existencias
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Typography
              sx={{
                color: "#69EAE2",
                fontFamily: "Nunito",
                fontSize: { xs: '14px', sm: "20px" },
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "140%",
                marginRight: '15px'
              }}
            >
              Total Productos registrados :
            </Typography>
            <Chip
              sx={{
                marginRight: "11px",
                backgroundColor: "#69EAE2",
                filter:
                  "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
              label={
                <Typography
                  sx={{
                    color: "#2C3248",
                    fontFamily: "Nunito",
                    fontSize: { xs: '20px', sm: "1.5rem" },
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "140%",
                  }}
                >
                  {data?.length ?? 0}
                </Typography>
              }
            />
          </Box>
        </Box>
        <Paper
          id={"paper"}
          sx={{ width: "95%", height: "90%", marginTop: "2rem" }}
          style={{
            borderRadius: "0.625rem",
            background: "#1F1D2B",
            boxShadow: "0px 1px 100px -50px #69EAE2",
          }}
        >
          <Box
            sx={{
              padding: { xs: "30px 2px 30px 10px ", sm: "40px 48px" },
              height: "100%",
              textAlign: "-webkit-center",
            }}
          >
            <Box
              sx={{
                display: { sm: "blok", md: "flex" },
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box display={"flex"}>
                <Paper
                  component='form'
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    handleSearchChange(e.target[1].value)
                  }}
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
                <IconButton
                  sx={{
                    paddingTop: "0px",
                    marginBottom: { xs: "px", sm: "4px" },
                    paddingBottom: { xs: 0 },
                  }}
                >
                  <Box component={"img"} src={"/images/scan.svg"} />
                </IconButton>
              </Box>
              <Box
                sx={{
                  width: "19rem",
                  marginTop: { xs: "15px", sm: "15px", md: "0" },
                }}
              >
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
            <Box sx={{ marginTop: "1.56rem", height: { xs: '90%', sm: "80%" } }}>
              {isTable ? (
                <>
                  <Box
                    display={{ md: "none", lg: "block", xs: "none" }}
                    sx={{ height: "100%" }}
                  >
                    <StickyHeadTable filteredData={currentDataPage} />
                  </Box>
                  <Box
                    display={{ lg: "none", md: "block", xs: "block" }}
                    sx={{ height: "80%" }}
                  >
                    <TableResponsive filteredData={currentDataPage} />
                  </Box>
                </>
              ) : (
                <ProductCards filteredData={currentDataPage} />
              )}
              <Box id='pagination' sx={{ filter: "invert(1)", display: "flex", justifyContent: "center", marginTop: '20px', width: { xs: '115%', sm: "100%" }, marginLeft: { xs: '-15px', sm: '0' } }} >
                <Pagination sx={{ color: "#fff" }} onChange={(e, page) => setCurrentPage(page)} count={totalPages} shape="circular" size={matches ? "large" : "small"} />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Page;
