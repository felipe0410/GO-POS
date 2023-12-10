"use client";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { inputs } from "@/data/inputs";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { NumericFormat } from "react-number-format";
import { Input as BaseInput, InputProps } from "@mui/base/Input";
import { createProduct, getProductsData } from "@/firebase";

const Input = React.forwardRef(function CustomInput(
  props: InputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <BaseInput
      slots={{
        root: RootDiv,
        input: "input",
        textarea: TextareaElement,
      }}
      {...props}
      ref={ref}
    />
  );
});

const RootDiv = styled("div")`
  display: flex;
  max-width: 100%;
`;

const TextareaElement = styled("textarea", {
  shouldForwardProp: (prop) =>
    !["ownerState", "minRows", "maxRows"].includes(prop.toString()),
})(
  ({ theme }) => `
  width: 100%;
  font-family: 'Nunito';
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 0.625rem;
  color: #FFF;
  background: #2C3248;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border: 0;
`
);

export default function NewProduct() {
  const DATA_DEFAULT = {
    productName: "",
    category: "",
    measurement: "",
    price: "",
    barCode: "",
    description: "",
    image: "",
  };
  const [data, setData] = useState({
    productName: "",
    category: "",
    measurement: "",
    price: "",
    barCode: "",
    description: "",
    image: "",
  });

  console.log(data);

  const saveToFirebase = async () => {
    try {
      const existingProduct = await getProductsData(data.barCode);

      if (existingProduct) {
        enqueueSnackbar("El producto ya existe", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        return;
      }
      await createProduct(data.barCode, {
        ...data,
      });
      enqueueSnackbar("Producto guardado con exito", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setData(DATA_DEFAULT);
    } catch (error) {
      enqueueSnackbar("Error al guardar el producto", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  const isNotEmpty = (fields: any) => {
    for (const value in fields) {
      if (
        fields.hasOwnProperty(value) &&
        typeof fields[value] === "string" &&
        fields[value].trim() === ""
      ) {
        return false;
      }
    }
    return true;
  };
  const inputOnChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
      id='container'
    >
      <SnackbarProvider />
      <Paper
        style={{
          borderRadius: "0.625rem",
          background: "#1F1D2B",
          boxShadow: "0px 1px 100px -50px #69EAE2",
        }}
      >
        <Box sx={{ padding: "2rem 3.8rem 2rem 3.4rem" }}>
          <Box id='container-inputs'>
            {inputs.map((input, index) => {
              const style = {
                width: input.width,
                marginTop: "27px",
                marginLeft: {
                  sm:
                    input.width === "45%" && [3, 6].includes(index)
                      ? index === 6
                        ? "30%"
                        : "10%"
                      : "0",
                },
              };
              const styleTypography = {
                color: "#FFF",
                fontFamily: "Nunito",
                fontSize: "1rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                marginBottom: "5px",
              };
              const categorySelect = (
                <Box>
                  <Select
                    onChange={(e: any) =>
                      inputOnChange(input.field, e.target.value)
                    }
                    label='selecciona una opcion'
                    value={data["category"]}
                    sx={{
                      height: "44.9px",
                      width: "100%",
                      borderRadius: "0.625rem",
                      background: "#2C3248",
                      boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    style={{ color: "#FFF" }}
                  >
                    <MenuItem value={"direccion"}>{"direccion"}</MenuItem>
                    <MenuItem value={"oficina"}>{"oficina"}</MenuItem>
                  </Select>
                </Box>
              );
              const measurementSelect = (
                <Box>
                  <Select
                    onChange={(e: any) =>
                      inputOnChange(input.field, e.target.value)
                    }
                    label='selecciona una opcion'
                    value={data["measurement"]}
                    sx={{
                      height: "44.9px",
                      width: "100%",
                      borderRadius: "0.625rem",
                      background: "#2C3248",
                      boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    style={{ color: "#FFF" }}
                  >
                    <MenuItem value={"direccion"}>{"direccion"}</MenuItem>
                    <MenuItem value={"oficina"}>{"oficina"}</MenuItem>
                  </Select>
                </Box>
              );
              const amountInput = (
                <NumericFormat
                  onChange={(e: any) => {
                    setData((prevData) => ({
                      ...prevData,
                      price: e.target.value,
                    }));
                  }}
                  value={data.price}
                  prefix='$ '
                  thousandSeparator
                  customInput={OutlinedInput}
                  style={{ color: "#FFF" }}
                  sx={{
                    height: "44.9px",
                    borderRadius: "0.625rem",
                    background: "#2C3248",
                    boxShadow:
                      "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                />
              );
              const descriptionInput = (
                <Input
                  multiline={true}
                  rows={3}
                  value={data["description"]}
                  onChange={(e) => inputOnChange("description", e.target.value)}
                />
              );

              const qrBar = (
                <OutlinedInput
                  value={data["barCode"]}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton sx={{ paddingRight: "0px" }}>
                        <Box component={"img"} src={"/images/scan.svg"} />
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(e) => inputOnChange("barCode", e.target.value)}
                  type={"number"}
                  sx={{
                    height: "44.9px",
                    borderRadius: "0.625rem",
                    background: "#2C3248",
                    boxShadow:
                      "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                  style={{ color: "#FFF" }}
                />
              );

              const imgInput = (
                <OutlinedInput
                  value={data["image"]}
                  onChange={(e) => inputOnChange("image", e.target.value)}
                  sx={{
                    width: "7.25rem",
                    height: "6.375rem",
                    borderRadius: "0.625rem",
                    background: "#2C3248",
                    boxShadow:
                      "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                  style={{ color: "#FFF" }}
                />
              );

              return (
                <React.Fragment key={index * 123}>
                  <FormControl sx={style} variant='outlined'>
                    <Typography sx={styleTypography}>{input.name}</Typography>
                    {input.type === "measurement" ? (
                      measurementSelect
                    ) : input.type === "category" ? (
                      categorySelect
                    ) : input.type === "img" ? (
                      imgInput
                    ) : input.type === "amount" ? (
                      amountInput
                    ) : input.type === "textarea" ? (
                      descriptionInput
                    ) : input.type === "qrbar" ? (
                      qrBar
                    ) : (
                      <>
                        <OutlinedInput
                          value={data["productName"]}
                          onChange={(e) =>
                            inputOnChange(input.field, e.target.value)
                          }
                          type={input.type}
                          sx={{
                            height: "44.9px",
                            borderRadius: "0.625rem",
                            background: "#2C3248",
                            boxShadow:
                              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                          }}
                          style={{ color: "#FFF" }}
                        />
                      </>
                    )}
                  </FormControl>
                </React.Fragment>
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "2%",
            }}
          >
            <Button
              onClick={() => saveToFirebase()}
              disabled={!isNotEmpty(data)}
              sx={{
                width: "12.3125rem",
                height: "2.5rem",
                borderRadius: "0.625rem",
                boxShadow:
                  "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                background: !isNotEmpty(data) ? "gray" : "#69EAE2",
              }}
            >
              <Typography
                sx={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: { xs: "0.58rem", sm: "0.875rem" },
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                GUARDAR
              </Typography>
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
