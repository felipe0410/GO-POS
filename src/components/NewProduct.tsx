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
import React, { useEffect, useRef, useState, RefObject } from "react";
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LinearBuffer from "./progress";

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

  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [category, setCategory] = useState<[]>([]);
  const [measure, setMeasure] = useState<[]>([]);
  const [productExist, setProductExist] = useState(false);
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
    console.log("entro a upload");
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
        console.log(getDownloadURL);
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
      setUpload(false);
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
    console.log("entro aqui");
    const dataFirebase: any = await getProductData(data.barCode);
    if (dataFirebase !== null) {
      setProductExist(true);
      setData(dataFirebase);
      setImageBase64(dataFirebase.image);
      setUpload(true);
    } else {
      setData({ ...DATA_DEFAULT, barCode: data.barCode });
      setImageBase64("");
      setProductExist(false);
    }
  };

  useEffect(() => {
    const measurementsData = async () => {
      try {
        await getAllMeasurementsDataa(setMeasure);
        // setMeasure(measurements);
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
                      justifyContent: "flex-end",
                      marginBottom: "2%",
                      marginLeft: "auto",
                      width: { sm: "50%" },
                      marginTop: "auto",
                    }}
                  >
                    <Button
                      onClick={() => saveToFirebase()}
                      disabled={!isNotEmpty(data)}
                      sx={{
                        width: "100%",
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

              const imgInput = (
                <>
                  <Box
                    sx={{
                      textAlign: "center",
                      width: "9.25rem",
                      height: "8.375rem",
                      borderRadius: "0.625rem",
                      background: "#2C3248",
                      display: upload ? "none" : "block",
                      boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Button
                      component='label'
                      sx={{
                        marginTop: "12px",
                        border: "dashed #ffffff47",
                        width: "7rem",
                        height: "7rem",
                      }}
                    >
                      <AddOutlinedIcon
                        sx={{
                          color: "#FFF",
                          fontSize: "30px",
                        }}
                      />
                      <input
                        style={{
                          overflow: "hidden",
                          clip: "rect(0 0 0 0)",
                          clipPath: "inset(50%)",
                          height: 1,
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          whiteSpace: "nowrap",
                          width: 1,
                        }}
                        accept='image/*'
                        ref={fileRef}
                        onChange={() => {
                          setUpload(true);
                          setProductExist(false);
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
                        width: "200px",
                      }}
                    >
                      <img
                        style={{ width: "100%" }}
                        src={imageBase64}
                        alt='Preview'
                      />
                      {/* <LinearBuffer /> */}
                      <Box
                        sx={{
                          width: "90%",
                          justifyContent: "space-evenly",
                          marginY: "10px",
                        }}
                        display={
                          data.image.length > 0 && !productExist
                            ? "none"
                            : "flex"
                        }
                      >
                        <Button
                          sx={{
                            display: productExist ? "none" : "block",
                            borderRadius: "0.625rem",
                            boxShadow:
                              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                            background: "#69EAE2",
                          }}
                          onClick={() => {
                            handleAcceptImage(fileRef);
                          }}
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
                </>
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
        </Box>
      </Paper>
    </Box>
  );
}
