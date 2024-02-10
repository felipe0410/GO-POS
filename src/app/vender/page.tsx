"use client";
import Header from "@/components/Header";
import {
  Box,
  IconButton,
  InputBase,
  Pagination,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { getAllProductsDataonSnapshot } from "@/firebase";
import VenderCards from "@/components/VenderCards";
import SlidebarVender from "./SlidebarVender";

const Page: any = () => {
  const [data, setData] = useState<undefined | any[]>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setfilter] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const filteredData = async (event: any) => {
    try {
      const resolvedData = await data;
      const foundProducts = resolvedData?.filter((producto) => producto.barCode === event);
      const filterSearch: any = resolvedData?.filter((item) => {
        if (searchTerm === "") {
          return true;
        }
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setfilter(filterSearch);
      if (foundProducts?.length === 1) {
        const cleanedPrice = Number(foundProducts[0].price.replace(/[$,]/g, ""));
        const newItem = {
          ...foundProducts[0],
          acc: cleanedPrice,
          cantidad: 1,
        };
        const updatedItems = updateSelectedItems(newItem);
        setSelectedItems(updatedItems);
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const updateSelectedItems = (newItem: any) => {
    let productAlreadyInList = false;
    const updatedItems = (selectedItems || []).map((item: any) => {
      if (item.barCode === newItem.barCode) {
        productAlreadyInList = true;
        return { ...item, cantidad: item.cantidad + 1, acc: item.acc + newItem.acc };
      }
      return item;
    });
    if (!productAlreadyInList || !(selectedItems?.length)) {
      return [...updatedItems, newItem];
    }
    return updatedItems;
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
    filteredData("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
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
      saveDataToLocalStorage('selectedItems', selectedItems)
    }
  }, [selectedItems])

  useEffect(() => {
    const localStorageSelectedItems = getDataFromLocalStorage('selectedItems')
    if (localStorageSelectedItems?.length > 0) {
      setSelectedItems(localStorageSelectedItems)

    }
  }, [])


  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "80%", marginLeft: '10px' }}>
      <Box
        id='conainer_vender'
        sx={{ width: { xs: "100%", lg: "calc(100% - 23rem)" } }}
      >
        <Header title='VENDER' />
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
              height: { xs: "90%", sm: '105%' },
              textAlign: "-webkit-center",
            }}
          >
            <Box display={"flex"}>
              <Paper
                component='form'
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                  }}
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
                marginTop: "1rem",
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
            </Box>
            <Box sx={{ marginTop: { sm: "0" }, height: "70%" }}>
              <VenderCards
                filteredData={currentDataPage}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
              />
              <Box id='pagination' sx={{ filter: "invert(1)", display: "flex", justifyContent: "center", marginTop: '20px', width: { xs: '115%', sm: "100%" }, marginLeft: { xs: '-15px', sm: '0' } }} >
                <Pagination sx={{ color: "#fff" }} onChange={(e, page) => setCurrentPage(page)} count={totalPages} shape="circular" size={matches ? "large" : "small"} />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <SlidebarVender
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        searchTerm={searchTerm}
        filteredData={filteredData}
        setSearchTerm={setSearchTerm}
      />
    </Box>
  );
};

export default Page;
