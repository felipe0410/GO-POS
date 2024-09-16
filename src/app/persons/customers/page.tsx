"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { Box, Paper } from "@mui/material";
import FilterCustomersComponent from "./components/filters";
import TableCustomerComponent from "./components/table";
import { CFakerCustomers } from "./utils/constants";
import { IFilteredData } from "./utils/interfaces";

const Customers: any = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IFilteredData[]>([]);

  const handleAddCustomer = () => {
    setFilteredData((prev: any[]) => {
      if (prev.length === 0) {
        return CFakerCustomers;
      } else {
        return [
          ...prev,
          {
            id: prev.length + 1,
            clientName: "Juan Perez",
            type: "Persona",
            numberOfPurchases: 10,
            country: "Colombia",
            actions: ["View", "Edit", "Delete"],
          },
        ];
      }
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "80%",
        marginLeft: "10px",
      }}
    >
      <Box id="conainer_customers" sx={{ width: { xs: "100%", lg: "100%" } }}>
        <Header title="CLIENTES" />
        <Paper
          id={"paper"}
          sx={{ width: "95%", height: "100%", marginTop: "2rem" }}
          style={{
            borderRadius: "0.625rem",
            background: "#1F1D2B",
            boxShadow: "0px 1px 100px -50px #69EAE2",
          }}
        >
          <Box
            sx={{
              padding: "40px 48px",
              height: { xs: "92%", sm: "99%" },
              //   textAlign: "-webkit-center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FilterCustomersComponent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                handleAddCustomer={handleAddCustomer}
              />
              <TableCustomerComponent
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                handleAddCustomer={handleAddCustomer}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Customers;
