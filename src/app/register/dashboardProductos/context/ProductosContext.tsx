// context/ProductosContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAllInvoicesData, getProductData } from "@/firebase";

type ProductoInfo = {
    productName: string;
    description?: string;
    price?: number;
    purchasePrice?: number;
    image?: string;
    barCode?: string;
};
type Factura = {
    timestamp?: { seconds: number };
    date?: string;
    compra?: {
        barCode: string;
        cantidad?: number;
        acc?: number;
    }[];
};

type Promedios = {
    diario: number;
    semanal: number;
    mensual: number;
};

type ProductosContextType = {
    facturas: Factura[];
    setFacturas: React.Dispatch<React.SetStateAction<Factura[]>>;
    productosInfoMap: Record<string, ProductoInfo>;
    productoSeleccionado: string | null;
    setProductoSeleccionado: React.Dispatch<React.SetStateAction<string | null>>;
    productoInfo: ProductoInfo | null;
    setProductoInfo: React.Dispatch<React.SetStateAction<ProductoInfo | null>>;
    metric: "ventas" | "cantidad";
    setMetric: React.Dispatch<React.SetStateAction<"ventas" | "cantidad">>;
    datosProducto: { x: string; y: number }[];
    setDatosProducto: React.Dispatch<React.SetStateAction<{ x: string; y: number }[]>>;
    dateSearchTerm: string[];
    setDateSearchTerm: React.Dispatch<React.SetStateAction<string[]>>;
    promedios: Promedios;
    setPromedios: React.Dispatch<React.SetStateAction<Promedios>>;
    mostrarTabla: boolean;
    setMostrarTabla: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProductosContext = createContext<ProductosContextType | null>(null);

export const ProductosProvider = ({ children }: { children: ReactNode }) => {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [productosInfoMap, setProductosInfoMap] = useState<Record<string, ProductoInfo>>({});
    const [productoSeleccionado, setProductoSeleccionado] = useState<string | null>(null);
    const [productoInfo, setProductoInfo] = useState<ProductoInfo | null>(null);
    const [metric, setMetric] = useState<"ventas" | "cantidad">("ventas");
    const [datosProducto, setDatosProducto] = useState<{ x: string; y: number }[]>([]);
    const [dateSearchTerm, setDateSearchTerm] = useState<string[]>([]);
    const [promedios, setPromedios] = useState<Promedios>({ diario: 0, semanal: 0, mensual: 0 });
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllInvoicesData((data: Factura[]) => {
            setFacturas(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const cargarProductos = async () => {
            const codigos = Array.from(new Set(facturas.flatMap(f => f.compra?.map((c: any) => c.barCode) || [])));
            const map: Record<string, ProductoInfo> = {};

            await Promise.all(codigos.map(async code => {
                const data = await getProductData(code);
                if (data && typeof data.productName === "string") {
                    map[code] = {
                        productName: data.productName,
                        description: data.description,
                        price: data.price,
                        purchasePrice: data.purchasePrice,
                        image: data.image,
                    };
                }
            }));

            setProductosInfoMap(map);
        };

        if (facturas.length > 0) cargarProductos();
    }, [facturas]);

    return (
        <ProductosContext.Provider
            value={{
                facturas,
                setFacturas,
                productosInfoMap,
                productoSeleccionado,
                setProductoSeleccionado,
                productoInfo,
                setProductoInfo,
                metric,
                setMetric,
                datosProducto,
                setDatosProducto,
                dateSearchTerm,
                setDateSearchTerm,
                promedios,
                setPromedios,
                mostrarTabla,
                setMostrarTabla,
                loading,
                setLoading,
            }}
        >
            {children}
        </ProductosContext.Provider>
    );
};

export const useProductosContext = () => {
    const context = useContext(ProductosContext);
    if (!context) throw new Error("useProductosContext debe usarse dentro de ProductosProvider");
    return context;
};
