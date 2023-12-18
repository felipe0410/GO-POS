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
import React, { useState } from "react";
import ProductCards from "@/components/ProductCards";
import { getAllProductsData } from "@/firebase";

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
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ marginTop: "1.56rem", height: "75%" }}>
              <ProductCards filteredData={filteredData} />
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
          <Box sx={{ textSlignLast: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: "1.88rem",
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
            <Box id='items-list' sx={{ minHeight: "450px" }}></Box>
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
