"use client";

import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import CalendarioDias from "../dashboard/CalendarioDias";
import { useProductosContext } from "./context/ProductosContext";
import { generarSerie } from "./utils/generarSerie";


export default function ProductosSidebar() {
    const {
        productosInfoMap,
        productoSeleccionado,
        setProductoSeleccionado,
        setProductoInfo,
        setDatosProducto,
        facturas,
        setPromedios,
        metric,
        dateSearchTerm,
        setDateSearchTerm
    } = useProductosContext();

    const [searchTerm, setSearchTerm] = useState("");

    const productosUnicos: any = Object.entries(productosInfoMap).map(
        ([barCode, info]) => ({
            barCode,
            productName: info.productName || "Nombre desconocido",
        })
    );

    const productosFiltrados = Object.entries(productosInfoMap)
        .map(([barCode, info]) => ({
            barCode,
            productName: info.productName || "Nombre desconocido",
        }))
        .filter((item) => {
            const search = searchTerm.trim().toLowerCase();
            return (
                item.productName.toLowerCase().includes(search) ||
                item.barCode.includes(search)
            );
        });


    const calcularPromedios = (valores: Record<string, { cantidad: number; acc: number }>, tipo: "ventas" | "cantidad") => {
        const fechas = Object.keys(valores).map(f => new Date(f));
        if (fechas.length === 0) return;

        const valoresArray = Object.values(valores);
        const total = valoresArray.reduce((acc, cur) => acc + (tipo === "ventas" ? cur.acc : cur.cantidad), 0);
        const diasUnicos = new Set(fechas.map(f => f.toISOString().split("T")[0]));
        const semanasUnicas = new Set(fechas.map(f => {
            const date = new Date(f);
            date.setDate(date.getDate() - date.getDay()); // inicio de semana
            return date.toISOString().split("T")[0];
        }));
        const mesesUnicos = new Set(fechas.map(f => {
            const date = new Date(f);
            return `${date.getFullYear()}-${date.getMonth() + 1}`;
        }));

        setPromedios({
            diario: total / diasUnicos.size,
            semanal: total / semanasUnicas.size,
            mensual: total / mesesUnicos.size,
        });
    };

    const filtrarPorProducto = async (barCode: string) => {
        setProductoSeleccionado(barCode);
        const info = productosInfoMap[barCode];
        setProductoInfo(info);

        const agrupado: Record<string, { cantidad: number; acc: number }> = {};
        facturas.forEach((factura) => {
            const fecha = factura.timestamp?.seconds
                ? new Date(factura.timestamp.seconds * 1000).toISOString().split("T")[0]
                : factura.date?.split(" ")[0];

            if (!fecha || (dateSearchTerm.length === 2 && (fecha < dateSearchTerm[0] || fecha > dateSearchTerm[1]))) {
                return;
            }
            const dentroDeRango =
                dateSearchTerm.length === 0 ||
                (fecha >= dateSearchTerm[0] && fecha <= (dateSearchTerm[1] || dateSearchTerm[0]));

            if (!dentroDeRango) return;

            factura.compra?.forEach((item: any) => {
                if (item.barCode === barCode) {
                    if (!agrupado[fecha]) agrupado[fecha] = { cantidad: 0, acc: 0 };
                    agrupado[fecha].cantidad += item.cantidad || 0;
                    agrupado[fecha].acc += item.acc || 0;
                }
            });
        });

        calcularPromedios(agrupado, metric);

        const serie = generarSerie(agrupado, metric);
        setDatosProducto(serie);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const search = searchTerm.trim().toLowerCase();

        if (!search) return;

        const producto = productosUnicos.find((item: any) =>
            item.productName.toLowerCase().includes(search) || item.barCode === search
        );

        if (producto) {
            filtrarPorProducto(producto.barCode);
        }
    };

    useEffect(() => {
        if (productoSeleccionado) {
            filtrarPorProducto(productoSeleccionado);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateSearchTerm, metric]);


    return (
        <Box width={{ xs: "100%", md: "30%" }}>
            <Typography variant="h6" color="white" gutterBottom>
                Productos
            </Typography>
            <form onSubmit={handleSearch}>
                <TextField
                    fullWidth
                    placeholder="Buscar por nombre o código..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton type="submit">
                                    <SearchIcon sx={{ color: "#FFF" }} />
                                </IconButton>
                            </InputAdornment>
                        ),
                        style: { color: "#FFF" },
                    }}
                    sx={{ mb: 2, backgroundColor: "#2C3248", borderRadius: 2 }}
                />
            </form>
            <Box
                sx={{
                    display: { lg: "flex", md: "flex", xs: "block" },
                    flexDirection: "row",
                }}
            >
                <CalendarioDias setDateSearchTerm={setDateSearchTerm} setSelectedDate={setDateSearchTerm} />
            </Box>

            <List sx={{ maxHeight: "60vh", overflow: "auto" }}>
                {productosFiltrados.map((item) => (
                    <ListItem
                        button
                        key={item.barCode}
                        selected={productoSeleccionado === item.barCode}
                        onClick={() => filtrarPorProducto(item.barCode)}
                    >
                        <ListItemText primary={item.productName} sx={{ color: "white" }} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
