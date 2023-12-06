"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

interface Column {
  id: "iconos" | "name" | "code" | "population" | "size" | "density";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "iconos", label: " ", minWidth: 90 },
  { id: "name", label: "NOMBRE DEL PRODUCTO", minWidth: 170 },
  { id: "code", label: "CODIGO DE BARRA", minWidth: 100 },
  {
    id: "population",
    label: "PRECIO",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "EXISTENCIAS",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "CATEGORÍA",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  iconos: any;
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

function createData(
  iconos: any,
  name: string,
  code: string,
  population: number,
  size: number
): Data {
  const density = population / size;
  return { iconos, name, code, population, size, density };
}

const rows = [
  createData("iconos", "India", "IN", 1324171354, 3287263),
  createData("iconos", "China", "CN", 1403500365, 9596961),
  createData("iconos", "Italy", "IT", 60483973, 301340),
  createData("iconos", "United States", "US", 327167434, 9833520),
  createData("iconos", "Canada", "CA", 37602103, 9984670),
  createData("iconos", "Australia", "AU", 25475400, 7692024),
  createData("iconos", "Germany", "DE", 83019200, 357578),
  createData("iconos", "Ireland", "IE", 4857000, 70273),
  createData("iconos", "Mexico", "MX", 126577691, 1972550),
  createData("iconos", "Japan", "JP", 126317000, 377973),
  createData("iconos", "France", "FR", 67022000, 640679),
  createData("iconos", "United Kingdom", "GB", 67545757, 242495),
  createData("iconos", "Russia", "RU", 146793744, 17098246),
  createData("iconos", "Nigeria", "NG", 200962417, 923768),
  createData("iconos", "Brazil", "BR", 210147125, 8515767),
];

export default function StickyHeadTable() {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", background: "#1F1D2B" }}>
      <TableContainer
        sx={{ maxHeight: 490, background: "#1F1D2B", border: "none" }}
      >
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    background: "#1F1D2B",
                    color: "#69EAE2",
                    fontFamily: "Nunito",
                    fontSize: "1rem",
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "normal",
                    borderColor: "#69EAE2",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                      >
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
