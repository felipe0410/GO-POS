import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Chip, Autocomplete, Divider, Typography
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { getAllProveedores, getAllCategoriesData } from "@/firebase";

interface Proveedor {
  nit: string;
  nombre?: string;
  [k: string]: any;
}

interface OptimalQuantityDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    quantity: number;
    category: string;
    proveedoresNits: string[]; // ← solo NITs
  }) => void;

  productName: string;
  initialQuantity?: number;
  initialCategory?: string;
  initialProveedores?: string[]; // ← solo NITs
}

const OptimalQuantityDialog: React.FC<OptimalQuantityDialogProps> = ({
  open, onClose, onSave, productName,
  initialQuantity, initialCategory, initialProveedores,
}) => {
  const [quantity, setQuantity] = useState<number | string>(initialQuantity ?? "");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [valueCategory, setValueCategory] = useState<string | null>(initialCategory ?? null);

  const [proveedoresOptions, setProveedoresOptions] = useState<Proveedor[]>([]);
  const [proveedoresNits, setProveedoresNits] = useState<string[]>(initialProveedores ?? []);

  // Mapa nit -> proveedor (para mostrar nombre en chips / dropdown)
  const proveedoresMap = useMemo(() => {
    const m = new Map<string, Proveedor>();
    for (const p of proveedoresOptions) m.set(p.nit, p);
    return m;
  }, [proveedoresOptions]);

  // Opciones del Autocomplete: solo NITs
  const proveedorNitsOptions = useMemo(
    () => proveedoresOptions.map((p) => p.nit),
    [proveedoresOptions]
  );

  // Búsqueda por nombre o NIT
  const filterByNombreONit = useMemo(
    () =>
      createFilterOptions<string>({
        stringify: (nit) => {
          const p = proveedoresMap.get(nit);
          return `${p?.nombre ?? ""} ${nit}`.trim();
        },
      }),
    [proveedoresMap]
  );

  // Cargar listas al abrir
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        await getAllCategoriesData((cats: string[]) => {
          const base = Array.isArray(cats) ? cats : [];
          // Inyecta la categoría actual si no existe, para que se pinte seleccionada
          if (initialCategory && !base.includes(initialCategory)) {
            setCategorias([initialCategory, ...base]);
          } else {
            setCategorias(base);
          }
        });
      } catch (e) {
        console.error("Error cargando categorías:", e);
      }

      try {
        const lista = await getAllProveedores();
        setProveedoresOptions(lista ?? []);
      } catch (e) {
        console.error("Error cargando proveedores:", e);
      }
    })();
  }, [open, initialCategory]);

  // Sincroniza iniciales al abrir
  useEffect(() => {
    if (!open) return;
    setQuantity(initialQuantity ?? "");
    setValueCategory(initialCategory ?? null);
    setProveedoresNits(initialProveedores ?? []);
  }, [open, initialQuantity, initialCategory, initialProveedores]);

  const canSave = useMemo(() => {
    const q = Number(quantity);
    return !isNaN(q) && q > 0 && (valueCategory?.trim()?.length ?? 0) > 0;
  }, [quantity, valueCategory]);

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      quantity: Number(quantity),
      category: valueCategory ?? "",
      proveedoresNits, // ← solo nits
    });
    setQuantity("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#1F1D2B",
          color: "#FFF",
          borderRadius: "12px",
          padding: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          width: "min(620px, 96vw)"
        },
      }}
    >
      <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#69EAE2" }}>
        Configurar datos del producto
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ color: "#BDBDBD", mb: 1 }}>
          {typeof productName === "string" && productName.length
            ? `Producto: ${productName}`
            : "Producto sin nombre"}
        </Typography>

        {/* Cantidad óptima */}
        <TextField
          autoFocus
          margin="dense"
          label="Cantidad óptima"
          type="number"
          fullWidth
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          InputLabelProps={{ style: { color: "#BDBDBD" } }}
          InputProps={{ style: { color: "#FFF", backgroundColor: "#2C2A36", borderRadius: 4 } }}
        />

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />

        {/* Categoría */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            options={categorias}
            value={valueCategory}
            onChange={(_, newVal) => setValueCategory(newVal)}
            isOptionEqualToValue={(opt, val) => opt === val}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                label="Categoría"
                placeholder="Selecciona una categoría"
                InputLabelProps={{ style: { color: "#FFF" } }}
                sx={{
                  "& .MuiFilledInput-root": { backgroundColor: "#2C3248" },
                  "& .MuiInputBase-input": { color: "#FFF" },
                }}
              />
            )}
          />
        </Box>

        {/* Proveedores (multiple, SOLO NITs) */}
        <Autocomplete
          multiple
          id="select-multiple-proveedores"
          options={proveedorNitsOptions}               // ← opciones: NITs
          value={proveedoresNits}                      // ← value: NITs
          onChange={(_, newValue) => setProveedoresNits(newValue as string[])}
          filterOptions={filterByNombreONit}          // ← búsqueda por nombre o NIT
          getOptionLabel={(nit) => proveedoresMap.get(nit)?.nombre || nit}
          renderOption={(props, nit) => {
            const p = proveedoresMap.get(nit);
            return (
              <li {...props} key={nit}>
                {p?.nombre ? `${p.nombre} (${nit})` : nit}
              </li>
            );
          }}
          renderTags={(value, getTagProps) =>
            value.map((nit, index) => {
              const p = proveedoresMap.get(nit);
              const label = p?.nombre || nit;  // muestra nombre si existe
              return (
                <Chip
                  label={label}
                  {...getTagProps({ index })}
                  key={nit}
                  sx={{ backgroundColor: "#69EAE2", color: "#1F1D2B", fontWeight: 900 }}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label="Proveedores (NIT)"
              placeholder="Buscar por nombre o NIT"
              InputLabelProps={{ style: { color: "#FFF" } }}
              sx={{
                "& .MuiFilledInput-root": { backgroundColor: "#2C3248" },
                "& .MuiInputBase-input": { color: "#FFF" },
              }}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#FFF",
            borderColor: "#69EAE2",
            textTransform: "none",
            "&:hover": { backgroundColor: "#69EAE2", color: "#1F1D2B" },
          }}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={!canSave}
          sx={{
            backgroundColor: canSave ? "#69EAE2" : "rgba(105,234,226,0.3)",
            color: "#1F1D2B",
            textTransform: "none",
            "&:hover": { backgroundColor: canSave ? "#56C5BE" : "rgba(105,234,226,0.3)" },
          }}
          variant="contained"
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OptimalQuantityDialog;
