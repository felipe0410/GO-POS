import { Box, IconButton, InputBase, Paper } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { IFilterCustomersComponentProps } from "../../utils/interfaces";
import ButtonAddCustomers from "../buttons/addCustomers";

const FilterCustomersComponent = ({
  searchTerm,
  setSearchTerm,
  filteredData,
  setFilteredData,
}: IFilterCustomersComponentProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: { xs: "center", sm: "space-between" },
        width: "100%",
        gap: "10px",
      }}
    >
      <Box
        display={"flex"}
        sx={{
          width: { xs: "100%", sm: "65%" },
        }}
      >
        <Paper
          component="form"
          //   onSubmit={(e: any) => {
          //     e.preventDefault();
          //     console.log("searchTerm");
          //   }}
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#fff",
            width: "35rem",
            // height: "2rem",
            borderRadius: "0.3125rem",
            background: "#2C3248",
          }}
        >
          <IconButton
            type="button"
            // sx={{ p: "10px" }}
            aria-label="search"
          >
            <SearchIcon sx={{ color: "#fff" }} />
          </IconButton>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              color: "#fff",
            }}
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </Paper>
        <IconButton
          type="button"
          aria-label="filter"
          onClick={() => console.log("filter")}
        >
          <TuneIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>
      {filteredData.length > 0 && (
        <ButtonAddCustomers setAddCustomer={setFilteredData} />
      )}
    </Box>
  );
};

export default FilterCustomersComponent;
