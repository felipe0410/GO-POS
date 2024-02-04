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
const VenderCard = React.memo(({ filteredData, setSelectedItems, selectedItems, }: { filteredData: any; setSelectedItems: any, selectedItems: any }) => {
  const handleDecrement = (product: any) => {
    const cleanedPrice = Number(product.price.replace(/[$,]/g, ""));
    const existingItem = selectedItems?.find(
      (item: any) => item.barCode === product.barCode
    );
    if (existingItem) {
      if (existingItem.cantidad > 1) {
        const updatedItems = selectedItems?.map((item: any) =>
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
        const updatedItems = selectedItems?.filter(
          (item: any) => item.barCode !== product.barCode
        );
        setSelectedItems(updatedItems);
      }
    }
  }

  const handleIncrement = (product: any) => {
    const cleanedPrice = Number(product.price.replace(/[$,]/g, ""));
    const existingItem = selectedItems?.find(
      (item: any) => item.barCode === product.barCode
    );
    if (existingItem) {
      const updatedItems = selectedItems?.map((item: any) =>
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
      setSelectedItems([newItems, ...selectedItems])
    }
  }

  return filteredData?.map((product: any) => {
    return (
      <Card
        key={product.uid}
        sx={{
          width: { xs: '130px', sm: "190px" },
          maxHeight: "17.52rem",
          borderRadius: "0.32rem",
          background: "#2C3248",
          overflow: "visible",
          textAlign: "-webkit-center",
          marginTop: '50px',
          '&:hover': {
            border: "1px solid #69EAE2"
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
          <Button sx={{ padding: 0, minWidth: 0, minHeight: 0 }} onClick={() => handleDecrement(product)}>
            <Box
              component={"img"}
              src={"/images/minus.svg"}
              sx={{
                width: "30px",
              }}
            />
          </Button>
          <Box
            component={"img"}
            src={["", null].includes(product.image) ? "images/noImage.svg" : product.image}
            alt={`imagen del producto ${product.productName}`}
            sx={{
              width: "60%",
              height: { xs: '70px', sm: '120px' },
              position: "relative",
              top: { xs: '-10px', sm: "-30px" },
              '&:hover': {
                transform: "scale(1.7)"
              },
            }}
            loading="lazy"
          />

          <Button sx={{ padding: 0, minWidth: 0, minHeight: 0 }} onClick={() => handleIncrement(product)}>
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
            marginTop: { xs: '-10px', sm: '-35px' },
            padding: '5px',
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
              fontSize: { xs: '10px', sm: "14px" },
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
              fontSize: { xs: '10px', sm: "14px" },
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
              fontSize: { xs: '10px', sm: "14px" },
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
            }}
          >
            Existencias: <span style={{ fontWeight: '700', color: '#fff' }}>{product.cantidad}</span>
          </Typography>
          <Typography
            sx={{
              color: "#ABBBC2",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: { xs: '10px', sm: "14px" },
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
})

VenderCard.displayName = 'VenderCard';

export default VenderCard