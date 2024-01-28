"use client";
import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/material";
import FacturaModal from "./FacturaModal";

interface Column {
  id: "iconos" | "clientName" | "invoice" | "date" | "hora" | "estado";
  label: string;
  minWidth?: number;
  align?: "right" | "center" | "left";
}

const columns: readonly Column[] = [
  {
    id: "clientName",
    label: "NOMBRE DEL CLIENTE",
    minWidth: 170,
    align: "left",
  },
  { id: "invoice", label: "# DE VENTA ", minWidth: 100, align: "right" },
  {
    id: "date",
    label: "FECHA",
    minWidth: 170,
    align: "center",
  },
  {
    id: "hora",
    label: "HORA",
    minWidth: 170,
    align: "center",
  },
  {
    id: "estado",
    label: "ESTADO",
    minWidth: 170,
    align: "center",
  },
];

export default function InvoicesTable({ filteredData }: { filteredData: any }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        background: "#1F1D2B",
        height: "87%",
        marginTop: "1em",
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
            {filteredData?.map((row: any) => {
              const [date, hora] = row.date.split(" ");
              const newDate = date.replaceAll("-", "/");
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.uid}>
                  <TableCell align='center' sx={{ borderColor: "#69EAE2" }}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <FacturaModal data={row} />
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                    align='left'
                  >
                    {row.cliente.name}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                    align='center'
                  >
                    {row.invoice}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                    align='center'
                  >
                    {newDate}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                    align='center'
                  >
                    {hora}
                  </TableCell>
                  <TableCell
                    sx={{
                      color:
                        row.status === undefined || row.status.toLowerCase() === "cancelado"
                          ? "#00C52B"
                          : "#FF0404",
                      borderColor: "#69EAE2",
                    }}
                    align='center'
                  >
                    {row.status ? row.status.toUpperCase() : "CANCELADO"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
