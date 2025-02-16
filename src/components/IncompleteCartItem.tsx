"use client";
import { createProduct } from "@/firebase";
import {
  Box,
  Typography,
  InputBase,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { v4 as uuidv4 } from "uuid";
import ImgInputSlidebar from "./inputIMGSlidebar";

const IncompleteCartItem = ({
  setSelectedItems,
  facturaActiva
}: {
  setSelectedItems: any;
  facturaActiva:any;
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
  const [imageBase64, setImageBase64] = useState("");
  const cleanedPrice = Number(incompletedItem.price.replace(/[$,]/g, ""));
  const user = atob(localStorage?.getItem("user") ?? "");

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
        setSelectedItems((prev: any[]) =>
          prev.map((f) =>
            f.id === facturaActiva
              ? {
                  ...f,
                  items: [incompletedItem, ...f.items]
                }
              : f
          )
        );
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
        setTimeout(() => {
          document.getElementById("buscador")?.focus();
        }, 0);
      } else {
        setSelectedItems((prev: any[]) =>
          prev.map((f) =>
            f.id === facturaActiva
              ? {
                  ...f,
                  items: [
                    { ...incompletedItem, barCode: uuidv4() },
                    ...f.items
                  ]
                }
              : f
          )
        );
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
        setTimeout(() => {
          const inputId =
            window.innerWidth > 768 ? "buscador" : "buscardor-responsive";
          document.getElementById(inputId)?.focus();
        }, 0);
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
    <>
      <Typography
        sx={{
          marginTop: "10px",
          fontFamily: "Nunito",
          fontSize: "12px",
          fontWeight: 600,
          lineHeight: "17px",
          letterSpacing: "0em",
          textAlign: "left",
          color: "#69EAE2",
        }}
      >
        AGREGAR PRODUCTO NO REGISTRADO
      </Typography>
      <Box sx={{ marginTop: "10px", display: "flex" }}>
        <Box sx={{ display: "flex", width: "60%" }}>
          <Box
            id="container_img"
            sx={{
              maxWidth: "50px",
              alignSelf: "end",
            }}
          >
            {incompletedItem.barCode.length > 0 ? (
              <Box
                component={"img"}
                src={"/images/noImage.svg"}
                alt={"logo no imagen"}
                sx={{
                  width: { xs: "2.5rem", sm: "37px" },
                  height: { xs: "2.9rem", sm: "37px" },
                }}
              />
            ) : (
              <Box
                component={"img"}
                src={"/images/noImage.svg"}
                alt={"logo no imagen"}
                sx={{
                  width: { xs: "2.5rem", sm: "37px" },
                  height: { xs: "2.9rem", sm: "37px" },
                }}
              />
            )}
          </Box>
          <Box marginLeft={1} sx={{ width: "100%" }}>
            <InputBase
              sx={{
                width: "90%",
                height: { xs: "1rem", sm: "20px" },
                paddingLeft: "5px",
                padding: "0px, 47px, 0px, 10px",
                fontSize: "16px",
              }}
              style={{
                color: "#FFF",
                borderRadius: "0.5rem",
                border: "1px solid  #393C49",
                background: "var(--Base-Form-BG, #2D303E)",
              }}
              placeholder="Producto..."
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
              prefix="$ "
              placeholder="Precio..."
              thousandSeparator
              customInput={InputBase}
              style={{ color: "#FFF" }}
              sx={{
                height: { xs: "1rem", sm: "24px" },
                width: "90%",
                borderRadius: "0.5rem",
                padding: "0",
                border: "1px solid var(--Base-Dark-Line, #393C49)",
                background: "var(--Base-Form-BG, #2D303E)",
                paddingLeft: "5px",
                fontSize: "16px",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "15%",
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          <InputBase
            sx={{
              width: "50px",
              padding: { sm: "6px" },
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
        </Box>
        <Box
          id="count-value"
          sx={{
            width: "25%",
            fontSize: "16px",
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              placeSelf: "center",
              alignSelf: "center",
              textAlign: "center",
            }}
          >
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
      </Box>
      <Box sx={{ display: "flex", marginTop: "10px" }}>
        <Box sx={{ width: "60%" }}>
          <InputBase
            endAdornment={
              <InputAdornment position="end">
                <Box
                  sx={{ height: "15px" }}
                  component={"img"}
                  src={"/images/scan.svg"}
                />
              </InputAdornment>
            }
            onBlur={() => setIncompletedItem({ ...incompletedItem })}
            sx={{
              width: "92%",
              height: { xs: "20px", sm: "24px" },
              fontSize: "16px",
              padding: "0px 7px",
            }}
            style={{
              color: "#FFF",
              borderRadius: "0.5rem",
              border: "1px solid var(--Base-Dark-Line, #393C49)",
              background: "var(--Base-Form-BG, #2D303E)",
            }}
            placeholder="Codigo de barras"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleOnChange(event, "barCode")
            }
            value={incompletedItem.barCode}
          />
        </Box>
        <Box
          id="buttons"
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "40%",
          }}
        >
          <Box sx={{ width: "40%", textAlign: "center" }}>
            <Button
              disabled={!validationDisabled}
              onClick={() => pushIncompletedItem()}
              variant="outlined"
              sx={{
                height: { xs: "35px", sm: "35px" },
                width: { xs: "35px", sm: "35px" },
                minWidth: 0,
                padding: 0,
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
          </Box>
          <Box sx={{ width: "60%", textAlign: "center" }}>
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
              variant="outlined"
              sx={{
                height: { xs: "35px", sm: "35px" },
                width: { xs: "35px", sm: "35px" },
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
      </Box>
    </>
  );
};

export default IncompleteCartItem;
