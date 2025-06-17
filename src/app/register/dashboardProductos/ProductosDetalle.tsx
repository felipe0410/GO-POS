"use client";

import { Box, CircularProgress, Paper, Typography, ToggleButton, ToggleButtonGroup, Grid, Avatar, Divider } from "@mui/material";
import { useProductosContext } from "./context/ProductosContext";

import InventoryIcon from "@mui/icons-material/Inventory2";
import { StyledToggleButton } from "./StyledToggleButton";
import ToggleMetricos from "./ToggleMetricos";
import ProductosTabla from "./ProductosTabla";
import ProductosGrafica from "./ProductosGrafica";
import PromediosResumen from "./PromediosResumen";

export default function ProductosDetalle() {
  const {
    productoInfo,
    productoSeleccionado,
    loading,
    metric,
    mostrarTabla,
    setMostrarTabla
  } = useProductosContext();

  return (
    <Box width={{ xs: "100%", md: "70%" }}>
      <Paper sx={{ backgroundColor: "#2C3248", p: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : productoSeleccionado ? (
          <>
            <PromediosResumen />
            <Paper
              sx={{
                backgroundColor: "#1F2633",
                borderRadius: "16px",
                p: 3,
                mb: 3,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <Grid container spacing={2}>
                {/* Imagen */}
                <Grid item xs={12} sm={4} md={3}>
                  <Box
                    sx={{
                      backgroundColor: "#2C3248",
                      borderRadius: "12px",
                      p: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    {productoInfo?.image ? (
                      <img
                        src={productoInfo?.image}
                        alt={productoInfo?.productName}
                        style={{
                          width: "100%",
                          maxHeight: 180,
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Avatar sx={{ width: 80, height: 80, bgcolor: "#69EAE2" }}>
                        <InventoryIcon sx={{ fontSize: 40, color: "#1F1D2B" }} />
                      </Avatar>
                    )}
                  </Box>
                </Grid>

                {/* Detalles */}
                <Grid item xs={12} sm={8} md={9}>
                  <Typography variant="h5" color="#69EAE2" gutterBottom>
                    {productoInfo?.productName}
                  </Typography>
                  <Typography variant="body1" color="gray" gutterBottom>
                    {productoInfo?.description || "Sin descripción disponible"}
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: "#2C3248" }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="#B0BEC5">
                        <strong>Código de barras:</strong>
                      </Typography>
                      <Typography variant="body1" color="white">
                        {productoInfo?.barCode}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="#B0BEC5">
                        <strong>Precio de venta:</strong>
                      </Typography>
                      <Typography variant="body1" color="white">
                        $ {(productoInfo?.price || 0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="#B0BEC5">
                        <strong>Precio de compra:</strong>
                      </Typography>
                      <Typography variant="body1" color="white">
                        $ {(productoInfo?.purchasePrice || 0)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>

            <ToggleMetricos />

            <ToggleButtonGroup
              exclusive
              value={mostrarTabla ? "tabla" : "grafica"}
              onChange={(e, val) => setMostrarTabla(val === "tabla")}
              sx={{
                mb: 2,
                backgroundColor: "#1F1D2B",
                borderRadius: "12px",
                p: 0.5,
                gap: 1,
              }}
            >
              <StyledToggleButton value="grafica" selected={!mostrarTabla}>
                Ver gráfica
              </StyledToggleButton>
              <StyledToggleButton value="tabla" selected={mostrarTabla}>
                Ver tabla
              </StyledToggleButton>
            </ToggleButtonGroup>


            {mostrarTabla ? <ProductosTabla /> : <ProductosGrafica />}
          </>
        ) : (
          <Typography color="white">Selecciona un producto para ver detalles.</Typography>
        )}
      </Paper>
    </Box>
  );
}
