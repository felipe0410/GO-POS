/* eslint-disable react-hooks/rules-of-hooks */
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getPendingKitchenOrders, markOrderAsPrepared } from "@/firebase/cocina";
import OrdenCocina from "../components/OrdenCocina";
import { Timestamp } from "firebase/firestore";

const CocinaView = () => {
    const [ordenes, setOrdenes] = useState<any[]>([]);
    const [mesaSeleccionada, setMesaSeleccionada] = useState("Todas");
    const [vista, setVista] = useState<"individual" | "categorias">("individual");
    const [tick, setTick] = useState(0); // ⏱️ usado para forzar re-render

    const printRefs = useRef<Record<string, any>>({});

    const fetchOrdenes = async () => {
        await getPendingKitchenOrders(setOrdenes);
    };

    useEffect(() => {
        fetchOrdenes();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((prev) => prev + 1);
        }, 60000); // cada 60 segundos
        return () => clearInterval(interval);
    }, []);

    const handlePreparada = async (uid: string) => {
        await markOrderAsPrepared(uid);
        fetchOrdenes();
    };

    const mesasUnicas = Array.from(
        new Set(ordenes.map((orden) => orden.mesa).filter(Boolean))
    );

    const calcularSemaforo = (timestamp: Timestamp) => {
        if (!timestamp?.toDate) return { color: "default", label: "sin hora" };

        const minutos =
            (Date.now() - timestamp.toDate().getTime()) / 1000 / 60;

        if (minutos < 10) return { color: "success", label: `${Math.floor(minutos)} min 🟢` };
        if (minutos < 25) return { color: "warning", label: `${Math.floor(minutos)} min 🟠` };
        return { color: "error", label: `${Math.floor(minutos)} min 🔴` };
    };

    const ordenesFiltradas = mesaSeleccionada === "Todas"
        ? ordenes
        : ordenes.filter((o) => o.mesa === mesaSeleccionada);

    const productosAgrupados = () => {
        const categorias: Record<string, Record<string, number>> = {};

        ordenesFiltradas.forEach((orden) => {
            (orden.compra || []).forEach((producto: any) => {
                const categoria = producto.category?.toUpperCase() || "OTROS";
                const nombre = producto.productName?.toUpperCase() || "SIN NOMBRE";
                if (!categorias[categoria]) categorias[categoria] = {};
                if (!categorias[categoria][nombre]) categorias[categoria][nombre] = 0;
                categorias[categoria][nombre] += producto.cantidad;
            });
        });

        return categorias;
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" fontWeight={800} mb={3}>
                🧑‍🍳 Órdenes de cocina pendientes
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2} mb={3} sx={{ filter: 'invert(1)' }}>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Mesa</InputLabel>
                    <Select
                        value={mesaSeleccionada}
                        label="Mesa"
                        onChange={(e) => setMesaSeleccionada(e.target.value)}
                    >
                        <MenuItem value="Todas">Todas</MenuItem>
                        {mesasUnicas.map((mesa) => (
                            <MenuItem key={mesa} value={mesa}>
                                {mesa}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Vista</InputLabel>
                    <Select
                        value={vista}
                        label="Vista"
                        onChange={(e) => setVista(e.target.value as "individual" | "categorias")}
                    >
                        <MenuItem value="individual">Por orden</MenuItem>
                        <MenuItem value="categorias">Agrupado por categoría</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {vista === "individual" ? (
                <Grid container spacing={2}>
                    {[...ordenesFiltradas]
                        .sort((a, b) => b.timestamp?.toDate?.() - a.timestamp?.toDate?.()) // más reciente primero
                        .map((orden, index, arr) => {
                            const tiempo = calcularSemaforo(orden.timestamp);
                            const numeroOrden = arr.length - index; // numeración desde la más antigua (1) a más reciente (n)
                            return (
                                <Grid item xs={12} md={6} lg={4} key={orden.uid}>
                                    <Paper sx={{ p: 2 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Chip
                                                    label={`#${numeroOrden}`}
                                                    color="info"
                                                    sx={{ fontWeight: 700 }}
                                                />
                                                <Typography fontWeight={700}>
                                                    Mesa: {orden.mesa || "—"}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={tiempo.label}
                                                color={tiempo.color as any}
                                                sx={{ fontWeight: 700 }}
                                            />
                                        </Box>

                                        <div ref={(el: any) => (printRefs.current[orden.uid] = el)}>
                                            <OrdenCocina
                                                facturaActiva={orden}
                                                numeroFactura={orden.uid}
                                                typeInvoice="orden"
                                                setNextStep={() => { }}
                                            />
                                        </div>

                                        <Box display="flex" justifyContent="space-between">
                                            <Button
                                                sx={{ width: '100%', margin: '10px' }}
                                                onClick={() => handlePreparada(orden.uid)}
                                                variant="contained"
                                                color="success"
                                            >
                                                Marcar como preparada
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })}
                </Grid>
            ) : (
                <Box>
                    {Object.entries(productosAgrupados()).map(([categoria, productos]) => (
                        <Box key={categoria} mb={4}>
                            <Typography variant="h6" fontWeight={800} textTransform="uppercase" mb={1}>
                                {categoria}
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Producto</strong></TableCell>
                                            <TableCell align="center"><strong>Cantidad</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(productos).map(([nombre, cantidad]) => (
                                            <TableRow key={nombre}>
                                                <TableCell>{nombre}</TableCell>
                                                <TableCell align="center">{cantidad}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default CocinaView;
