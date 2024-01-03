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

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setfilter] = useState<any>();
  const [data, setData] = useState<undefined | any[]>(undefined);

  console.log(data);

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
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
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
              {/* <IconButton
                  sx={{
                    marginTop: "2px",
                    paddingTop: "0px",
                    marginBottom: "4px",
                    paddingBottom: "0px",
                  }}
                >
                  <Box component={"img"} src={"/images/scan.svg"} />
                </IconButton> */}
            </Paper>
          </Box>
          <Box>
            <InvoicesTable filteredData={filter} />
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default Invoices;
