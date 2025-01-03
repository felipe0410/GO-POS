"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  InputBase,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "debounce";
import { getInvoicesDian } from "@/firebase/dian";
import DateFilter from "./DateFilter";
import InvoiceTable from "./InvoiceTable";
import Header from "@/components/Header";

const InvoiceViewer = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | string[]>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoices = await getInvoicesDian();
        setData(invoices || []);
        setFilteredData(invoices || []);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  const handleSearchChange = debounce((term: string) => {
    setSearchTerm(term);
    filterData(term);
  }, 300);

  const filterData = (term: string | string[]) => {
    const lowerTerm = typeof term === "string" ? term.toLowerCase() : "";

    const filtered = data.filter((invoice) => {
      const { cliente, document_number, status, date } = invoice;

      // Asegurarse de que `date` exista antes de intentar usar `split`
      const fecha = typeof date === "string" ? date.split(" ")[0] : "";

      if (Array.isArray(term)) {
        const [startDate, endDate] = term;
        return fecha >= startDate && fecha <= endDate;
      }

      return (
        cliente?.name?.toLowerCase().includes(lowerTerm) ||
        String(document_number).includes(lowerTerm) ||
        String(status).toLowerCase().includes(lowerTerm)
      );
    });

    setFilteredData(filtered);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box>
      <Header title="FACTURAS DIAN" />
      <Paper
        sx={{
          alignItems: "center",
          padding: "0.5rem",
          marginBottom: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "0.625rem",
          background: "#1F1D2B",
          boxShadow: "0px 1px 100px -50px #69EAE2",
          marginTop: "20px",
          width: "95%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            background: "#fff",
            borderRadius: "10px",
            width: "50%",
          }}
        >
          <IconButton>
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Buscar por cliente, número de factura o estado"
            fullWidth
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <DateFilter
            onFilter={(dates: string | string[]) => filterData(dates)}
          />
        </Box>

        <InvoiceTable data={paginatedData} />

        <Pagination
          count={Math.ceil(filteredData.length / itemsPerPage)}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          shape="circular"
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
            color: "#fff",
            filter: "invert(1)"
          }}
        />
      </Paper>
    </Box>
  );
};

export default InvoiceViewer;
