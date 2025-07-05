"use client";
import Header from "@/components/Header";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  cards,
  container,
  styleTypography,
  typographyButton,
  typographyProfile,
} from "./EstablishmentStyle";
import {
  getEstablishmentData,
  getEstablishmentDataLoggin,
  updateEstablishmentsData,
} from "@/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import ImgInputSettings from "@/components/inputIMG-Settings";
import { profileInputs } from "../dian/DIANStyle";
import { getModules, saveModules } from "@/firebase/settingsModules";

interface Data {
  name: string;
  direction: string;
  phone: string;
  establishment: string;
  NIT: string;
  email: string;
  img: string;
  solution_restaurant: string;
  solution_general: string;
  [key: string]: string;
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
    solution_restaurant: "false",
    solution_general: "false",
  });

  const [imageBase64, setImageBase64] = useState("");
  const userData = JSON.parse(localStorage?.getItem("dataUser") ?? "{}");
  const user = atob(localStorage?.getItem("user") ?? "");

  const inputOnChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleChanges = async () => {
    try {
      await updateEstablishmentsData(data);
      await saveModules({
        solution_restaurant: data.solution_restaurant,
        solution_general: data.solution_general,
      });

      enqueueSnackbar("Cambios guardados correctamente", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error) {
      enqueueSnackbar("Error al guardar cambios", {
        variant: "error",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const dataFirebase: any = await getEstablishmentData();
      const userDataResponse: any = await getEstablishmentDataLoggin(
        atob(userData.uid)
      );

      const modules = await getModules();

      const baseData = {
        name: userDataResponse?.name ?? dataFirebase?.name ?? "",
        direction: "centro",
        phone: "30000",
        establishment: "pruea",
        NIT: userDataResponse?.status ?? "",
        email: userDataResponse?.mail ?? dataFirebase?.email ?? "",
        img: userDataResponse?.img ?? "",
        solution_restaurant: modules?.solution_restaurant ?? "false",
        solution_general: modules?.solution_general ?? "true", // valor por defecto
      };

      setData(baseData);
    };

    fetchData();
  }, [userData.uid]);


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

              <Box
                sx={{
                  marginTop: "5.5rem",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  background: "#2C3248",
                  borderRadius: "0.625rem",
                  padding: "1rem",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Typography sx={styleTypography}>
                  ¿Qué solución necesitas activar?
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.solution_restaurant === "true"}
                      onChange={(e) => {
                        const checked = e.target.checked.toString();
                        setData((prev) => ({
                          ...prev,
                          solution_restaurant: checked,
                          solution_general: checked === "true" ? "false" : prev.solution_general,
                        }));
                      }}
                      sx={{
                        color: "#69EAE2",
                        "&.Mui-checked": { color: "#69EAE2" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={typographyProfile}>
                      🍽️ Restaurantes y Gastrobares
                    </Typography>
                  }
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.solution_general === "true"}
                      onChange={(e) => {
                        const checked = e.target.checked.toString();
                        setData((prev) => ({
                          ...prev,
                          solution_general: checked,
                          solution_restaurant: checked === "true" ? "false" : prev.solution_restaurant,
                        }));
                      }}
                      sx={{
                        color: "#69EAE2",
                        "&.Mui-checked": { color: "#69EAE2" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={typographyProfile}>
                      🛒 Solución general (supermercados, tiendas, papelerías, etc.)
                    </Typography>
                  }
                />


              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "2rem",
                }}
              >
                <Button
                  onClick={handleChanges}
                  sx={{
                    height: "2.5rem",
                    borderRadius: "0.625rem",
                    background: "#004d00",
                    border: "solid #ffffff 1px",
                    "&:hover": { opacity: "80%" },
                  }}
                >
                  <Typography sx={typographyButton} style={{ color: "#fff" }}>
                    Guardar Cambios
                  </Typography>
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
