"use client";

import Header from "@/components/Header";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    InputBase,
    Paper,
    Pagination,
    Skeleton,
    Typography,
    useMediaQuery,
    useTheme,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Stack,
    Tabs,
    Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useCallback, useMemo, useState } from "react";
import CalendarioReportes from "./CalendarioReportes";
import { epochMs, getInvoicesByDateRange, saveReportIfOlderThan30Days } from "@/firebase";

// ---------------- Tipos/helpers existentes ----------------
type FireTs = { seconds: number; nanoseconds?: number };
type CompraItem = { barCode?: string; productName?: string; cantidad?: number; acc?: number; };
type Invoice = {
    id: string; invoice: string; timestamp?: FireTs; date?: string; fechaCreacion?: string;
    subtotal?: number; descuento?: number; total?: number; status?: string;
    name?: string; paymentMethod?: string; compra?: CompraItem[];
};


// MOCK: reemplaza por getInvoicesByDateRange(start,end)
async function mockFetchInvoices(start: Date, end: Date, searchTerm: string): Promise<Invoice[]> {
    const base: Invoice[] = Array.from({ length: 12 }).map((_, idx) => {
        const d = new Date(start.getTime() + (idx * (end.getTime() - start.getTime())) / 12);
        const withTs = idx % 2 === 0;
        const compra: CompraItem[] = [
            { barCode: "7702168217308", productName: "RON VIEJO CALDAS 750 ML", cantidad: (idx % 3) + 1, acc: 115000 },
            { barCode: "7706434112755", productName: "Lider azul 750", cantidad: (idx % 2) + 1, acc: 100000 },
        ];
        const subtotal = compra.reduce((s, it) => s + (it.acc ?? 0) * (it.cantidad ?? 0), 0);
        const descuento = (idx % 5) * 2500;
        const total = subtotal - descuento;
        return {
            id: `mock-${idx}`,
            invoice: (1450 + idx).toString().padStart(7, "0"),
            ...(withTs
                ? { timestamp: { seconds: Math.floor(d.getTime() / 1000) } }
                : idx % 3 === 0
                    ? { fechaCreacion: new Date(d.getTime() + 60_000).toISOString() }
                    : { date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` }),
            subtotal, descuento, total,
            status: idx % 7 === 0 ? "ANULADO" : "CANCELADO",
            name: idx % 2 === 0 ? "donata" : "JUAN PABLO SANTOS",
            paymentMethod: idx % 3 === 0 ? "Efectivo" : "Transferencia",
            compra,
        };
    });

    const filtered = base
        .filter((i) => {
            const t = epochMs(i);
            return t >= start.getTime() && t <= end.getTime();
        })
        .filter((i) => {
            if (!searchTerm) return true;
            const hay = [
                i.invoice, i.name, i.status, i.paymentMethod, i.date, i.fechaCreacion,
                ...(i.compra ?? []).map(c => `${c.productName} ${c.barCode}`)
            ].filter(Boolean).join(" ").toLowerCase();
            return hay.includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => epochMs(b) - epochMs(a));

    return filtered;
}

const styleViewActive = {
    borderRadius: "0.625rem",
    background: "#69EAE2",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
};

// ---------------- Agregaciones existentes ----------------
type GeneralMetrics = {
    facturas: number; ventasBrutas: number; descuentoTotal: number; ventasNetas: number; ticketPromedio: number;
    porMetodoPago: Record<string, number>;
};
export function computeGeneralMetrics(rows: Invoice[]): GeneralMetrics {

    const facturasValidas = rows.filter(r => r.status !== "ANULADO");
    const ventasBrutas = facturasValidas.reduce((s, r) => s + (r.subtotal ?? 0), 0);
    const descuentoTotal = facturasValidas.reduce((s, r) => s + (r.descuento ?? 0), 0);
    const ventasNetas = facturasValidas.reduce((s, r) => s + (r.total ?? ((r.subtotal ?? 0) - (r.descuento ?? 0))), 0);
    const facturas = facturasValidas.length;
    const ticketPromedio = facturas ? Math.round(ventasNetas / facturas) : 0;
    const porMetodoPago: Record<string, number> = {};
    facturasValidas.forEach(r => {
        const k = r.paymentMethod ?? "Sin método";
        porMetodoPago[k] = (porMetodoPago[k] ?? 0) + (r.total ?? ((r.subtotal ?? 0) - (r.descuento ?? 0)));
    });
    return { facturas, ventasBrutas, descuentoTotal, ventasNetas, ticketPromedio, porMetodoPago };
}

type ProductRow = {
    key: string; barCode?: string; productName?: string;
    unidades: number; precioUnitProm: number; precioUnitUltimo?: number;
    ventasBrutas: number; ventasNetas: number;
};
export function computeProductMetrics(rows: Invoice[]): ProductRow[] {
    const facturas = rows.filter(r => r.status !== "ANULADO" && (r.compra?.length ?? 0) > 0);

    type Acc = { unidades: number; bruto: number; sumPrecioPorCant: number; precioUnitUltimo?: number; barCode?: string; productName?: string; };
    const accMap = new Map<string, Acc>();
    const ventasNetasPorKey = new Map<string, number>();

    for (const f of facturas) {
        const items = f.compra ?? [];
        const brutoFactura = items.reduce((s, it) => s + (it.acc ?? 0) * (it.cantidad ?? 0), 0);
        const desc = f.descuento ?? 0;

        for (const it of items) {
            const codigo = (it.barCode ?? "").trim();
            const nombre = (it.productName ?? "").trim();
            const key = `${codigo}|${nombre}`;
            const cantidad = it.cantidad ?? 0;
            const unit = it.acc ?? 0;
            const lineBruto = unit * cantidad;
            const prop = brutoFactura > 0 ? (lineBruto / brutoFactura) : 0;
            const lineDesc = Math.round(desc * prop);
            const lineNeto = lineBruto - lineDesc;

            const prev = accMap.get(key) ?? { unidades: 0, bruto: 0, sumPrecioPorCant: 0, precioUnitUltimo: undefined, barCode: codigo || undefined, productName: nombre || undefined };
            accMap.set(key, {
                unidades: prev.unidades + cantidad,
                bruto: prev.bruto + lineBruto,
                sumPrecioPorCant: prev.sumPrecioPorCant + unit * cantidad,
                precioUnitUltimo: unit,
                barCode: prev.barCode ?? (codigo || undefined),
                productName: prev.productName ?? (nombre || undefined),
            });

            ventasNetasPorKey.set(key, (ventasNetasPorKey.get(key) ?? 0) + lineNeto);
        }
    }

    const out: ProductRow[] = [];
    for (const [key, v] of accMap) {
        const ventasNetas = ventasNetasPorKey.get(key) ?? 0;
        const precioUnitProm = v.unidades ? Math.round(v.sumPrecioPorCant / v.unidades) : 0;
        out.push({
            key, barCode: v.barCode, productName: v.productName,
            unidades: v.unidades, precioUnitProm, precioUnitUltimo: v.precioUnitUltimo,
            ventasBrutas: v.bruto, ventasNetas,
        });
    }
    out.sort((a, b) => b.unidades - a.unidades);
    return out;
}

// ---------------- NUEVO: utilidades CSV/Descarga ----------------
function csvEscape(value: any): string {
    const s = value === null || value === undefined ? "" : String(value);
    // Comillas si tiene coma, comilla o salto de línea
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

function toCSV(rows: Record<string, any>[], headers: string[]): string {
    const headerLine = headers.map(csvEscape).join(",");
    const lines = rows.map(r => headers.map(h => csvEscape(r[h])).join(","));
    // BOM para Excel
    return "\uFEFF" + [headerLine, ...lines].join("\n");
}

function downloadCSV(filename: string, csv: string) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function fmtYMD(d?: Date | null): string {
    if (!d) return "NA";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

// ---------------- Página ----------------
const Page = () => {
    // KPIs provenientes del reporte (cache o live)
    const [generalFromCache, setGeneralFromCache] = useState<GeneralMetrics | null>(null);
    const [productosFromCache, setProductosFromCache] = useState<ProductRow[] | null>(null);
    const [reportSource, setReportSource] = useState<"cache" | "live" | null>(null);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));

    // Calendario
    const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

    // UI state
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<Invoice[] | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [reportTab, setReportTab] = useState<0 | 1>(0); // 0: General, 1: Productos

    // Paginación (para tabla de facturas del reporte general)
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = useMemo(() => Math.ceil((rows?.length ?? 0) / itemsPerPage) || 1, [rows]);
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return rows?.slice(start, start + itemsPerPage) ?? [];
    }, [rows, currentPage]);

    const canGenerate = !!range.start && !!range.end;

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = (e.currentTarget.elements[1] as HTMLInputElement)?.value ?? "";
        const norm = input.replace(/\s+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        setSearchTerm(norm);
    };

    const handleGenerate = useCallback(async () => {
        if (!range.start || !range.end) return;
        setLoading(true);
        setCurrentPage(1);
        try {
            // ✅ Usa la función que cachea si el rango termina hace ≥30 días
            const res = await saveReportIfOlderThan30Days(range.start, range.end);

            setReportSource(res.source);
            setGeneralFromCache(res.general);
            setProductosFromCache(res.productos);

            // Si es live, te vienen las facturas para la tabla/CSV de facturas.
            // Si es cache, por defecto NO trae invoices (puedes cargarlas bajo demanda).
            if (res.source === "live") {
                setRows(res.invoices as any);
            } else {
                setRows([]); // opcional: dejar vacío y mostrar chip "Reporte cacheado"
            }
        } finally {
            setLoading(false);
        }
    }, [range.start, range.end]);

    // KPIs
    const general = useMemo<GeneralMetrics>(
        () => generalFromCache ?? computeGeneralMetrics(rows ?? []),
        [generalFromCache, rows]
    );
    const productos = useMemo<ProductRow[]>(
        () => productosFromCache ?? computeProductMetrics(rows ?? []),
        [productosFromCache, rows]
    );
    // ---------------- NUEVO: Exportadores ----------------
    const exportGeneralCSV = () => {
        const filename = `reporte-general_${fmtYMD(range.start)}_a_${fmtYMD(range.end)}.csv`;
        // Resumen general (una fila)
        const resumenRow = [{
            facturas: general.facturas,
            ventas_brutas: general.ventasBrutas,
            descuentos: general.descuentoTotal,
            ventas_netas: general.ventasNetas,
            ticket_promedio: general.ticketPromedio,
        }];
        const resumenHeaders = ["facturas", "ventas_brutas", "descuentos", "ventas_netas", "ticket_promedio"];

        // Método de pago (múltiples filas)
        const mpRows = Object.entries(general.porMetodoPago).map(([metodo, valor]) => ({ metodo_pago: metodo, ventas_netas: valor }));
        const mpHeaders = ["metodo_pago", "ventas_netas"];

        // Facturas (opcional, detallado)
        const facturasRows = (rows ?? []).map(r => {
            const when = epochMs(r) ? new Date(epochMs(r)).toISOString() : "";
            const bruto = r.subtotal ?? 0;
            const desc = r.descuento ?? 0;
            const neto = r.total ?? (bruto - desc);
            return {
                factura: r.invoice,
                fecha_iso: when,
                cliente: r.name ?? "",
                metodo_pago: r.paymentMethod ?? "",
                bruto, descuento: desc, neto,
                estado: r.status ?? "",
            };
        });
        const factHeaders = ["factura", "fecha_iso", "cliente", "metodo_pago", "bruto", "descuento", "neto", "estado"];

        // Unimos en un solo CSV con separadores visuales
        const bloque1 = toCSV(resumenRow, resumenHeaders);
        const bloque2 = toCSV(mpRows, mpHeaders);
        const bloque3 = toCSV(facturasRows, factHeaders);

        // Quitamos BOM duplicados al concatenar (primer bloque ya lo tiene)
        const concat = [
            bloque1,
            "\n\nVentas por método de pago\n",
            bloque2.replace(/^\uFEFF/, ""),
            "\n\nDetalle de facturas\n",
            bloque3.replace(/^\uFEFF/, "")
        ].join("");

        downloadCSV(filename, concat);
    };

    const exportProductosCSV = () => {
        const filename = `reporte-productos_${fmtYMD(range.start)}_a_${fmtYMD(range.end)}.csv`;
        const rowsP = productos.map(p => ({
            codigo: p.barCode ?? "",
            producto: p.productName ?? "",
            unidades: p.unidades,
            precio_unit_prom: p.precioUnitProm,
            precio_unit_ultimo: p.precioUnitUltimo ?? "",
            ventas_brutas: p.ventasBrutas,
            ventas_netas: p.ventasNetas,
        }));
        const headers = ["codigo", "producto", "unidades", "precio_unit_prom", "precio_unit_ultimo", "ventas_brutas", "ventas_netas"];
        const csv = toCSV(rowsP, headers);
        downloadCSV(filename, csv);
    };

    const exportFacturasCSV = () => {
        const filename = `reporte-facturas_${fmtYMD(range.start)}_a_${fmtYMD(range.end)}.csv`;
        const rowsF = (rows ?? []).map(r => {
            const when = epochMs(r) ? new Date(epochMs(r)).toISOString() : "";
            const bruto = r.subtotal ?? 0;
            const desc = r.descuento ?? 0;
            const neto = r.total ?? (bruto - desc);
            return {
                factura: r.invoice,
                fecha_iso: when,
                cliente: r.name ?? "",
                metodo_pago: r.paymentMethod ?? "",
                bruto, descuento: desc, neto,
                estado: r.status ?? "",
            };
        });
        const headers = ["factura", "fecha_iso", "cliente", "metodo_pago", "bruto", "descuento", "neto", "estado"];
        const csv = toCSV(rowsF, headers);
        downloadCSV(filename, csv);
    };

    return (
        <Box id="page reportes" sx={{ height: "78%" }}>
            <Header title="REPORTES" />
            <Box sx={{ mt: "2rem", height: "100%" }}>
                <Box>
                    <Typography sx={{ color: "#FFF", fontFamily: "Nunito Sans", fontSize: { sm: "20px", md: "32px" }, fontWeight: 700 }}>
                        GENERAR REPORTE
                    </Typography>
                    <Typography sx={{ color: "#FFF", fontFamily: "Nunito", fontSize: "1rem", mt: "0.6rem" }}>
                        Elige un rango de meses y genera el consolidado. Soporta facturas antiguas (sin <code>timestamp</code>) y nuevas (con <code>timestamp</code>).
                    </Typography>
                </Box>

                <Paper
                    sx={{ width: "95%", minHeight: "90%", mt: "2rem", borderRadius: "0.625rem", background: "#1F1D2B", boxShadow: "0px 1px 100px -50px #69EAE2" }}
                >
                    <Box sx={{ p: { xs: "30px 2px 30px 10px ", sm: "40px 48px" }, height: "100%", textAlign: "-webkit-center" }}>
                        {/* Controles superiores */}
                        <Box sx={{ display: { sm: "block", md: "flex" }, justifyContent: "space-between", gap: 2, alignItems: "center" }}>
                            {/* Buscador opcional para filtrar listado de facturas */}
                            <Box display={"flex"}>
                                <Paper
                                    component="form"
                                    onSubmit={handleSearchSubmit}
                                    sx={{ display: "flex", alignItems: "center", color: "#fff", width: { xs: "100%", sm: "15.875rem" }, height: "2rem", borderRadius: "0.3125rem", background: "#2C3248" }}
                                >
                                    <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                                        <SearchIcon sx={{ color: "#fff" }} />
                                    </IconButton>
                                    <InputBase sx={{ ml: 1, flex: 1, color: "#fff" }} placeholder="Buscar en facturas" />
                                </Paper>
                            </Box>

                            {/* Calendario + botón */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                                <Box sx={{ width: { xs: "100%", md: "22rem" } }}>
                                    <CalendarioReportes onRangeChange={setRange} />
                                </Box>
                                <Button onClick={handleGenerate} disabled={!canGenerate || loading} sx={canGenerate ? { ...styleViewActive } : {}}>
                                    <Typography sx={{ color: canGenerate ? "#1F1D2B" : "#FFF", fontFamily: "Nunito", fontSize: "0.875rem", fontWeight: 800 }}>
                                        {loading ? "Generando..." : "GENERAR REPORTE"}
                                    </Typography>
                                </Button>
                                <Button
                                    onClick={async () => {
                                        if (!range.start || !range.end) return;
                                        setLoading(true);
                                        try {
                                            // Carga solo el detalle cuando el usuario lo pide
                                            const invoices = await getInvoicesByDateRange(range.start, range.end);
                                            setRows(invoices as any);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={reportSource !== "cache" || loading}
                                    sx={{ border: "1px solid #69EAE2", ml: 1 }}
                                >
                                    <Typography sx={{ color: "#69EAE2", fontWeight: 800, fontSize: "0.875rem" }}>
                                        Cargar detalle (Facturas)
                                    </Typography>
                                </Button>

                            </Box>
                        </Box>

                        <Divider sx={{ background: "#69EAE2", mt: 2, mb: 2 }} />

                        {/* Tabs de reporte */}
                        <Tabs
                            value={reportTab}
                            onChange={(_, v) => setReportTab(v)}
                            textColor="inherit"
                            TabIndicatorProps={{ style: { background: "#69EAE2" } }}
                            sx={{ ".MuiTab-root": { color: "#fff", fontWeight: 700 } }}
                        >
                            <Tab label="Análisis general" />
                            <Tab label="Análisis por producto" />
                        </Tabs>
                        {/* Botones de exportación */}
                        <Button
                            onClick={exportGeneralCSV}
                            disabled={!rows || rows.length === 0 || loading}
                            sx={{ border: "1px solid #69EAE2" }}
                        >
                            <Typography sx={{ color: "#69EAE2", fontWeight: 800, fontSize: "0.875rem" }}>
                                Exportar CSV (General)
                            </Typography>
                        </Button>

                        <Button
                            onClick={exportProductosCSV}
                            disabled={!rows || rows.length === 0 || loading}
                            sx={{ border: "1px solid #69EAE2" }}
                        >
                            <Typography sx={{ color: "#69EAE2", fontWeight: 800, fontSize: "0.875rem" }}>
                                Exportar CSV (Productos)
                            </Typography>
                        </Button>


                        {/* Contenido de cada reporte */}
                        {reportTab === 0 ? (
                            <>
                                {/* KPIs generales */}
                                <Box sx={{ mt: 2, width: "100%" }}>
                                    {loading ? (
                                        <Stack direction="row" gap={2} justifyContent="center">
                                            <Skeleton variant="rounded" width={180} height={60} />
                                            <Skeleton variant="rounded" width={180} height={60} />
                                            <Skeleton variant="rounded" width={180} height={60} />
                                            <Skeleton variant="rounded" width={180} height={60} />
                                        </Stack>
                                    ) : (
                                        <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center">
                                            {reportSource && (
                                                <Chip
                                                    sx={{ background: reportSource === "cache" ? "#2C3248" : "#69EAE2", border: "1px solid #69EAE2", ml: 1 }}
                                                    label={<Typography sx={{ color: "#fff" }}>
                                                        {reportSource === "cache" ? "Reporte cacheado" : "Reporte en vivo"}
                                                    </Typography>}
                                                />
                                            )}

                                            <Chip sx={{ background: "#69EAE2" }} label={<Typography sx={{ color: "#1F1D2B", fontWeight: 700 }}>Facturas: {general.facturas}</Typography>} />
                                            <Chip sx={{ background: "#69EAE2" }} label={<Typography sx={{ color: "#1F1D2B", fontWeight: 700 }}>Ventas brutas: ${general.ventasBrutas.toLocaleString()}</Typography>} />
                                            <Chip sx={{ background: "#69EAE2" }} label={<Typography sx={{ color: "#1F1D2B", fontWeight: 700 }}>Descuentos: ${general.descuentoTotal.toLocaleString()}</Typography>} />
                                            <Chip sx={{ background: "#69EAE2" }} label={<Typography sx={{ color: "#1F1D2B", fontWeight: 700 }}>Ventas netas: ${general.ventasNetas.toLocaleString()}</Typography>} />
                                            <Chip sx={{ background: "#69EAE2" }} label={<Typography sx={{ color: "#1F1D2B", fontWeight: 700 }}>Ticket promedio: ${general.ticketPromedio.toLocaleString()}</Typography>} />
                                        </Stack>
                                    )}
                                </Box>

                                {/* Breakdown por método de pago */}
                                {!loading && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography sx={{ color: "#69EAE2", fontWeight: 800, mb: 1 }}>Ventas por método de pago</Typography>
                                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                                            {Object.entries(general.porMetodoPago).map(([k, v]) => (
                                                <Chip key={k} sx={{ background: "#2C3248", border: "1px solid #69EAE2" }} label={<Typography sx={{ color: "#fff" }}>{k}: ${v.toLocaleString()}</Typography>} />
                                            ))}
                                            {Object.keys(general.porMetodoPago).length === 0 && <Typography sx={{ color: "#fff" }}>—</Typography>}
                                        </Box>
                                    </Box>
                                )}

                                {/* Tabla de facturas (opcional) */}
                                <Box sx={{ mt: 2, width: "95%", mx: "auto" }}>
                                    {loading ? (
                                        <Skeleton variant="rounded" height={320} />
                                    ) : (
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: "#69EAE2" }}>Factura</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }}>Fecha</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }}>Cliente</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }} align="right">Bruto</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }} align="right">Desc</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }} align="right">Neto</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }}>Estado</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {currentData.map((r) => {
                                                    const when = epochMs(r) ? new Date(epochMs(r)).toLocaleString() : "-";
                                                    const bruto = r.subtotal ?? 0;
                                                    const desc = r.descuento ?? 0;
                                                    const neto = r.total ?? (bruto - desc);
                                                    return (
                                                        <TableRow key={r.id}>
                                                            <TableCell sx={{ color: "#fff" }}>{r.invoice}</TableCell>
                                                            <TableCell sx={{ color: "#fff" }}>{when}</TableCell>
                                                            <TableCell sx={{ color: "#fff" }}>{r.name ?? "-"}</TableCell>
                                                            <TableCell sx={{ color: "#fff" }} align="right">${bruto.toLocaleString()}</TableCell>
                                                            <TableCell sx={{ color: "#fff" }} align="right">${desc.toLocaleString()}</TableCell>
                                                            <TableCell sx={{ color: "#fff" }} align="right">${neto.toLocaleString()}</TableCell>
                                                            <TableCell sx={{ color: "#fff" }}>{r.status}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                {currentData.length === 0 && (
                                                    <TableRow>
                                                        <TableCell sx={{ color: "#fff" }} colSpan={7} align="center">
                                                            No hay facturas para el rango/criterios seleccionados.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    )}
                                    {/* Paginación */}
                                    <Box id="pagination" sx={{ filter: "invert(1)", display: "flex", justifyContent: "center", mt: "20px" }}>
                                        <Pagination
                                            count={totalPages}
                                            page={currentPage}
                                            onChange={(_, p) => setCurrentPage(p)}
                                            shape="circular"
                                            size={matches ? "large" : "small"}
                                        />
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <>
                                {/* KPIs por producto */}
                                <Box sx={{ mt: 2, width: "100%" }}>
                                    {loading ? (
                                        <Stack direction="row" gap={2} justifyContent="center">
                                            <Skeleton variant="rounded" width={220} height={60} />
                                            <Skeleton variant="rounded" width={220} height={60} />
                                            <Skeleton variant="rounded" width={220} height={60} />
                                        </Stack>
                                    ) : (
                                        <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center">
                                            <Chip sx={{ background: "#69EAE2" }} label={<Typography sx={{ color: "#1F1D2B", fontWeight: 700 }}>Productos vendidos: {productos.length}</Typography>} />
                                            <Chip sx={{ background: "#69EAE2" }} label={<Typography sx={{ color: "#1F1D2B", fontWeight: 700 }}>Unidades totales: {productos.reduce((s, p) => s + p.unidades, 0)}</Typography>} />
                                            <Chip sx={{ background: "#69EAE2" }} label={<Typography sx={{ color: "#1F1D2B", fontWeight: 700 }}>Ventas netas: ${productos.reduce((s, p) => s + p.ventasNetas, 0).toLocaleString()}</Typography>} />
                                        </Stack>
                                    )}
                                </Box>

                                {/* Tabla por producto */}
                                <Box sx={{ mt: 2, width: "95%", mx: "auto" }}>
                                    {loading ? (
                                        <Skeleton variant="rounded" height={360} />
                                    ) : (
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: "#69EAE2" }}>Código</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }}>Producto</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }} align="right">Unidades</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }} align="right">Precio Unit. (Prom)</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }} align="right">Precio Unit. (Último)</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }} align="right">Ventas brutas</TableCell>
                                                    <TableCell sx={{ color: "#69EAE2" }} align="right">Ventas netas</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {productos.map((p) => (
                                                    <TableRow key={p.key}>
                                                        <TableCell sx={{ color: "#fff" }}>{p.barCode ?? "-"}</TableCell>
                                                        <TableCell sx={{ color: "#fff" }}>{p.productName ?? "-"}</TableCell>
                                                        <TableCell sx={{ color: "#fff" }} align="right">{p.unidades}</TableCell>
                                                        <TableCell sx={{ color: "#fff" }} align="right">${p.precioUnitProm.toLocaleString()}</TableCell>
                                                        <TableCell sx={{ color: "#fff" }} align="right">{p.precioUnitUltimo ? `$${p.precioUnitUltimo.toLocaleString()}` : "-"}</TableCell>
                                                        <TableCell sx={{ color: "#fff" }} align="right">${p.ventasBrutas.toLocaleString()}</TableCell>
                                                        <TableCell sx={{ color: "#fff" }} align="right">${p.ventasNetas.toLocaleString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {productos.length === 0 && (
                                                    <TableRow>
                                                        <TableCell sx={{ color: "#fff" }} colSpan={7} align="center">
                                                            No hay ventas por producto para el rango seleccionado.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Page;
