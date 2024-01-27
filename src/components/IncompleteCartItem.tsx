"use client";
import { IMG_DEFAULT } from "@/data/inputs";
import { createIncompletedItems, createProduct } from "@/firebase";
import { Box, Typography, InputBase, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { v4 as uuidv4 } from 'uuid';

const IncompleteCartItem = ({
  setSelectedItems,
}: {
  setSelectedItems: any;
}) => {
  const [incompletedItem, setIncompletedItem] = useState({
    productName: "",
    price: "",
    cantidad: 0,
    acc: 0,
    barCode: "",
    category: "",
    measurement: "",
    description: "",
    image: "",
    purchasePrice: "",
  });

  const cleanedPrice = Number(incompletedItem.price.replace(/[$,]/g, ""));

  const validationDisabled =
    incompletedItem.acc > 0 && incompletedItem.productName.length > 0;
  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const validationParseInt = parseInt(event.target.value);
    const validation =
      field === "cantidad"
        ? Number.isNaN(validationParseInt)
          ? ""
          : validationParseInt
        : event.target.value;
    setIncompletedItem({ ...incompletedItem, [field]: validation });
  };

  const pushIncompletedItem = async () => {
    try {
      if (incompletedItem.barCode) {
        setSelectedItems((prevData: any) => [incompletedItem, ...prevData]);
        await createProduct(incompletedItem.barCode, incompletedItem);
        setIncompletedItem({
          productName: "",
          price: "",
          cantidad: 0,
          acc: 0,
          barCode: "",
          category: "",
          measurement: "",
          description: "",
          image: "",
          purchasePrice: "",
        });
      } else {

        setSelectedItems((prevData: any) => [{ ...incompletedItem, barCode: uuidv4() }, ...prevData]);
        setIncompletedItem({
          productName: "",
          price: "",
          cantidad: 0,
          acc: 0,
          barCode: "",
          category: "",
          measurement: "",
          description: "",
          image: "",
          purchasePrice: "",
        });
      }
    } catch (error) {
      console.error("error al agregar items incompleto", error);
    }
  };
  useEffect(() => {
    setIncompletedItem((prevData) => ({
      ...prevData,
      acc: cleanedPrice * incompletedItem.cantidad,
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
            width: { xs: "2.5rem", sm: "3rem" },
            height: { xs: "2.9rem", sm: "3rem" },
          }}
        />
        <Box marginLeft={1} sx={{ width: { xs: "43%", sm: "163.200px" } }}>
          <InputBase
            sx={{
              width: "90%",
              height: { xs: "1rem", sm: "1.3rem" },
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
              height: { xs: "1rem", sm: "1.5rem" },
              width: "90%",
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
            padding: { sm: "0.5rem" },
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
          onBlur={() =>
            setIncompletedItem({ ...incompletedItem })
          }
          sx={{
            width: { xs: "55%", sm: "12.27rem" },
            height: { xs: "2rem", sm: "3rem" },
            padding: "1rem",
          }}
          style={{
            color: "#FFF",
            borderRadius: "0.5rem",
            border: "1px solid var(--Base-Dark-Line, #393C49)",
            background: "var(--Base-Form-BG, #2D303E)",
          }}
          placeholder='Codigo de barras'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleOnChange(event, "barCode")
          }
          value={incompletedItem.barCode}
        />
        <Button
          disabled={!validationDisabled}
          onClick={() => pushIncompletedItem()}
          variant='outlined'
          sx={{
            height: { xs: "2rem", sm: "3rem" },
            width: { xs: "2rem", sm: "3rem" },
            minWidth: 0,
            padding: 0,
            marginLeft: { xs: "20px", sm: "1.6rem" },
            filter: validationDisabled ? "invert(0)" : "invert(50%)",
          }}
          style={{
            borderRadius: "0.5rem",
            border: "1px solid var(--Accents-Red, #69EAE2)",
          }}
        >
          <Box
            sx={{ width: "50%" }}
            component={"img"}
            src={"/images/okay.svg"}
          />
        </Button>
        <Button
          onClick={() =>
            setIncompletedItem({
              productName: "",
              price: "",
              cantidad: 0,
              acc: 0,
              barCode: "",
              category: "",
              measurement: "",
              description: "",
              image: "",
              purchasePrice: "",
            })
          }
          variant='outlined'
          sx={{
            height: { xs: "2rem", sm: "3rem" },
            width: { xs: "2rem", sm: "3rem" },
            minWidth: 0,
            padding: 0,
            marginLeft: { xs: "2rem", sm: "1.6rem" },
          }}
          style={{
            borderRadius: "0.5rem",
            border: "1px solid var(--Accents-Red, #FF7CA3)",
          }}
        >
          <Box
            sx={{ width: "50%" }}
            component={"img"}
            src={"/images/deletePink.svg"}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default IncompleteCartItem;
