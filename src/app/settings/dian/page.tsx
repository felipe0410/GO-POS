"use client";
import Header from "@/components/Header";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { cards, container, styleTypography, profileInputs } from "./DIANStyle";

import {
  createDianRecord,
  getDianRecord, // Importamos la función para obtener datos
  getEstablishmentData,
  getEstablishmentDataLoggin,
} from "@/firebase";
import { SnackbarProvider } from "notistack";
import { enqueueSnackbar } from "notistack";

const Page = () => {
  const [data, setData] = useState<any>({
    Prefijo: "",
    RangoInicio: "",
    RangoFin: "",
    Resolucion: "",
    name: "",
    direction: "",
    phone: "",
    establishment: "",
    NIT: "",
    email: "",
  });

  const inputOnChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleSave = async () => {
    try {
      await createDianRecord(data);
      enqueueSnackbar("Datos guardados correctamente en DIAN", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      enqueueSnackbar("Error al guardar los datos", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  useEffect(() => {
    const fetchDianData = async () => {
      try {
        const dianData = await getDianRecord(); // Obtenemos los datos de DIAN
        const getEstablishmentDataa = await getEstablishmentData();
        console.log("getEstablishmentDataa::::>", getEstablishmentDataa);
        if (!dianData) {
          console.log("El documento no existe.");
          enqueueSnackbar("No existe información de DIAN", {
            variant: "info",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          return;
        }
        if (!getEstablishmentDataa) {
          console.log("El documento no existe.");
          enqueueSnackbar("No existe información de DIAN", {
            variant: "info",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          return;
        }
        // Manejar el caso de campos vacíos
        setData((prevData: any) => ({
          ...prevData,
          Prefijo: dianData.Prefijo || "",
          RangoInicio: dianData.RangoInicio || "",
          RangoFin: dianData.RangoFin || "",
          Resolucion: dianData.Resolucion || "",
          nameEstablishment: getEstablishmentDataa.nameEstablishment,
          phone: getEstablishmentDataa.phone,
          NIT_CC: getEstablishmentDataa.NIT_CC,
          email: getEstablishmentDataa.email,
          name: getEstablishmentDataa.name,
          direction: getEstablishmentDataa.direction,
        }));
      } catch (error) {
        console.error("Error al obtener los datos de DIAN:", error);
        enqueueSnackbar("Error al cargar la información de DIAN", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    };

    fetchDianData(); // Cargamos los datos al montar el componente
  }, []);

  return (
    <>
      <SnackbarProvider />
      <Header title="Ajustes DIAN" />
      <Box sx={container}>
        <Box
          sx={{
            width: { lg: "54.5rem", md: "38rem", sm: "35rem", xs: "32rem" },
          }}
          mt={5}
        >
          <Paper
            sx={{
              ...cards,
              width: "100%",
              position: "relative",
              padding: "60px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  fontFamily: "Nunito",
                  fontSize: "24px",
                  fontWeight: 400,
                  lineHeight: "32.74px",
                  textAlign: "left",
                  color: "#69EAE2",
                }}
              >
                <Typography>Establecimiento</Typography>
                <Typography sx={{ color: "#FFFFFF" }}>
                  {data?.nameEstablishment ?? ""}
                </Typography>
              </Box>
              <Box
                sx={{
                  fontFamily: "Nunito",
                  fontSize: "24px",
                  fontWeight: 400,
                  lineHeight: "32.74px",
                  textAlign: "left",
                  color: "#69EAE2",
                }}
              >
                <Typography>Direccion</Typography>
                <Typography sx={{ color: "#FFFFFF" }}>{data?.direction ?? ""}</Typography>
              </Box>
            </Box>
            <Divider
              sx={{
                height: "1px",
                background: "#69EAE2",
                width: "100%",
                marginY: "20px",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: { md: "row", xs: "column" },
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "space-between",
                padding: "1.5rem",
                textAlign: "start",
              }}
            >
              {profileInputs.map((input, index) => {
                if (input.name === "Rango") {
                  return (
                    <React.Fragment key={index * 123}>
                      <FormControl
                        variant="outlined"
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Typography sx={styleTypography}>
                          {input.name} (Inicio - Fin)
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <OutlinedInput
                            value={data.RangoInicio}
                            onChange={(e) =>
                              inputOnChange("RangoInicio", e.target.value)
                            }
                            placeholder="Inicio"
                            sx={{
                              height: "35.9px",
                              borderRadius: "0.625rem",
                              background: "#2C3248",
                              color: "#FFF",
                              width: "45%",
                            }}
                          />
                          <OutlinedInput
                            value={data.RangoFin}
                            onChange={(e) =>
                              inputOnChange("RangoFin", e.target.value)
                            }
                            placeholder="Fin"
                            sx={{
                              height: "35.9px",
                              borderRadius: "0.625rem",
                              background: "#2C3248",
                              color: "#FFF",
                              width: "45%",
                            }}
                          />
                        </Box>
                      </FormControl>
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={index * 123}>
                    <FormControl sx={{ width: "100%" }} variant="outlined">
                      <Typography sx={styleTypography}>{input.name}</Typography>
                      <OutlinedInput
                        value={data[input.field]}
                        onChange={(e) =>
                          inputOnChange(input.field, e.target.value)
                        }
                        type={input.type}
                        sx={{
                          height: "35.9px",
                          borderRadius: "0.625rem",
                          background: "#2C3248",
                          color: "#FFF",
                        }}
                      />
                    </FormControl>
                  </React.Fragment>
                );
              })}
              <Box sx={{ margin: "0 auto" }}>
                <Button
                  sx={{ background: "#FF0404", color: "#fff", fontWeight: 700 }}
                >
                  CANCELAR
                </Button>
                <Button
                  sx={{
                    background: "#69EAE2",
                    color: "#1F1D2B",
                    marginLeft: "20px",
                    fontWeight: 700,
                  }}
                  onClick={handleSave}
                >
                  GUARDAR
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Page;
