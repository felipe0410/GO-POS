"use client";
import Header from "@/components/Header";
import { Box, IconButton, InputBase, Paper, Typography } from "@mui/material";
import {
  BoxStyles,
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
  const [searchTerm, setSearchTerm] = useState<any>();
  const [filter, setfilter] = useState<any>();
  const [data, setData] = useState<undefined | any[]>(undefined);
  const [totalVentasHoy, setTotalVentasHoy] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<any>();
  const [totalVentasFecha, setTotalVentasFecha] = useState<number>(0);

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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const filteredData = data?.filter((item) => {
      if (!searchTerm || searchTerm.length === 0) {
        return true;
      }

      const lowerSearchTerm = Array.isArray(searchTerm)
        ? searchTerm[0].toLowerCase()
        : searchTerm.toLowerCase();

      const [fecha, hora] = item?.date.split(" ");

      if (Array.isArray(searchTerm)) {
        const [fechaInicio, fechaFin] = searchTerm;
        return fecha >= fechaInicio && fecha <= fechaFin;
      } else {
        return (
          fecha.includes(lowerSearchTerm) ||
          item.cliente.name.toLowerCase().includes(lowerSearchTerm) ||
          String(item.invoice).toLowerCase().includes(lowerSearchTerm) ||
          String(item.status).toLowerCase().includes(lowerSearchTerm)
        );
      }
    });

    setfilter(filteredData);

    const ventasHoy = data?.filter((item) => {
      const [fecha, hora] = item.date.split(" ");
      const fechaHoy = getCurrentDateTime();
      return fecha === fechaHoy;
    });
    const totalVentas =
      ventasHoy?.reduce((total, factura) => total + factura.total, 0) || 0;

    setTotalVentasHoy(totalVentas);
  }, [data, searchTerm]);

  useEffect(() => {
    const [fechaInicio, fechaFin] = Array.isArray(selectedDate)
      ? selectedDate
      : [selectedDate, selectedDate];

    const facturasEnRango = filter?.filter((item: any) => {
      const [fecha, hora] = item.date.split(" ");
      const fechaFactura = fecha;

      return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
    });

    const totalVentasFechaFilter =
      facturasEnRango?.reduce(
        (total: any, factura: any) => total + factura.total,
        0
      ) || 0;

    setTotalVentasFecha(totalVentasFechaFilter);
  }, [filter, selectedDate]);

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
            padding: { xs: "20px 20px", sm: "40px 48px" },
            height: "100%",
            textAlign: "-webkit-center",
          }}
        >
          <Box
            sx={{
              justifyContent: { lg: "space-between" },
              display: { lg: "flex", md: "block", xs: "block" },
            }}
          >
            <Paper
              component='form'
              onSubmit={(e: any) => {
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
              <DateModal
                setSearchTerm={setSearchTerm}
                setSelectedDate={setSelectedDate}
              />
            </Paper>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: { md: "center", xs: "center" },
                marginTop: { md: "10px", xs: "10px" },
              }}
            >
              <Box sx={{ textAlign: "start", marginRight: "20px" }}>
                <Typography
                  variant='caption'
                  sx={BoxStyles.typographyCaptionStyles}
                >
                  {`Fecha: ${getCurrentDateTime()}`}
                </Typography>
                <Box sx={BoxStyles.boxGreen}>
                  <Typography sx={BoxStyles.typographyBoxStyles}>
                    {`$ ${totalVentasHoy.toLocaleString("en-US")}`}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: "start", minWidth: "5rem" }}>
                <Typography
                  variant='caption'
                  sx={BoxStyles.typographyCaptionStyles}
                >
                  {`Fecha: ${selectedDate ? selectedDate : " "}`}
                </Typography>
                <Box sx={BoxStyles.boxOrange}>
                  <Typography sx={BoxStyles.typographyBoxStyles}>
                    {`$ ${totalVentasFecha.toLocaleString("en-US")}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
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
