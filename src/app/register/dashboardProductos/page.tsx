"use client";

import { Paper, Box } from "@mui/material";
import { ProductosProvider } from "./context/ProductosContext";
import ProductosSidebar from "./ProductosSidebar";
import ProductosDetalle from "./ProductosDetalle";


export default function DashboardProductosPage() {
    return (
        <ProductosProvider>
            <Paper sx={{ backgroundColor: "#1F1D2B", p: 2, height: "80vh", overflow: "auto" }}>
                <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
                    <ProductosSidebar />
                    <ProductosDetalle />
                </Box>
            </Paper>
        </ProductosProvider>
    );
}
