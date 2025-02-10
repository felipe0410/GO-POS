import React, { useState, useEffect } from "react";
import { InputBase, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchInputProps {
  placeholder?: string;
  debounceTime?: number; // Tiempo de debounce
  searchTerm:any;
  setSearchTerm:any;
}

const SearchInput: React.FC<SearchInputProps> = ({
  setSearchTerm,
  searchTerm// Tiempo de espera antes de ejecutar la búsqueda
}) => {
  const [inputValue, setInputValue] = useState<string>("");


  const [localSearch, setLocalSearch] = useState<string>("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchTerm(localSearch);
    }
  };

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  return (
    <InputBase
      sx={{
        ml: 1,
        flex: 1,
        color: "#fff",
      }}
      placeholder="Buscar"
      id='buscador'
      value={localSearch}
      onChange={(e) => setLocalSearch(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default SearchInput;
