export const getHoraColombia = () => {
  const opciones: Intl.DateTimeFormatOptions = {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formateador = new Intl.DateTimeFormat("en-GB", opciones);
  const partes = formateador.formatToParts(new Date());

  const obtenerValor = (type: string) =>
    partes.find((p) => p.type === type)?.value || "00";

  const año = obtenerValor("year");
  const mes = obtenerValor("month");
  const día = obtenerValor("day");
  const hora = obtenerValor("hour");
  const minuto = obtenerValor("minute");
  const segundo = obtenerValor("second");

  // 🕒 Construir fecha ISO segura
  const isoString = `${año}-${mes}-${día}T${hora}:${minuto}:${segundo}`;
  return new Date(isoString);
};
