"use client";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getAllProductsData } from "@/firebase";
import { Box, IconButton } from "@mui/material";

interface Column {
  id: "iconos" | "productName" | "barCode" | "price" | "cantidad" | "category";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: readonly Column[] = [
  { id: "productName", label: "NOMBRE DEL PRODUCTO", minWidth: 170 },
  { id: "barCode", label: "CODIGO DE BARRA", minWidth: 100 },
  {
    id: "price",
    label: "PRECIO",
    minWidth: 170,
    align: "right",
  },
  {
    id: "cantidad",
    label: "EXISTENCIAS",
    minWidth: 170,
    align: "right",
  },
  {
    id: "category",
    label: "CATEGORÍA",
    minWidth: 170,
    align: "right",
  },
];

export default function StickyHeadTable() {
  const [data, setData] = useState<undefined | any[]>(undefined);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const allProducts = await getAllProductsData();
        if (allProducts) {
          setData(allProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getAllProducts();
  }, []);
  return (
    <Paper
      elevation={0}
      sx={{ width: "100%", overflow: "hidden", background: "#1F1D2B" }}
    >
      <TableContainer
        sx={{ maxHeight: 490, background: "#1F1D2B", border: "none" }}
      >
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell
                align={"center"}
                style={{ minWidth: 90 }}
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
                {" "}
              </TableCell>
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
            {data?.map((row) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.uid}>
                  <TableCell align='center' sx={{ borderColor: "#69EAE2" }}>
                    <IconButton sx={{ padding: "8px 3px" }}>
                      <Box
                        component={"img"}
                        src={"/images/edit.svg"}
                        sx={{ width: "0.8rem", height: "0.8rem" }}
                      />
                    </IconButton>
                    <IconButton sx={{ padding: "8px 3px" }}>
                      <Box
                        component={"img"}
                        src={"/images/delete.svg"}
                        sx={{ width: "0.8rem", height: "0.8rem" }}
                      />
                    </IconButton>
                  </TableCell>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                      >
                        {value}
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
