import { Box, Button, Typography } from "@mui/material";
import React from "react";
import {
  jobsCardBoxes,
  typographyStep2,
  typographyColabsButton,
} from "./profileStyles";
import Checkbox from "@mui/material/Checkbox";
import { SnackbarProvider } from "notistack";

const Step2 = ({
  step,
  colabsData,
  setStep,
  handleCheckboxChange,
}: {
  step: any;
  setStep: any;
  colabsData: any;
  handleCheckboxChange: (job: string) => void;
}) => {
  return (
    <Box>
      <SnackbarProvider />
      <Typography sx={typographyStep2}>
        Ahora elige las tareas o secciones a las que tu colaborador puede tener
        acceso
      </Typography>
      <Box sx={jobsCardBoxes}>
        <Typography
          sx={{
            ...typographyStep2,
            fontSize: "1rem",
            alignSelf: "center",
            paddingLeft: "16px",
          }}
        >
          Ventas
        </Typography>
        <Checkbox
          checked={colabsData.jobs.includes("Ventas")}
          onChange={() => handleCheckboxChange("Ventas")}
          sx={{
            color: "#69EAE2",
            "&.Mui-checked": {
              color: "#69EAE2",
            },
          }}
        />
      </Box>
      <Box sx={jobsCardBoxes}>
        <Typography
          sx={{
            ...typographyStep2,
            fontSize: "1rem",
            alignSelf: "center",
            paddingLeft: "16px",
          }}
        >
          Caja
        </Typography>
        <Checkbox
          checked={colabsData.jobs.includes("Caja")}
          onChange={() => handleCheckboxChange("Caja")}
          sx={{
            color: "#69EAE2",
            "&.Mui-checked": {
              color: "#69EAE2",
            },
          }}
        />
      </Box>
      <Box sx={jobsCardBoxes}>
        <Typography
          sx={{
            ...typographyStep2,
            fontSize: "1rem",
            alignSelf: "center",
            paddingLeft: "16px",
          }}
        >
          Inventario
        </Typography>
        <Checkbox
          checked={colabsData.jobs.includes("Inventario")}
          onChange={() => handleCheckboxChange("Inventario")}
          sx={{
            color: "#69EAE2",
            "&.Mui-checked": {
              color: "#69EAE2",
            },
          }}
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
          onClick={() => setStep(step + 1)}
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
            SIGUIENTE
          </Typography>
          <Box component={"img"} src={"/images/arrow.svg"} />
        </Button>
      </Box>
    </Box>
  );
};

export default Step2;
