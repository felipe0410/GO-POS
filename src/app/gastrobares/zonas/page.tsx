"use client";
import Header from "@/components/Header";
import {
    Box,
    Typography,
    Button,
    Card,
    CardActionArea,
    CardMedia,
    Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const VistaPisosConImagen = () => {
    const [pisos, setPisos] = useState(3);
    const router = useRouter();

    const handleClick = (piso: number) => {
        router.push(`/gastrobares/configuracion/zonas/${piso}`);
    };


    const agregarPiso = () => {
        if (pisos < 10) {
            setPisos(pisos + 1);
        }
    };

    const quitarPiso = () => {
        if (pisos > 1) {
            setPisos(pisos - 1);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Header title="Configurar estructura" />

            {/* Controles */}
            <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 4 }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={agregarPiso}
                    disabled={pisos >= 10}
                >
                    + Agregar piso
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={quitarPiso}
                    disabled={pisos <= 1}
                >
                    - Quitar piso
                </Button>
            </Stack>

            {/* Vista de pisos */}
            <Stack direction="column-reverse" spacing={2} alignItems="center">
                {Array.from({ length: pisos }, (_, i) => {
                    const pisoNumero = i + 1;
                    const image =
                        pisoNumero === 1
                            ? "/restaurant/entrada.png"
                            : "/restaurant/piso.png";

                    return (
                        <Card
                            key={pisoNumero}
                            sx={{
                                width: 400,
                                borderRadius: 2,
                                boxShadow: 4,
                                cursor: "pointer",
                                background: "transparent",
                                margin: "0",
                            }}
                            onClick={() => handleClick(pisoNumero)}
                        >
                            <CardActionArea sx={{ margin: "0" }}>
                                <CardMedia
                                    component="img"
                                    image={image}
                                    alt={`Piso ${pisoNumero}`}
                                    sx={{
                                        objectFit: "cover",
                                        margin: "0",
                                    }}
                                />
                            </CardActionArea>
                        </Card>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default VistaPisosConImagen;
