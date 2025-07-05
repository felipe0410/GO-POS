"use client";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import React from "react";
import { facturaStyles } from "./styles";
import JsBarcode from "jsbarcode";
import { getEstablishmentData, handleGuardarDevolucion } from "@/firebase";
import { NumericFormat } from "react-number-format";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { usePathname } from "next/navigation";

const Factura = ({
  data,
  setFacturaData,
  setSelectedInvoice,
}: {
  data: any;
  setFacturaData: (value: any) => void;
  setSelectedInvoice?: ((value: any) => void) | any;
}) => {
  const pathname = usePathname();
  const [establishmentData, setEstablishmentData] = React.useState({
    phone: "",
    NIT_CC: "",
    email: "",
    nameEstablishment: "",
    name: "",
    direction: "",
    img: "",
  });

  React.useEffect(() => {
    if (data.invoice)
      JsBarcode("#barcode", data.invoice, {
        width: data.invoice.includes("venta-rapida") ? 1 : 2,
      });
  }, [data.invoice]);
  React.useEffect(() => {
    const dataEstablesimente = async () => {
      const data: any = await getEstablishmentData();
      if (data !== null) {
        setEstablishmentData(data);
      }
    };
    dataEstablesimente();
  }, []);
  const formatCurrency = (value: number) => `${value?.toLocaleString("en-US")}`;

  return (
    <>
      <SnackbarProvider />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          display: pathname?.startsWith("/vender") ? "block" : "none",
          mt: 2,
          backgroundColor: "#007128",
          color: "#fff",
          fontWeight: 900,
        }}
        onClick={async () => {
          try {
            await handleGuardarDevolucion(data);
            enqueueSnackbar("Valor guardado con éxito", {
              variant: "success",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
            }); { }
            if (setSelectedInvoice) {
              setSelectedInvoice(null)
            }
          } catch (error) {
            enqueueSnackbar("Hubo un error al guardar la devolución", {
              variant: "error",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
            });
          }
        }}
      >
        Confirmar devolución
      </Button>

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
            Venta : {data.invoice}
          </Typography>
          <Typography sx={facturaStyles.typographyVenta}>
            {data.date}
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
            CLIENTE: {data?.cliente?.name}
          </Typography>
          <Typography sx={facturaStyles.typographyVendedor}>
            CC/NIT: {data?.cliente?.identificacion}
          </Typography>
          <Typography sx={facturaStyles.typographyVendedor}>
            DIRECCIÓN: {data?.cliente?.direccion}
          </Typography>
          <Typography sx={facturaStyles.typographyVendedor}>
            CELULAR: {data?.cliente?.celular}
          </Typography>
          <Typography sx={facturaStyles.typographyVendedor}>
            EMAIL: {data?.cliente?.email}
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
              {data?.compra?.map((item: any, index: number) => {
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
                    {/* <TableCell align="right">
                      <NumericFormat
                        value={item.descuento ?? 0}
                        onValueChange={({ value }) => {
                          const descuento = parseInt(value || "0", 10);
                          const nuevaCompra = [...data.compra];
                          nuevaCompra[index].descuento = descuento;

                          const nuevoSubtotal = nuevaCompra.reduce((acc, p) => {
                            const u = p.acc / (p.cantidad > 0 ? p.cantidad : 1);
                            const total = u * p.cantidad - (p.descuento ?? 0);
                            return acc + total;
                          }, 0);

                          setFacturaData((prev: any) => ({
                            ...prev,
                            compra: nuevaCompra,
                            subtotal: nuevoSubtotal,
                            total: nuevoSubtotal - (prev.descuento ?? 0),
                          }));
                        }}
                        customInput={TextField}
                        thousandSeparator
                        prefix="$"
                        variant="standard"
                        sx={{
                          width: 100,
                          input: {
                            textAlign: "right",
                            fontWeight: 500,
                            color: "#000",
                          },
                        }}
                      />
                    </TableCell> */}
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

        {data?.Devolucion?.length > 0 && (
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
                color: "#000", // color rojizo para diferenciarlo
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
                  {data?.Devolucion.map((item: any, index: number) => {
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
          <Typography>{formatCurrency(data.subtotal)}</Typography>
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
            value={data?.descuento ?? 0}
            onValueChange={(values) => {
              const { value } = values;

              if (setFacturaData) {
                const descuento = parseInt(value || "0", 10);
                const totalCalculado = Math.max(
                  0,
                  (data?.subtotal ?? 0) - descuento
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
          <Typography>{formatCurrency(data?.cambio ?? 0)}</Typography>
        </Box>
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
            {formatCurrency(data.total)}
          </Typography>
        </Box>

        {/* Nota */}
        {data.nota?.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography
              sx={{
                background: "#8080804d",
                marginTop: "#000 solid",
                display: data?.nota?.length > 0 ? "flex" : "none",
                color: "#000",
                fontSize: "0.8rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "140%",
                justifyContent: "space-between",
              }}
            >
              Nota: <span style={{ fontWeight: 500 }}>{data.nota}</span>
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
  );
};

export default Factura;
