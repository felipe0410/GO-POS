import React, { useState } from "react";
import { SnackbarProvider } from "notistack";
import { enqueueSnackbar } from "notistack";
import { Box, Typography, Button } from "@mui/material";
import { typographyStep2, typographyColabsButton } from "./profileStyles";
import ImgInput from "@/components/inputIMG";
import { createColabsData, creteUser, saveDataUser } from "@/firebase";

const Step3 = ({
  step,
  setStep,
  setAddColabs,
  setColabsData,
  colabsData,
}: {
  step: any;
  setStep: any;
  setAddColabs: any;
  setColabsData: any;
  colabsData: any;
}) => {
  const [imageBase64, setImageBase64] = useState("");
  const user = atob(localStorage?.getItem("user") ?? "");

  const handleCloseSnackbar = () => {
    setAddColabs(false);
  };

  const validateLength = () => {
    const arrayValue = Object.values(colabsData);
    const validation = arrayValue.some((valor: any) => valor.length < 1);
    if (validation) {
      return true;
    }
    return false;
  };

  const createUser = async () => {
    if (!validateLength()) {
      try {
        const creation: any = await creteUser(
          colabsData.mail,
          colabsData.password
        );
        const userData = {
          ...colabsData,
          uidEstablishments: user,
        };
        await Promise.all([
          saveDataUser(creation.uid, userData),
          createColabsData(creation.uid, userData),
        ]);
        enqueueSnackbar("Usuario creado con exito", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          onClose: handleCloseSnackbar,
        });
      } catch (error) {
        console.error("Error al crear usuario:", error);
        enqueueSnackbar("Ocurrió un error al crear el usuario", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } else {
      enqueueSnackbar("Completa los campos", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  return (
    <Box>
      <SnackbarProvider />
      <Typography sx={typographyStep2}>
        Ahora carga una foto de tu colaborador (formato JPG,SVG)
      </Typography>
      <Box
        sx={{
          marginTop: "1.5rem",
          width: { lg: 200, md: 200, sm: 130, xs: 130 },
          height: { lg: 200, md: 200, sm: 130, xs: 130 },
        }}
      >
        <ImgInput
          data={colabsData}
          setData={setColabsData}
          folderSaved={user.length > 0 ? user : "images"}
          imageBase64={imageBase64}
          setImageBase64={setImageBase64}
          border='50%'
        />
      </Box>
      <Box
        sx={{
          marginTop: "12px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => setStep(step - 1)}
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "5px",
            "&:hover": {
              backgroundColor:
                "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(24, 24, 42, 0.93) 61.61%, #1F1D2B 91.2%)",
            },
          }}
        >
          <Typography
            sx={{
              ...typographyColabsButton,
              fontSize: {
                lg: "1rem",
                md: "1rem",
                sm: "0.85rem",
                xs: "0.85rem",
              },
            }}
          >
            VOLVER
          </Typography>
          <Box component={"img"} src={"/images/arrow2.svg"} />
        </Button>
        <Button
          onClick={() => {
            createUser();
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "5px",
            "&:hover": {
              backgroundColor:
                "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(24, 24, 42, 0.93) 61.61%, #1F1D2B 91.2%)",
            },
          }}
        >
          <Typography
            sx={{
              ...typographyColabsButton,
              fontSize: {
                lg: "1rem",
                md: "1rem",
                sm: "0.85rem",
                xs: "0.85rem",
              },
            }}
          >
            FINALIZAR
          </Typography>
          <Box component={"img"} src={"/images/arrow.svg"} />
        </Button>
      </Box>
    </Box>
  );
};

export default Step3;
