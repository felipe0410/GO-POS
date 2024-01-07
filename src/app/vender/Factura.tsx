import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import React, { useEffect, useRef, useState } from "react";
import { getEstablishmentData, getInvoiceData } from "@/firebase";
import { DocumentData } from "firebase/firestore";
import JsBarcode from "jsbarcode";
import { useReactToPrint } from "react-to-print";

interface TuComponenteProps {
  setReciboPago: (arg0: boolean) => void;
  setSelectedItems: (arg0: []) => void;
  setNextStep: (arg0: boolean) => void;
}

const Factura: React.FC<TuComponenteProps> = (props) => {
  const numeroFactura = localStorage.getItem("invoice");
  const [facturaData, setFacturaData] = useState<null | DocumentData>(null);
  const { setReciboPago, setSelectedItems, setNextStep } = props;
  const [establishmentData, setEstablishmentData] = useState({
    phone: "",
    NIT_CC: "",
    email: "",
    nameEstablishment: "",
    name: "",
    direction: "",
  });
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
  useEffect(() => {
    saveDataToLocalStorage('selectedItems', [])
  }, [])

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
        <Button
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
          TAMAÑO CARTA
        </Button>
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
        id='factura'
        sx={{
          margin: "0 auto",
          width: "100%",
          height: "100%",
          backgroundImage: 'url("images/factura.svg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "bootom",
          filter: "brightness(1.2)",
        }}
      >
        <Box>
          <Box
            ref={componentRef}
            sx={{
              filter: "brightness(1.2)",
              maxWidth: "22.25rem",
              padding: "10px",
              background: '#fff',
              '@media print': {
                "@page": {
                  size: `${componentRef?.current?.clientWidth}px ${componentRef?.current?.clientHeight * 1.1
                    }px`,
                },
                width: "100%",
              },
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
                  {establishmentData?.nameEstablishment?.toUpperCase() ?? ""}
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
                    fontSize: "0.8rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "140%",
                  }}
                >
                  NIT:{establishmentData.NIT_CC}
                </Typography>
                <Typography
                  sx={{
                    color: "#000",
                    fontSize: "0.8rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "140%",
                  }}
                >
                  CELULAR:{establishmentData.phone}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "#000",
                  textAlign: "center",
                  fontSize: "0.8rem",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                }}
              >
                {establishmentData.direction}
              </Typography>
            </Box>
            <Box padding={1}>
              <Typography
                sx={{
                  color: "#000",
                  fontSize: "0.8rem",
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
                  borderTop: "solid",
                }}
              >
                <Typography
                  sx={{
                    color: "#000",
                    fontSize: "0.8rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "140%",
                  }}
                >
                  {facturaData?.date}
                </Typography>
                <Typography
                  sx={{
                    width: '60%',
                    color: "#000",
                    fontSize: "0.85rem",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "140%",
                  }}
                >
                  VENDEDOR:{" "}
                  <span
                    style={{
                      color: "#000",
                      fontSize: "0.8rem",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "140%",
                    }}
                  >
                    {establishmentData.name}
                  </span>
                </Typography>
              </Box>
              <Divider sx={{ color: "#000" }} />
              <Box>
                <Box
                  sx={{
                    borderTop: "solid",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#000",
                      fontSize: "0.8rem",
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
                        fontSize: "0.8rem",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "140%",
                      }}
                    >
                      {facturaData?.cliente.name}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000",
                      fontSize: "0.8rem",
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
                        fontSize: "0.8rem",
                        fontStyle: "normal",
                        fontWeight: 700,
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
                      fontSize: "0.8rem",
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
                        fontSize: "0.8rem",
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
                      fontSize: "0.8rem",
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
                        fontSize: "0.8rem",
                        fontStyle: "normal",
                        fontWeight: 700,
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
                    fontSize: "0.8rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "140%",
                    marginTop: "3px",
                  }}
                >
                  EMAIL:{" "}
                  <span
                    style={{
                      color: "#000",
                      fontSize: "0.8rem",
                      fontStyle: "normal",
                      fontWeight: 700,
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
                  fontSize: "0.8rem",
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
                    fontSize: "0.7rem",
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
                    fontSize: "0.7rem",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "140%",
                    marginLeft: "75px",
                  }}
                >
                  UND
                </Typography>
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "center",
                    fontSize: "0.7rem",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "140%",
                    marginRight: "5px",
                  }}
                >
                  $VALOR
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
                        fontSize: "0.8",
                        fontStyle: "normal",
                        fontWeight: 700,
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
                        fontSize: "0.8",
                        fontStyle: "normal",
                        fontWeight: 700,
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
                        fontSize: "0.8",
                        fontStyle: "normal",
                        fontWeight: 700,
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
                  borderTop: "solid"
                }}
              >
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "center",
                    fontSize: "1rem",
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
                    fontSize: "1rem",
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
                    fontSize: "1rem",
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
                    fontSize: "1rem",
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
                    fontSize: "1rem",
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
                    fontSize: "1rem",
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
