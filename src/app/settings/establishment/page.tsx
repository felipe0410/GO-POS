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
  styleTypography,
  typographyProfile,
  typographyButton,
} from "./EstablishmentStyle";
import { profileInputs } from "@/data/inputs";
import ImgInput from "@/components/inputIMG";
import {
  getEstablishmentData,
  getEstablishmentDataLoggin,
  updateEstablishmentsData,
} from "@/firebase";
import { SnackbarProvider } from "notistack";
import { enqueueSnackbar } from "notistack";


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
          if (userData.mail.length > 0) {
            setData({
              name: userData.name,
              direction: "centro",
              phone: "30000",
              establishment: 'pruea',
              NIT: userData.status,
              email: userData.mail,
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
  }, []);
 
  return (
    <>
      <SnackbarProvider />
      <Header title="Ajustes del establecimiento" />
      <Box sx={container} >
        <Box
          sx={{ width: { lg: "65%", md: "85%", sm: "95%", xs: "95%" } }}
          mt={5}
        >
          <Paper sx={{ ...cards, width: "100%", position: "relative"  }}>
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
                border="50%"
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'space-between',
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
                  width: '45%',
                  marginTop: input.field === ("name") ? "80px" : "27px",
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
                            height: "44.9px",
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
                      boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",                   
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
                      marginTop: "40px",                      
                    }}
                    style={{position: 'absolute', right: 0, top:0}}
                  >
                    <Typography sx={typographyButton} >Editar Datos</Typography>
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
