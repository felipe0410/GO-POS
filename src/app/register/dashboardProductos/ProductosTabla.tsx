"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useProductosContext } from "./context/ProductosContext";

export default function ProductosTabla() {
  const { datosProducto, metric } = useProductosContext();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // ✅ Ordenar de mayor a menor valor
  const datosOrdenados = [...datosProducto].sort((a, b) => Number(b.y) - Number(a.y));

  // ✅ Elemento con mayor venta o cantidad (estará primero)
  const maxItem = datosOrdenados[0];

  // ✅ Paginado sobre los datos ya ordenados
  const datosPaginados = datosOrdenados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#2C3248",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headCellStyle}>Fecha</TableCell>
              <TableCell sx={headCellStyle}>
                {metric === "ventas" ? "Valor vendido" : "Unidades vendidas"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosPaginados.map((d, i) => {
              const isMax = d.x === maxItem?.x;

              return (
                <TableRow
                  key={i}
                  hover
                  sx={{
                    backgroundColor: isMax ? "#1E442B" : "transparent",
                    "&:hover": {
                      backgroundColor: isMax ? "#256F46" : "#394358",
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell sx={cellStyle}>{d.x}</TableCell>
                  <TableCell sx={cellStyle}>
                    {metric === "ventas"
                      ? `$ ${Number(d.y).toLocaleString("es-CO")}`
                      : `${Math.round(Number(d.y)).toLocaleString("es-CO")} uds`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={datosOrdenados.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
        sx={{
          color: "#fff",
          ".MuiTablePagination-toolbar": {
            backgroundColor: "#1F1D2B",
          },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
            color: "#ccc",
          },
          ".MuiTablePagination-actions button": {
            color: "#69EAE2",
          },
        }}
      />
    </Box>
  );
}

const headCellStyle = {
  color: "#B0BEC5",
  fontWeight: "bold",
  fontSize: "0.95rem",
  backgroundColor: "#1F1D2B",
  borderBottom: "1px solid #455A64",
};

const cellStyle = {
  color: "white",
  borderBottom: "1px solid #37474F",
};
