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
import DatosVenta from "@/components/DatosVenta";
import Factura from "@/components/Factura";

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

interface SelectedProduct {
  image: string;
  cantidad: number;
  productName: string;
  price: string;
  nota: string;
  barCode: string;
  acc: number;
}

const Page = () => {
  const [data, setData] = useState<undefined | any[]>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<[]>([]);
  const [agregarDescuento, setAgregarDescuento] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [descuentoON, setDescuentoON] = useState(false);
  const [nextStep, setNextStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reciboPago, setReciboPago] = useState(false);
  const storedContadorFactura = localStorage.getItem("contadorFactura");
  const initialContadorFactura = storedContadorFactura
    ? parseInt(storedContadorFactura, 10)
    : 1;
  const [contadorFactura, setContadorFactura] = useState(
    initialContadorFactura
  );

  // Actualiza localStorage cada vez que el contador cambia
  useEffect(() => {
    localStorage.setItem("contadorFactura", contadorFactura.toString());
  }, [contadorFactura]);

  const generarNumeroFactura = () => {
    return String(contadorFactura).padStart(7, "0");
  };

  const handleVenderClick = () => {
    // Incrementa el contador de factura
    setContadorFactura((prevContador) => prevContador + 1);
  };

  const calcularTotal = () => {
    if (inputValue.includes("%")) {
      let valorSinPorcentaje: number;
      const porcentajeComoNumero = Number(inputValue.replace("%", ""));
      valorSinPorcentaje = Math.ceil((porcentajeComoNumero / 100) * subtotal);
      console.log(`Descuento: ${valorSinPorcentaje}`);
      setDescuento(valorSinPorcentaje);
    } else {
      setDescuento(Number(inputValue));
    }
    setDescuentoON(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
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

  useEffect(() => {
    const nuevoSubtotal = selectedItems.reduce(
      (total, producto) => total + producto.acc,
      0
    );
    setSubtotal(nuevoSubtotal);
  }, [selectedItems]);

  const filteredData = data?.filter(
    (item) =>
      (searchTerm === "" ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barCode.toString().includes(searchTerm)) &&
      (selectedCategory === "" || item.category === selectedCategory)
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
                  value={selectedCategory}
                  onChange={handleCategoryChange}
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
              <VenderCards
                filteredData={filteredData}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
              />
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
          {reciboPago ? (
            <Factura
              setReciboPago={setReciboPago}
              setSelectedItems={setSelectedItems}
              setNextStep={setNextStep}
            />
          ) : (
            <>
              {nextStep ? (
                <IconButton
                  sx={{ paddingLeft: 0 }}
                  onClick={() => setNextStep(false)}
                >
                  <Box
                    component={"img"}
                    src={"/images/vender.svg"}
                    sx={{ width: "0.93rem", height: "0.93rem" }}
                  />
                  <Typography
                    sx={{
                      color: "#69EAE2",
                      fontFamily: "Nunito",
                      fontSize: "0.875rem",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "140%",
                      marginLeft: "2px",
                    }}
                  >
                    Volver al Carrito
                  </Typography>
                </IconButton>
              ) : null}
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
                VENTA # {generarNumeroFactura()}
              </Typography>
              {nextStep ? (
                <DatosVenta
                  total={subtotal - descuento}
                  selectedItems={selectedItems}
                  subtotal={subtotal}
                  descuento={descuento}
                  setLoading={setLoading}
                  loading={loading}
                  setReciboPago={setReciboPago}
                  reciboPago={reciboPago}
                  numeroFactura={generarNumeroFactura}
                  handleVenderClick={handleVenderClick}
                />
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      width: "70%",
                      marginTop: "1rem",
                    }}
                  >
                    <Button
                      style={{ borderRadius: "0.5rem", background: "#69EAE2" }}
                    >
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
                          marginRight: "19px",
                        }}
                      >
                        Precio
                      </Typography>
                    </Box>
                    <Divider sx={{ background: "#69EAE2" }} />
                    <Box
                      id='items-list'
                      sx={{ maxHeight: "450px", overflowY: "auto" }}
                    >
                      {selectedItems.length === 0 ? (
                        <Typography
                          sx={{
                            color: "#69EAE2",
                            textAlign: "center",
                            fontFamily: "Nunito",
                            fontSize: "1rem",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "140%",
                            marginTop: "2rem",
                          }}
                        >
                          AÑADE ITEMS A TU CARRITO
                        </Typography>
                      ) : (
                        selectedItems.map((product: any) => (
                          <React.Fragment key={product.barCode}>
                            <CartItems
                              product={product}
                              setSelectedItems={setSelectedItems}
                              selectedItems={selectedItems}
                            />
                          </React.Fragment>
                        ))
                      )}
                    </Box>
                    <Divider
                      sx={{ background: "#69EAE2", marginTop: "1.5rem" }}
                    />
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
                          {`$ ${subtotal.toLocaleString("en-US")}`}
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
                          $ 0
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
                            {descuentoON ? (
                              <Typography
                                sx={{
                                  color: "#69EAE2",
                                  textAlign: "center",
                                  fontFamily: "Nunito",
                                  fontSize: "1rem",
                                  fontStyle: "normal",
                                  fontWeight: 500,
                                  lineHeight: "90%",
                                }}
                              >
                                <IconButton
                                  sx={{
                                    paddingTop: "2px",
                                    paddingRight: "2px",
                                  }}
                                  onClick={() => {
                                    setDescuento(0);
                                    setDescuentoON(false);
                                  }}
                                >
                                  <Box
                                    component={"img"}
                                    src={"/images/edit.svg"}
                                    sx={{ width: "0.9rem", height: "0.9rem" }}
                                  />
                                </IconButton>
                                {`$ ${descuento.toLocaleString("en-US")}`}
                              </Typography>
                            ) : (
                              <InputBase
                                autoFocus
                                startAdornment={
                                  <InputAdornment position='start'>
                                    <IconButton
                                      sx={{ paddingRight: "0px" }}
                                      onClick={calcularTotal}
                                    >
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
                                value={inputValue}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => handleInputChange(event)}
                                sx={{ width: "9.75rem", height: "2.25rem" }}
                                style={{
                                  borderRadius: "0.375rem",
                                  border: "1px solid #69EAE2",
                                  background: "#1F1D2B",
                                  color: "#FFF",
                                }}
                              />
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                    <Divider
                      sx={{ background: "#69EAE2", marginTop: "1rem" }}
                    />
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
                        {`$ ${(subtotal - descuento).toLocaleString("en-US")}`}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                      <Button
                        onClick={() => setNextStep(true)}
                        style={{
                          borderRadius: "0.5rem",
                          background: "#69EAE2",
                          width: "7rem",
                        }}
                      >
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
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
