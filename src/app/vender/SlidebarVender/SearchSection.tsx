import React from "react";
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
}) => (
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
        {<ArrowCircleLeftIcon sx={{ marginRight: "10px", color: "#dbdada" }} />}
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
        {<ArrowCircleRightIcon sx={{ marginLeft: "10px", color: "#dbdada" }} />}
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
          onChange={(e: any) => {
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
  </>
);

export default SearchSection;
