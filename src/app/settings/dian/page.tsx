/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { getEstablishmentData } from "@/firebase";
import EditIcon from '@mui/icons-material/Edit';
import { createDianRecord, getDianRecord } from "@/firebase/dian";

// Tema personalizado
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#69EAE2" },
    background: { default: "#1F1D2B", paper: "#2C3248" },
    text: { primary: "#FFFFFF", secondary: "#69EAE2" },
  },
  typography: {
    fontFamily: "Nunito, sans-serif",
    fontSize: 14,
  },
});

const DianInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: any) => (
  <FormControl variant="outlined" sx={{ width: "100%" }}>
    <Typography sx={{ color: "#69EAE2", fontWeight: 700 }}>{label}</Typography>
    <OutlinedInput
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      sx={{
        height: "35.9px",
        borderRadius: "0.625rem",
        background: disabled ? "#3a3f54" : "#2C3248",
        color: "#FFF",
      }}
    />
  </FormControl>
);

const Page = () => {
  const [data, setData] = useState({
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
    ValidDateFrom: "",
    ValidDateTo: "",
    TechnicalKey: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const inputOnChange = (field: string, value: any) => {
    if (isEditable) {
      setData({ ...data, [field]: value });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!isEditable) return;

    if (!validateEmail(data.email)) {
      enqueueSnackbar("El correo electrónico no es válido", {
        variant: "error",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }

    try {
      await createDianRecord(data);
      enqueueSnackbar("Datos guardados correctamente en DIAN", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      enqueueSnackbar("Error al guardar los datos", {
        variant: "error",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  const handlePasswordSubmit = () => {
    if (password === "Ab1007446687") {
      setIsEditable(true);
      setPasswordDialogOpen(false);
      enqueueSnackbar("Acceso concedido", { variant: "success" });
    } else {
      enqueueSnackbar("Contraseña incorrecta", { variant: "error" });
    }
  };

  const handleEditClick = () => {
    setPasswordDialogOpen(true);
  };

  useEffect(() => {
    const fetchDianData = async () => {
      setLoading(true);
      try {
        const dianData = await getDianRecord();
        const establishmentData = await getEstablishmentData();

        if (!dianData || !establishmentData) {
          enqueueSnackbar("No existe información disponible", {
            variant: "info",
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
          });
          setLoading(false);
          return;
        }

        setData({
          ...data,
          Prefijo: dianData.Prefijo || "",
          RangoInicio: dianData.RangoInicio || "",
          RangoFin: dianData.RangoFin || "",
          Resolucion: dianData.Resolucion || "",
          ValidDateFrom: dianData.ValidDateFrom || "",
          ValidDateTo: dianData.ValidDateTo || "",
          TechnicalKey: dianData.TechnicalKey || "",
          name: establishmentData.name || "",
          direction: establishmentData.direction || "",
          phone: establishmentData.phone || "",
          NIT: establishmentData.NIT_CC || "",
          email: establishmentData.email || "",
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        enqueueSnackbar("Error al cargar la información", {
          variant: "error",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDianData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Header title="AJUSTES DIAN" />

        <Dialog
          open={passwordDialogOpen}
          onClose={() => setPasswordDialogOpen(false)}
        >
          <DialogTitle>Acceso Restringido</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ingrese la contraseña para habilitar la edición de datos.
            </DialogContentText>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: "100%", marginTop: "1rem" }}
              placeholder="Contraseña"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => setPasswordDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              sx={{ background: "#69EAE2", color: "#1F1D2B" }}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        <Box
          sx={{
            padding: "2rem",
            backgroundColor: "background.default",
            borderRadius: "20px",
            marginTop: "30px",
            width: "95%",
          }}
        >
          <Paper
            sx={{
              padding: "2rem",
              backgroundColor: "background.paper",
              borderRadius: "20px",
            }}
          >
            {loading ? (
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress color="primary" />
                <Typography>Cargando datos...</Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="h5"
                    sx={{ color: "#69EAE2", marginBottom: "1rem" }}
                  >
                    INFORMACION DEL ESTABLECIMIENTO
                  </Typography>
                  <Button onClick={handleEditClick} endIcon={<EditIcon />}>
                    Editar
                  </Button>
                </Box>
                <DianInput
                  label="Prefijo"
                  value={data.Prefijo}
                  onChange={(e: { target: { value: any } }) =>
                    inputOnChange("Prefijo", e.target.value)
                  }
                  placeholder={undefined}
                  disabled={!isEditable}
                />
                <DianInput
                  label="Rango Inicio"
                  value={data.RangoInicio}
                  onChange={(e: { target: { value: any } }) =>
                    inputOnChange("RangoInicio", e.target.value)
                  }
                  placeholder={undefined}
                  disabled={!isEditable}
                />
                <DianInput
                  label="Rango Fin"
                  value={data.RangoFin}
                  onChange={(e: { target: { value: any } }) =>
                    inputOnChange("RangoFin", e.target.value)
                  }
                  placeholder={undefined}
                  disabled={!isEditable}
                />
                <DianInput
                  label="Correo Electrónico"
                  value={data.email}
                  onChange={(e: { target: { value: any } }) =>
                    inputOnChange("email", e.target.value)
                  }
                  placeholder="ejemplo@correo.com"
                  disabled={!isEditable}
                />
                <DianInput
                  label="Resolución"
                  value={data.Resolucion}
                  onChange={(e: { target: { value: any } }) =>
                    inputOnChange("Resolucion", e.target.value)
                  }
                  placeholder={undefined}
                  disabled={!isEditable}
                />
                <DianInput
                  label="Fecha de Validez Desde"
                  value={data.ValidDateFrom}
                  onChange={(e: { target: { value: any } }) =>
                    inputOnChange("ValidDateFrom", e.target.value)
                  }
                  placeholder="YYYY-MM-DD"
                  disabled={!isEditable}
                />
                <DianInput
                  label="Fecha de Validez Hasta"
                  value={data.ValidDateTo}
                  onChange={(e: { target: { value: any } }) =>
                    inputOnChange("ValidDateTo", e.target.value)
                  }
                  placeholder="YYYY-MM-DD"
                  disabled={!isEditable}
                />
                <DianInput
                  label="Clave Técnica"
                  value={data.TechnicalKey}
                  onChange={(e: { target: { value: any } }) =>
                    inputOnChange("TechnicalKey", e.target.value)
                  }
                  placeholder={undefined}
                  disabled={!isEditable}
                />

                <Divider sx={{ marginY: "1.5rem", background: "#69EAE2" }} />

                <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                  <Button
                    sx={{ background: "#FF0404", color: "#FFF" }}
                    onClick={() =>
                      setData({
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
                        ValidDateFrom: "",
                        ValidDateTo: "",
                        TechnicalKey: "",
                      })
                    }
                  >
                    Cancelar
                  </Button>
                  <Button
                    sx={{ background: "#69EAE2", color: "#1F1D2B" }}
                    onClick={handleSave}
                  >
                    Guardar
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Page;
