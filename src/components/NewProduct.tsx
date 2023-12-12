"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useRef, useState, RefObject } from "react";
import { inputs } from "@/data/inputs";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { NumericFormat } from "react-number-format";
import { Input as BaseInput, InputProps } from "@mui/base/Input";
import {
  createProduct,
  getAllCategoriesData,
  getAllMeasurementsData,
  getProductsData,
} from "@/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Image from "next/image";

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

  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [category, setCategory] = useState<[]>([]);
  const [measure, setMeasure] = useState<[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = (fileRef: RefObject<HTMLInputElement>) => {
    if (fileRef.current?.files?.length) {
      const file = fileRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String: any = event?.target?.result;
        if (base64String) setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected");
    }
  };

  const handleAcceptImage = (fileRef: any) => {
    setLoading(true);
    if (fileRef.current?.files?.length) {
      const file = fileRef.current.files[0];
      const fileName = Date.now() + "_" + file.name;
      const imgRef = ref(storage, "images/" + fileName);
      uploadImageToFirebase(imgRef, file);
      setLoading(false);
    } else {
      enqueueSnackbar("No ha seleccionado ninguna imagen", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setImageBase64("");
    setUpload(false);
    setData((prevState: any) => ({
      ...prevState,
      image: "",
    }));
  };

  const uploadImageToFirebase = (imgRef: any, file: any) => {
    const imgUpload = uploadBytesResumable(imgRef, file);
    imgUpload.on(
      "state_changed",
      ({ state }) => {
        switch (state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (err) => {
        console.error(err);
      },
      async () => {
        const url = await getDownloadURL(imgUpload.snapshot.ref);
        setData((prevState: any) => ({
          ...prevState,
          image: url,
        }));
      }
    );
  };

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

  useEffect(() => {
    const categoriesData = async () => {
      try {
        const categories = await getAllCategoriesData();
        setCategory(categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    categoriesData();
  }, [category]);

  useEffect(() => {
    const measurementsData = async () => {
      try {
        const measurements = await getAllMeasurementsData();
        setMeasure(measurements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    measurementsData();
  }, [measure]);

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
                <FormControl>
                  <Box
                    sx={{
                      textAlign: "center",
                      width: "7.25rem",
                      height: "6.375rem",
                      borderRadius: "0.625rem",
                      background: "#2C3248",
                      display: upload ? "none" : "block",
                      boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Button sx={{ marginTop: "25px" }}>
                      <AddOutlinedIcon
                        sx={{ color: "#FFF" }}
                        fontSize='large'
                      />
                      <input
                        accept='image/*'
                        ref={fileRef}
                        onChange={() => {
                          setUpload(true);
                          uploadImage(fileRef);
                        }}
                        type='file'
                      />
                    </Button>
                  </Box>
                  {imageBase64 && (
                    <Box
                      id='contianer_img'
                      sx={{
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        style={{ width: "90%" }}
                        src={imageBase64}
                        alt='Preview'
                      />
                      <Box
                        sx={{
                          width: "90%",
                          justifyContent: "space-evenly",
                          marginY: "10px",
                        }}
                        display={data.image.length > 0 ? "none" : "flex"}
                      >
                        <Button
                          sx={{
                            borderRadius: "0.625rem",
                            boxShadow:
                              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                            background: "#69EAE2",
                          }}
                          onClick={() => handleAcceptImage(fileRef)}
                        >
                          <Typography
                            sx={{
                              color: "#1F1D2B",
                              textAlign: "center",
                              fontFamily: "Nunito",
                              fontSize: "0.7rem",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            CARGAR
                          </Typography>
                        </Button>
                        <Button
                          sx={{
                            borderRadius: "0.625rem",
                            boxShadow:
                              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                            background: "#69EAE2",
                          }}
                          onClick={() => handleCancel()}
                        >
                          <Typography
                            sx={{
                              color: "#1F1D2B",
                              textAlign: "center",
                              fontFamily: "Nunito",
                              fontSize: "0.7rem",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            CANCELAR
                          </Typography>
                        </Button>
                      </Box>
                    </Box>
                  )}
                </FormControl>
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
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
