import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import React from "react";
import { CColumnsCustomers } from "../../utils/constants";
import { ITableCustomerComponentProps } from "../../utils/interfaces";
import ButtonAddCustomers from "../buttons/addCustomers";

const TableCustomerComponent = ({
  filteredData,
  setFilteredData,
}: ITableCustomerComponentProps) => {
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
        <TableContainer
          sx={{
            maxHeight: "100%",
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
              {filteredData.length > 0 ? (
                filteredData.map((row: any) => {
                  return <>SE ESPERA LLENAR ESTA TABLA</>;
                })
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: "50%",
                    left: { xs: "15%", sm: "45%" },
                    gap: "20px",
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
                  <ButtonAddCustomers setAddCustomer={setFilteredData} />
                </Box>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TableCustomerComponent;
