"use client";
import Header from "@/components/Header";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import ProductCards from "@/components/ProductCards";
import { getAllCategoriesData, getAllProductsData } from "@/firebase";
import VenderCards from "@/components/VenderCards";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  ".MuiSelect-icon": { color: "#69EAE2" },
  "& .MuiInputBase-input": {
    borderRadius: "0.5rem",
    position: "relative",
    backgroundColor: "#1F1D2B",
    border: "1px solid #69EAE2",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: "Nunito",
    "&:focus": {
      borderRadius: "0.5rem",
      borderColor: "#69EAE2",
    },
  },
}));

const Page = () => {
  const [data, setData] = useState<undefined | any[]>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<[]>([]);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
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

  const filteredData = data?.filter(
    (item) =>
      searchTerm === "" ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barCode.toString().includes(searchTerm)
  );

  useEffect(() => {
    const categoriesData = async () => {
      try {
        await getAllCategoriesData(setCategory);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    categoriesData();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
      <Box sx={{ width: "65%" }}>
        <Header title='VENDER' />
        <Paper
          id={"paper"}
          sx={{ width: "95%", height: "100%", marginTop: "2rem" }}
          style={{
            borderRadius: "0.625rem",
            background: "#1F1D2B",
            boxShadow: "0px 1px 100px -50px #69EAE2",
          }}
        >
          <Box
            sx={{
              padding: "40px 48px",
              height: "100%",
              textAlign: "-webkit-center",
            }}
          >
            <Box display={"flex"}>
              <Paper
                component='form'
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#fff",
                  width: "25rem",
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
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <IconButton
                  sx={{
                    marginTop: "2px",
                    paddingTop: "0px",
                    marginBottom: "4px",
                    paddingBottom: "0px",
                  }}
                >
                  <Box component={"img"} src={"/images/scan.svg"} />
                </IconButton>
              </Paper>
            </Box>
            <Box
              sx={{
                textAlign: "start",
                marginTop: "2.81rem",
              }}
            >
              <Typography
                sx={{
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "1rem",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                AGREGAR DESDE CATALOGO
              </Typography>
              <FormControl sx={{ m: 1, minWidth: 170 }} variant='standard'>
                <InputLabel id='category-label' style={{ color: "#69EAE2" }}>
                  CATEGORIAS
                </InputLabel>
                <Select
                  labelId='category-label'
                  autoWidth
                  input={<BootstrapInput />}
                  style={{ color: "#FFF" }}
                >
                  <MenuItem value=''>
                    <em>Categorias</em>
                  </MenuItem>
                  {category?.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ marginTop: "1.56rem", height: "75%" }}>
              <VenderCards filteredData={filteredData} />
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* SIDEBAR */}
      <Box
        sx={{
          width: "25.5625rem",
          height: "100%",
          background: "#1F1D2B",
        }}
      >
        <Box padding={4}>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito",
              fontSize: "1.25rem",
              fontStyle: "normal",
              fontWeight: 800,
              lineHeight: "140%",
              marginTop: "0.5rem",
              marginLeft: "1rem",
            }}
          >
            VENTA #
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "70%",
              marginTop: "1rem",
            }}
          >
            <Button style={{ borderRadius: "0.5rem", background: "#69EAE2" }}>
              <Typography
                sx={{
                  color: "#1F1D2B",
                  fontFamily: "Nunito",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "140%",
                }}
              >
                EN OFICINA
              </Typography>
            </Button>
            <Button
              variant='outlined'
              style={{ borderRadius: "0.5rem", borderColor: "#69EAE2" }}
            >
              <Typography
                sx={{
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "140%",
                }}
              >
                DOMICILIO
              </Typography>
            </Button>
          </Box>
          <Box sx={{ textAlignLast: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: "1.88rem",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  color: "var(--White, #FFF)",
                  fontFamily: "Nunito",
                  fontSize: "1rem",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "140%",
                }}
              >
                Producto
              </Typography>
              <Typography
                sx={{
                  color: "var(--White, #FFF)",
                  fontFamily: "Nunito",
                  fontSize: "1rem",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "140%",
                  marginLeft: "100px",
                }}
              >
                Cantidad
              </Typography>
              <Typography
                sx={{
                  color: "var(--White, #FFF)",
                  fontFamily: "Nunito",
                  fontSize: "1rem",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "140%",
                }}
              >
                Precio
              </Typography>
            </Box>
            <Divider sx={{ background: "#69EAE2" }} />
            <Box id='items-list' sx={{ minHeight: "450px" }}>
              <Box>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <Box
                    component={"img"}
                    src={"/images/imageVinilo.png"}
                    alt={"imagen de prueba"}
                    sx={{
                      width: "3rem",
                      height: "3rem",
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        color: "#FFF",
                        fontFamily: "Nunito",
                        fontSize: "0.875rem",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "140%",
                      }}
                    >
                      NOMBRE DEL PRODUCTO
                    </Typography>
                    <Typography>$ 21312</Typography>
                  </Box>
                  <InputBase
                    sx={{ width: "3rem" }}
                    style={{
                      color: "#FFF",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--Base-Dark-Line, #393C49)",
                      background: "var(--Base-Form-BG, #2D303E)",
                    }}
                  />
                  <Typography>$ 324234</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row" }}></Box>
              </Box>
            </Box>
            <Divider sx={{ background: "#69EAE2" }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "0.6rem",
              }}
            >
              <Typography
                sx={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: "1rem",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                Total
              </Typography>
              <Typography
                sx={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: "1rem",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                $12312
              </Typography>
            </Box>
            <Button style={{ borderRadius: "0.5rem", background: "#69EAE2" }}>
              <Typography
                sx={{
                  color: "#1F1D2B",
                  fontFamily: "Nunito",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "140%",
                }}
              >
                HECHO
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
