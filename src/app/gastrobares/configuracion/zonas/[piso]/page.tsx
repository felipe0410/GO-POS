"use client";
import { useParams } from "next/navigation";
import {
    Box,
    Typography,
    Stack,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    InputLabel,
    Tabs,
    Tab,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { getZonaConfig, saveZonaConfig } from "@/firebase";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

const ELEMENTOS_EXTRA = [
    { tipo: "entrada", color: "#ff9800" },
    { tipo: "barra", color: "#9c27b0" },
    { tipo: "muro", color: "#607d8b" },
    { tipo: "cocina", color: "#3f51b5" },
    { tipo: "baño", color: "#795548" },
];

type ElementoPlano = {
    id: string;
    tipo: "mesa" | "decorativo";
    subtipo?: string;
    nombre: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    puestos?: number;
    forma?: "cuadrada" | "redonda" | "rectangular";
};

export default function ZonaPorPiso() {
    const { piso } = useParams();
    const [elementos, setElementos] = useState<ElementoPlano[]>([]);
    const [editando, setEditando] = useState<ElementoPlano | null>(null);
    const [tab, setTab] = useState(0);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const data = JSON.parse(e.dataTransfer.getData("elemento"));
        const offsetX = e.nativeEvent.offsetX;
        const offsetY = e.nativeEvent.offsetY;

        const nuevo: ElementoPlano = {
            id: Date.now().toString(),
            tipo: data.tipo === "mesa" ? "mesa" : "decorativo",
            subtipo: data.tipo !== "mesa" ? data.tipo : undefined,
            forma: data.forma,
            puestos: data.tipo === "mesa" && data.forma === "rectangular" ? 6 : 4,
            nombre: data.tipo === "mesa"
                ? `Mesa ${elementos.filter((e) => e.tipo === "mesa").length + 1}`
                : data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1),
            x: offsetX,
            y: offsetY,
            width: data.forma === "rectangular" ? 100 : 60,
            height: 60,
            color: data.color,
        };

        setElementos((prev) => [...prev, nuevo]);
    };

    const actualizarElemento = (id: string, updates: Partial<ElementoPlano>) => {
        setElementos((prev) =>
            prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
        );
    };

    const handleGuardar = async () => {
        const success = await saveZonaConfig(Number(piso), elementos);
        if (success) {
            enqueueSnackbar("Zona guardada exitosamente", { variant: "success" });
        } else {
            enqueueSnackbar("Error al guardar zona", { variant: "error" });
        }
    };

    useEffect(() => {
        const cargarZona = async () => {
            const config = await getZonaConfig(Number(piso));
            if (config) {
                setElementos(config);
            }
        };
        cargarZona();
    }, [piso]);


    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#121212", color: "white" }}>
            {/* Panel lateral */}
            <SnackbarProvider />
            <Box
                sx={{
                    width: 250,
                    p: 3,
                    borderRight: "1px solid #333",
                    bgcolor: "#1e1e1e",
                }}
            >
                <Button onClick={() => setEditando(null)}>Cancelar</Button>
                <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
                <Typography variant="h6" gutterBottom>
                    Piso {piso}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    Elementos: <Chip label={elementos.length} size="small" color="primary" />
                </Typography>

                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                    <Tab label="Mesas" />
                    <Tab label="Extras" />
                </Tabs>

                <Stack spacing={2}>
                    {tab === 0 && ["cuadrada", "redonda", "rectangular"].map((forma) => (
                        <Paper
                            key={forma}
                            draggable
                            onDragStart={(e) =>
                                e.dataTransfer.setData(
                                    "elemento",
                                    JSON.stringify({ tipo: "mesa", forma, color: "#4caf50" })
                                )
                            }
                            sx={{
                                width: "100%",
                                height: 60,
                                bgcolor: "#4caf50",
                                color: "white",
                                borderRadius: forma === "redonda" ? "50%" : "8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "grab",
                                fontWeight: "bold",
                            }}
                        >
                            {forma.charAt(0).toUpperCase() + forma.slice(1)}
                        </Paper>
                    ))}

                    {tab === 1 && ELEMENTOS_EXTRA.map((item) => (
                        <Paper
                            key={item.tipo}
                            draggable
                            onDragStart={(e) =>
                                e.dataTransfer.setData(
                                    "elemento",
                                    JSON.stringify({ tipo: item.tipo, color: item.color })
                                )
                            }
                            sx={{
                                width: "100%",
                                height: 60,
                                bgcolor: item.color,
                                color: "white",
                                borderRadius: "4px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "grab",
                                fontWeight: "bold",
                            }}
                        >
                            {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                        </Paper>
                    ))}
                </Stack>
            </Box>

            {/* Área de diseño */}
            <Box
                sx={{
                    flex: 1,
                    position: "relative",
                    bgcolor: "#1a1a1a",
                    overflow: "hidden",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {elementos.map((el) => (
                    <Rnd
                        key={el.id}
                        size={{ width: el.width, height: el.height }}
                        position={{ x: el.x, y: el.y }}
                        onDragStop={(_, d) => actualizarElemento(el.id, { x: d.x, y: d.y })}
                        onResizeStop={(_, __, ref, ___, pos) =>
                            actualizarElemento(el.id, {
                                width: parseInt(ref.style.width),
                                height: parseInt(ref.style.height),
                                x: pos.x,
                                y: pos.y,
                            })
                        }
                        bounds="parent"
                    >
                        <Box
                            onDoubleClick={() => setEditando(el)}
                            sx={{
                                width: "100%",
                                height: "100%",
                                borderRadius: el.forma === "redonda" ? "50%" : "8px",
                                bgcolor: el.color,
                                color: "white",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "bold",
                                position: "absolute",
                                cursor: "move",
                                userSelect: "none",
                                textAlign: "center",
                                px: 1,
                            }}
                        >
                            {el.nombre}
                        </Box>
                    </Rnd>
                ))}
            </Box>

            <Dialog open={!!editando} onClose={() => setEditando(null)}>
                <DialogTitle>Editar elemento</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nombre"
                        fullWidth
                        margin="dense"
                        value={editando?.nombre || ""}
                        onChange={(e) =>
                            setEditando((prev) =>
                                prev ? { ...prev, nombre: e.target.value } : prev
                            )
                        }
                    />
                    {editando?.tipo === "mesa" && (
                        <TextField
                            label="Número de puestos"
                            type="number"
                            fullWidth
                            margin="dense"
                            inputProps={{ min: 1 }}
                            value={editando?.puestos || ""}
                            onChange={(e) =>
                                setEditando((prev) =>
                                    prev ? { ...prev, puestos: parseInt(e.target.value) } : prev
                                )
                            }
                        />
                    )}
                    <InputLabel sx={{ mt: 2 }}>Color</InputLabel>
                    <input
                        type="color"
                        value={editando?.color || "#4caf50"}
                        onChange={(e) =>
                            setEditando((prev) =>
                                prev ? { ...prev, color: e.target.value } : prev
                            )
                        }
                        style={{ width: "100%", height: 40, border: "none" }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
