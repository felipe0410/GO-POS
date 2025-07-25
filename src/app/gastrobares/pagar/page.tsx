'use client'
import {
    Box,
    Typography,
    Paper,
    Grid,
    Drawer,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { getPendingKitchenOrders } from "@/firebase/cocina";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { createInvoice, db, InvoiceNumber, user } from "@/firebase";
import { useReactToPrint } from "react-to-print";
import OrdenCocina from "../components/OrdenCocina";
import Factura from "@/app/register/invoices/Factura";
import React from "react";
import { filter } from "lodash";

const FacturasPorMesa = () => {
    const [facturas, setFacturas] = useState<any[]>([]);
    const [mesaSeleccionada, setMesaSeleccionada] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [metodoPago, setMetodoPago] = useState("EFECTIVO");
    const [facturaUnificada, setFacturaUnificada] = useState<any | null>(null);
    const [mostrarFactura, setMostrarFactura] = useState(false);
    const componentRef: any = React.useRef();

    const agruparCompraPorBarCode = (compraTotal: any[]) => {
        const agrupado: Record<string, any> = {};
        for (const item of compraTotal) {
            const codigo = item.barCode;
            if (!agrupado[codigo]) {
                agrupado[codigo] = { ...item };
            } else {
                agrupado[codigo].cantidad += item.cantidad;
                agrupado[codigo].acc += item.acc;
            }
        }
        return Object.values(agrupado);
    };

    useEffect(() => {
        const unsubscribe: any = getPendingKitchenOrders(setFacturas);
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    const mesas = Array.from(new Set(facturas.map((f) => f.mesa).filter(Boolean)));
    const facturasDeMesa = mesaSeleccionada ? facturas.filter((f) => f.mesa === mesaSeleccionada) : [];
    const total = facturasDeMesa.reduce((sum, f) => sum + (f.total || 0), 0);

    const handleMesaClick = async (mesa: string) => {
        setMesaSeleccionada(mesa);
        const ordenes = facturas.filter((f) => f.mesa === mesa);
        if (ordenes.length > 0) {
            const compraSinAgrupar = ordenes.flatMap((orden) => orden.compra || []);
            const compraAgrupada = agruparCompraPorBarCode(compraSinAgrupar);
            const subtotal = compraAgrupada.reduce((sum, item) => sum + item.acc, 0);
            const total = subtotal;
            const { nextNumber } = await InvoiceNumber();
            const baseFactura = {
                ...ordenes[0],
                compra: compraAgrupada,
                subtotal,
                total,
                date: new Date().toLocaleString("sv-SE", {
                    timeZone: "America/Bogota",
                    hour12: false,
                }).replace("T", " ").slice(0, 16),
                invoice: nextNumber,
                status: "CANCELADO",
                nota: "",
            };
            setFacturaUnificada(baseFactura);
        } else {
            setFacturaUnificada(null);
        }
        setDrawerOpen(true);
    };

    const pagarFacturas = async () => {
        try {
            // 1. Cancelar todas las facturas pendientes de la mesa
            for (const factura of facturasDeMesa) {
                const ref = doc(
                    db,
                    "establecimientos",
                    user().decodedString,
                    "invoices",
                    factura.id
                );
                await updateDoc(ref, {
                    status: "CANCELADO",
                    paymentMethod: metodoPago,
                    timestampPago: Timestamp.now(),
                });
            }

            // 2. Crear la nueva factura unificada (si existe)
            if (facturaUnificada) {
                const { nextNumber } = await InvoiceNumber();
                await createInvoice(nextNumber, {
                    ...facturaUnificada,
                    invoice: nextNumber,
                    uid: `${nextNumber}-${crypto.randomUUID().slice(0, 8)}`,
                    status: "PENDIENTE",
                    orden_preparada: false,
                    paymentMethod: metodoPago,
                    fechaCreacion: Timestamp.now(),
                });
                setMostrarFactura(true);
            }
            //setDrawerOpen(false);
            setMesaSeleccionada(null);
        } catch (error) {
            console.error("❌ Error al pagar o crear la factura:", error);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => {
            const content = componentRef.current;
            return content;
        },
    });

    return (
        <Box p={2}>
            <Typography variant="h5" fontWeight={800} mb={2} color="#fff">
                🧾 Mesas con facturas pendientes
            </Typography>

            <Grid container spacing={2}>
                {mesas.map((mesa) => {
                    const cantidad = facturas.filter((f) => f.mesa === mesa).length;
                    return (
                        <Grid item xs={6} sm={4} md={3} key={mesa}>
                            <Paper
                                onClick={() => handleMesaClick(mesa)}
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    bgcolor: "#2a2838",
                                    color: "#fff",
                                    transition: "0.2s",
                                    ":hover": { bgcolor: "#38344d" },
                                }}
                            >
                                <Typography variant="h6" fontWeight={700}>
                                    Mesa {mesa}
                                </Typography>
                                <Chip label={`${cantidad} órdenes`} color="primary" sx={{ filter: 'invert(1)' }} />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setMostrarFactura(false);
                }}
            >
                <Box sx={{ width: 380, p: 3, bgcolor: "#1f1d2b", color: "white", minHeight: "100%" }}>
                    {mostrarFactura && facturaUnificada ? (
                        <Box
                            ref={componentRef}
                            sx={{
                                "@media print": {
                                    "@page": {
                                        size: `${componentRef?.current?.clientWidth}px ${componentRef?.current?.clientHeight * 1.1
                                            }px`,
                                    },
                                    width: "100%",
                                },
                            }}
                        >
                            <Factura data={facturaUnificada} setFacturaData={function (value: any): void {
                                throw new Error("Function not implemented.");
                            }} />
                            <Button
                                onClick={handlePrint}
                                sx={{
                                    width: "100%",
                                    height: "2.1875rem",
                                }}
                                style={{ borderRadius: "0.5rem", background: "#69EAE2" }}
                            >
                                <Typography
                                    sx={{
                                        color: "#1F1D2B",
                                        fontFamily: "Nunito",
                                        fontSize: "0.75rem",
                                        fontStyle: "normal",
                                        fontWeight: 800,
                                        lineHeight: "140%",
                                    }}
                                >
                                    IMPRIMIR
                                </Typography>
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="h6" fontWeight={700} mb={2}>
                                🧾 Factura consolidada - Mesa {mesaSeleccionada}
                            </Typography>

                            <Divider sx={{ mb: 2, borderColor: "gray" }} />

                            <Typography variant="body1" mb={1}>
                                Cantidad de órdenes: {facturasDeMesa.length}
                            </Typography>

                            <Typography variant="body1" fontWeight={600} mb={2}>
                                Total: ${total.toLocaleString()}
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Método de pago</InputLabel>
                                <Select
                                sx={{filter:'invert(1)'}}
                                    value={metodoPago}
                                    label="Método de pago"
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                >
                                    <MenuItem value="EFECTIVO">Efectivo</MenuItem>
                                    <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
                                    <MenuItem value="MIXTO">Mixto</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                fullWidth
                                variant="contained"
                                color="success"
                                onClick={pagarFacturas}
                            >
                                Confirmar pago
                            </Button>

                            {facturaUnificada && (
                                <>
                                    <Divider sx={{ my: 2, borderColor: "gray" }} />
                                    <Typography variant="body1" fontWeight={600} mb={1}>
                                        Productos:
                                    </Typography>
                                    {facturaUnificada.compra.map((item: any, i: number) => (
                                        <Box key={i} sx={{ mb: 1 }}>
                                            <Typography variant="body1">
                                                {item.cantidad} x {item.productName} — ${item.acc.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </Box>
            </Drawer >

            <Divider sx={{ my: 4, bgcolor: "#555" }} />

            <Typography variant="h6" fontWeight={800} mb={2} color="#fff">
                📋 Detalle de órdenes por mesa
            </Typography>

            {
                mesas.map((mesa) => {
                    const ordenes = facturas.filter((f) => f.mesa === mesa);
                    return (
                        <Accordion
                            key={mesa}
                            sx={{
                                mb: 1,
                                bgcolor: "#2a2838",
                                color: "#fff",

                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                                <Typography fontWeight={700}>Mesa {mesa}</Typography>
                                <Chip label={`${ordenes.length} órdenes`} sx={{ ml: 2, filter: 'invert(1)' }} />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex' }}>
                                    {ordenes.map((orden) => (
                                        <Paper
                                            key={orden.id}
                                            sx={{margin:'10px'}}
                                        >
                                            <OrdenCocina
                                                facturaActiva={orden}
                                                numeroFactura={orden.invoice}
                                                typeInvoice="orden"
                                                setNextStep={() => { }}
                                            />
                                        </Paper>
                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    );
                })
            }
        </Box >
    );
};

export default FacturasPorMesa;
