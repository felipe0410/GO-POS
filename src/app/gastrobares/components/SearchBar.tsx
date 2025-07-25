import SearchInput from "@/app/vender/Normal/SearchInput";
import { Paper, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ searchTerm, setSearchTerm, onSubmit }: any) {
    return (
        <Paper component="form" onSubmit={onSubmit}
            sx={{ display: "flex", alignItems: "center", color: "#fff", width: "25rem", height: "2rem", borderRadius: "0.3125rem", background: "#2C3248" }}
        >
            <IconButton type="submit"><SearchIcon sx={{ color: "#fff" }} /></IconButton>
            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <IconButton><Box component="img" src="/images/scan.svg" /></IconButton>
        </Paper>
    );
}
