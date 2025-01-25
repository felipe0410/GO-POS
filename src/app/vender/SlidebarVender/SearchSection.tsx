import React, { useEffect, useState } from "react";
import { Box, Paper, InputBase, ButtonGroup, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Slider from "../sliderScan";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

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
  setNextStep: (checked: boolean) => void;
  nextStep: boolean;
  descuento: number;
  subtotal: number;
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
  setNextStep,
  nextStep,
  descuento,
  subtotal,
}) => {
  const [localSearch, setLocalSearch] = useState<string>("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (checked) {
        setSearch(localSearch);
      } else {
        setSearchTerm(localSearch);
        filteredData(localSearch);
      }
    }
  };

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <ButtonGroup
        fullWidth
        disableElevation
        variant="contained"
        sx={{ marginTop: "-10px", height: "25px" }}
      >
        <Button
          onClick={() => setNextStep(false)}
          sx={{
            borderRadius: "40px",
            background: "#183735",
            color: "#69eae2",
            fontWeight: 800,
            fontSize: "12px",
            "&:hover": { opacity: "50%", background: "#183735" },
          }}
        >
          <ArrowCircleLeftIcon sx={{ marginRight: "10px", color: "#dbdada" }} />
          Atras
        </Button>
        <Button
          onClick={() => setNextStep(true)}
          disabled={descuento > subtotal || subtotal === 0}
          sx={{
            borderRadius: "40px",
            background: "#183735",
            color: "#69eae2",
            fontWeight: 800,
            fontSize: "12px",
            "&:hover": { opacity: "50%", background: "#183735" },
          }}
        >
          Sigiente
          <ArrowCircleRightIcon sx={{ marginLeft: "10px", color: "#dbdada" }} />
        </Button>
      </ButtonGroup>
      <Box
        sx={{
          marginY: "20px",
          height: "25px",
          display: nextStep ? "none" : "flex",
          justifyContent: "space-between",
          borderRadius: "5px",
          alignItems: "center",
          color: "#fff",
          background: "#2C3248",
        }}
      >
        <Paper
          component="form"
          onSubmit={(e) => e.preventDefault()}
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
            value={localSearch}
            placeholder={
              !checked
                ? "Ingresa el código del producto"
                : "Buscar en la factura"
            }
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Paper>
        {matchesSM ? (
          <Slider checked={checked} setChecked={setChecked} />
        ) : (
          <SearchIcon sx={{ color: "#F8F8F8", fontSize: "20px" }} />
        )}
      </Box>
    </>
  );
};

export default SearchSection;
