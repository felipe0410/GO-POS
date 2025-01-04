import {
  Box,
  Typography,
  InputBase,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";

const CartItems = ({
  product,
  setSelectedItems,
  selectedItems,
}: {
  product: any;
  setSelectedItems: any;
  selectedItems: any;
}) => {
  const [edit, setEdit] = useState(false);
  const saveDataToLocalStorage = (key: string, data: any) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  };

  const handleDelete = (product: any) => {
    const updatedItems = selectedItems.filter(
      (item: any) => item.barCode !== product.barCode
    );
    saveDataToLocalStorage("selectedItems", updatedItems);
    setSelectedItems(updatedItems);
  };

  const calcularTotal = (event: any) => {};

  const handleOnChangePrice = (
    event: React.ChangeEvent<HTMLInputElement>,
    product: any
  ) => {
    setSelectedItems((prevSelectedItems: any) => {
      const cleanString = event.target.value.replace(/[\$,\s]/g, "");
      const numberValue = parseFloat(cleanString);
      const updatedItems = prevSelectedItems.map((item: any) =>
        item.barCode === product.barCode
          ? {
              ...item,
              price: event.target.value,
              acc: (numberValue > 0 ? numberValue : 0) * item.cantidad,
            }
          : item
      );
      return updatedItems;
    });
  };

  const handleChange = (event: any, product: any) => {
    const numericValue = Number(product.price.replace(/[^0-9.-]+/g, ""));
    setSelectedItems((prevSelectedItems: any) => {
      const updatedItems = prevSelectedItems.map((item: any) =>
        item.barCode === product.barCode
          ? {
              ...item,
              acc: Number.isInteger(parseInt(event?.target?.value ?? 0))
                ? event.target.value * numericValue
                : 0,
              cantidad:
                event?.target?.value > 0
                  ? parseInt(event?.target?.value ?? 0)
                  : "",
            }
          : item
      );
      return updatedItems;
    });
  };
  return (
    <Box sx={{ marginTop: "10px" }}>
      <Box display={"flex"}>
        <Box sx={{ width: "60%", display: "flex" }}>
          <Box
            component={"img"}
            src={
              ["", null].includes(product.image)
                ? "/images/noImage.svg"
                : product.image
            }
            alt={`imagen del producto ${product.productName}`}
            sx={{
              width: "37px",
              height: "37px",
            }}
          />
          <Box marginLeft={1} sx={{ width: "100%" }}>
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Nunito",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.productName}
            </Typography>
            <Typography
              width={"70%"}
              sx={{
                color: "#FFF",
                fontFamily: "Nunito",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
              }}
            >
              {edit ? (
                <Box
                  id="container numeric"
                  sx={{
                    display: "flex",
                    height: { xs: "1rem", sm: "1.5rem" },
                    borderRadius: "0.5rem",
                    border: "1px solid var(--Base-Dark-Line, #393C49)",
                    background: "var(--Base-Form-BG, #2D303E)",
                    paddingLeft: "5px",
                  }}
                >
                  <NumericFormat
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleOnChangePrice(event, product)
                    }
                    value={product.price}
                    prefix="$ "
                    placeholder="Precio..."
                    thousandSeparator
                    customInput={InputBase}
                    style={{ color: "#FFF" }}
                  />
                  <IconButton
                    sx={{ paddingRight: "0px", marginRight: "-10px" }}
                    onClick={(event) => calcularTotal(event)}
                  >
                    <IconButton
                      color="secondary"
                      onClick={() => setEdit(false)}
                    >
                      <Box component={"img"} src={"/images/okay.svg"} />
                    </IconButton>
                  </IconButton>
                </Box>
              ) : (
                <>
                  <Typography sx={{ color: "#69EAE2", fontSize: "14px" }}>
                    {product.price}
                    <IconButton
                      sx={{ paddingTop: "2px", paddingRight: "2px" }}
                      onClick={() => {
                        setEdit(true);
                      }}
                    >
                      <Box
                        component={"img"}
                        src={"/images/edit.svg"}
                        sx={{ width: "0.9rem", height: "0.9rem" }}
                      />
                    </IconButton>
                  </Typography>
                </>
              )}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: "40%", display: "flex" }}>
          <Box width={"35%"} sx={{ textAlign: "center" }}>
            <InputBase
              sx={{
                width: { xs: "32px", sm: "50px" },
                padding: { xs: "5px", sm: "6px" },
                textAlignLast: "center",
                fontSize: { xs: "13px", sm: "16px" },
              }}
              style={{
                color: "#FFF",
                borderRadius: "0.5rem",
                border: "1px solid var(--Base-Dark-Line, #393C49)",
                background: "var(--Base-Form-BG, #2D303E)",
              }}
              value={product.cantidad}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(event, product);
              }}
            />
          </Box>
          <Box sx={{ alignSelf: "center" }}>
            <Typography
              sx={{
                alignSelf: "center",
                color: "#FFF",
                fontFamily: "Nunito",
                fontSize: { xs: "13px", sm: "0.75rem" },
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                marginLeft: { sm: "1rem" },
              }}
            >
              {`$ ${product?.acc?.toLocaleString("en-US")}`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box sx={{ width: "73%" }}>
          <InputBase
            sx={{
              width: "100%",
              height: { xs: "17px", sm: "24px" },
              fontSize: "12px",
              padding: "5px",
            }}
            style={{
              color: "#FFF",
              borderRadius: "0.5rem",
              border: "1px solid var(--Base-Dark-Line, #393C49)",
              background: "var(--Base-Form-BG, #2D303E)",
            }}
            placeholder="Codigo de barras"
            value={product.barCode}
          />
        </Box>
        <Box sx={{ width: "23%", display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => handleDelete(product)}
            variant="outlined"
            sx={{
              height: "37px",
              width: "37px",
              minWidth: 0,
              padding: 0,
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
    </Box>
  );
};

export default CartItems;
