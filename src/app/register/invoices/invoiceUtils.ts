// utils/invoiceUtils.ts

export const isInRange = (fecha: string, searchTerm: any): boolean => {
  if (Array.isArray(searchTerm) && searchTerm.length === 2) {
    const [start, end] = searchTerm;
    return fecha >= start && fecha <= end;
  }
  return true;
};

export const matchesSearchTerm = (factura: any, searchTerm: any): boolean => {
  if (typeof searchTerm !== "string") return true;
  const term = searchTerm.toLowerCase();
  return (
    factura?.cliente?.name?.toLowerCase().includes(term) ||
    String(factura?.invoice).toLowerCase().includes(term) ||
    String(factura?.status).toLowerCase().includes(term)
  );
};

export const matchesStatus = (factura: any, statusFilter: string): boolean =>
  statusFilter === "Todos" ||
  factura.status.toUpperCase() === statusFilter.toUpperCase();

export const matchesType = (factura: any, typeFilter: string): boolean =>
  typeFilter === "Todos" ||
  (factura.typeInvoice?.toUpperCase() || "FACTURA NORMAL") ===
    typeFilter.toUpperCase();

export const getVentasDelDia = (data: any[], currentDate: string) =>
  data.filter(
    (f) =>
      f.date.split(" ")[0] === currentDate &&
      f.status.toUpperCase() !== "PENDIENTE"
  );

export const getPendientesDelDia = (data: any[], currentDate: string) =>
  data.filter(
    (f) =>
      f.date.split(" ")[0] === currentDate &&
      f.status.toUpperCase() === "PENDIENTE"
  );

export const calcularTotalesMetodoPago = (ventasHoy: any[]) => {
  let efectivo = 0;
  let transferencia = 0;

  for (const f of ventasHoy) {
    const metodo = f.paymentMethod?.toUpperCase();

    if (!metodo || metodo === "EFECTIVO") {
      efectivo += f.total;
    } else if (metodo === "TRANSFERENCIA") {
      transferencia += f.total;
    } else if (metodo === "MIXTO") {
      efectivo += f.vrMixta?.efectivo || 0;
      transferencia += f.vrMixta?.transferencia || 0;
    }
  }

  return { efectivo, transferencia };
};
