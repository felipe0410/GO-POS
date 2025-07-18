"use client";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { deleteProduct, getAllProductsData } from "@/firebase";
import { Box, IconButton } from "@mui/material";
import DeleteModal from "../../../components/DeleteModal";
import EditModal from "../../../components/EditModal";

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

export default function StickyHeadTable({
  filteredData,
}: {
  filteredData: any;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        background: "#1F1D2B",
        height: "92%",
      }}
    >
      <TableContainer
        sx={{ maxHeight: "100%", background: "#1F1D2B", border: "none" }}
      >
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell
                align={"center"}
                style={{ minWidth: 75 }}
                sx={{
                  background: "#1F1D2B",
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "0.8rem",
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
                    fontSize: "0.8rem",
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
            {filteredData?.map((row: any) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.uid}>
                  <TableCell align='center' sx={{ borderColor: "#69EAE2" }}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <EditModal data={row} />
                      <DeleteModal data={row} />
                    </Box>
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
