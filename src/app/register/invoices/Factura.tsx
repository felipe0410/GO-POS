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
            <Box>
              <Box
                sx={{
                  maxHeight: "60px",
                  display:
                    establishmentData?.img?.length > 0 ? "block" : "none",
                }}
                component={"img"}
                src={establishmentData.img}
              />
            </Box>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Typography sx={facturaStyles.typographyTitle}>
                {establishmentData.nameEstablishment}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginBottom: "10px",
              }}
            >
              <Typography sx={facturaStyles.typographyNIT}>
                <span style={{ fontWeight: 900 }}>NIT</span>
                {`${establishmentData.NIT_CC}`}
              </Typography>
            </Box>
            <Typography sx={facturaStyles.typographyNIT}>
              <span style={{ fontWeight: 900 }}>CELULAR</span>{" "}
              {`${establishmentData.phone}`}
            </Typography>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={facturaStyles.typographyVenta}>
                Venta # {data.invoice}
              </Typography>
              <Typography sx={facturaStyles.typographyVenta}>
                {data?.date}
              </Typography>
            </Box>
            <Typography sx={facturaStyles.typographyVendedor}>
              VENDEDOR:{" "}
              <span style={facturaStyles.typographySpan}>
                {establishmentData.name}
              </span>
            </Typography>
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
                    {data?.cliente?.name ?? ""}
                  </span>
                </Typography>
              </Box>
              <Typography
                sx={{
                  ...facturaStyles.typographyVendedor,
                  marginTop: "8px",
                }}
              >
                CC/NIT:{" "}
                <span style={facturaStyles.typographySpan}>
                  {data?.cliente?.identificacion ?? ""}
                </span>
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
                    ...facturaStyles.typographyVendedor,
                    marginTop: "3px",
                  }}
                >
                  DIRECCION:{" "}
                  <span style={facturaStyles.typographySpan}>
                    {data?.cliente?.direccion ?? ""}
                  </span>
                </Typography>
              </Box>
              <Typography
                sx={{
                  ...facturaStyles.typographyVendedor,
                  marginTop: "3px",
                }}
              >
                CELULAR:{" "}
                <span style={facturaStyles.typographySpan}>
                  {data?.cliente?.celular ?? ""}
                </span>
              </Typography>
              <Typography
                sx={{
                  ...facturaStyles.typographyVendedor,
                  marginTop: "3px",
                }}
              >
                EMAIL:{" "}
                <span style={facturaStyles.typographySpan}>
                  {data?.cliente?.email ?? ""}
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
                  marginLeft: "30px",
                }}
              >
                UND
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
                  fontWeight: 900,
                  fontSize: "0.85rem",
                }}
              >
                {`$ ${
                  data?.cambio > 0 ? data?.cambio?.toLocaleString("en-US") : 0
                }`}
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
            <Box
              sx={{ textAlign: "center", marginTop: "1.5rem", width: "100%" }}
            >
              <svg style={{ width: "100%" }} id="barcode"></svg>
            </Box>
            <Divider sx={{ background: "#000", marginTop: "20px" }} />
            <Typography sx={{ color: "#000", fontWeight: 700 }}>
              Nombre:
            </Typography>
            <Typography sx={{ color: "#000", fontWeight: 700 }}>
              Cedula:
            </Typography>
          </Box>
          <Typography align="center" sx={facturaStyles.typographyVenta}>
            {`Generado con GO-POS cel:3144098591`}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Factura;
