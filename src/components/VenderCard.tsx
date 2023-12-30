"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";

export default function VenderCard({
  filteredData,
  setSelectedItems,
  selectedItems,
}: {
  filteredData: any;
  setSelectedItems: any;
  selectedItems: any;
}) {
  const StyledCardContent = styled(CardContent)(({ theme }) => ({
    "&:last-child": {
      paddingBottom: "12px",
    },
  }));

  const handleDecrement = (product: any) => {
    const cleanedPrice = Number(product.price.replace(/[$,]/g, ""));
    const existingItem = selectedItems.find(
      (item: any) => item.barCode === product.barCode
    );
    if (existingItem) {
      if (existingItem.cantidad > 1) {
        const updatedItems = selectedItems.map((item: any) =>
          item.barCode === product.barCode
            ? {
              ...item,
              cantidad: item.cantidad - 1,
              acc: (item.cantidad - 1) * cleanedPrice,
            }
            : item
        );
        setSelectedItems(updatedItems);
      } else {
        const updatedItems = selectedItems.filter(
          (item: any) => item.barCode !== product.barCode
        );
        setSelectedItems(updatedItems);
      }
    }
  };

  const handleIncrement = (product: any) => {
    const cleanedPrice = Number(product.price.replace(/[$,]/g, ""));
    const existingItem = selectedItems.find(
      (item: any) => item.barCode === product.barCode
    );

    if (existingItem) {
      const updatedItems = selectedItems.map((item: any) =>
        item.barCode === product.barCode
          ? {
            ...item,
            cantidad: item.cantidad + 1,
            acc: (item.cantidad + 1) * cleanedPrice,
          }
          : item
      );
      setSelectedItems(updatedItems);
    } else {
      const newItems = {
        image: product.image,
        cantidad: 1,
        productName: product.productName,
        price: product.price,
        nota: "",
        barCode: product.barCode,
        acc: cleanedPrice,
      };
      setSelectedItems([newItems, ...selectedItems]);
    }
  };

  return filteredData?.map((product: any) => {
    return (
      <Card
        key={product.uid}
        sx={{
          width: "15rem",
          maxHeight: "17.52rem",
          borderRadius: "0.32rem",
          background: "#2C3248",
          overflow: "visible",
          textAlign: "-webkit-center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            top: "2.3rem",
            justifyContent: "space-between",
            zIndex: 4,
          }}
        >
          <Button sx={{ padding: 0 }} onClick={() => handleDecrement(product)}>
            <Box
              component={"img"}
              src={"/images/minus.svg"}
              sx={{ width: "2rem", height: "2rem" }}
            />
          </Button>

          <Button sx={{ padding: 0 }} onClick={() => handleIncrement(product)}>
            <Box
              component={"img"}
              src={"/images/plus.svg"}
              sx={{ width: "2rem", height: "2rem" }}
            />
          </Button>
        </Box>
        <Box
          sx={{
            position: "relative",
            height: "8rem",
            marginTop: "-25%",
            overflow: "visible",
          }}
        >
          <Box
            component={"img"}
            src={product.image}
            alt={`imagen del producto ${product.productName}`}
            sx={{
              width: "6.5rem",
              height: "7.5rem",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            loading="lazy"
          />
        </Box>
        <StyledCardContent
          sx={{
            padding: 0,
            width: "12rem",
          }}
        >
          <Typography
            sx={{
              color: "#69EAE2",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: "0.875rem",
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
              fontSize: "0.7rem",
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
              fontSize: "0.875rem",
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
              fontSize: "0.736rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
            }}
          >
            {product.cantidad}
            {product.cantidad === "1"
              ? " Unidad Disponible"
              : " Unidades Disponibles"}
          </Typography>
          <Typography
            sx={{
              color: "#ABBBC2",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: "0.865rem",
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
