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
            let pisosConfig = JSON.parse(localStorage.getItem("pisosConfig") || "null");

            if (!pisosConfig) {
                pisosConfig = await getPisosConfigurados();
                localStorage.setItem("pisosConfig", JSON.stringify(pisosConfig));
            }

            setPisos(pisosConfig);

            if (!piso && pisosConfig.length === 1) {
                router.push(`/gastrobares/tomar-pedido/${pisosConfig[0]}`);
            }

            if (piso) {
                const cacheKey = `mesas-piso-${piso}`;
                let mesasCargadas = JSON.parse(localStorage.getItem(cacheKey) || "null");

                if (!mesasCargadas) {
                    mesasCargadas = await getZonaConfig(parseInt(piso as string));
                    localStorage.setItem(cacheKey, JSON.stringify(mesasCargadas));
                }

                setMesas(mesasCargadas);
            }
        };

        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
