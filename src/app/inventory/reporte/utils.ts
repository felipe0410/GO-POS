// Tipos/helpers para reportes
type FireTs = { seconds: number; nanoseconds?: number };
type CompraItem = { barCode?: string; productName?: string; cantidad?: number; acc?: number; };
type Invoice = {
    id: string; invoice: string; timestamp?: FireTs; date?: string; fechaCreacion?: string;
    subtotal?: number; descuento?: number; total?: number; status?: string;
    name?: string; paymentMethod?: string; compra?: CompraItem[];
};

// Agregaciones existentes
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

// Exportar tipos para uso en otros archivos
export type { GeneralMetrics, ProductRow, Invoice, CompraItem, FireTs };