"use client";
import Header from "@/components/Header";
import {
  Box,
  Button,
  FormControl,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  cards,
  container,
  typographyColab,
  styleTypography,
  typographyProfile,
  typographyButton,
  typographyColabsButton,
  typographyUntitled,
} from "./profileStyles";
import { profileInputs } from "@/data/inputs";
import Step1 from "./Step1";
import ImgInput from "@/components/inputIMG";
import { getEstablishmentData, updateEstablishmentsData } from "@/firebase";
import { SnackbarProvider } from "notistack";
import { enqueueSnackbar } from "notistack";

interface Data {
  name: string;
  direction: string;
  phone: string;
  rol: string;
  email: string;
  [key: string]: string;
}

const Page = () => {
  const [data, setData] = useState<Data>({
    name: "",
    direction: "",
    phone: "",
    rol: "",
    email: "",
  });
  const [editOn, setEditOn] = useState<boolean>(false);
  const [addColabs, setAddColabs] = useState<boolean>(false);
  const [imageBase64, setImageBase64] = useState("");

  const user = atob(localStorage?.getItem("user") ?? "");

  const inputOnChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };
  const handleEdit = () => {
    setEditOn(true);
  };
  const handleChanges = async () => {
    try {
      await updateEstablishmentsData(data);
      enqueueSnackbar("Cambios guardados", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      enqueueSnackbar("Error al guardar", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    setEditOn(false);
  };

  const handleColabs = () => {
    setAddColabs(true);
  };

  useEffect(() => {
    const dataEstablesimente = async () => {
      const data: any = await getEstablishmentData();
      if (data !== null) {
        setData(data);
      }
    };
    dataEstablesimente();
  }, []);

  return (
    <>
      <SnackbarProvider />
      <Header title='Perfil Personal' />
      <Box sx={container}>
        <Box
          sx={{ width: { lg: "35%", md: "35%", sm: "85%", xs: "85%" } }}
          mt={5}
        >
          <Paper sx={{ ...cards, width: "100%", position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: -85,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
                width: 170,
                height: 170,
                overflow: "visible",
              }}
            >
              <ImgInput
                data={data}
                setData={setData}
                folderSaved={user.length > 0 ? user : "images"}
                imageBase64={imageBase64}
                setImageBase64={setImageBase64}
                border='50%'
              />
            </Box>
            <Box
              sx={{
                padding: "1.5rem",
                textAlign: "start",
                marginTop: {
                  lg: "2rem",
                  md: "2rem",
                  sm: "100px",
                  xs: "100px",
                },
              }}
            >
              {profileInputs.map((input, index) => {
                const style = {
                  width: input.width,
                  marginTop: input.field === "name" ? "70px" : "27px",
                };

                return (
                  <React.Fragment key={index * 123}>
                    <FormControl sx={style} variant='outlined'>
                      <Typography sx={styleTypography}>{input.name}</Typography>
                      {editOn ? (
                        <OutlinedInput
                          value={data[input.field]}
                          onChange={(e) => {
                            inputOnChange(input.field, e.target.value);
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
                      ) : (
                        <Typography sx={typographyProfile}>
                          {data[input.field]}
                        </Typography>
                      )}
                    </FormControl>
                  </React.Fragment>
                );
              })}
              {editOn ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    onClick={handleChanges}
                    sx={{
                      height: "2.5rem",
                      borderRadius: "0.625rem",
                      boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      background: "#69EAE2",
                      marginTop: "40px",
                      "&:hover": { backgroundColor: "#69EAE2" },
                    }}
                  >
                    <Typography sx={typographyButton}>
                      Guardar Cambios
                    </Typography>
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    onClick={handleEdit}
                    sx={{
                      height: "2.5rem",
                      borderRadius: "0.625rem",
                      boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      background: "#69EAE2",
                      marginTop: "40px",
                      "&:hover": { backgroundColor: "#69EAE2" },
                    }}
                  >
                    <Typography sx={typographyButton}>Editar Datos</Typography>
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
        <Box
          sx={{
            width: { lg: "60%", md: "60%", sm: "85%", xs: "85%" },
            marginTop: { sm: "2rem", xs: "2rem" },
          }}
        >
          <Typography sx={typographyColab}>TUS COLABORADORES</Typography>
          <Paper sx={{ ...cards, width: "100%" }}>
            <Box padding={4} sx={{ textAlign: "-webkit-center" }}>
              <Typography sx={typographyUntitled}>
                {addColabs
                  ? "Registrando colaborador..."
                  : "Aun no tienes colaboradores"}
              </Typography>
              <Box
                sx={{
                  marginTop: "2rem",
                  padding: { lg: "3rem", md: "3rem", sm: "1rem", xs: "1rem" },
                  width: { lg: "80%", md: "80%", sm: "100%", xs: "100%" },
                }}
              >
                {addColabs ? (
                  <Step1 setAddColabs={setAddColabs} />
                ) : (
                  <Button onClick={handleColabs}>
                    <Typography sx={typographyColabsButton}>
                      Agregar Colaboradores
                    </Typography>
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Page;
