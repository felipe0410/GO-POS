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
import {
  createProduct,
  getAllCategoriesData,
  getAllMeasurementsDataa,
  getProductData,
} from "@/firebase";
import Calculatorr from "./modalCalculator";
import ImgInput from "./inputIMG";

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
  });
  const [imageBase64, setImageBase64] = useState("");
  const [category, setCategory] = useState<[]>([]);
  const [measure, setMeasure] = useState<[]>([]);
  const saveToFirebase = async () => {
    try {
      await createProduct(data.barCode, {
        ...data,
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
    }
  };

  const user = atob(localStorage?.getItem('user') ?? "")
  console.log('user:::>', user)

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
        <Box sx={{ padding: { xs: "15px", sm: "2rem 3.8rem 2rem 3.4rem" } }}>
          <Box
            id='container-inputs'
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
                fontSize: { xs: "10px", sm: "1rem" },
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
                    {category?.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
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
                    {measure?.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              );
              const amountInput = (
                <>
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
                  <Typography sx={{ ...styleTypography, marginTop: "10px" }}>
                    {"CANTIDAD"}
                  </Typography>
                  <OutlinedInput
                    id="cantidad"
                    value={data["cantidad"]}
                    onChange={(e) => inputOnChange("cantidad", e.target.value)}
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
                    <Box sx={{ width: '45%' }}>
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
                  <FormControl sx={style} variant='outlined'>
                    <Typography sx={styleTypography}>{input.name}</Typography>
                    {input.type === "measurement" ? (
                      measurementSelect
                    ) : input.type === "category" ? (
                      categorySelect
                    ) : input.type === "img" ? (
                      <Box id='contianer img' sx={{ width: { xs: '200%', sm: '150%' }, height: '100%' }}>
                        <ImgInput data={data} setData={setData} folderSaved={user.length > 0 ? user : "images"} fiel={"image"} imageBase64={imageBase64} setImageBase64={setImageBase64} />
                      </Box>
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
                          onChange={(e) => {
                            inputOnChange(input.field, e.target.value);
                          }

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
        </Box>
      </Paper>
    </Box>
  );
}
