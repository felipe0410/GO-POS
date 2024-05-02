"use client";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { inputs } from "@/data/inputs";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { NumericFormat } from "react-number-format";
import { Input as BaseInput, InputProps } from "@mui/base/Input";
import {
  createProduct,
  getAllCategoriesData,
  getAllMeasurementsDataa,
  getProductData,
} from "@/firebase";
import Calculatorr from "./modalCalculator";
import ImgInput from "./inputIMG";
import Revenue from "@/app/inventory/agregarProductos/revenue";
import GenerateBarCode from "@/app/inventory/agregarProductos/modal/Barcode";

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
    cantidad: "",
    purchasePrice: "",
  };
  const [data, setData] = useState({
    productName: "",
    category: "",
    measurement: "",
    price: "",
    barCode: "",
    description: "",
    image: "",
    cantidad: "",
    purchasePrice: "",
  });
  const [imageBase64, setImageBase64] = useState("");
  const [category, setCategory] = useState<any>([""]);
  const [measure, setMeasure] = useState<any>([""]);
  const [inputValue, setInputValue] = React.useState("");
  const [inputValue2, setInputValue2] = React.useState("");
  const [valueMeasure, setValueMeasure] = React.useState<string | null>(
    measure[0]
  );
  const [valueCategory, setValueCategory] = React.useState<string | null>(
    category[0]
  );

  const saveToFirebase = async () => {
    try {
      await createProduct(data.barCode, {
        ...data,
        image: data.image === "" ? "/images/noImage.svg" : data.image,
      });
      enqueueSnackbar("Producto guardado con exito", {
        variant: "success",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      setData(DATA_DEFAULT);
      setImageBase64("");
      setValueCategory("");
      setValueMeasure("");
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
        value !== "nota" &&
        value !== "image" &&
        value !== "purchasePrice" &&
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

  useEffect(() => {
    const categoriesData = async () => {
      try {
        await getAllCategoriesData(setCategory);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    categoriesData();
  }, []);

  const getDataProductForID = async () => {
    const dataFirebase: any = await getProductData(data.barCode);
    if (dataFirebase !== null) {
      setData(dataFirebase);
      setImageBase64(dataFirebase.image);
    } else {
      setData({ ...DATA_DEFAULT, barCode: data.barCode });
      setImageBase64("");
      setValueCategory("");
      setValueMeasure("");
    }
  };

  const user = atob(localStorage?.getItem("user") ?? "");

  useEffect(() => {
    const measurementsData = async () => {
      try {
        await getAllMeasurementsDataa(setMeasure);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    measurementsData();
  }, []);

  useEffect(() => {
    const dataMeasurement = data?.measurement ?? "";
    const dataCategory = data?.category ?? "";
    if (dataCategory.length > 0 && valueCategory?.length === 0) {
      setValueCategory(dataCategory);
    }
    if (dataMeasurement.length > 0 && valueMeasure?.length === 0) {
      setValueMeasure(dataMeasurement);
    }
  }, [
    data?.category,
    data?.measurement,
    valueCategory?.length,
    valueMeasure?.length,
  ]);

  const getNum = () => {
    const settingsData = localStorage.getItem("settingsData");
    if (settingsData) {
      const settings = JSON.parse(settingsData);
      if (settings.numberOfDigitsToGenerateCode) {
        return settings.numberOfDigitsToGenerateCode;
      }
    }
    return null;
  };

  const generateCode = async (): Promise<string> => {
    const numDigitos: number = await getNum();
    if (numDigitos < 1) {
      throw new Error("El número de dígitos debe ser al menos 1");
    }
    let numeroAleatorio = "";
    numeroAleatorio += Math.floor(Math.random() * 9) + 1;
    for (let i = 1; i < numDigitos; i++) {
      numeroAleatorio += Math.floor(Math.random() * 10);
    }
    setData((prevData) => ({
      ...prevData,
      barCode: numeroAleatorio,
    }));
    return numeroAleatorio;
  };

  return (
    <>
      <SnackbarProvider />
      <Box
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        id="container"
      >
        <Paper
          style={{
            borderRadius: "0.625rem",
            background: "#1F1D2B",
            boxShadow: "0px 1px 100px -50px #69EAE2",
          }}
        >
          <Box sx={{ padding: { xs: "15px", sm: "2rem 3.8rem 2rem 3.4rem" } }}>
            <Box
              id="container-inputs"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {inputs.map((input, index) => {
                const style = {
                  width: input.width,
                  marginTop: "27px",
                  marginLeft: {
                    sm:
                      input.width === "45%" && [3, 6, 8].includes(index)
                        ? index === 8
                          ? "30%"
                          : "10%"
                        : "0",
                  },
                };
                const styleTypography = {
                  color: "#FFF",
                  fontFamily: "Nunito",
                  fontSize: { xs: "10px", sm: "1rem" },
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                  marginBottom: "5px",
                };
                const categorySelect = (
                  <Box>
                    <Autocomplete
                      placeholder="Categoria"
                      style={{
                        width: "100%",
                        borderRadius: "0.625rem",
                        background: "#2C3248",
                        boxShadow:
                          "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                      value={valueCategory}
                      onChange={(event: any, newValue: string | null) => {
                        setValueCategory(newValue);
                        inputOnChange(input.field, newValue ?? "");
                      }}
                      inputValue={inputValue2}
                      onInputChange={(event, newInputValue) => {
                        setInputValue2(newInputValue);
                      }}
                      options={category}
                      renderInput={(params) => (
                        <TextField
                          placeholder="Categoria"
                          variant="standard"
                          sx={{ filter: "invert(1)", paddingLeft: "15px" }}
                          style={{ color: "red", filter: "invert(1)" }}
                          {...params}
                        />
                      )}
                    />
                  </Box>
                );
                const measurementSelect = (
                  <Box>
                    <Box>
                      <Autocomplete
                        placeholder="Unidades de medida"
                        style={{
                          width: "100%",
                          borderRadius: "0.625rem",
                          background: "#2C3248",
                          boxShadow:
                            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                        value={valueMeasure}
                        onChange={(event: any, newValue: string | null) => {
                          setValueMeasure(newValue);
                          inputOnChange("measurement", newValue ?? "");
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        options={measure}
                        renderInput={(params) => (
                          <TextField
                            placeholder="Unidades de medida"
                            variant="standard"
                            sx={{ filter: "invert(1)", paddingLeft: "15px" }}
                            style={{ color: "red", filter: "invert(1)" }}
                            {...params}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                );
                const priceInput = (
                  <NumericFormat
                    onChange={(e: any) => {
                      setData((prevData) => ({
                        ...prevData,
                        price: e.target.value,
                      }));
                    }}
                    value={data.price}
                    prefix="$ "
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
                const purchasePriceInput = (
                  <NumericFormat
                    onChange={(e: any) => {
                      setData((prevData) => ({
                        ...prevData,
                        purchasePrice: e.target.value,
                      }));
                    }}
                    value={data.purchasePrice}
                    prefix="$ "
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
                const amountInput = (
                  <>
                    <OutlinedInput
                      id="cantidad"
                      value={data["cantidad"]}
                      onChange={(e) =>
                        inputOnChange("cantidad", e.target.value)
                      }
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
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2%",
                        marginLeft: "auto",
                        width: "100%",
                        marginTop: "auto",
                      }}
                    >
                      <Button
                        onClick={() => saveToFirebase()}
                        disabled={!isNotEmpty(data)}
                        sx={{
                          width: "45%",
                          height: "2.5rem",
                          borderRadius: "0.625rem",
                          boxShadow:
                            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                          background: !isNotEmpty(data) ? "gray" : "#69EAE2",
                          // background: "#69EAE2",
                          marginTop: "10px",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#1F1D2B",
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
                      <Box sx={{ width: "45%" }}>
                        {/* <Revenue /> */}
                        <Calculatorr />
                      </Box>
                    </Box>
                  </>
                );
                const descriptionInput = (
                  <Input
                    multiline={true}
                    rows={3}
                    value={data["description"]}
                    onChange={(e) =>
                      inputOnChange("description", e.target.value)
                    }
                  />
                );
                const qrBar = (
                  <OutlinedInput
                    value={data["barCode"]}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton sx={{ paddingRight: "0px" }}>
                          <Box
                            component={"img"}
                            src={"/images/scan.svg"}
                            onClick={() => {
                              generateCode();
                            }}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={(e) => inputOnChange("barCode", e.target.value)}
                    onBlur={() => {
                      getDataProductForID();
                    }}
                    type={"text"}
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

                return (
                  <React.Fragment key={index * 123}>
                    <FormControl sx={style} variant="outlined">
                      <Typography
                        sx={{
                          ...styleTypography,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {input.name}
                        <Box display={index == 0 ? "block" : "none"}>
                          <GenerateBarCode />
                        </Box>
                      </Typography>
                      {input.type === "measurement" ? (
                        measurementSelect
                      ) : input.type === "category" ? (
                        categorySelect
                      ) : input.type === "img" ? (
                        <Box
                          id="contianer img"
                          sx={{
                            width: { xs: "200%", sm: "150%" },
                            height: "200px",
                          }}
                        >
                          <ImgInput
                            data={data}
                            setData={setData}
                            folderSaved={user.length > 0 ? user : "images"}
                            fiel={"image"}
                            imageBase64={imageBase64}
                            setImageBase64={setImageBase64}
                          />
                        </Box>
                      ) : input.type === "cantidad" ? (
                        amountInput
                      ) : input.type === "purchasePrice" ? (
                        purchasePriceInput
                      ) : input.type === "amount" ? (
                        priceInput
                      ) : input.type === "textarea" ? (
                        descriptionInput
                      ) : input.type === "qrbar" ? (
                        qrBar
                      ) : (
                        <>
                          <OutlinedInput
                            value={data["productName"]}
                            onChange={(e) => {
                              inputOnChange(input.field, e.target.value);
                            }}
                            onBlur={() => {
                              setData((prevData) => {
                                const descriptionPrefix = prevData.productName
                                  ? `${prevData.productName}:`
                                  : "";
                                return {
                                  ...prevData,
                                  description: `${descriptionPrefix}${
                                    prevData.description.split(":")[1] || ""
                                  }`,
                                };
                              });
                            }}
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
          </Box>
        </Paper>
      </Box>
    </>
  );
}
