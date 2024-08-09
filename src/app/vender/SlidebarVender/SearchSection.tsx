import React from "react";
import { Box, Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Slider from "../sliderScan";

interface SearchSectionProps {
  search: string;
  setSearch: (search: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredData: (term: string) => void;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  matchesSM: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  search,
  setSearch,
  searchTerm,
  setSearchTerm,
  handleSearch,
  filteredData,
  checked,
  setChecked,
  matchesSM,
}) => (
  <Box
    sx={{
      marginY: "20px",
      height: "25px",
      display: "flex",
      justifyContent: "space-between",
      borderRadius: "5px",
      alignItems: "center",
      color: "#fff",
      background: "#2C3248",
    }}
  >
    <Paper
      component="form"
      onSubmit={(e: any) => {
        e.preventDefault();
        !checked && filteredData(e.target[0].value);
      }}
      sx={{
        marginY: "20px",
        height: "25px",
        display: "flex",
        borderRadius: "5px",
        alignItems: "center",
        color: "#fff",
        background: "#2C3248",
        width: "100%",
      }}
    >
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          color: "#fff",
          fontSize: "16px",
        }}
        value={!checked ? searchTerm : search}
        placeholder={
          !checked ? "Ingresa el código del producto" : "Buscar en la factura"
        }
        onChange={(e:any) => {
          if (checked) {
            handleSearch(e);
            setSearch(e.target.value);
          } else {
            setSearchTerm(e.target.value);
          }
        }}
      />
    </Paper>
    {matchesSM ? (
      <Slider checked={checked} setChecked={setChecked} />
    ) : (
      <SearchIcon sx={{ color: "#F8F8F8", fontSize: "20px" }} />
    )}
  </Box>
);

export default SearchSection;
