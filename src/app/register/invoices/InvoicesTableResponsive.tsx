import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FacturaModal from "./FacturaModal";

export default function InvoicesTableResponsive({
  filteredData,
  setEditInvoice,
}: {
  filteredData: any;
  setEditInvoice: any;
}) {
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        background: "#1F1D2B",
        height: { xs: "80%", sm: "90%" },
      }}
    >
      <TableContainer
        sx={{ maxHeight: "100%", background: "#1F1D2B", border: "none" }}
      >
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell
                align={"left"}
                style={{ minWidth: 75 }}
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
                NOMBRE DEL CLIENTE
              </TableCell>
              <TableCell
                align={"left"}
                style={{ minWidth: 75 }}
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
                # DE VENTA
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.map((row: any) => {
              const [date, hora] = row.date.split(" ");
              const newDate = date.replaceAll("-", "/");
              return (
                <React.Fragment key={row.uid}>
                  <TableRow>
                    <TableCell sx={{ borderColor: "#69EAE2" }}>
                      <IconButton
                        aria-label='expand row'
                        size='small'
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === row.uid ? null : row.uid
                          )
                        }
                      >
                        {expandedRow === row.uid ? (
                          <KeyboardArrowUpIcon sx={{ color: "#69EAE2" }} />
                        ) : (
                          <KeyboardArrowDownIcon sx={{ color: "#69EAE2" }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell
                      component='th'
                      scope='row'
                      sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                    >
                      {row.cliente.name}
                    </TableCell>
                    <TableCell
                      align='left'
                      sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                    >
                      {row.invoice}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={expandedRow === row.uid}
                        timeout='auto'
                        unmountOnExit
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align={"center"}
                                style={{ minWidth: 75 }}
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
                                FECHA
                              </TableCell>
                              <TableCell
                                align={"center"}
                                style={{ minWidth: 75 }}
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
                                HORA
                              </TableCell>
                              <TableCell
                                align={"center"}
                                style={{ minWidth: 75 }}
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
                                ESTADO
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableRow>
                            <TableCell
                              align='center'
                              sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                            >
                              {newDate}
                            </TableCell>
                            <TableCell
                              align='center'
                              sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                            >
                              {hora}
                            </TableCell>
                            <TableCell
                              align='center'
                              sx={{
                                color:
                                  row.status === undefined ||
                                  row.status === "cancelado"
                                    ? "#00C52B"
                                    : "#FF0404",
                                borderColor: "#69EAE2",
                              }}
                            >
                              {row.status
                                ? row.status.toUpperCase()
                                : "CANCELADO"}
                            </TableCell>
                          </TableRow>
                        </Table>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <FacturaModal data={row} />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
