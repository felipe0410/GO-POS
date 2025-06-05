import React from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Presentacion {
  tipo: string;
  codigoBarra: string;
  factor: string;
  precio: string;
  cantidadEquivalente: number;
  porcentajeEquivalencia: number;
}

interface Props {
  presentaciones: Presentacion[];
  setPresentaciones: React.Dispatch<React.SetStateAction<Presentacion[]>>;
  open: boolean;
  toggleOpen: () => void;
  openDrawer: boolean;
  setOpenDrawer: any;
  cantidad: number | string;
}

export default function PresentacionesProducto({
  presentaciones,
  setPresentaciones,
  open,
  toggleOpen,
  openDrawer,
  setOpenDrawer,
  cantidad
}: Props) {
  const addPresentacion = () => {
    setPresentaciones((prev) => [
      ...prev,
      { tipo: "", codigoBarra: "", factor: "", precio: "", porcentajeEquivalencia: 0, cantidadEquivalente: 0 },
    ]);
  };

  const removePresentacion = (indexToRemove: number) => {
    setPresentaciones((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const updatePresentacionesConEquivalentes = (
    lista: Presentacion[],
    cantidadBase: number
  ) => {
    return lista.map((p, i) => {
      const cantidadEquivalente = lista
        .slice(0, i + 1)
        .reduce((acc, p) => {
          const factor = parseFloat(p.factor || "1");
          return acc * (isNaN(factor) ? 1 : factor);
        }, cantidadBase);
      console.log('cantidadEquivalente:::>', cantidadEquivalente)
      console.log('cantidadBase:::>', cantidadBase)
      const porcentajeEquivalencia = (cantidadBase / cantidadEquivalente);
      console.log('porcentajeEquivalencia:::>', porcentajeEquivalencia)
      return {
        ...p, cantidadEquivalente, porcentajeEquivalencia: +porcentajeEquivalencia.toFixed(5),
      };
    });
  };



  const updatePresentacion = (index: number, field: string, value: string) => {
    const cantidadNumerica = parseFloat(cantidad as string);
    if (isNaN(cantidadNumerica)) return;

    const newPresentaciones: any = [...presentaciones];
    newPresentaciones[index][field as keyof Presentacion] = value;

    const actualizadas = updatePresentacionesConEquivalentes(
      newPresentaciones,
      cantidadNumerica
    );

    setPresentaciones(actualizadas);
  };

  React.useEffect(() => {
    const cantidadNumerica = parseFloat(cantidad as string);
    if (isNaN(cantidadNumerica)) return;

    const actualizadas = updatePresentacionesConEquivalentes(
      presentaciones,
      cantidadNumerica
    );
    setPresentaciones(actualizadas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cantidad]);



  return (
    <Drawer
      anchor="left"
      open={openDrawer}
      onClose={() => setOpenDrawer(false)}
      PaperProps={{
        sx: {
          backgroundColor: "#1F1D2B",
          width: { xs: "100%", sm: "400px" },
        },
      }}
    >
      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="outlined"
          onClick={toggleOpen}
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            color: "#69EAE2",
            borderColor: "#69EAE2",
            borderRadius: "10px",
            marginBottom: 1,
          }}
        >
          {open ? "Ocultar presentaciones" : "Agregar presentaciones"}
        </Button>

        <Collapse in={open}>
          <Box
            sx={{
              border: "1px solid #444",
              padding: "1rem",
              borderRadius: "10px",
              background: "#2C3248",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#FFF", marginBottom: 2, fontWeight: "bold" }}
            >
              Agregar producto hijo
            </Typography>

            {presentaciones.map((p, idx) => (
              <Box
                key={idx}
                sx={{
                  marginBottom: 3,
                  paddingLeft: `${idx * 30}px`,
                  borderLeft: idx > 0 ? "2px dashed #69EAE2" : "none",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#69EAE2", marginBottom: 1 }}
                >
                  Nivel {idx + 1}: {p.tipo || "(sin tipo)"}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {[
                    { label: "Tipo", key: "tipo" },
                    { label: "Código de barras", key: "codigoBarra" },
                    { label: "Cantidad contenida", key: "factor", type: "number" },
                  ].map((input) => (
                    <TextField
                      key={input.key}
                      label={input.label}
                      type={input.type || "text"}
                      value={p[input.key as keyof Presentacion]}
                      onChange={(e) =>
                        updatePresentacion(idx, input.key, e.target.value)
                      }
                      InputProps={{ sx: { color: "#FFF" } }}
                      InputLabelProps={{ sx: { color: "#FFF" } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#69EAE2" },
                          "&:hover fieldset": { borderColor: "#69EAE2" },
                          "&.Mui-focused fieldset": { borderColor: "#69EAE2" },
                        },
                      }}
                      size="small"
                      helperText={
                        input.key === "factor"
                          ? idx === 0
                            ? "Equivale a sí mismo"
                            : `Equivale a ${p.factor} del nivel anterior`
                          : undefined
                      }
                    />
                  ))}

                  <TextField
                    label="Precio"
                    type="number"
                    value={p.precio}
                    onChange={(e) => updatePresentacion(idx, "precio", e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: "#FFF" }}>
                          $
                        </InputAdornment>
                      ),
                      sx: { color: "#FFF" },
                    }}
                    InputLabelProps={{ sx: { color: "#FFF" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#69EAE2" },
                        "&:hover fieldset": { borderColor: "#69EAE2" },
                        "&.Mui-focused fieldset": { borderColor: "#69EAE2" },
                      },
                    }}
                    size="small"
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "#69EAE2", marginTop: 1 }}
                >
                  {`Equivale a ${p.cantidadEquivalente?.toLocaleString() || 0} unidades del producto base`}
                </Typography>


                <IconButton onClick={() => removePresentacion(idx)}>
                  <DeleteIcon sx={{ color: "red" }} />
                </IconButton>
              </Box>
            ))}

            <Divider sx={{ marginY: 2 }} />

            <Button
              variant="outlined"
              onClick={addPresentacion}
              sx={{ color: "#69EAE2", borderColor: "#69EAE2" }}
            >
              + Agregar nivel de presentación
            </Button>
          </Box>
        </Collapse>
      </Box>
    </Drawer>
  );
}
