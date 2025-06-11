"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const InvoiceDialog = ({
  open,
  client,
  onClose,
}: {
  open: boolean;
  client: any;
  onClose: () => void;
}) => {
  if (!client) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent
        sx={{
          backgroundColor: "#1F1D2B",
          color: "#FFFFFF",
          padding: { xs: 2, sm: 4 },
          borderRadius: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#292C36",
            padding: { xs: 2, sm: 3 },
            borderRadius: 3,
            border: "2px solid #69EAE2",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{ width: 100, height: 100, bgcolor: "gray", mb: 2 }}
            src={client.foto || ""}
          >
            {!client.foto && <PersonIcon fontSize="large" />}
          </Avatar>

          <Typography variant="h5" sx={{ color: "#69EAE2", fontWeight: "bold" }}>
            Carnet del Cliente
          </Typography>

          <Divider sx={{ width: "100%", backgroundColor: "#69EAE2", my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Nombre:</strong> {client.nombre}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Cédula:</strong> {client.cedula}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Correo:</strong> {client.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Teléfono:</strong> {client.telefono}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Dirección:</strong> {client.direccion}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Estado:</strong> {client.estado}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ backgroundColor: "#444", my: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography><strong>Plan:</strong> {client.plan_internet?.nombre}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Precio del Plan:</strong> ${parseFloat(client?.precio_plan || "0").toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Instalación:</strong> {client.fecha_instalacion}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Router:</strong> {client.modelo_router_wifi}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>IP Router:</strong> {client.ip_router_wifi}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Box textAlign="right" mt={3}>
          <Button variant="outlined" sx={{ color: "#69EAE2", borderColor: "#69EAE2" }} onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
