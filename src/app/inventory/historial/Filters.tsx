import React from "react";
import { Box, Paper, InputBase, IconButton, Select, MenuItem, Typography, Checkbox, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface FiltersProps {
  searchTerm: string;
  stockFilter: string;
  categoryFilter: string;
  allCategories: string[];
  columns:any;
  onSearchChange: (value: string) => void;
  onStockFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  exportToCSV:(value: any) => void;
  setColumns:any
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  stockFilter,
  categoryFilter,
  allCategories,
  onSearchChange,
  onStockFilterChange,
  onCategoryFilterChange,
  exportToCSV,
  columns,
  setColumns
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <Paper
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "300px",
          marginRight: "10px",
        }}
      >
        <InputBase
          placeholder="Buscar productos"
          value={searchTerm}
          onChange={(e:any) =>{ 
            onSearchChange(e)
        }}
          sx={{ marginLeft: "10px", flex: 1 }}
        />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Paper>
      <Select
        value={stockFilter}
        onChange={(e:any) => onStockFilterChange(e)}
        sx={selectStyles}
      >
        <MenuItem value="all">Todos</MenuItem>
        <MenuItem value="out">Sin Stock</MenuItem>
        <MenuItem value="low">Stock Bajo</MenuItem>
        <MenuItem value="in">En Stock</MenuItem>
      </Select>
      <Select
        value={categoryFilter}
        onChange={(e:any) => onCategoryFilterChange(e)}
        sx={selectStyles}
      >
        {allCategories.map((category) => (
          <MenuItem key={category} value={category}>
            {category === "all" ? "Todas las Categorías" : category}
          </MenuItem>
        ))}
      </Select>
      <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Select
              multiple
              displayEmpty
              value={columns.filter((col: { visible: any; }) => col.visible).map((col: { id: any; }) => col.id)}
              onChange={(event) => {
                const selectedValues = event.target.value as string[];
                setColumns((prevColumns: any[]) =>
                  prevColumns.map((col) => ({
                    ...col,
                    visible: selectedValues.includes(col.id),
                  }))
                );
              }}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <Typography sx={{ color: "#69EAE2" }}>
                      Seleccione columnas
                    </Typography>
                  );
                }
                return (
                  <Typography sx={{ color: "#69EAE2" }}>
                    {selected.length} columnas
                  </Typography>
                );
              }}
              sx={{
                minWidth: "150px",
                background: "#1F1D2B",
                color: "#69EAE2",
                borderRadius: "4px",
                marginRight: "10px",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#69EAE2",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#69EAE2",
                },
              }}
            >
              {columns.map((column: { id: any; visible: any; label: any; }) => (
                <MenuItem key={column.id} value={column.id}>
                  <Checkbox
                    checked={column.visible}
                    sx={{ color: "#69EAE2" }}
                  />
                  <Typography>{column.label}</Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <Button variant="contained" color="primary" onClick={exportToCSV}>
          Descargar CSV
        </Button>
    </Box>
  );
};

const selectStyles = {
  minWidth: "150px",
  background: "#1F1D2B",
  color: "#69EAE2",
  marginRight: "10px",
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#69EAE2",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#69EAE2",
  },
};

export default Filters;
