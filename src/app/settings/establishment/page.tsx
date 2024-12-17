"use client";
import Header from "@/components/Header";
import {
  Avatar,
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
  styleTypography,
  typographyProfile,
  typographyButton,
} from "./EstablishmentStyle";
import {
  getEstablishmentData,
  getEstablishmentDataLoggin,
  updateEstablishmentsData,
} from "@/firebase";
import { SnackbarProvider } from "notistack";
import { enqueueSnackbar } from "notistack";
import ImgInputSettings from "@/components/inputIMG-Settings";
import { profileInputs } from "../dian/DIANStyle";

interface Data {
  name: string;
  direction: string;
  phone: string;
  establishment: string;
  NIT: string;
  email: string;
  [key: string]: string;
}

export interface ColabData {
  uid: string;
  name: string;
  jobs: [];
  password: string;
  img: string;
  uidEstablishments: string;
  mail: string;
  status: string;
}

const Page = () => {
  const [data, setData] = useState<Data>({
    name: "",
    direction: "",
    phone: "",
    establishment: "",
    NIT: "",
    email: "",
    img: "",
  });

  const [editOn, setEditOn] = useState<boolean>(false);
  const [imageBase64, setImageBase64] = useState("");
  const userData = JSON.parse(localStorage?.getItem("dataUser") ?? "{}");
  const dataUser = async () => {
    const establishmentData = await getEstablishmentDataLoggin(
      atob(userData.uid)
    );
    return establishmentData;
  };

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

  useEffect(() => {
    const dataEstablesimente = async () => {
      const data: any = await getEstablishmentData();
      dataUser()
        .then((userData: any) => {
          console.log(userData);
          if (userData.mail.length > 0) {
            setData({
              name: userData.name,
              direction: "centro",
              phone: "30000",
              establishment: "pruea",
              NIT: userData.status,
              email: userData.mail,
              img: userData.img,
            });
          } else if (data !== null) {
            setData(data);
          }
        })
        .catch((error) => {
          setData(data);
          console.error("Error al obtener los datos del usuario:", error);
        });
    };
    dataEstablesimente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SnackbarProvider />
      <Header title="Ajustes del establecimiento" />
      <Box sx={container}>
        <Box
          sx={{
            width: { lg: "54.5rem", md: "38rem", sm: "35rem", xs: "32rem" },
          }}
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
                width: { sm: 170, xs: 145 },
                height: { sm: 170, xs: 145 },
                overflow: "visible",
              }}
            >
              <ImgInputSettings
                data={data}
                setData={setData}
                folderSaved={user.length > 0 ? user : "images"}
                imageBase64={imageBase64}
                setImageBase64={setImageBase64}
                border="50%"
              />

              <Box
                sx={{
                  position: "absolute",
                  top: { lg: 405, md: 415, sm: 410, xs: 460 },
                  left: { lg: 390, md: 270, sm: 270, xs: 160 },
                }}
              >
                <Avatar
                  alt="robot-image"
                  src="/images/robot.png/"
                  variant="square"
                  sx={{
                    width: { lg: "170px", sm: "150px", xs: "120px" },
                    height: { lg: "260px", sm: "230px", xs: "180px" },
                  }}
                />
                |
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { md: "row", xs: "column" },
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "space-between",
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
                  width: { sm: "45%", xs: "100%" },
                  marginTop: { sm: "90px", xs: "75px" },
                  marginBottom: { sm: "-73px", xs: "-75px" },
                };

                return (
                  <React.Fragment key={index * 123}>
                    <FormControl sx={style} variant="outlined">
                      <Typography sx={styleTypography}>{input.name}</Typography>
                      {editOn ? (
                        <OutlinedInput
                          value={data[input.field]}
                          onChange={(e) => {
                            inputOnChange(input.field, e.target.value);
                          }}
                          type={input.type}
                          sx={{
                            height: "35.9px",
                            borderRadius: "0.625rem",
                            background: "#2C3248",
                            boxShadow:
                              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                          }}
                          style={{ color: "#FFF" }}
                        />
                      ) : (
                        <Typography
                          sx={{
                            ...typographyProfile,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
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
                      marginTop: "10px",
                      "&:hover": { opacity: "80%" },
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 12,
                      background: "#004d00",
                      border: "solid #ffffff 1px",
                    }}
                  >
                    <Typography sx={typographyButton} style={{color:'#fff'}}>
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
                      marginTop: "10px",
                    }}
                    style={{ position: "absolute", top: 1, right: 12 }}
                  >
                    <Typography
                      sx={typographyButton}
                      style={{ textDecoration: "0.5px solid underline" }}
                    >
                      Editar Datos
                    </Typography>
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Page;
