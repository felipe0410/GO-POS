"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useProductosContext } from "./context/ProductosContext";

const PromediosResumen = () => {
    const { promedios, metric, datosProducto } = useProductosContext();

    const formatValor = (valor: number) =>
        metric === "ventas"
            ? `$ ${valor.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`
            : `${Math.round(valor).toLocaleString("es-CO")} uds`;

    const total = datosProducto.reduce((acc: number, d: any) => acc + d.y, 0);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "15px",
            }}
        >
            <ResumenCard
                label="Promedio diario"
                valor={formatValor(promedios.diario)}
                bg="#1A1F2E"
                border="#69EAE2"
            />
            <ResumenCard
                label="Promedio semanal"
                valor={formatValor(promedios.semanal)}
                bg="#1E2A30"
                border="#42A5F5"
            />
            <ResumenCard
                label="Promedio mensual"
                valor={formatValor(promedios.mensual)}
                bg="#1C2C1E"
                border="#81C784"
            />
            <ResumenCard
                label="Total en el periodo"
                valor={formatValor(total)}
                bg="#2A1D2E"
                border="#AB47BC"
            />
        </Box>
    );
};

interface ResumenCardProps {
    label: string;
    valor: string;
    bg: string;
    border: string;
}

const ResumenCard: React.FC<ResumenCardProps> = ({ label, valor, bg, border }) => (
    <Paper sx={cardStyles(bg, border)}>
        <Typography variant="h6" sx={titleStyles}>
            {label}
        </Typography>
        <Typography variant="h3" sx={numberStyles}>
            {valor}
        </Typography>
    </Paper>
);

const cardStyles = (backgroundColor: string, borderColor: string) => ({
    padding: "20px",
    flex: "1 1 calc(25% - 15px)",
    background: backgroundColor,
    color: "#FFF",
    textAlign: "center",
    borderRadius: "12px",
    border: `2px solid ${borderColor}`,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
    },
});

const titleStyles = {
    fontSize: "1rem",
    fontWeight: 500,
    textTransform: "uppercase",
    color: "#BDBDBD",
};

const numberStyles = {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#FFF",
};

export default PromediosResumen;
