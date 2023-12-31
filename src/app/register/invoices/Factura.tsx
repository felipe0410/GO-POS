"use client";
import { Box, Typography, Divider } from "@mui/material";
import React from "react";
import { facturaStyles } from "./styles";
import JsBarcode from "jsbarcode";
import { getEstablishmentData } from "@/firebase";

const Factura = ({ data }: { data: any }) => {
  const [establishmentData, setEstablishmentData] = React.useState({
    phone: "",
    NIT_CC: "",
    email: "",
    nameEstablishment: "",
    name: "",
    direction: "",
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
          backgroundColor: "#FFF",
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
              <Typography sx={facturaStyles.typographyTitle}>
                {establishmentData.nameEstablishment}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Typography sx={facturaStyles.typographyNIT}>
                {`NIT ${establishmentData.NIT_CC}`}
              </Typography>
              <Typography sx={facturaStyles.typographyNIT}>
                {`CELULAR ${establishmentData.phone}`}
              </Typography>
            </Box>
            <Typography
              sx={{
                ...facturaStyles.typographyNIT,
                textAlign: "center",
              }}
            >
              {establishmentData.direction}
            </Typography>
          </Box>
          <Box padding={1}>
            <Typography sx={facturaStyles.typographyVenta}>
              Venta # {data.invoice}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={facturaStyles.typographyVenta}>
                {data?.date}
              </Typography>
              <Typography sx={facturaStyles.typographyVendedor}>
                VENDEDOR:{" "}
                <span style={facturaStyles.typographySpan}>
                  {establishmentData.name}
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
                    ...facturaStyles.typographyVendedor,
                    marginTop: "8px",
                  }}
                >
                  CLIENTE:{" "}
                  <span style={facturaStyles.typographySpan}>
                    {data?.cliente.name}
                  </span>
                </Typography>
                <Typography
                  sx={{
                    ...facturaStyles.typographyVendedor,
                    marginTop: "8px",
                  }}
                >
                  CC/NIT:{" "}
                  <span style={facturaStyles.typographySpan}>
                    {data?.cliente.identificacion}
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
                    ...facturaStyles.typographyVendedor,
                    marginTop: "3px",
                  }}
                >
                  DIRECCION:{" "}
                  <span style={facturaStyles.typographySpan}>
                    {data?.cliente.direccion}
                  </span>
                </Typography>
                <Typography
                  sx={{
                    ...facturaStyles.typographyVendedor,
                    marginTop: "3px",
                  }}
                >
                  CELULAR:{" "}
                  <span style={facturaStyles.typographySpan}>
                    {data?.cliente.celular}
                  </span>
                </Typography>
              </Box>
              <Typography
                sx={{
                  ...facturaStyles.typographyVendedor,
                  marginTop: "3px",
                }}
              >
                EMAIL:{" "}
                <span style={facturaStyles.typographySpan}>
                  {data?.cliente.email}
                </span>
              </Typography>
            </Box>
            <Divider sx={{ color: "#000", marginTop: "8px" }} />
            <Typography
              sx={{
                ...facturaStyles.typographyResumenCompra,
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
              <Typography sx={facturaStyles.typographyResumenCompra}>
                PRODUCTO
              </Typography>
              <Typography
                sx={{
                  ...facturaStyles.typographyResumenCompra,
                  marginLeft: "75px",
                }}
              >
                CANTIDAD
              </Typography>
              <Typography
                sx={{
                  ...facturaStyles.typographyResumenCompra,
                  marginRight: "5px",
                }}
              >
                PRECIO
              </Typography>
            </Box>
            <Box mt={1}>
              {data?.compra.map((product: any) => (
                <Box
                  key={product.barCode}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={facturaStyles.typographyProduct}>
                    {product.productName}
                  </Typography>
                  <Typography sx={facturaStyles.typographyCantidad}>
                    {product.cantidad}
                  </Typography>
                  <Typography sx={facturaStyles.typographyACC}>
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
              <Typography sx={facturaStyles.typographyResumenCompra}>
                Sub Total
              </Typography>
              <Typography sx={facturaStyles.typographyVenta}>
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
              <Typography sx={facturaStyles.typographyVenta}>
                {`$ ${data?.descuento.toLocaleString("en-US")}`}
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
                Total
              </Typography>
              <Typography sx={facturaStyles.typographyVenta}>
                {`$ ${data?.total.toLocaleString("en-US")}`}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", marginTop: "1.5rem" }}>
              <svg id='barcode'></svg>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Factura;
