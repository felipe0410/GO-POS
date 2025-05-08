"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  "&:last-child": {
    paddingBottom: "5px",
  },
}));

const VenderCard = React.memo(
  ({
    filteredData,
    setSelectedItems,
    selectedItems,
    facturaActiva,
  }: {
    filteredData: any;
    setSelectedItems: any;
    selectedItems: any;
    facturaActiva: any;
  }) => {
    const actualizarProductosFactura = (id: string, nuevosProducto: any) => {
      setSelectedItems((prev: any[]) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                items: (f.items || [])
                  .map((item: any) =>
                    item.barCode === nuevosProducto.barCode
                      ? {
                          ...item,
                          cantidad: nuevosProducto.cantidad,
                          acc:
                            nuevosProducto.cantidad *
                            Number(
                              nuevosProducto.price.replace(/[^0-9.-]+/g, "")
                            ),
                        }
                      : item
                  )
                  .concat(
                    (f.items || []).some(
                      (item: any) => item.barCode === nuevosProducto.barCode
                    )
                      ? []
                      : [
                          {
                            ...nuevosProducto,
                            acc:
                              nuevosProducto.cantidad *
                              Number(
                                nuevosProducto.price.replace(/[^0-9.-]+/g, "")
                              ),
                          },
                        ]
                  ),
              }
            : f
        )
      );
    };

    const handleDecrement = (product: any) => {
      const cleanedPrice = Number(product.price.replace(/[$,]/g, ""));
      const existingItem = selectedItems?.find(
        (item: any) => item.barCode === product.barCode
      );
      if (existingItem) {
        const updatedCantidad = existingItem.cantidad - 1;
        if (updatedCantidad > 0) {
          actualizarProductosFactura(facturaActiva, {
            ...existingItem,
            cantidad: updatedCantidad,
            acc: updatedCantidad * cleanedPrice,
          });
        } else {
          const updatedItems = selectedItems?.filter(
            (item: any) => item.barCode !== product.barCode
          );
          setSelectedItems(updatedItems);
        }
      }
    };

    const handleIncrement = (product: any) => {
      const cleanedPrice = Number(product.price.replace(/[$,]/g, ""));
      const existingItem = selectedItems?.find(
        (item: any) => item.barCode === product.barCode
      );
      const updatedCantidad = existingItem ? existingItem.cantidad + 1 : 1;
      actualizarProductosFactura(facturaActiva, {
        ...product,
        cantidad: updatedCantidad,
        acc: updatedCantidad * cleanedPrice,
      });
    };

    return filteredData?.map((product: any) => {
      return (
        <Card
          key={product.uid}
          sx={{
            width: { xs: "130px", sm: "190px" },
            maxHeight: "17.52rem",
            borderRadius: "0.32rem",
            background: "#2C3248",
            overflow: "visible",
            textAlign: "-webkit-center",
            marginTop: "50px",
            "&:hover": {
              border: "1px solid #69EAE2",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              zIndex: 4,
            }}
          >
            <Button
              sx={{ padding: 0, minWidth: 0, minHeight: 0 }}
              onClick={() => handleDecrement(product)}
            >
              <Box
                component={"img"}
                src={"/images/minus.svg"}
                sx={{
                  width: "30px",
                }}
              />
            </Button>
            <Box
              sx={{
                position: "relative",
                width: "60%",
                height: { xs: "70px", sm: "120px" },
                top: { xs: "-10px", sm: "-30px" },
              }}
            >
              <Box
                component="img"
                src={
                  ["", null].includes(product.image)
                    ? "images/noImage.svg"
                    : product.image
                }
                alt={`imagen del producto ${product.productName}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter:
                    product.cantidad === 0
                      ? "grayscale(100%) brightness(0.5)"
                      : "none",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.7)",
                  },
                }}
                loading="lazy"
              />

              {product.cantidad === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    // backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  Producto agotado
                </Box>
              )}
            </Box>

            <Button
              sx={{ padding: 0, minWidth: 0, minHeight: 0 }}
              onClick={() => handleIncrement(product)}
            >
              <Box
                component={"img"}
                src={"/images/plus.svg"}
                sx={{
                  width: "30px",
                }}
              />
            </Button>
          </Box>
          <StyledCardContent
            sx={{
              marginTop: { xs: "-10px", sm: "-35px" },
              padding: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#69EAE2",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "10px", sm: "14px" },
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "130%",
              }}
            >
              {product.productName}
            </Typography>
            <Typography
              sx={{
                marginTop: "1px",
                color: "var(--text-light, #ABBBC2)",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "13px",
                fontStyle: "normal",
                fontWeight: 200,
                lineHeight: "140%",
              }}
            >
              {product.barCode}
            </Typography>
            <Typography
              sx={{
                marginTop: "2px",
                color: "var(--White, #FFF)",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "10px", sm: "14px" },
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "140%",
              }}
            >
              {product.price}
            </Typography>
            <Typography
              sx={{
                marginTop: "1px",
                color: "var(--text-light, #ABBBC2)",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "10px", sm: "14px" },
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
              }}
            >
              Existencias:{" "}
              <span style={{ fontWeight: "700", color: "#fff" }}>
                {product.cantidad}
              </span>
            </Typography>
            <Typography
              sx={{
                color: "#ABBBC2",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "10px", sm: "14px" },
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
              }}
            >
              {product.category}
            </Typography>
          </StyledCardContent>
        </Card>
      );
    });
  }
);

VenderCard.displayName = "VenderCard";

export default VenderCard;
