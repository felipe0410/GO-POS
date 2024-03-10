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
  colabsList,
  typographyTitleTable,
} from "./profileStyles";
import { profileInputs } from "@/data/inputs";
import Step1 from "./Step1";
import ImgInput from "@/components/inputIMG";
import {
  getAllColabsData,
  getEstablishmentData,
  updateEstablishmentsData,
} from "@/firebase";
import { SnackbarProvider } from "notistack";
import { enqueueSnackbar } from "notistack";
import ColabsList from "./ColabsList";
import AddIcon from "@mui/icons-material/Add";

interface Data {
  name: string;
  direction: string;
  phone: string;
  rol: string;
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
    rol: "",
    email: "",
  });
  const [colabsData, setColabsData] = useState<ColabData[]>([]);
  const [editOn, setEditOn] = useState<boolean>(false);
  const [addColabs, setAddColabs] = useState<boolean>(false);
  const [imageBase64, setImageBase64] = useState("");
  const userData = JSON.parse(localStorage?.getItem("dataUser") ?? "{}");
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
      // getEstablishmentDataLoggin()
      const data: any = await getEstablishmentData();
      if (data !== null) {
        setData(data);
      }
    };
    dataEstablesimente();
  }, []);

  useEffect(() => {
    const unsubscribePromise = getAllColabsData((colabsData) => {
      const transformedData: ColabData[] = colabsData.map((data: any) => ({
        uid: data.uid,
        name: data.name,
        jobs: data.jobs,
        password: data.password,
        img: data.img,
        uidEstablishments: data.uidEstablishments,
        mail: data.mail,
        status: data.status,
      }));
      setColabsData(transformedData);
    });

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
    };
  }, []);

  return (
    <>
      <SnackbarProvider />
      <Header title='Perfil Personal' />
      <Box sx={container}>
        <Box
          sx={{ width: { lg: "35%", md: "35%", sm: "95%", xs: "95%" } }}
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
            width: { lg: "60%", md: "60%", sm: "95%", xs: "95%" },
            marginTop: { sm: "2rem", xs: "2rem" },
          }}
        >
          <Typography sx={typographyColab}>TUS COLABORADORES</Typography>
          <Paper sx={{ ...cards, width: "100%" }}>
            <Box padding={4} sx={{ textAlign: "-webkit-center" }}>
              {addColabs ? (
                <>
                  <Typography sx={typographyUntitled}>
                    {addColabs && "Registrando colaborador..."}
                  </Typography>

                  <Box
                    sx={{
                      marginTop: "2rem",
                      padding: {
                        lg: "3rem",
                        md: "3rem",
                        sm: "1rem",
                        xs: "1rem",
                      },
                      width: { lg: "80%", md: "80%", sm: "100%", xs: "100%" },
                    }}
                  >
                    <Step1 setAddColabs={setAddColabs} />
                  </Box>
                </>
              ) : colabsData.length > 0 ? (
                <>
                  <Box sx={{ textAlign: "start" }}>
                    <Button onClick={handleColabs}>
                      <Typography sx={colabsList.typographyButtonList}>
                        Agregar Colaboradores
                      </Typography>
                      <AddIcon sx={{ color: "#69EAE2" }} />
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: {
                        lg: "block",
                        md: "block",
                        sm: "none",
                        xs: "none",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        marginTop: "1.4rem",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <Typography sx={typographyTitleTable}>Nombre</Typography>
                      <Typography sx={typographyTitleTable}>Estatus</Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: {
                        lg: "none",
                        md: "none",
                        sm: "block",
                        xs: "block",
                      },
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ ...typographyTitleTable, marginTop: "0.8rem" }}
                      >
                        Nombre/Status
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ maxHeight: "438px", overflowY: "auto" }}>
                    {colabsData.map((collaborator) => (
                      <ColabsList key={collaborator.uid} data={collaborator} />
                    ))}
                  </Box>
                </>
              ) : (
                <>
                  <Typography sx={typographyUntitled}>
                    {addColabs
                      ? "Registrando colaborador..."
                      : "Aun no tienes colaboradores"}
                  </Typography>
                  <Box
                    sx={{
                      marginTop: "2rem",
                      padding: {
                        lg: "3rem",
                        md: "3rem",
                        sm: "1rem",
                        xs: "1rem",
                      },
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
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Page;
