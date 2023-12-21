import { Box, Typography, InputBase, Button } from "@mui/material";
import React from "react";

const CartItems = ({ product }: { product: any }) => {
  return (
    <Box sx={{ marginTop: "1.31rem" }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box
          component={"img"}
          src={product.image}
          alt={`imagen del producto ${product.productName}`}
          sx={{
            width: "3rem",
            height: "3rem",
          }}
        />
        <Box>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito",
              fontSize: "0.875rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              width: "10.5rem",
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
        />
        <Typography
          sx={{
            color: "#FFF",
            fontFamily: "Nunito",
            fontSize: "0.75rem",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "140%",
            marginLeft: "1.3rem",
            alignSelf: "center",
          }}
        >
          {product.acc}
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
            width: "16.6875rem",
            height: "3rem",
            padding: "1rem",
          }}
          style={{
            color: "#FFF",
            borderRadius: "0.5rem",
            border: "1px solid var(--Base-Dark-Line, #393C49)",
            background: "var(--Base-Form-BG, #2D303E)",
          }}
          placeholder='Nota de la orden...'
        />
        <Button
          variant='outlined'
          sx={{
            height: "3rem",
            width: "3rem",
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
