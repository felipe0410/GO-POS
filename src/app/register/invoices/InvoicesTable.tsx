import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, IconButton, Chip } from "@mui/material";
import FacturaModal from "./FacturaModal";
import EditInvoice from "./EditInvoice";
import DeleteFacturaModal from "./DeleteFacturaModal";
import ModalInvoiceLetter from "./modalInvoiceLetter";

interface Column {
  id: "iconos" | "clientName" | "invoice" | "date" | "hora" | "estado" | "total";
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
    id: "total",
    label: "TOTAL",
    minWidth: 100,
    align: "right",
  },
  {
    id: "estado",
    label: "ESTADO",
    minWidth: 170,
    align: "center",
  },
  {
    id: "estado",
    label: "PAGO",
    minWidth: 170,
    align: "center",
  },
];

export default function InvoicesTable({
  filteredData,
  setEditInvoice,
}: {
  filteredData: any;
  setEditInvoice: any;
}) {
  const [rowData, setRowData] = useState({});
  const [editingInvoice, setEditingInvoice] = useState(false);
  const newDataObject = (row: any) => {
    setRowData(row);
    setEditingInvoice(true);
    setEditInvoice(true);
  };

  const today = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [day, month, year] = today.split("/");
  const formattedToday = `${year}/${month}/${day}`;

  return (
    <>
      {editingInvoice ? (
        <EditInvoice
          rowData={rowData}
          setEditInvoice={setEditInvoice}
          setEditingInvoice={setEditingInvoice}
        />
      ) : (
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflow: "hidden",
            background: "#1F1D2B",
            height: "95%",
            marginTop: "1em",
          }}
        >
          <TableContainer
            sx={{ maxHeight: "100%", background: "#1F1D2B", border: "none" }}
          >
            <Table stickyHeader aria-label="sticky table">
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
                {filteredData?.map((row: any, index: number) => {
                  const [date, hora] = row.date.split(" ");
                  const newDate = date.replaceAll("-", "/");

                  const paymentMethod = row.paymentMethod?.toUpperCase() || "EFECTIVO";

                  const paymentColors: Record<string, string> = {
                    EFECTIVO: "success",      // verde
                    TRANSFERENCIA: "primary", // azul
                    NEQUI: "secondary",       // morado
                    TARJETA: "warning",       // naranja
                  };

                  const chipColor = paymentColors[paymentMethod] || "default";
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row?.uid ?? `invoice-${index}`}
                    >
                      <TableCell align="center" sx={{ borderColor: "#69EAE2" }}>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          {JSON.parse(localStorage.getItem("dataUser") ?? "{}")
                            .status === "admin" && (
                              <>
                                <IconButton
                                  sx={{ padding: "8px 3px" }}
                                  onClick={() => newDataObject(row)}
                                >
                                  <Box
                                    component={"img"}
                                    src={"/images/edit.svg"}
                                    sx={{ width: "1rem", height: "1rem" }}
                                  />
                                </IconButton>
                                <DeleteFacturaModal data={row} />
                              </>
                            )}
                          <FacturaModal data={row} />
                          <ModalInvoiceLetter data={row} />
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                        align="left"
                      >
                        {newDate === formattedToday ? (
                          <Chip
                            label={row?.cliente?.name ?? "xxx"}
                            color="success"
                            variant="filled"
                          />
                        ) : (
                          row?.cliente?.name ?? "xxx"
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                        align="center"
                      >
                        {row?.invoice?.toLowerCase().includes("venta-rapida") ||
                          row?.invoice?.toLowerCase().includes("vr") ? (
                          <Chip
                            label={row?.invoice ?? "xxxx"}
                            color="warning" // 🟡 Amarillo para destacar
                            variant="filled"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              maxWidth: "150px",        // 👈 límite de ancho
                              whiteSpace: "normal",     // 👈 permite saltos de línea
                              wordBreak: "break-word",  // 👈 corta palabras largas
                              textAlign: "center",      // 👈 centra el texto
                              lineHeight: 1.2,          // 👌 mejor altura de línea
                            }}
                          />
                        ) : (
                          row?.invoice ?? "xxxx"
                        )}
                      </TableCell>

                      <TableCell
                        sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                        align="center"
                      >
                        {newDate}
                      </TableCell>
                      <TableCell
                        sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                        align="center"
                      >
                        {hora}
                      </TableCell>
                      <TableCell
                        sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                        align="right"
                      >
                        ${row?.total?.toLocaleString() ?? "0"}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            row.status === undefined ||
                              row.status.toLowerCase() === "cancelado"
                              ? "#00C52B"
                              : "#FF0404",
                          borderColor: "#69EAE2",
                        }}
                        align="center"
                      >
                        {row?.status ? row.status.toUpperCase() : "CANCELADO"}
                      </TableCell>
                      <TableCell sx={{ borderColor: "#69EAE2" }} align="center">
                        <Chip
                          label={paymentMethod}
                          color={chipColor as "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info"}
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
}
