"use client";

import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getZonaConfig, getPisosConfigurados } from "@/firebase";
import { useParams, useRouter } from "next/navigation";

export default function SeleccionMesa({
    onMesaSeleccionada,
}: {
    onMesaSeleccionada: (mesa: any) => void;
}) {
    const [mesas, setMesas] = useState<any[]>([]);
    const [pisos, setPisos] = useState<number[]>([]);
    const { piso } = useParams();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const pisosConfig = await getPisosConfigurados();
            setPisos(pisosConfig);

            if (!piso && pisosConfig.length === 1) {
                // Solo un piso, redirigir automáticamente
                router.push(`/gastrobares/tomar-pedido/${pisosConfig[0]}`);
            }

            if (piso) {
                const mesasCargadas = await getZonaConfig(parseInt(piso as string));
                if (mesasCargadas) setMesas(mesasCargadas);
            }
        };

        init();
    }, [piso]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                Selecciona una mesa para tomar el pedido
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                {mesas?.map((mesa) => (
                    <Paper
                        key={mesa.id}
                        onClick={() => onMesaSeleccionada(mesa)}
                        sx={{
                            p: 2,
                            backgroundColor: "#69EAE2",
                            borderRadius: 3,
                            cursor: "pointer",
                            minWidth: "120px",
                            textAlign: "center",
                            "&:hover": {
                                backgroundColor: "#45d0c9",
                            },
                        }}
                    >
                        <Typography fontWeight="bold" color="#1F1D2B">
                            {mesa.nombre}
                        </Typography>
                        <Typography variant="body2" color="#1F1D2B">
                            {mesa.puestos || "1"} puestos
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}
