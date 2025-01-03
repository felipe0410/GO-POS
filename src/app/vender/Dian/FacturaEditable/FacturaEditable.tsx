import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import StepCliente from "./StepCliente";
import StepItems from "./StepItems";
import StepResumen from "./StepResumen";
import { FacturaProviderContext } from "../context";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#69EAE2",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B3B3B3",
    },
  },
});

const FacturaEditable = () => {
  const { activeStep, setActiveStep, localData } =
    useContext(FacturaProviderContext) || {};
  const [data, setData] = useState({
    cliente: {
      tipoDocumento: "",
      numeroDocumento: "",
      telefono: "",
      correo: "",
      nombre: "",
      pais: "",
      departamento: "",
      ciudad: "",
      direccion: "",
    },
    items: [
      {
        codigo: "",
        detalle: "",
        cantidad: 1,
        precio: 0,
        total: 0,
      },
    ],
    total: 0,
  });
  const steps = ["Datos del Cliente", "Items de la Factura", "Resumen"];

  const validateItems = () => {
    return data.items.every(
      (item) =>
        item.codigo.trim() !== "" &&
        item.detalle.trim() !== "" &&
        !isNaN(item.precio) &&
        item.precio > 0 &&
        !isNaN(item.total) &&
        item.total > 0 &&
        item.cantidad > 0
    );
  };
  const handleNext = () => {
    if (activeStep === 1 && !validateItems()) {
      console.log("1");
      enqueueSnackbar(
        "Existen productos con valores inválidos o campos vacíos. Por favor verifica los datos.",
        {
          variant: "warning",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        }
      );
      return;
    }
    setActiveStep((prevStep: number) => prevStep + 1);
  };
  const handleBack = () => setActiveStep((prevStep: number) => prevStep - 1);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepCliente data={data} setData={setData} />;
      case 1:
        return <StepItems data={data} setData={setData} />;
      case 2:
        return <StepResumen />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setData(localData);
  }, [localData]);

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: "80%",
          borderRadius: "20px",
          height: "110%",
        }}
      >
        <SnackbarProvider />
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={4}>{renderStepContent(activeStep)}</Box>
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            color="primary"
          >
            Atrás
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </Button>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default FacturaEditable;
