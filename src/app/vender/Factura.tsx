import { Box, Button, Divider, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import React, { useEffect, useRef, useState } from "react";
import { getEstablishmentData, getInvoiceData, handleGuardarDevolucion } from "@/firebase";
import { DocumentData } from "firebase/firestore";
import JsBarcode from "jsbarcode";
import { useReactToPrint } from "react-to-print";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { NumericFormat } from "react-number-format";
import { facturaStyles } from "../register/invoices/styles";

interface TuComponenteProps {
  setReciboPago: (arg0: boolean) => void;
  setSelectedItems: any;
  setNextStep: (arg0: boolean) => void;
  typeInvoice: string;
  facturaActiva: any;
}

const Factura: React.FC<TuComponenteProps> = (props) => {
  const barCode = localStorage.getItem("uidInvoice");
  const numeroFactura = localStorage?.getItem("invoice") ?? "0000000";
  const [paperSize, setPaperSize] = useState<"58mm" | "80mm">("58mm");
  const [facturaData, setFacturaData] = useState<null | DocumentData>(null);
  const {
    setReciboPago,
    setSelectedItems,
    setNextStep,
    typeInvoice,
    facturaActiva,
  } = props;
  const [establishmentData, setEstablishmentData] = useState({
    phone: "",
    NIT_CC: "",
    email: "",
    nameEstablishment: "",
    name: "",
    direction: "",
    img: ''
  });

  const cleanfactura = () => {
    setSelectedItems((prevFacturas: any) => {
      const nuevasFacturas = prevFacturas.filter(
        (f: { id: any }) => f.id !== facturaActiva
      );

      // Si hay facturas restantes, activamos la primera de la lista
      if (nuevasFacturas.length > 0) {
        // setFacturaActiva(nuevasFacturas[0].id);
      } else {
        // Si no quedan facturas, creamos una nueva
        const nuevaFactura = {
          id: `factura-1`,
          name: `Factura 1`,
          items: [],
        };
        nuevasFacturas.push(nuevaFactura);
        // setFacturaActiva(nuevaFactura.id);
      }

      return nuevasFacturas;
    });
  }

  const setNuevaFactura = () => {
    setReciboPago(false);
    //setSelectedItems([]);
    // Eliminar la factura activa

    setNextStep(false);
  };

  useEffect(() => {
    const getInvoiceDataFull = async () => {
      try {
        const data = await getInvoiceData(barCode);
        setFacturaData(data);
      } catch (error) {
        console.error("error", error);
      }
    };
    getInvoiceDataFull();
  }, [barCode, numeroFactura]);

  useEffect(() => {
    if (numeroFactura) {
      JsBarcode("#barcode", numeroFactura);
    }
  }, [numeroFactura]);

  useEffect(() => {
    const dataEstablesimente = async () => {
      const data: any = await getEstablishmentData();
      if (data !== null) {
        setEstablishmentData(data);
      }
    };
    dataEstablesimente();
  }, []);

  const componentRef: any = useRef();
  const handlePrint = useReactToPrint({
    content: () => {
      const content = componentRef.current;
      return content;
    },
  });

  const saveDataToLocalStorage = (key: string, data: any) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  };
  const formatCurrency = (value: number) => `${value?.toLocaleString("en-US")}`;
  useEffect(() => {
    typeInvoice === "quickSale" && setNuevaFactura();
    saveDataToLocalStorage("selectedItems", []);
    cleanfactura()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heightPx = componentRef.current?.offsetHeight || 0;
  const mmPerPx = 25.4 / 96; // 1in = 25.4mm, 1in = 96px
  const heightMm = heightPx * mmPerPx;


  return (
    <>
      <IconButton sx={{ paddingLeft: 0 }} onClick={() => setNuevaFactura()}>
        <ChevronLeftIcon sx={{ color: "#69EAE2" }} />
        <Typography
          sx={{
            color: "#69EAE2",
            fontFamily: "Nunito",
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "140%",
          }}
        >
          NUEVA VENTA
        </Typography>
      </IconButton>
      <Box>
        <Typography
          sx={{
            color: "#69EAE2",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "1.25rem",
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "140%",
          }}
        >
          TICKET/FACTURA
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mb: 1,
          }}
        >
          <Button
            sx={{
              width: "45%",
              background: paperSize === "58mm" ? "#69EAE2" : "#ccc",
              color: "#1F1D2B",
              fontWeight: 800,
            }}
            onClick={() => setPaperSize("58mm")}
          >
            58 mm
          </Button>
          <Button
            sx={{
              width: "45%",
              background: paperSize === "80mm" ? "#69EAE2" : "#ccc",
              color: "#1F1D2B",
              fontWeight: 800,
            }}
            onClick={() => setPaperSize("80mm")}
          >
            80 mm
          </Button>
        </Box>

        <Button
          onClick={handlePrint}
          sx={{
            width: "45%",
            background: "#69EAE2",
            color: "#1F1D2B",
            fontFamily: "Nunito",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "140%",
          }}
        >
          IMPRIMIR
        </Button>
      </Box>
      <Box
        sx={{
          marginTop: "20px",
          borderRadius: "8px",
          border: "5px solid #69EAE2",
          background: "#1F1D2B",
          width: "100%",
          height: "30px",
          flexShrink: 0,
          marginBottom: "-15px",
        }}
      />
      <Box
        ref={componentRef}
        id="factura"
        sx={{
          transform:
            paperSize === "58mm"
              ? "scale(0.63)"
              : paperSize === "80mm"
                ? "scale(0.87)"
                : "scale(1)",
          transformOrigin: "top left", // importante para que no desplace
          padding: "10px",
          background: "#fff",
          "@media print": {
            "@page": {
              size: (`${paperSize} ${Math.ceil(heightPx)}px`),
              margin: 0,
            },
            width: "94mm",
          },
        }}
      >

        <>
          <Box sx={{ backgroundColor: "#fff", padding: "0px" }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              {establishmentData.img && (
                <Box
                  component="img"
                  src={establishmentData.img}
                  sx={{ maxHeight: "120px", mb: 1 }}
                />
              )}
              <Typography sx={facturaStyles.typographyTitle}>
                {establishmentData.nameEstablishment}
              </Typography>
              <Typography sx={facturaStyles.typographyNIT}>
                NIT: {establishmentData.NIT_CC}
              </Typography>
              <Typography sx={facturaStyles.typographyNIT}>
                CEL: {establishmentData.phone}
              </Typography>
              <Typography sx={facturaStyles.typographyNIT}>
                {establishmentData.direction}
              </Typography>
            </Box>

            {/* Datos venta */}
            <Box>
              <Typography sx={facturaStyles.typographyVenta}>
                Venta : {facturaData?.invoice ?? 'sin dato'}
              </Typography>
              <Typography sx={facturaStyles.typographyVenta}>
                {facturaData?.date}
              </Typography>
              <Typography
                sx={{
                  ...facturaStyles.typographyVendedor,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  fontSize: "1rem",
                  color: "#000",
                  fontFamily: "system-ui",
                  letterSpacing: "0.00938em",
                }}
              >
                VENDEDOR:{" "}
                <span style={facturaStyles.typographySpan}>
                  {establishmentData.name}
                </span>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography sx={facturaStyles.typographyVendedor}>
                CLIENTE: {facturaData?.cliente?.name}
              </Typography>
              <Typography sx={facturaStyles.typographyVendedor}>
                CC/NIT: {facturaData?.cliente?.identificacion}
              </Typography>
              <Typography sx={facturaStyles.typographyVendedor}>
                DIRECCIÓN: {facturaData?.cliente?.direccion}
              </Typography>
              <Typography sx={facturaStyles.typographyVendedor}>
                CELULAR: {facturaData?.cliente?.celular}
              </Typography>
              <Typography sx={facturaStyles.typographyVendedor}>
                EMAIL: {facturaData?.cliente?.email}
              </Typography>
            </Box>

            {/* Tabla de productos */}
            <Divider sx={{ my: 1 }} />
            <Typography
              sx={{ ...facturaStyles.typographyResumenCompra, textAlign: "center" }}
            >
              RESUMEN DE COMPRA
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table size="small" sx={{ width: "98%", margin: " 0 auto" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 900,
                        textTransform: "uppercase",
                        fontSize: "1rem",
                        color: "#000",
                        fontFamily: "system-ui",
                        letterSpacing: "0.00938em",
                      }}
                    >
                      <b>Detalle</b>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 900,
                        textTransform: "uppercase",
                        fontSize: "1rem",
                        color: "#000",
                        fontFamily: "system-ui",
                        letterSpacing: "0.00938em",
                      }}
                      align="right"
                    >
                      <b>V/Unit</b>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 900,
                        textTransform: "uppercase",
                        fontSize: "1rem",
                        color: "#000",
                        fontFamily: "system-ui",
                        letterSpacing: "0.00938em",
                      }}
                      align="center"
                    >
                      <b>UND</b>
                    </TableCell>
                    {/* <TableCell align="right">
                  <b>Descuento</b>
                </TableCell> */}

                    <TableCell
                      sx={{
                        color: "#000",
                        fontSize: "1rem",
                        fontWeight: 900,
                      }}
                      align="right"
                    >
                      <b>Total</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturaData?.compra?.map((item: any, index: number) => {
                    const unit = item.acc / (item.cantidad > 0 ? item.cantidad : 1);
                    return (
                      <TableRow
                        key={item.barCode}
                        style={{
                          background: index % 2 === 0 ? "#807e7e" : "#FFFFFF",
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            fontSize: "1.1rem",
                            color: "#000",
                            fontFamily: "system-ui",
                            letterSpacing: "0.00938em",
                          }}
                          padding={"none"}
                          size={"small"}
                        // variant={"head"}
                        >
                          {item.productName}
                        </TableCell>
                        <TableCell
                          padding={"none"}
                          size={"small"}
                          // variant={"head"}
                          align="right"
                          sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            fontSize: "1.1rem",
                            color: "#000",
                            fontFamily: "system-ui",
                            letterSpacing: "0.00938em",
                          }}
                        >
                          {item?.unitPrice ?? formatCurrency(unit)}
                        </TableCell>
                        <TableCell
                          padding={"none"}
                          size={"small"}
                          // variant={"head"}
                          align="center"
                          sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            fontSize: "1.1rem",
                            color: "#000",
                            fontFamily: "system-ui",
                            letterSpacing: "0.00938em",
                          }}
                        >
                          {item.cantidad}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            fontSize: "1.1rem",
                            color: "#000",
                            fontFamily: "system-ui",
                            letterSpacing: "0.00938em",
                            padding: '0 15px 0 0'
                          }}
                          padding={"none"}
                          size={"small"}
                          // variant={"head"}
                          align="right"
                        >
                          {formatCurrency(item.acc)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {facturaData?.Devolucion?.length > 0 && (
              <Box
                sx={{
                  background: "gray",
                  padding: "2px",
                }}
              >
                <Divider sx={{ my: 2 }} />
                <Typography
                  sx={{
                    ...facturaStyles.typographyResumenCompra,
                    textAlign: "center",
                    color: "#000",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontSize: "1rem",
                    fontFamily: "system-ui",
                    letterSpacing: "0.00938em",
                  }}
                >
                  DEVOLUCIÓN DE PRODUCTOS
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: "none", background: "gray" }}
                >
                  <Table size="small" sx={{ width: "100%", fontWeight: 900 }}>
                    <TableHead>
                      <TableRow sx={{ fontWeight: 900 }}>
                        <TableCell
                          sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            fontSize: "1rem",
                            color: "#000",
                            fontFamily: "system-ui",
                            letterSpacing: "0.00938em",
                          }}
                        >
                          <b>Detalle</b>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            fontSize: "1rem",
                            color: "#000",
                            fontFamily: "system-ui",
                            letterSpacing: "0.00938em",
                          }}
                          align="right"
                        >
                          <b>V/Unit</b>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            fontSize: "1rem",
                            color: "#000",
                            fontFamily: "system-ui",
                            letterSpacing: "0.00938em",
                          }}
                          align="center"
                        >
                          <b>UND</b>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            fontSize: "1rem",
                            color: "#000",
                            fontFamily: "system-ui",
                            letterSpacing: "0.00938em",
                          }}
                          align="right"
                        >
                          <b>Total</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {facturaData?.Devolucion.map((item: any, index: number) => {
                        const unit = item.acc / item.cantidad;
                        return (
                          <TableRow
                            sx={{
                              fontWeight: 900,
                              textTransform: "uppercase",
                              fontSize: "1rem",
                              color: "#000",
                              fontFamily: "system-ui",
                              letterSpacing: "0.00938em",
                            }}
                            key={item.barCode + "-devolucion-" + index}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 900,
                                textTransform: "uppercase",
                                fontSize: "1rem",
                                color: "#000",
                                fontFamily: "system-ui",
                                letterSpacing: "0.00938em",
                              }}
                            >
                              {item.productName}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 900,
                                textTransform: "uppercase",
                                fontSize: "1rem",
                                color: "#000",
                                fontFamily: "system-ui",
                                letterSpacing: "0.00938em",
                              }}
                              align="right"
                            >
                              {formatCurrency(unit)}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 900,
                                textTransform: "uppercase",
                                fontSize: "1rem",
                                color: "#000",
                                fontFamily: "system-ui",
                                letterSpacing: "0.00938em",
                              }}
                              align="center"
                            >
                              {item.cantidad}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 900,
                                textTransform: "uppercase",
                                fontSize: "1rem",
                                color: "#000",
                                fontFamily: "system-ui",
                                letterSpacing: "0.00938em",
                              }}
                              align="right"
                            >
                              {formatCurrency(item.acc)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Totales */}
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                ...facturaStyles.typographyResumenCompra,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>Subtotal:</Typography>
              <Typography>{formatCurrency(facturaData?.subtotal ?? '0')}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "3px",
              }}
            >
              <Typography
                sx={{
                  color: "#000",
                  fontSize: "1rem",
                  fontWeight: 900,
                }}
              >
                DESCUENTO
              </Typography>

              <NumericFormat
                value={facturaData?.descuento ?? 0}
                onValueChange={(values) => {
                  const { value } = values;

                  if (setFacturaData) {
                    const descuento = parseInt(value || "0", 10);
                    const totalCalculado = Math.max(
                      0,
                      (facturaData?.subtotal ?? 0) - descuento
                    );

                    setFacturaData((prev: any) => ({
                      ...prev,
                      descuento,
                      total: totalCalculado,
                    }));
                  }
                }}
                customInput={TextField}
                thousandSeparator
                prefix="$"
                variant="standard"
                sx={{
                  width: 120,
                  input: {
                    textAlign: "right",
                    fontWeight: 700,
                    color: "#000",
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                ...facturaStyles.typographyResumenCompra,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>Cambio:</Typography>
              <Typography>{formatCurrency(facturaData?.cambio ?? 0)}</Typography>
            </Box>
            {facturaData?.vrMixta && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    background: "#828181",
                    borderRadius: "6px",
                    padding: "6px",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#69EAE2",
                      textAlign: "center",
                      fontSize: "0.95rem",
                      mb: 0.5,
                    }}
                  >
                    Detalle de pagos mixtos
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>Efectivo:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      $ {facturaData.vrMixta.efectivo?.toLocaleString("en-US")}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                      mt: 0.5,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>Transferencia:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      $ {facturaData.vrMixta.transferencia?.toLocaleString("en-US")}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            <Box
              sx={{
                ...facturaStyles.typographyResumenCompra,
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                mt: 1,
              }}
            >
              <Typography>Total:</Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 900,
                }}
              >
                {formatCurrency(facturaData?.total ?? '0')}
              </Typography>
            </Box>

            {/* Nota */}
            {facturaData?.nota?.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography
                  sx={{
                    background: "#8080804d",
                    marginTop: "#000 solid",
                    display: facturaData?.nota?.length > 0 ? "flex" : "none",
                    color: "#000",
                    fontSize: "0.8rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "140%",
                    justifyContent: "space-between",
                  }}
                >
                  Nota: <span style={{ fontWeight: 500 }}>{facturaData?.nota}</span>
                </Typography>
              </>
            )}

            {/* Código de barras */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <svg id="barcode" style={{ width: "100%" }} />
            </Box>

            {/* Pie de página */}
            <Divider sx={{ my: 2 }} />
            <Typography align="center" sx={{ fontSize: "0.75rem", color: "#000" }}>
              Generado con GO-POS - cel: 3144098591
            </Typography>
          </Box>
        </>
      </Box>
    </>
  );
};

export default Factura;
