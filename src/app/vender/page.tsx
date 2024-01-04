"use client";
import Header from "@/components/Header";
import {
  Box,
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
import { getAllCategoriesData, getAllProductsData } from "@/firebase";
import VenderCards from "@/components/VenderCards";
import debounce from "debounce";
import SlidebarVender from "./SlidebarVender";

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
  const [filter, setfilter] = useState<any>();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState<any>([]);

  const debouncedHandleSearchChange = debounce(() => { }, 1000);

  const handleSearchChange = async (event: any) => {
    setSearchTerm(event);
    debouncedHandleSearchChange();
    filteredData(event)
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


  const filteredData = async (event: any) => {
    const filterSearch: any = await data?.filter((item) => {
      if (searchTerm === "") {
        return true;
      }
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setfilter(filterSearch);
    const foundProducts = data?.filter(producto => producto.barCode === event);
    let productAlreadyInList
    if (foundProducts?.length === 1) {
      const cleanedPrice = Number(foundProducts[0].price.replace(/[$,]/g, ""));
      const newItem = {
        ...foundProducts[0],
        acc: cleanedPrice,
        cantidad: 1,
      };
      const updatedItems = selectedItems?.map((item: any) => {
        if (item.barCode === newItem.barCode) {
          productAlreadyInList = true
          return { ...item, cantidad: item.cantidad + 1 };
        }
        productAlreadyInList = false
        return item;
      });
      if (!productAlreadyInList || selectedItems?.length === 0) {
        await updatedItems.push(newItem);
      }
      setSelectedItems(updatedItems);
      setSearchTerm("")
    }
  }

  useEffect(() => {
    filteredData("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
    <Box sx={{ display: "flex", flexDirection: "row", height: "80%" }}>
      <Box
        id='conainer_vender'
        sx={{ width: { xs: "100%", sm: "calc(100% - 25.5625rem)" } }}
      >
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
                onSubmit={(e: any) => {
                  e.preventDefault();
                  handleSearchChange(e.target[1].value);
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
                  onChange={(e) => handleSearchChange(e.target.value)}
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
            <Box sx={{ marginTop: { sm: "1.56rem" }, height: "70%" }}>
              <VenderCards
                filteredData={filter}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
      <SlidebarVender
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange} />
    </Box>
  );
};

export default Page;
