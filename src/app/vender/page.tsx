"use client";
import Header from "@/components/Header";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { getAllCategoriesData, getAllProductsData } from "@/firebase";
import VenderCards from "@/components/VenderCards";
import CartItems from "@/components/CartItems";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HelpIcon from "@mui/icons-material/Help";

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

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#69EAE2",
    color: "#1F1D2B",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: "146px",
  },
}));

const Page = () => {
  const [data, setData] = useState<undefined | any[]>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<[]>([]);
  const [agregarDescuento, setAgregarDescuento] = useState(false);

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
          background: "#1F1D2B",
          height: "100%",
          borderRadius: "0.625rem",
        }}
      >
        <Box padding={3} sx={{ height: "100%" }}>
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
            VENTA # {"numero"}
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
          <Box sx={{ height: "100%" }}>
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
                  marginRight: "17px",
                }}
              >
                Precio
              </Typography>
            </Box>
            <Divider sx={{ background: "#69EAE2" }} />
            <Box id='items-list' sx={{ maxHeight: "450px", overflowY: "auto" }}>
              <CartItems />
              <CartItems />
              <CartItems />
              <CartItems />
            </Box>
            <Divider sx={{ background: "#69EAE2", marginTop: "1.5rem" }} />
            <Box sx={{ marginTop: "0.8rem" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
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
                  SubTotal
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
                  $12231
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
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
                  Costo de envío
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
                  $0
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                {agregarDescuento === false ? (
                  <Button
                    onClick={() => setAgregarDescuento(true)}
                    sx={{
                      color: "#69EAE2",
                      textAlign: "center",
                      fontFamily: "Nunito",
                      fontSize: "1rem",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "140%",
                      textTransform: "none",
                    }}
                  >
                    Ingresar descuento
                    <ArrowDropDownIcon sx={{ color: "#69EAE2" }} />
                  </Button>
                ) : (
                  <>
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
                      Descuento
                      <LightTooltip
                        title='Puede ingresar el valor del descuento en porcentaje o pesos.'
                        arrow
                      >
                        <HelpIcon
                          sx={{
                            fontSize: "0.8rem",
                            "&:hover": { color: "#69EAE2" },
                          }}
                        />
                      </LightTooltip>
                    </Typography>
                    <InputBase
                      autoFocus
                      startAdornment={
                        <InputAdornment position='start'>
                          <IconButton sx={{ paddingRight: "0px" }}>
                            <Typography
                              sx={{
                                color: "#69EAE2",
                                textAlign: "center",
                                fontFamily: "Nunito",
                                fontSize: "0.75rem",
                                fontStyle: "normal",
                                fontWeight: 500,
                                lineHeight: "140%",
                              }}
                            >
                              APLICAR
                            </Typography>
                          </IconButton>
                        </InputAdornment>
                      }
                      sx={{ width: "9.75rem", height: "2.25rem" }}
                      style={{
                        borderRadius: "0.375rem",
                        border: "1px solid #69EAE2",
                        background: "#1F1D2B",
                        color: "#FFF",
                      }}
                    />
                  </>
                )}
              </Box>
            </Box>
            <Divider sx={{ background: "#69EAE2", marginTop: "1rem" }} />
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
