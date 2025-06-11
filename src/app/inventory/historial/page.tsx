"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
} from "@mui/material";
import { getAllProductsData, getAllProveedores } from "@/firebase";
import { saveAs } from "file-saver";
import Header from "@/components/Header";
import SummaryCards from "./SummaryCards";
import Filters from "./Filters";
import ProductsTable from "./ProductsTable";
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  visible: boolean;
}

const initialColumns: Column[] = [
  {
    id: "image",
    label: "IMAGEN",
    minWidth: 100,
    align: "center",
    visible: true,
  },
  {
    id: "productName",
    label: "NOMBRE DEL PRODUCTO",
    minWidth: 170,
    visible: true,
  },
  { id: "barCode", label: "CÓDIGO DE BARRA", minWidth: 100, visible: true },
  {
    id: "price",
    label: "PRECIO",
    minWidth: 100,
    align: "right",
    visible: true,
  },
  {
    id: "cantidad",
    label: "EXISTENCIAS",
    minWidth: 170,
    align: "right",
    visible: true,
  },
  {
    id: "category",
    label: "CATEGORÍA",
    minWidth: 170,
    align: "right",
    visible: true,
  },

];

export default function StickyHeadTable() {
  const [proveedoresData, setProveedoresData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(initialColumns);
  const [proveedorFilter, setProveedorFilter] = useState("all");
  const itemsPerPage = 10;
  const totalProductos = data.length;

  const productosSinStock = data.filter(
    (item) => {
      const optimiceCant = item?.optimice_cant ?? 100;
      const porcentaje = (item.cantidad / optimiceCant) * 100;
      return porcentaje >= 0 && porcentaje <= 20;
    }
  ).length;

  const productosStockBajo = data.filter(
    (item) => {
      const optimiceCant = item?.optimice_cant ?? 100;
      const porcentaje = (item.cantidad / optimiceCant) * 100;
      return porcentaje > 20 && porcentaje <= 70;
    }
  ).length;

  const productosBuenStock = data.filter(
    (item) => {
      const optimiceCant = item?.optimice_cant ?? 100;
      const porcentaje = (item.cantidad / optimiceCant) * 100;
      return porcentaje > 70; // Más del 70%
    }
  ).length;

  useEffect(() => {
    getAllProductsData((fetchedData: any[]) => {
      setData(fetchedData);
      setFilter(fetchedData);
    });
  }, []);
  useEffect(() => {
    const fetchProveedores = async () => {
      const lista = await getAllProveedores();
      setProveedoresData(lista);
    };
    fetchProveedores();
  }, []);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    applyFilters(value, stockFilter, categoryFilter, proveedorFilter);
  };

  const handleStockFilterChange = (event: any) => {
    const value = event.target.value as string;
    setStockFilter(value);
    applyFilters(searchTerm, value, categoryFilter, proveedorFilter);
  };

  const handleCategoryFilterChange = (event: any) => {
    const value = event.target.value as string;
    setCategoryFilter(value);
    applyFilters(searchTerm, stockFilter, value, proveedorFilter);
  };

  const applyFilters = (
    search: string,
    stock: string,
    category: string,
    proveedor: string
  ) => {
    let filtered = data;

    if (search) {
      filtered = filtered.filter((item) =>
        item.productName.toLowerCase().includes(search)
      );
    }

    if (stock !== "all") {
      filtered = filtered.filter((item) => {
        if (stock === "out") return item.cantidad === 0;
        if (stock === "low") return item.cantidad > 0 && item.cantidad <= 30;
        if (stock === "in") return item.cantidad > 30;
        return true;
      });
    }

    if (category !== "all") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (proveedor !== "all") {
      filtered = filtered.filter((item) =>
        item.proveedores?.includes(proveedor)
      );
    }

    setFilter(filtered);
  };

  const handleSort = (key: string) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key, direction });
    setFilter((prevFilter) =>
      [...prevFilter].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const exportToCSV = () => {
    const csvContent = [
      columns
        .filter((col) => col.visible && col.id !== "image")
        .map((col) => col.label),
      ...filter.map((item) =>
        columns
          .filter((col) => col.visible && col.id !== "image")
          .map((col) => item[col.id])
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "inventory.csv");
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const paginatedData = filter.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const allCategories = [
    "all",
    ...Array.from(new Set(data.map((item: any) => item?.category ?? ""))),
  ];

  return (
    <Box sx={{ padding: "20px" }}>
      <Header title="RESUMEN INVENTARIO" />
      <br />

      <SummaryCards
        totalProductos={totalProductos}
        productosSinStock={productosSinStock}
        productosStockBajo={productosStockBajo}
        productosBuenStock={productosBuenStock}
      />
      <Filters
        searchTerm={searchTerm}
        stockFilter={stockFilter}
        categoryFilter={categoryFilter}
        allCategories={allCategories}
        onSearchChange={(value: any) => handleSearchChange(value)}
        onStockFilterChange={handleStockFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        columns={columns}
        exportToCSV={exportToCSV}
        setColumns={setColumns}
        proveedoresData={proveedoresData}
        proveedorFilter={proveedorFilter}
        onProveedorFilterChange={(value: any) => {
          setProveedorFilter(value);
          applyFilters(searchTerm, stockFilter, categoryFilter, value);
        }}
      />
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          background: "#1F1D2B",
          height: "50%",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <ProductsTable
          columns={columns}
          paginatedData={paginatedData}
          sortConfig={sortConfig}
          onSort={handleSort}
          onPageChange={setCurrentPage}
          totalPages={Math.ceil(filter.length / itemsPerPage)}
          proveedoresData={proveedoresData}
        />
      </Paper>
    </Box>
  );
}
