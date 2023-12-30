"use client";
import { createIncompletedItems } from "@/firebase";
import { Box, Typography, InputBase, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

const IncompleteCartItem = ({
  setSelectedItems,
}: {
  setSelectedItems: any;
}) => {
  const [incompletedItem, setIncompletedItem] = useState({
    productName: "",
    price: "",
    nota: "",
    cantidad: 0,
    acc: 0,
    barCode: "",
  });

  const cleanedPrice = Number(incompletedItem.price.replace(/[$,]/g, ""));

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}`;
  };

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    setIncompletedItem({ ...incompletedItem, [field]: event.target.value });
  };

  const pushIncompletedItem = async () => {
    try {
      setSelectedItems((prevData: any) => [incompletedItem, ...prevData]);
      await createIncompletedItems(incompletedItem.barCode, incompletedItem);
      console.log("se guardo con exito con el numero", incompletedItem.barCode);
      setIncompletedItem({
        productName: "",
        price: "",
        nota: "",
        cantidad: 0,
        acc: 0,
        barCode: "",
      });
    } catch (error) {
      console.error("error al agregar items incompletos", error);
    }
  };

  useEffect(() => {
    setIncompletedItem((prevData) => ({
      ...prevData,
      acc: cleanedPrice * incompletedItem.cantidad,
      barCode: getCurrentDateTime(),
    }));
  }, [incompletedItem.cantidad, cleanedPrice]);

  return (
    <Box sx={{ marginTop: "1.31rem" }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box
          component={"img"}
          src={"/images/noImage.svg"}
          alt={"logo no imagen"}
          sx={{
            width: "3rem",
            height: "3rem",
          }}
        />
        <Box marginLeft={1} sx={{ width: "163.200px" }}>
          <InputBase
            sx={{
              width: "8rem",
              height: "1.3rem",
              paddingLeft: "5px",
            }}
            style={{
              color: "#FFF",
              borderRadius: "0.5rem",
              border: "1px solid var(--Base-Dark-Line, #393C49)",
              background: "var(--Base-Form-BG, #2D303E)",
            }}
            placeholder='Producto...'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleOnChange(event, "productName")
            }
            value={incompletedItem.productName}
          />
          <NumericFormat
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleOnChange(event, "price")
            }
            value={incompletedItem.price}
            prefix='$ '
            placeholder='Precio...'
            thousandSeparator
            customInput={InputBase}
            style={{ color: "#FFF" }}
            sx={{
              height: "1.5rem",
              width: "4.3rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--Base-Dark-Line, #393C49)",
              background: "var(--Base-Form-BG, #2D303E)",
              paddingLeft: "5px",
            }}
          />
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleOnChange(event, "cantidad")
          }
          value={incompletedItem.cantidad}
        />
        <Box sx={{ marginLeft: "15px", placeSelf: "center" }}>
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
            {`$ ${incompletedItem.acc.toLocaleString("en-US")}`}
          </Typography>
        </Box>
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
            width: "12.27rem",
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleOnChange(event, "nota")
          }
        />
        <Button
          onClick={() => pushIncompletedItem()}
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
            border: "1px solid var(--Accents-Red, #69EAE2)",
          }}
        >
          <Box component={"img"} src={"/images/okay.svg"} />
        </Button>
        <Button
          //   onClick={() => handleDelete(product)}
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

export default IncompleteCartItem;
