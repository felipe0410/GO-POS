"use client";
import Header from "@/components/Header";
import { Box, IconButton, InputBase, Paper, Typography } from "@mui/material";
import {
  typographyPaperSearch,
  typographySubtitle,
  typographyTitle,
} from "./styles";
import debounce from "debounce";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import InvoicesTable from "./InvoicesTable";
import { getAllInvoicesData } from "@/firebase";
import InvoicesTableResponsive from "./InvoicesTableResponsive";
import DateModal from "./DateModal";

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setfilter] = useState<any>();
  const [data, setData] = useState<undefined | any[]>(undefined);

  const debouncedHandleSearchChange = debounce(() => {}, 300);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event);
    debouncedHandleSearchChange();
  };

  useEffect(() => {
    const getAllInvoices = async () => {
      try {
        await getAllInvoicesData(setData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getAllInvoices();
  }, []);

  useEffect(() => {
    const filteredData = data?.filter((item) => {
      if (searchTerm === "") {
        return true;
      }

      const lowerSearchTerm = searchTerm.toLowerCase();
      const [fecha, hora] = item?.date.split(" ");

      return (
        fecha.includes(lowerSearchTerm) ||
        item.cliente.name.toLowerCase().includes(lowerSearchTerm) ||
        String(item.invoice).toLowerCase().includes(lowerSearchTerm) ||
        String(item.status).toLowerCase().includes(lowerSearchTerm)
      );
    });
    setfilter(filteredData);
  }, [data, searchTerm]);

  return (
    <>
      <Header title='CAJA' />
      <Typography sx={typographyTitle}>FACTURAS</Typography>
      <Typography sx={typographySubtitle}>
        Aqui encontraras las facturas que ya han sido generadas, podras
        editarlas y ver su estado.
      </Typography>
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
            height: "100%",
            textAlign: "-webkit-center",
          }}
        >
          <Box display={"flex"}>
            <Paper
              component='form'
              onSubmit={(e: any) => {
                console.log(e);
                e.preventDefault();
                handleSearchChange(e.target[1].value);
              }}
              sx={typographyPaperSearch}
            >
              <IconButton type='button' sx={{ p: "10px" }} aria-label='search'>
                <SearchIcon sx={{ color: "#fff" }} />
              </IconButton>
              <InputBase
                sx={{
                  ml: 1,
                  flex: 1,
                  color: "#fff",
                }}
                placeholder='Buscar'
                onBlur={(e) => {
                  handleSearchChange(e.target.value);
                  e.preventDefault();
                }}
              />
              <DateModal setSearchTerm={setSearchTerm} />
            </Paper>
          </Box>
          <Box sx={{ marginTop: "1.56rem", height: "100%" }}>
            <Box
              display={{ md: "none", lg: "block", xs: "none" }}
              sx={{ height: "100%" }}
            >
              <InvoicesTable filteredData={filter} />
            </Box>
            <Box
              display={{ lg: "none", md: "block", xs: "block" }}
              sx={{ height: "100%" }}
            >
              <InvoicesTableResponsive filteredData={filter} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default Invoices;
