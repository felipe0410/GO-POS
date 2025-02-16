"use client";
import Header from "@/components/Header";
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Paper,
  Tab,
  Tabs,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import {
  fetchAndStoreSettings,
  getAllProductsDataonSnapshot,
} from "@/firebase";
import VenderCards from "@/components/VenderCards";
import SlidebarVender from "./SlidebarVender";
import CarouselCategorias from "@/components/CarouselCategorias";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ModalSettings from "./modal_settings";
import SearchInput from "./SearchInput";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const themee = createTheme({
  palette: {
    secondary: {
      main: "#1F1D2B",
    },
  },
});

const styleButtonInvoice = {
  select: {
    color: "#1F1D2B",
    background: "#69EAE2",
    fontWeight: 700,
    borderRadius: "40px",
    transition: "all 1.3s ease",
  },
  default: {
    color: "#69EAE2",
    fontWeight: 300,
  },
};

const Page: any = () => {
  const [data, setData] = useState<undefined | any[]>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setfilter] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [typeInvoice, setTypeInvoice] = useState<string>("quickSale");
  const [load, setLoad] = useState(0);
  const [facturas, setFacturas] = useState<
    { id: string; name: string; items: any[] }[]
  >([{ id: "factura-1", name: "Factura 1", items: [] }]);
  const [facturaActiva, setFacturaActiva] = useState("factura-1");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const loadSettings = async () => {
    const cachedSettings = localStorage.getItem("settingsData");
    if (cachedSettings) {
      const parsedSettings = JSON.parse(cachedSettings);
      setTypeInvoice(parsedSettings?.defaultTypeInvoice || "quickSale");
    } else {
      const success: any = await fetchAndStoreSettings();
      if (success) {
        const updatedSettings = localStorage.getItem("settingsData");
        const parsedUpdatedSettings = JSON.parse(updatedSettings || "{}");
        setTypeInvoice(
          parsedUpdatedSettings?.defaultTypeInvoice || "quickSale"
        );
      }
    }
  };

  const filteredData = async (
    event: any,
    removeCategoryFilter: boolean = false
  ) => {
    try {
      let value2 = event.trim();
      value2 = value2.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const resolvedData = await data;

      if (removeCategoryFilter) {
        setSelectedCategory(null);
      }

      const filterSearch: any = resolvedData?.filter((item) => {
        if (searchTerm === "") {
          if (!selectedCategory) {
            return true;
          }
          return item.category === selectedCategory;
        } else {
          return Object.values(item).some((value) =>
            String(value).toLowerCase().includes(value2.toLowerCase())
          );
        }
      });

      setfilter(filterSearch);
      const foundProducts = resolvedData?.filter(
        (producto) => producto.barCode === value2
      );

      if (foundProducts?.length === 1) {
        const cleanedPrice = Number(
          foundProducts[0].price.replace(/[$,]/g, "")
        );
        const newItem = {
          ...foundProducts[0],
          acc: cleanedPrice,
          cantidad: 1,
        };

        setFacturas((prevFacturas) =>
          prevFacturas.map((factura) =>
            factura.id === facturaActiva
              ? {
                  ...factura,
                  items: updateSelectedItems(factura.items, newItem),
                }
              : factura
          )
        );

        setSearchTerm("");
      } else {
        if (searchTerm.length > 0) {
          const audio = new Audio("/error-beep.mp3");
          audio.play();
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const updateSelectedItems = (items: any[], newItem: any) => {
    let updatedItems = items.filter((item) => item.barCode !== newItem.barCode);

    const existingItem = items.find((item) => item.barCode === newItem.barCode);

    if (existingItem) {
      // Si el producto ya existe, actualizamos su cantidad y acumulado
      const updatedItem = {
        ...existingItem,
        cantidad: existingItem.cantidad + 1,
        acc: existingItem.acc + newItem.acc,
      };
      updatedItems = [updatedItem, ...updatedItems];
    } else {
      // Si es un nuevo producto, lo agregamos directamente al inicio
      updatedItems = [newItem, ...updatedItems];
    }

    return updatedItems;
  };
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    filteredData("");
  };

  const handleResetFilter = () => {
    setSelectedCategory(null);
    setSearchTerm("");
    filteredData("");
  };

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDataPage = filter?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filter?.length / itemsPerPage);

  const saveDataToLocalStorage = (key: string, data: any) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  };
  const getDataFromLocalStorage = (key: string) => {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error("Error getting data from localStorage:", error);
      return null;
    }
  };
  useEffect(() => {
    filteredData("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedCategory]);
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        await getAllProductsDataonSnapshot(setData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getAllProducts();
  }, []);
  useEffect(() => {
    if (selectedItems?.length > 0) {
      saveDataToLocalStorage("selectedItems", selectedItems);
    }
  }, [selectedItems]);

  useEffect(() => {
    const localStorageSelectedItems = getDataFromLocalStorage("selectedItems");
    if (localStorageSelectedItems?.length > 0) {
      setSelectedItems(localStorageSelectedItems);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    filteredData("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 📌 Estado para manejar múltiples facturas (pestañas)

  // 📌 Obtener la factura activa
  const cambiarFacturaActiva = (id: React.SetStateAction<string>) => {
    setFacturaActiva(id);
    const factura = facturas.find((f) => f.id === id);
  };

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        await getAllProductsDataonSnapshot(setData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getAllProducts();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const productosFacturaActiva =
    facturas.find((factura) => factura.id === facturaActiva)?.items || [];

  const agregarNuevaFactura = () => {
    const maxNumeroFactura = facturas.reduce((max, factura) => {
      const num = parseInt(factura.id.replace("factura-", ""), 10);
      return num > max ? num : max;
    }, 0);

    const nuevoNumero = maxNumeroFactura + 1;

    const nuevaFactura = {
      id: `factura-${nuevoNumero}`,
      name: `Factura ${nuevoNumero}`,
      items: [],
    };

    setFacturas([...facturas, nuevaFactura]);
    setFacturaActiva(nuevaFactura.id);
  };

  const cambiarNombreFactura = (id: string, nuevoNombre: string) => {
    setFacturas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: nuevoNombre } : f))
    );
  };

  const cerrarFactura = (id: string) => {
    if (facturas.length === 1) return; // No eliminar si solo hay una factura
    const nuevasFacturas = facturas.filter((f) => f.id !== id);
    setFacturas(nuevasFacturas);
    if (facturaActiva === id) {
      setFacturaActiva(nuevasFacturas[0].id); // Mover a la primera disponible
    }
  };

  useEffect(() => {
    setLoad((prev) => prev + 1);
    if (load > 0) {
      localStorage.setItem("facturas", JSON.stringify(facturas));
    }
    if (facturas.length === 0) {
      agregarNuevaFactura();
    }
    const facturaExiste = facturas.some(
      (factura) => factura.id === facturaActiva
    );
    if (!facturaExiste) {
      setFacturaActiva(facturas[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facturas, facturaActiva]);

  useEffect(() => {
    const cachedFacturas = localStorage.getItem("facturas");
    if (cachedFacturas) {
      setFacturas(JSON.parse(cachedFacturas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("facturaActiva", JSON.stringify(facturaActiva));
  }, [facturaActiva]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "80%",
        marginLeft: "10px",
      }}
    >
      <Box
        id="conainer_vender"
        sx={{ width: { xs: "100%", lg: "calc(100% - 23rem)" } }}
      >
        <Header title="VENDER" txt={<ModalSettings />} />

        {/* 📌 Pestañas de Facturas */}
        <Paper
          sx={{
            background: "#1F1D2B",
            boxShadow: "0px 0px 19px -14px #69EAE2",
            display: { xs: "none", lg: "block" },
            width: "95%",
            borderRadius: "10px",
          }}
        >
          <Tabs
            value={facturaActiva}
            onChange={(_, newValue) => cambiarFacturaActiva(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {facturas.map((factura) => (
              <Tab
                key={factura.id}
                value={factura.id}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      variant="standard"
                      value={factura.name}
                      onChange={(e) =>
                        cambiarNombreFactura(factura.id, e.target.value)
                      }
                      sx={{
                        width: "100px",
                        marginRight: "8px",
                        color: "#fff",
                        filter: "invert(1)",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => cerrarFactura(factura.id)}
                      sx={{
                        color: "red",
                        display: facturas?.length == 1 ? "none" : "block",
                      }}
                    >
                      ✖
                    </IconButton>
                  </Box>
                }
              />
            ))}
            <Tab
              label={
                <Box
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AddOutlinedIcon
                    sx={{ color: "green", marginRight: "5px" }}
                  />
                  <Box>Nueva</Box>
                </Box>
              }
              onClick={agregarNuevaFactura}
            />
          </Tabs>
        </Paper>
        <ThemeProvider theme={themee}>
          <Box
            sx={{ marginTop: "15px", textAlignLast: "center", width: "95%" }}
          >
            <Box
              sx={{
                background: "#1F1D2B",
                boxShadow: "0px 0px 19px -14px #69EAE2",
                borderRadius: "40px",
                padding: { xs: "7px 11px", sm: "10px 14px" },
                width: "fit-content",
                margin: "0 auto",
              }}
            >
              <Button
                onClick={() => setTypeInvoice("invoice")}
                style={
                  typeInvoice == "invoice"
                    ? styleButtonInvoice.select
                    : styleButtonInvoice.default
                }
                sx={{
                  fontFamily: "Nunito",
                  fontSize: { xs: "12px", sm: "16px" },
                  lineHeight: "21.82px",
                  textAlign: "left",
                  height: { xs: "25px", sm: "auto" },
                }}
              >
                FACTURA
              </Button>
              <Button
                onClick={() => setTypeInvoice("quickSale")}
                style={
                  typeInvoice == "quickSale"
                    ? styleButtonInvoice.select
                    : styleButtonInvoice.default
                }
                sx={{
                  fontSize: { xs: "12px", sm: "16px" },
                  lineHeight: "21.82px",
                  textAlign: "left",
                  height: { xs: "25px", sm: "auto" },
                }}
              >
                VENTA RÁPIDA
              </Button>
              <Button
                disabled
                style={
                  typeInvoice == "quickSale"
                    ? styleButtonInvoice.select
                    : styleButtonInvoice.default
                }
                onClick={() => setTypeInvoice("electronic")}
                sx={{
                  fontSize: "16px",
                  lineHeight: "21.82px",
                  textAlign: "left",
                  display: "none",
                }}
              >
                FACTURA ELECTRONICA
              </Button>
            </Box>
          </Box>
        </ThemeProvider>
        <Paper
          id={"paper"}
          sx={{ width: "95%", height: "100%", marginTop: "1rem" }}
          style={{
            borderRadius: "0.625rem",
            background: "#1F1D2B",
            boxShadow: "0px 1px 100px -50px #69EAE2",
          }}
        >
          <Box
            sx={{
              padding: "40px 48px",
              height: { xs: "92%", sm: "99%" },
              textAlign: "-webkit-center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                display={"flex"}
                sx={{
                  width: "85%",
                }}
              >
                <Paper
                  component="form"
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    filteredData(e.target[1].value);
                  }}
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
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon sx={{ color: "#fff" }} />
                  </IconButton>
                  <SearchInput
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
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
              <Button
                onClick={handleResetFilter}
                sx={{
                  padding: "8px",
                  textAlign: "center",
                  backgroundColor: "#69EAE2",
                  color: "#1F1D2B",
                  border: "1px solid #69EAE2",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 10px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: { xs: "8px", sm: "12px" },
                  "&:hover": {
                    backgroundColor: "#69EAE2",
                    color: "#1F1D2B",
                    opacity: "70%",
                  },
                }}
              >
                RESTABLECER
              </Button>
            </Box>
            <Box sx={{ marginTop: { sm: "0" }, height: "70%" }}>
              <CarouselCategorias
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
              <VenderCards
                filteredData={currentDataPage}
                setSelectedItems={setFacturas}
                selectedItems={productosFacturaActiva}
                facturaActiva={facturaActiva}
              />
              <Box
                id="pagination"
                sx={{
                  filter: "invert(1)",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  width: { xs: "115%", sm: "100%" },
                  marginLeft: { xs: "-15px", sm: "0" },
                }}
              >
                <Pagination
                  sx={{ color: "#fff" }}
                  onChange={(e, page) => setCurrentPage(page)}
                  count={totalPages}
                  shape="circular"
                  size={matches ? "large" : "small"}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <SlidebarVender
        selectedItems={productosFacturaActiva}
        setSelectedItems={setFacturas}
        searchTerm={searchTerm}
        filteredData={filteredData}
        setSearchTerm={setSearchTerm}
        typeInvoice={typeInvoice}
        facturaActiva={facturaActiva}
      />
    </Box>
  );
};

export default Page;
