import { Box, Divider, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import React, { useEffect, useState } from "react";
import { getInvoiceData } from "@/firebase";
import { DocumentData } from "firebase/firestore";
import JsBarcode from "jsbarcode";

interface TuComponenteProps {
  setReciboPago: (arg0: boolean) => void;
  setSelectedItems: (arg0: []) => void;
  setNextStep: (arg0: boolean) => void;
}

const Factura: React.FC<TuComponenteProps> = (props) => {
  const numeroFactura = localStorage.getItem("invoice");
  const [facturaData, setFacturaData] = useState<null | DocumentData>(null);
  const { setReciboPago, setSelectedItems, setNextStep } = props;

  const setNuevaFactura = () => {
    setReciboPago(false);
    setSelectedItems([]);
    setNextStep(false);
  };

  useEffect(() => {
    const getInvoiceDataFull = async () => {
      try {
        const data = await getInvoiceData(numeroFactura);
        setFacturaData(data);
      } catch (error) {
        console.error("error", error);
      }
    };
    getInvoiceDataFull();
  }, [numeroFactura]);

  useEffect(() => {
    if (numeroFactura)
      JsBarcode("#barcode", numeroFactura, { background: "#D9D9D9" });
  }, [numeroFactura]);

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
      <Box sx={{ width: "22.25rem", height: "44.875rem" }}>
        <Box
          sx={{
            height: "100%",
            backgroundImage: 'url("images/factura.png")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              padding: "10px",
              marginTop: "1rem",
            }}
          >
            <Box
              sx={{
                textAlign: "-webkit-center",
                padding: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "16.1875rem" }}>
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "1.5rem",
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "110%",
                  }}
                >
                  PAPELERIA SANTIAGO
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Typography
                  sx={{
                    color: "#000",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "140%",
                  }}
                >
                  NIT 29129302939
                </Typography>
                <Typography
                  sx={{
                    color: "#000",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "140%",
                  }}
                >
                  CELULAR 3125607423
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "#000",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: "0.75rem",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "140%",
                }}
              >
                Cra 7#5-22 Aquitania, Boyacá
              </Typography>
            </Box>
            <Box padding={1}>
              <Typography
                sx={{
                  color: "#000",
                  fontFamily: "Nunito",
                  fontSize: "0.75rem",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                }}
              >
                Venta # {numeroFactura}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    color: "#000",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "140%",
                  }}
                >
                  {facturaData?.date}
                </Typography>
                <Typography
                  sx={{
                    color: "#000",
                    fontFamily: "Nunito",
                    fontSize: "0.625rem",
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "140%",
                  }}
                >
                  VENDEDOR:{" "}
                  <span
                    style={{
                      color: "#000",
                      fontFamily: "Nunito",
                      fontSize: "0.625rem",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "140%",
                    }}
                  >
                    Santiago x
                  </span>
                </Typography>
              </Box>
              <Divider sx={{ color: "#000" }} />
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#000",
                      fontFamily: "Nunito",
                      fontSize: "0.625rem",
                      fontStyle: "normal",
                      fontWeight: 800,
                      lineHeight: "140%",
                      marginTop: "8px",
                    }}
                  >
                    CLIENTE:{" "}
                    <span
                      style={{
                        color: "#000",
                        fontFamily: "Nunito",
                        fontSize: "0.625rem",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "140%",
                      }}
                    >
                      {facturaData?.cliente.name}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000",
                      fontFamily: "Nunito",
                      fontSize: "0.625rem",
                      fontStyle: "normal",
                      fontWeight: 800,
                      lineHeight: "140%",
                      marginTop: "8px",
                    }}
                  >
                    CC/NIT:{" "}
                    <span
                      style={{
                        color: "#000",
                        fontFamily: "Nunito",
                        fontSize: "0.625rem",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "140%",
                      }}
                    >
                      {facturaData?.cliente.identificacion}
                    </span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#000",
                      fontFamily: "Nunito",
                      fontSize: "0.625rem",
                      fontStyle: "normal",
                      fontWeight: 800,
                      lineHeight: "140%",
                      marginTop: "3px",
                    }}
                  >
                    DIRECCION:{" "}
                    <span
                      style={{
                        color: "#000",
                        fontFamily: "Nunito",
                        fontSize: "0.625rem",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "140%",
                      }}
                    >
                      {facturaData?.cliente.direccion}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000",
                      fontFamily: "Nunito",
                      fontSize: "0.625rem",
                      fontStyle: "normal",
                      fontWeight: 800,
                      lineHeight: "140%",
                      marginTop: "3px",
                    }}
                  >
                    CELULAR:{" "}
                    <span
                      style={{
                        color: "#000",
                        fontFamily: "Nunito",
                        fontSize: "0.625rem",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "140%",
                      }}
                    >
                      {facturaData?.cliente.celular}
                    </span>
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#000",
                    fontFamily: "Nunito",
                    fontSize: "0.625rem",
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "140%",
                    marginTop: "3px",
                  }}
                >
                  EMAIL:{" "}
                  <span
                    style={{
                      color: "#000",
                      fontFamily: "Nunito",
                      fontSize: "0.625rem",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "140%",
                    }}
                  >
                    {facturaData?.cliente.email}
                  </span>
                </Typography>
              </Box>
              <Divider sx={{ color: "#000", marginTop: "8px" }} />
              <Typography
                sx={{
                  color: "#000",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: "0.75rem",
                  fontStyle: "normal",
                  fontWeight: 900,
                  lineHeight: "140%",
                  marginTop: "1rem",
                }}
              >
                RESUMEN DE COMPRA
              </Typography>
              <Box
                mt={1}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "140%",
                  }}
                >
                  PRODUCTO
                </Typography>
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "140%",
                    marginLeft: "75px",
                  }}
                >
                  CANTIDAD
                </Typography>
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "140%",
                    marginRight: "5px",
                  }}
                >
                  PRECIO
                </Typography>
              </Box>
              <Box mt={1}>
                {facturaData?.compra.map((product: any) => (
                  <Box
                    key={product.barCode}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#000",
                        fontFamily: "Nunito",
                        fontSize: "0.625",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "140%",
                        width: "10.2rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.productName}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#000",
                        textAlign: "center",
                        fontFamily: "Nunito",
                        fontSize: "0.625",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "140%",
                      }}
                    >
                      {product.cantidad}
                    </Typography>
                    <Typography
                      sx={{
                        width: "70px",
                        color: "#000",
                        textAlign: "center",
                        fontFamily: "Nunito",
                        fontSize: "0.625",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "140%",
                      }}
                    >
                      {`$ ${product.acc.toLocaleString("en-US")}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ color: "#000", marginTop: "8px" }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "140%",
                  }}
                >
                  Sub Total
                </Typography>
                <Typography
                  sx={{
                    color: "#000",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "140%",
                  }}
                >
                  {`$ ${facturaData?.subtotal.toLocaleString("en-US")}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "3px",
                }}
              >
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "140%",
                  }}
                >
                  Descuento
                </Typography>
                <Typography
                  sx={{
                    color: "#000",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "140%",
                  }}
                >
                  {`$ ${facturaData?.descuento.toLocaleString("en-US")}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "3px",
                }}
              >
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "140%",
                  }}
                >
                  Total
                </Typography>
                <Typography
                  sx={{
                    color: "#000",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "140%",
                  }}
                >
                  {`$ ${facturaData?.total.toLocaleString("en-US")}`}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", marginTop: "1.5rem" }}>
                <svg id='barcode'></svg>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Factura;
