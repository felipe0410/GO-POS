import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { CColumnsCustomers } from "../../utils/constants";
import {
  IFilteredData,
  ITableCustomerComponentProps,
} from "../../utils/interfaces";
import ButtonAddCustomers from "../buttons/addCustomers";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TableCustomerComponent = ({
  filteredData,
  setFilteredData,
  handleAddCustomer,
}: ITableCustomerComponentProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getColor = (action: string) => {
    if (action === "View") return "#69EAE2";
    if (action === "Edit") return "#FFD700";
    return "#FF0000";
  };

  const tablePaginatorButtons = (subProps: {
    page: number;
    onPageChange: (
      arg0: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      arg1: number
    ) => void;
    count: number;
    rowsPerPage: number;
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginLeft: "5px",
        }}
      >
        <IconButton
          sx={{ color: subProps.page === 0 ? "#A9A9A9" : "#69EAE2" }}
          onClick={(event) => subProps.onPageChange(event, subProps.page - 1)}
          disabled={subProps.page === 0}
          aria-label="previous page"
        >
          {"<"}
        </IconButton>
        <IconButton
          sx={{
            color:
              subProps.page >=
              Math.ceil(subProps.count / subProps.rowsPerPage) - 1
                ? "#A9A9A9"
                : "#69EAE2",
          }}
          onClick={(event) => subProps.onPageChange(event, subProps.page + 1)}
          disabled={
            subProps.page >=
            Math.ceil(subProps.count / subProps.rowsPerPage) - 1
          }
          aria-label="next page"
        >
          {">"}
        </IconButton>
      </Box>
    );
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          marginTop: "1.5em",
          width: "100%",
          overflow: "hidden",
          background: "#1F1D2B",
          height: { xs: "80%", sm: "90%" },
        }}
      >
        {!filteredData.length ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
              gap: "20px",
              top: "50%",
              left: "50%",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "1rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              AUN NO TIENES CLIENTES INSCRITOS
            </Typography>
            <ButtonAddCustomers handleAddCustomer={handleAddCustomer} />
          </Box>
        ) : (
          <>
            <TableContainer
              sx={{
                height: "100%",
                // background: "#1F1D2B",
                border: "none",
              }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  {CColumnsCustomers.map((column) => (
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
                </TableHead>
                <TableBody>
                  {filteredData.length > 0
                    ? filteredData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row: IFilteredData) => {
                          return (
                            <TableRow hover key={row.id}>
                              <TableCell
                                sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                                align="center"
                              >
                                {row.clientName}
                              </TableCell>
                              <TableCell
                                sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                                align="center"
                              >
                                {row.type}
                              </TableCell>
                              <TableCell
                                sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                                align="center"
                              >
                                {row.numberOfPurchases}
                              </TableCell>
                              <TableCell
                                sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                                align="center"
                              >
                                {row.country}
                              </TableCell>
                              <TableCell
                                sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                                align="right"
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                  }}
                                >
                                  {row.actions.map(
                                    (action: string, index: number) => {
                                      return (
                                        <IconButton
                                          key={index + 1}
                                          sx={{
                                            color: getColor(action),
                                          }}
                                          onClick={() => console.log(row)}
                                        >
                                          {action === "View" && (
                                            <VisibilityIcon />
                                          )}
                                          {action === "Edit" && <EditIcon />}
                                          {action === "Delete" && (
                                            <DeleteIcon />
                                          )}
                                        </IconButton>
                                      );
                                    }
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              sx={{ color: "#69EAE2" }}
              rowsPerPageOptions={[6]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={(subProps) => tablePaginatorButtons(subProps)}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default TableCustomerComponent;
