"use client";
import { Box, Typography, Divider } from "@mui/material";
import React from "react";
import { facturaStyles } from "./styles";
import JsBarcode from "jsbarcode";
import { getEstablishmentData } from "@/firebase";

const InvoiceLetter = ({ data }: { data: any }) => {
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
    if (data.invoice) JsBarcode("#barcode", data.invoice);
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

  return (
    <>
      <Box
        sx={{
          height: "100%",
          minWidth: "100%",
          backgroundColor: "#FFF",
        }}
      >
        <Box
          sx={{
            padding: "10px",
            marginTop: "1rem",
            // marginLeft: '50px',
            // marginRight: 'auto'
          }}
        >
          <Box
            sx={{
              textAlign: "-webkit-center",
              padding: "10px",
              marginTop: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ width: { xs: "50%", sm: "40%", md: "40%" } }}>
                <Box
                  sx={{
                    maxHeight: "60px",
                    display:
                      establishmentData?.img?.length > 0 ? "block" : "none",
                    margin: "0 auto",
                  }}
                  component={"img"}
                  src={establishmentData.img}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={facturaStyles.typographyTitle}>
                    {establishmentData.nameEstablishment}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    background: "#1e1e1e",
                    height: "2px",
                    width: "100%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.3rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      marginBottom: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        ...facturaStyles.typographyNIT,
                        fontSize: "14px",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>NIT: </span>
                      {`${establishmentData.NIT_CC}`}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      ...facturaStyles.typographyNIT,
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>CELULAR: </span>{" "}
                    {`${establishmentData.phone}`}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    ...facturaStyles.typographyNIT,
                    marginTop: "-7px",
                    marginBottom: "0.18rem",
                    textAlign: "left",
                    fontSize: "14px",
                  }}
                >
                  {establishmentData.direction}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: "60px",
                    fontWeight: 800,
                    lineHeight: "57.56px",
                    color: "#69EAE2",
                    textShadow: "0px 0px 20px #69EAE2",
                    WebkitTextStrokeWidth: "0.5px",
                    WebkitTextStrokeColor: "#221E2C",
                    marginTop: "1.4rem",
                    marginRight: "0.3rem",
                  }}
                >
                  GO
                </Typography>
                <Typography
                  sx={{
                    top: "88px",
                    left: "486px",
                    gap: "0px",
                    opacity: "0px",
                    color: "#1F1D2B",
                    fontFamily: "Nunito",
                    fontSize: "14px",
                    fontWeight: 800,
                    lineHeight: "15.4px",
                    textAlign: "center",
                  }}
                >
                  FACTURA
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box padding={1}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={facturaStyles.typographyVenta}
                style={{ fontSize: "13px", fontWeight: "700" }}
              >
                Venta # {data.invoice}
              </Typography>
              <Typography
                sx={facturaStyles.typographyVenta}
                style={{ fontSize: "13px", fontWeight: "700" }}
              >
                {data?.date}
              </Typography>
            </Box>
            <Typography
              sx={facturaStyles.typographyVendedor}
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "-19px",
                fontSize: "12px",
              }}
            >
              VENDEDOR:{" "}
              <span
                style={{
                  paddingLeft: "7px",
                  fontSize: "14px",
                  fontWeight: "400",
                  marginTop: "-1px",
                }}
              >
                {establishmentData.name}
              </span>
            </Typography>
            <Divider
              sx={{ background: "#69EAE2", marginTop: "0.3rem", height: "2px" }}
            />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                width: "70%",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    ...facturaStyles.typographyVendedor,
                    marginTop: "10px",
                  }}
                >
                  CLIENTE:{" "}
                  <span
                    style={{
                      paddingLeft: "2px",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    {data?.cliente?.name ?? "xxx"}
                  </span>
                </Typography>
              </Box>
              <Typography
                sx={{
                  ...facturaStyles.typographyVendedor,
                  marginTop: "10px",
                }}
              >
                CC/NIT:{" "}
                <span
                  style={{
                    paddingLeft: "2px",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  {data?.cliente?.identificacion ?? "xxx"}
                </span>
              </Typography>
              <Box>
                <Typography
                  sx={{
                    ...facturaStyles.typographyVendedor,
                    marginTop: "-15px",
                  }}
                >
                  DIRECCION:{" "}
                  <span
                    style={{
                      paddingLeft: "2px",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    {data?.cliente?.direccion ?? "xxx"}
                  </span>
                </Typography>
              </Box>
              <Typography
                sx={{
                  ...facturaStyles.typographyVendedor,
                  marginTop: "-15px",
                }}
              >
                CELULAR:{" "}
                <span
                  style={{
                    paddingLeft: "2px",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  {data?.cliente?.celular ?? "xxx"}
                </span>
              </Typography>
              <Typography
                sx={{
                  ...facturaStyles.typographyVendedor,
                  marginTop: "-15px",
                }}
              >
                EMAIL:{" "}
                <span
                  style={{
                    paddingLeft: "2px",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  {data?.cliente?.email ?? "xxx"}
                </span>
              </Typography>
            </Box>
            <Box
              mt={1}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundImage: 'url("/images/header-table.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <Typography
                sx={facturaStyles.typographyResumenCompra}
                style={{ color: "#000", width: "40%" }}
              >
                PRODUCTO
              </Typography>
              <Typography
                sx={facturaStyles.typographyResumenCompra}
                style={{ color: "#000", textAlign: "center", width: "15%" }}
              >
                CANTIDAD
              </Typography>
              <Typography
                sx={facturaStyles.typographyResumenCompra}
                style={{ color: "#69EAE2", textAlign: "end", width: "20%" }}
              >
                V. UNITARIO
              </Typography>
              <Typography
                sx={facturaStyles.typographyResumenCompra}
                style={{ color: "#69EAE2", textAlign: "end", width: "25%" }}
              >
                PRECIO TOTAL
              </Typography>
            </Box>

            <Box
              mt={1}
              sx={{
                paddingBottom: "2rem",
              }}
            >
              {data?.compra?.map((product: any) => {
                const valorUnitario = product.acc / product.cantidad;

                return (
                  <Box
                    key={product.barCode}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={facturaStyles.typographyProduct}
                      style={{ width: "40%" }}
                    >
                      {product.productName}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#000",
                        fontFamily: "Nunito",
                        fontSize: "0.8rem",
                        textAlign: "center",
                        width: "15%",
                      }}
                    >
                      {product.cantidad}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#000",
                        fontFamily: "Nunito",
                        fontSize: "0.8rem",
                        textAlign: "end",
                        width: "20%",
                      }}
                    >
                      {`$ ${valorUnitario.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#000",
                        fontFamily: "Nunito",
                        fontSize: "0.8rem",
                        textAlign: "right",
                        width: "25%",
                      }}
                    >
                      {`$ ${product.acc.toLocaleString("en-US")}`}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Divider
              sx={{ background: "#000", marginTop: "8px", height: "2px" }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              <Typography sx={facturaStyles.typographyResumenCompra}>
                Sub Total
              </Typography>
              <Typography
                sx={facturaStyles.typographyVenta}
                style={{ fontSize: "0.8rem", marginRight: "1.5rem" }}
              >
                {`$ ${data?.subtotal.toLocaleString("en-US")}`}
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
              <Typography sx={facturaStyles.typographyResumenCompra}>
                Descuento
              </Typography>
              <Typography
                sx={facturaStyles.typographyVenta}
                style={{ fontSize: "0.8rem", marginRight: "1.5rem" }}
              >
                {`$ ${data?.descuento?.toLocaleString("en-US") ?? 0}`}
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
              <Typography sx={facturaStyles.typographyResumenCompra}>
                cambio
              </Typography>
              <Typography
                sx={{
                  ...facturaStyles.typographyVenta,
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  marginRight: "1.5rem",
                }}
              >
                {`$ ${data?.cambio > 0 ? data?.cambio?.toLocaleString("en-US") : 0
                  }`}
              </Typography>
            </Box>
            {data?.vrMixta && (
              <Box
                sx={{
                  color: '#000',
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "10px",
                  padding: "10px",
                  background: "#828181",
                  borderRadius: "8px",
                  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  sx={{
                    color: "#f0f8ff",
                    fontWeight: 900,
                    fontSize: "1.2rem",
                    marginBottom: "5px",
                    textTransform: 'uppercase'
                  }}
                >
                  Detalle de pagos mixtos
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "3px",
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>Efectivo:</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    $ {data.vrMixta.efectivo?.toLocaleString("en-US")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>Transferencia:</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    $ {data.vrMixta.transferencia?.toLocaleString("en-US")}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "3px",
                marginRight: "1.5rem",
              }}
            >
              <Typography sx={facturaStyles.typographyResumenCompra}>
                Total
              </Typography>
              <Typography
                sx={facturaStyles.typographyVenta}
                style={{ fontSize: "0.8rem" }}
              >
                {`$ ${data?.total.toLocaleString("en-US")}`}
              </Typography>
            </Box>
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
              <span style={{ fontWeight: 900 }}>Nota:</span>{" "}
              {`${data?.nota ?? ""}`}
            </Typography>
            <Box sx={{ textAlign: "center", marginTop: "1.5rem" }}>
              <svg id="barcode"></svg>
            </Box>
          </Box>
          <Typography align="center" sx={facturaStyles.typographyVenta}>
            {`Generado con GO-POS cel:3144098591`}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default InvoiceLetter;
