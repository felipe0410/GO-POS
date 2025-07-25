import { useEffect, useRef, useState } from "react";
import { isEqual } from "lodash";

export function useFacturas(mesa: any) {
  const [facturas, setFacturas] = useState<{ id: string; name: string; items: any[] }[]>([]);
  const [facturaActiva, setFacturaActiva] = useState(mesa?.nombre || "mesa-desconocida");
  const isFirstRender = useRef(true);

  // Al cambiar la mesa
  useEffect(() => {
    if (!mesa?.nombre) return;
    const nuevaFacturaKey = mesa.nombre;
    const cached = localStorage.getItem(`factura-${nuevaFacturaKey}`);
    const parsed = cached ? JSON.parse(cached) : null;

    setFacturaActiva(nuevaFacturaKey);

    setFacturas((prev) => {
      const yaExiste = prev.find((f) => f.id === nuevaFacturaKey);
      if (yaExiste) return prev;
      return [...prev, { id: nuevaFacturaKey, name: mesa.nombre, items: parsed?.items || [] }];
    });
  }, [mesa]);

  // Sincronizar con localStorage
  useEffect(() => {
    const factura = facturas.find((f) => f.id === facturaActiva);
    if (!factura) return;

    const key = `factura-${facturaActiva}`;
    const cachedStr = localStorage.getItem(key);
    const cached = cachedStr ? JSON.parse(cachedStr) : null;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (cached?.items && Array.isArray(cached.items)) {
        setFacturas((prev) =>
          prev.map((f) =>
            f.id === facturaActiva ? { ...f, items: cached.items } : f
          )
        );
      }
      return;
    }

    if (!isEqual(factura.items, cached?.items)) {
      localStorage.setItem(key, JSON.stringify(factura));
    }
  }, [facturas, facturaActiva]);

  return {
    facturas,
    setFacturas,
    facturaActiva,
    setFacturaActiva,
    productosFacturaActiva: facturas.find((f) => f.id === facturaActiva)?.items || [],
  };
}
