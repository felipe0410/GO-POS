"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useProductosContext } from "./context/ProductosContext";
import { color } from "html2canvas/dist/types/css/types/color";

export default function ToggleMetricos() {
    const { metric, setMetric } = useProductosContext();

    const handleChange = (_: any, newMetric: "ventas" | "cantidad" | null) => {
        if (newMetric) setMetric(newMetric);
    };

    return (
        <ToggleButtonGroup
            exclusive
            value={metric}
            onChange={handleChange}
            sx={{
                mb: 2,
                backgroundColor: "#1F1D2B",
                borderRadius: "12px",
                p: 0.5,
                gap: 1,
            }}
        >
            <StyledToggleButton value="ventas" selected={metric === "ventas"}>
                Valor vendido
            </StyledToggleButton>
            <StyledToggleButton value="cantidad" selected={metric === "cantidad"}>
                Número de unidades
            </StyledToggleButton>
        </ToggleButtonGroup>
    );
}

// Estilo base y dinámico para cada toggle
const StyledToggleButton = ({
    value,
    selected,
    children,
}: {
    value: string;
    selected: boolean;
    children: React.ReactNode;
}) => (
    <ToggleButton
        value={value}
        style={{
            color: selected ? "#ffff" : "#B0BEC5",
        }}
        sx={{
            color: selected ? "#ffff" : "#B0BEC5",
            backgroundColor: selected ? "#69EAE2" : "#2C3248",
            fontWeight: 600,
            borderRadius: "10px",
            px: 3,
            py: 1,
            boxShadow: selected
                ? "0 0 8px rgba(105, 234, 226, 0.6)"
                : "inset 0 0 0 1px #2C3248",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
                backgroundColor: selected ? "#58cfc9" : "#374151",
                color: "#FFF",
            },
        }}
    >
        {children}
    </ToggleButton>
);
