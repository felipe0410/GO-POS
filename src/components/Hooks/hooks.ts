export const getHoraColombia = () => {
    const fechaUTC = new Date();
    const fechaColombia = new Date(
      fechaUTC.toLocaleString("en-US", { timeZone: "America/Bogota" })
    );
    return fechaColombia;
  };