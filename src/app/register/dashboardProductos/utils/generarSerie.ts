export function generarSerie(
    agrupado: Record<string, { cantidad: number; acc: number }>,
    metric: "ventas" | "cantidad"
) {
    return Object.entries(agrupado).map(([fecha, valores]) => ({
        x: fecha,
        y: metric === "ventas" ? valores.acc : valores.cantidad,
    }));
}
