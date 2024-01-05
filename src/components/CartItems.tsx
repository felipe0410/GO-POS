import { Box, Typography, InputBase, Button } from "@mui/material";
import React from "react";

const CartItems = ({
  product,
  setSelectedItems,
  selectedItems,
}: {
  product: any;
  setSelectedItems: any;
  selectedItems: any;
}) => {
  const handleDelete = (product: any) => {
    const updatedItems = selectedItems.filter(
      (item: any) => item.barCode !== product.barCode
    );
    setSelectedItems(updatedItems);
  };

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    product: any
  ) => {
    setSelectedItems((prevSelectedItems: any) => {
      const updatedItems = prevSelectedItems.map((item: any) =>
        item.barCode === product.barCode
          ? { ...item, nota: event.target.value }
          : item
      );
      return updatedItems;
    });
  };

  const handleChange = (
    event: any,
    product: any
  ) => {
    const numericValue = Number(product.price.replace(/[^0-9.-]+/g, ''));
    setSelectedItems((prevSelectedItems: any) => {
      const updatedItems = prevSelectedItems.map((item: any) =>
        item.barCode === product.barCode
          ? { ...item, acc: (event.target.value * numericValue), cantidad: (event?.target?.value > 0 ? parseInt(event?.target?.value ?? 0) : 0) }
          : item
      );
      return updatedItems;
    });
  };

  return (
    <Box sx={{ marginTop: "1.31rem" }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box
          component={"img"}
          src={
            product.image === undefined ? "/images/noImage.svg" : product.image
          }
          alt={`imagen del producto ${product.productName}`}
          sx={{
            width: "3rem",
            height: "3rem",
          }}
        />
        <Box marginLeft={1}>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito",
              fontSize: "0.875rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              width: { xs: '7.5rem', sm: "10.2rem" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.productName}
          </Typography>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito",
              fontSize: "0.75rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
            }}
          >
            {product.price}
          </Typography>
        </Box>
        <InputBase
          sx={{
            width: "3rem",
            padding: "0.5rem",
            textAlignLast: "center",
          }}
          style={{
            color: "#FFF",
            borderRadius: "0.5rem",
            border: "1px solid var(--Base-Dark-Line, #393C49)",
            background: "var(--Base-Form-BG, #2D303E)",
          }}
          value={product.cantidad}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(event, product)
          }
          }
        />
        <Typography
          sx={{
            color: "#FFF",
            fontFamily: "Nunito",
            fontSize: "0.75rem",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "140%",
            marginLeft: "1rem",
            alignSelf: "center",
          }}
        >
          {`$ ${product.acc.toLocaleString("en-US")}`}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginTop: "1rem",
        }}
      >
        <InputBase
          sx={{
            width: { xs: '74%', sm: "16.6875rem" },
            height: { xs: '2rem', sm: "3rem" },
            padding: "1rem",
          }}
          style={{
            color: "#FFF",
            borderRadius: "0.5rem",
            border: "1px solid var(--Base-Dark-Line, #393C49)",
            background: "var(--Base-Form-BG, #2D303E)",
          }}
          placeholder='Nota de la orden...'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleOnChange(event, product)
          }
        />
        <Button
          onClick={() => handleDelete(product)}
          variant='outlined'
          sx={{
            height: { xs: '2rem', sm: "3rem" },
            width: { xs: '2rem', sm: "3rem" },
            minWidth: 0,
            padding: 0,
            marginLeft: "1.6rem",
          }}
          style={{
            borderRadius: "0.5rem",
            border: "1px solid var(--Accents-Red, #FF7CA3)",
          }}
        >
          <Box component={"img"} src={"/images/deletePink.svg"} />
        </Button>
      </Box>
    </Box>
  );
};

export default CartItems;
