"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Divider,
} from "@mui/material";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import { createInvoiceParking } from "@/firebase/parking";
import dayjs from "dayjs";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ConfigureTariffsDialog from "./ConfigureTariffsDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import { ParkingTicket } from "./ParkingTicket";

const ParkingSelector = () => {
  const [vehicleType, setVehicleType] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    plate: "",
    ownerPhone: "",
    note: "Sin datos adicionales",
  });
  const [tariffs, setTariffs] = useState({ car: 5000, motorcycle: 3000 });
  const [isSaving, setIsSaving] = useState(false);
  const [tariffsDialogOpen, setTariffsDialogOpen] = useState(false);
  const [showTicket, setShowTicket] = useState(false); // Nuevo estado para mostrar el ticket

  const handleTariffsSave = (
    newTariffs: React.SetStateAction<{ car: number; motorcycle: number }>
  ) => {
    setTariffs(newTariffs);
    enqueueSnackbar("Tarifas actualizadas con éxito.", {
      variant: "success",
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(true);
    }
  }, [isMobile]);

  const handleVehicleTypeChange = (type: string) => {
    setVehicleType(type);
    if (isMobile) {
      setDrawerOpen(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const formattedValue =
      name === "plate" ? value.replace(/\s+/g, "").toUpperCase() : value;
    setVehicleData({ ...vehicleData, [name]: formattedValue });
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setVehicleData({ plate: "", ownerPhone: "", note: "" });
      setVehicleType("");
      setDrawerOpen(false);
      setShowTicket(false);
    }
  };

  const handleSaveVehicle = async () => {
    if (
      !vehicleType ||
      !vehicleData.plate.trim() ||
      !vehicleData.ownerPhone.trim()
    ) {
      enqueueSnackbar(
        "Por favor selecciona el tipo de vehículo y completa todos los campos obligatorios.",
        {
          variant: "error",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        }
      );
      return;
    }

    const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const dataToSave = {
      type: vehicleType,
      plate: vehicleData.plate,
      phone: vehicleData.ownerPhone,
      note: vehicleData.note,
      entryTime: currentTime,
    };

    try {
      setIsSaving(true);
      await createInvoiceParking("1", dataToSave);
      enqueueSnackbar("Datos guardados con éxito.", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      setShowTicket(true);
    } catch (error) {
      enqueueSnackbar("Ocurrió un error al guardar los datos.", {
        variant: "error",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      p={2}
      sx={{
        backgroundColor: "#1F1D2B",
        minHeight: "90%",
        color: "white",
        borderRadius: "20px",
        textAlign: "center",
      }}
    >
      <SnackbarProvider />
      <Typography
        variant={isMobile ? "h6" : "h5"}
        gutterBottom
        sx={{ color: "#69EAE2" }}
      >
        SELECCIONA EL VEHÍCULO
      </Typography>

      <Grid
        container
        justifyContent="center"
        spacing={isMobile ? 1 : 3}
        sx={{ marginBottom: isMobile ? 1 : 2 }}
      >
        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: vehicleType === "car" ? "#69EAE2" : "#2C2A3A",
              color: vehicleType === "car" ? "#1F1D2B" : "white",
              cursor: "pointer",
            }}
            onClick={() => handleVehicleTypeChange("car")}
          >
            <CardActionArea>
              <DirectionsCarFilledIcon
                fontSize="large"
                sx={{ fontSize: isMobile ? "150px" : "300px" }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  CARRO
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor:
                vehicleType === "motorcycle" ? "#69EAE2" : "#2C2A3A",
              color: vehicleType === "motorcycle" ? "#1F1D2B" : "white",
              cursor: "pointer",
            }}
            onClick={() => handleVehicleTypeChange("motorcycle")}
          >
            <CardActionArea>
              <TwoWheelerIcon
                fontSize="large"
                sx={{ fontSize: isMobile ? "150px" : "300px" }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  MOTO
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              backgroundColor:
                vehicleType === "motorcycle" ? "#69EAE2" : "#2C2A3A",
              color: vehicleType === "motorcycle" ? "#1F1D2B" : "white",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={() => setTariffsDialogOpen(true)}
          >
            <CardActionArea>
              <SettingsIcon
                fontSize="large"
                sx={{ fontSize: isMobile ? "150px" : "300px" }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  Configurar Tarifas
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <ConfigureTariffsDialog
            open={tariffsDialogOpen}
            onClose={() => setTariffsDialogOpen(false)}
            tariffs={tariffs}
            onSave={handleTariffsSave}
          />
        </Grid>
      </Grid>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={isMobile ? () => toggleDrawer(false) : undefined}
        variant={isMobile ? "temporary" : "persistent"}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100vw" : 350,
            height: "100%",
          },
        }}
      >
        {showTicket ? (
          <>
            <ParkingTicket
              licensePlate={vehicleData.plate}
              ownerPhone={vehicleData.ownerPhone}
              note={vehicleData?.note ?? "sin nota"}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={() => toggleDrawer(false)}
              sx={{ mt: 2, backgroundColor: "#69EAE2", color: "#1F1D2B" }}
            >
              Finalizar
            </Button>
          </>
        ) : (
          <Box
            p={3}
            sx={{
              backgroundColor: "#1F1D2B",
              color: "white",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{ color: "#69EAE2" }}
            >
              DATOS DEL VEHÍCULO
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#fff", marginBottom: 1, fontWeight: 500 }}
            >
              PLACA DEL VEHICULO
            </Typography>
            <TextField
              name="plate"
              value={vehicleData.plate}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": { color: "#fff" },
                  "& fieldset": { borderColor: "#69EAE2" },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {vehicleType === "car" ? (
                      <DirectionsCarFilledIcon sx={{ color: "#fff" }} />
                    ) : (
                      <TwoWheelerIcon sx={{ color: "#fff" }} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Typography
              variant="body1"
              sx={{ color: "#fff", marginBottom: 1, fontWeight: 500 }}
            >
              CELULAR DEL DUEÑO
            </Typography>
            <TextField
              name="ownerPhone"
              type="tel"
              value={vehicleData.ownerPhone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {" "}
                    <WhatsAppIcon sx={{ color: "#fff" }} />{" "}
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": { color: "#fff" },
                  "& fieldset": { borderColor: "#69EAE2" },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
              }}
            />
            <TextField
              label="Nota (opcional)"
              name="note"
              value={vehicleData.note}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              minRows={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& textarea": { color: "#fff" },
                  "& fieldset": { borderColor: "#69EAE2" },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
              }}
            />

            <Box mt={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSaveVehicle}
                sx={{
                  backgroundColor: "#69EAE2",
                  color: "#1F1D2B",
                }}
              >
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </Box>

            <Box mt={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => toggleDrawer(false)}
                sx={{
                  borderColor: "#69EAE2",
                  color: "#69EAE2",
                }}
              >
                Cerrar
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default ParkingSelector;
