"use client";
import { Box, Pagination, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchAndStoreSettings, getAllInvoicesData } from "@/firebase";
import VenderCards from "@/components/VenderCards";
import SlidebarDevoluciones from "./SlidebarVender";

const ContainerDevolucion: any = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [data, setData] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setfilter] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [typeInvoice, setTypeInvoice] = useState<string>("quickSale");

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
      const resolvedData = await data.compra;
      if (removeCategoryFilter) {
        setSelectedCategory(null);
      }

      const filterSearch: any = resolvedData?.filter((item: any) => {
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
        (producto: any) => producto.barCode === value2
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
        const updatedItems = updateSelectedItems(newItem);
        setSelectedItems(updatedItems);
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

  const updateSelectedItems = (newItem: any) => {
    let productAlreadyInList = false;
    const updatedItems = (selectedItems || []).map((item: any) => {
      if (item.barCode === newItem.barCode) {
        productAlreadyInList = true;
        return {
          ...item,
          cantidad: item.cantidad + 1,
          acc: item.acc + newItem.acc,
        };
      }
      return item;
    });
    if (!productAlreadyInList || !selectedItems?.length) {
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
    filteredData("");
  }, [data]);
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

  useEffect(() => {
    const getData = async () => {
      console.log("entro aqui ");
      await getAllInvoicesData(setInvoices);
    };
    getData();
  }, []);

  return (
    <Box sx={{ height: "100%" }}>
      <Box sx={{ background: "red", height: "95%" }}>
        {/* <CarouselCategorias
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        /> */}
        <VenderCards
          filteredData={currentDataPage}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          type={true}
          facturaActiva={data.invoice}
          invoice={data}
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
      <SlidebarDevoluciones
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        invoices={invoices}
        selectedItems={data}
        setSelectedItems={setData}
      />
    </Box>
  );
};

export default ContainerDevolucion;
