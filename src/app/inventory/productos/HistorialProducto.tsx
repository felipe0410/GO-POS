"use client";

import dynamic from "next/dynamic";
import {
    Box,
    Typography,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    Stack,
    Paper,
    Button,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, orderBy, query } from "firebase/firestore";

const ChartDynamic = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
    visible: boolean;
    onBack: () => void;
    uid: string;
    establecimientoId: string;
}

const subcolecciones = {
    "Historial de stock": "historial_stock",
    "Precio de compra": "historial_precio_compra",
    "Precio de venta": "historial_precio_venta",
};

interface Historial {
    anterior: string | number;
    nuevo: string | number;
    fecha: { seconds: number; nanoseconds: number };
    realizado_por: string;
}

export default function HistorialProducto({
    visible,
    onBack,
    uid,
    establecimientoId,
}: Props) {
    const [tipo, setTipo] = useState("Historial de stock");
    const [modoVista, setModoVista] = useState<"tabla" | "grafica">("tabla");
    const [historial, setHistorial] = useState<Historial[]>([]);
    const [loading, setLoading] = useState(false);

    const cargarHistorial = async () => {
        try {
            setLoading(true);
            const ref = collection(
                doc(db, "establecimientos", establecimientoId, "productos", uid),
                subcolecciones[tipo as keyof typeof subcolecciones]
            );
            const q = query(ref, orderBy("fecha", "asc"));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map((doc) => doc.data() as Historial);
            setHistorial(items);
        } catch (error) {
            console.error("Error al cargar historial:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            cargarHistorial();
        }
    }, [visible, tipo]);

    const convertirFecha = (firebaseTimestamp: any) => {
        const date = new Date(firebaseTimestamp.seconds * 1000);
        return new Intl.DateTimeFormat("es-CO", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const limpiarValor = (valor: string | number) => {
        if (typeof valor === "string") {
            return parseInt(valor.replace(/[^0-9]/g, ""), 10) || 0;
        }
        return valor;
    };

    const renderChart = () => {
        const fechas = historial.map((item) => convertirFecha(item.fecha));
        const valores = historial.map((item) => limpiarValor(item.nuevo));

        const maxVal = Math.max(...valores);
        const maxIndex = valores.indexOf(maxVal);

        const options = {
            theme: {
                mode: "dark" as const,
            },
            chart: {
                background: "#1F1D2B",
                foreColor: "#FFF",
            },
            xaxis: {
                categories: fechas,
                labels: { rotate: -45 },
                title: { text: "Fecha" },
            },
            yaxis: {
                labels: {
                    formatter: (val: number) => `$ ${val.toLocaleString("es-CO")}`,
                },
                title: { text: tipo },
            },
            markers: {
                size: [4],
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: maxIndex,
                        fillColor: "#FF5722",
                        strokeColor: "#FFF",
                        size: 8,
                    },
                ],
            },
            tooltip: {
                y: {
                    formatter: (val: number) => `$ ${val.toLocaleString("es-CO")}`,
                },
            },
        };

        const series = [
            {
                name: tipo,
                data: valores,
            },
        ];

        return <ChartDynamic options={options} series={series} type="area" height={340} />;
    };

    if (!visible) return null;

    return (
        <Box p={2} bgcolor="#1F1D2B" color="#FFF" minHeight="100%">
            <Box mb={2} sx={{ display: 'flex' }}>
                <Box >
                    <Button
                        onClick={onBack}
                        variant="outlined"
                        sx={{
                            color: "#FFF",
                            borderColor: "#777",
                            marginRight: '10px',
                            "&:hover": {
                                borderColor: "#FFF",
                                backgroundColor: "#333",
                            },
                        }}
                    >
                        ← Atrás
                    </Button>
                </Box>
                <Typography variant="h6" fontWeight="bold" >
                    📈 Historial del producto
                </Typography>
            </Box>

            <Stack spacing={2}>
                <Select
                    fullWidth
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    variant="outlined"
                    sx={{
                        bgcolor: "#2A2B3C",
                        color: "#FFF",
                        ".MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
                        "& .MuiSvgIcon-root": { color: "#FFF" },
                    }}
                >
                    {Object.keys(subcolecciones).map((label) => (
                        <MenuItem key={label} value={label}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>

                <ToggleButtonGroup
                    value={modoVista}
                    exclusive
                    onChange={(_, newVista) => newVista && setModoVista(newVista)}
                    size="small"
                    color="primary"
                >
                    <ToggleButton value="tabla" sx={{ color: "#FFF", borderColor: "#555" }}>
                        Ver Tabla
                    </ToggleButton>
                    <ToggleButton value="grafica" sx={{ color: "#FFF", borderColor: "#555" }}>
                        Ver Gráfica
                    </ToggleButton>
                </ToggleButtonGroup>

                {loading ? (
                    <Box textAlign="center" mt={3}>
                        <CircularProgress />
                        <Typography mt={1}>Cargando historial...</Typography>
                    </Box>
                ) : historial.length > 0 ? (
                    modoVista === "tabla" ? (
                        <Paper
                            elevation={2}
                            sx={{
                                overflowX: "auto",
                                bgcolor: "#2A2B3C",
                                color: "#FFF",
                            }}
                        >
                            <Table id='table' sx={{ color: '#fff', filter: 'invert(1)' }} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Anterior</b></TableCell>
                                        <TableCell><b>Nuevo</b></TableCell>
                                        <TableCell><b>Fecha</b></TableCell>
                                        <TableCell><b>Responsable</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {historial.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{item.anterior}</TableCell>
                                            <TableCell>{item.nuevo}</TableCell>
                                            <TableCell>{convertirFecha(item.fecha)}</TableCell>
                                            <TableCell>{item.realizado_por}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    ) : (
                        renderChart()
                    )
                ) : (
                    <Typography>No hay historial para mostrar.</Typography>
                )}
            </Stack>


        </Box>
    );
}
