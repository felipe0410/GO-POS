import DatosVenta from "@/app/vender/SlidebarVender/DatosVenta";
import Factura from "@/app/vender/Factura";
import {
  Box,
  IconButton,
  SwipeableDrawer,
  Badge,
  BadgeProps,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Mark from "mark.js";
import Header from "../SlidebarVender/Header";
import ProductList from "../SlidebarVender/ProductList";
import DiscountSection from "../SlidebarVender/DiscountSection";
import TotalSection from "../SlidebarVender/TotalSection";
import { getAllInvoicesData, getNextInvoiceNumber } from "@/firebase";
import SubtotalSection from "../SlidebarVender/SubtotalSection";
import NoteSection from "../SlidebarVender/NoteSection";
import SearchSection from "../SlidebarVender/SearchSection";
import InvoicePreviewModal from "./InvoicePreview";

const SlidebarVender = ({
  selectedItems,
  setSelectedItems,
  searchTerm,
  filteredData,
  setSearchTerm,
  typeInvoice,
  facturaActiva,
}: {
  selectedItems: any;
  setSelectedItems: any;
  searchTerm: any;
  filteredData: any;
  setSearchTerm: any;
  typeInvoice: string;
  facturaActiva: any;
}) => {
  const [search, setSearch] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [nextStep, setNextStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reciboPago, setReciboPago] = useState(false);
  const [agregarDescuento, setAgregarDescuento] = useState(false);
  const [descuentoON, setDescuentoON] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [dataInvoice, setDataInvoice] = useState([]);
  const [nota, setNota] = useState("");
  const [checked, setChecked] = useState<boolean>(false);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState({
    lastNumber: "00001",
    nextNumber: "00002"
  })
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    matchesSM ? setChecked(false) : setChecked(true);
  }, [matchesSM]);

  useEffect(() => {
    const nuevoSubtotal = (selectedItems ?? []).reduce(
      (total: number, producto: { acc: number }) => total + producto.acc,
      0
    );
    setSubtotal(nuevoSubtotal);
  }, [selectedItems]);

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      padding: "0 4px",
    },
  }));

  const totalUnidades = useMemo(() => {
    return selectedItems?.reduce(
      (sum: number, item: any) => sum + item.cantidad,
      0
    );
  }, [selectedItems]);


  const handleVenderClick = useCallback(() => {
    setContadorFactura((prevContador) => {
      const newContador = prevContador + 1;
      localStorage.setItem("contadorFactura", newContador.toString());
      return newContador;
    });
    setNota("");
    setDescuento(0)
  }, []);

  const storedContadorFactura = localStorage.getItem("contadorFactura");
  const initialContadorFactura = storedContadorFactura
    ? parseInt(storedContadorFactura, 10)
    : 1;

  const [contadorFactura, setContadorFactura] = useState(
    Math.max(initialContadorFactura, dataInvoice.length + 1)
  );

  const calcularTotal = useCallback(() => {
    const value = inputValue?.trim() || "0";

    const valorSinPorcentaje = value.includes("%")
      ? Math.ceil((parseFloat(value.replace("%", "")) / 100) * subtotal)
      : parseFloat(value) || 0;

    setDescuento(valorSinPorcentaje);
    setDescuentoON(true);
  }, [inputValue, subtotal]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    const context: any = document.querySelector("#items-list");
    const instance = new Mark(context);
    instance.unmark({
      done: () => {
        instance.mark(keyword);
      },
    });
    setSearch(keyword);
  };

  const fetchNextInvoiceNumber = async () => {
    try {
      const data = await getNextInvoiceNumber();
      setNextInvoiceNumber(data);
    } catch (error) {
      console.error("Error al obtener número de factura:", error);
    }
  };

  useEffect(() => {
    fetchNextInvoiceNumber();
  }, [loading]);



  return (
    <Box display={"flex"}>
      <IconButton
        sx={{
          position: "absolute",
          top: "20px",
          right: "30px",
        }}
        onClick={() => setOpen(true)}
        aria-label="cart"
      >
        <StyledBadge
          badgeContent={totalUnidades}
          sx={{ color: "#fff" }}
          color="error"
        >
          <ShoppingCartIcon />
        </StyledBadge>
      </IconButton>
      <SwipeableDrawer
        open={open}
        id="drawer"
        variant={matchesSM ? "persistent" : "permanent"}
        anchor="right"
        PaperProps={{
          style: {
            background: "transparent",
            border: "none",
            width: !matchesSM ? "510px" : "95%",
          },
        }}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Box
          sx={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            position: "absolute",
            paddingTop: "8px",
            paddingBottom: "8px",
            background: "#1F1D2B",
            height: "100%",
            overflow: "hidden",
            top: 0,
            right: 0,
            width: { xs: "100%", sm: "50%", lg: "24rem" },
            borderRadius: "10px 0px 0px 10px",
          }}
        >
          <Header
            setOpen={setOpen}
            generarNumeroFactura={nextInvoiceNumber.nextNumber}
            totalUnidades={totalUnidades}
          />
          <Box sx={{ position: "absolute", top: { xs: 8, lg: 40 }, left: 12 }}>
            <InvoicePreviewModal selectedItems={selectedItems} />
          </Box>
          <Box
            id="principal container"
            padding={3}
            sx={{ height: "92%", width: "100%", overflow: "auto" }}
          >
            {reciboPago ? (
              <Factura
                setReciboPago={setReciboPago}
                setSelectedItems={setSelectedItems}
                setNextStep={setNextStep}
                typeInvoice={typeInvoice}
                facturaActiva={facturaActiva}
              />
            ) : (
              <>
                <SearchSection
                  search={search}
                  setSearch={setSearch}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  handleSearch={handleSearch}
                  filteredData={filteredData}
                  checked={checked}
                  setChecked={setChecked}
                  matchesSM={matchesSM}
                  setNextStep={setNextStep}
                  nextStep={nextStep}
                  descuento={descuento}
                  subtotal={subtotal}
                />
                {nextStep ? (
                  <DatosVenta
                    total={subtotal - descuento}
                    selectedItems={selectedItems}
                    subtotal={subtotal}
                    descuento={descuento}
                    setLoading={setLoading}
                    loading={loading}
                    setReciboPago={setReciboPago}
                    reciboPago={reciboPago}
                    numeroFactura={nextInvoiceNumber.nextNumber}
                    handleVenderClick={handleVenderClick}
                    propsNota={nota}
                    typeInvoice={typeInvoice}
                    setSelectedItems={setSelectedItems}
                  />
                ) : (
                  <>
                    <ProductList
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                      facturaActiva={facturaActiva}
                    />
                    <SubtotalSection
                      subtotal={subtotal}
                      descuento={descuento}
                    />
                    <DiscountSection
                      agregarDescuento={agregarDescuento}
                      setAgregarDescuento={setAgregarDescuento}
                      descuentoON={descuentoON}
                      setDescuentoON={setDescuentoON}
                      descuento={descuento}
                      setDescuento={setDescuento}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      calcularTotal={calcularTotal}
                    />
                    <NoteSection nota={nota} setNota={setNota} />
                    <TotalSection
                      subtotal={subtotal}
                      descuento={descuento}
                      setNextStep={setNextStep}
                    />
                  </>
                )}
              </>
            )}
          </Box>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default SlidebarVender;
