import React from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/** Acepta Timestamp de Firestore {seconds, nanoseconds}, Date, número (ms) o string ISO */
const toDate = (ts: any): Date | null => {
    if (!ts) return null;
    if (typeof ts === "object" && typeof ts.seconds === "number") {
        return new Date(ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1e6));
    }
    if (ts instanceof Date) return ts;
    if (typeof ts === "number") return new Date(ts);
    if (typeof ts === "string") return new Date(ts);
    return null;
};

// Formato amigable para Colombia
const formatColombia = (d: Date | null) =>
    d
        ? d.toLocaleString("es-CO", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "-";

const FieldChip = ({ field }: { field: string }) => {
    // resalta algunos campos clave con color
    const color =
        field === "status"
            ? "error"
            : field === "paymentMethod"
                ? "primary"
                : field.startsWith("cliente.")
                    ? "secondary"
                    : "default";
    return <Chip size="small" label={field} color={color as any} sx={{ mr: 1 }} />;
};

type ManifestChange = { field: string; from: any; to: any };
type ManifestEntry = { by?: string; at?: any; changes: ManifestChange[] };

export function InvoiceHistory({
    manifest = [],
    lastModifiedBy,
    modifiedAt,
}: {
    manifest: ManifestEntry[];
    lastModifiedBy?: string;
    modifiedAt?: any;
}) {
    // Ordena de más reciente a más antiguo
    const items = [...manifest].sort((a, b) => {
        const da = toDate(a.at)?.getTime() ?? 0;
        const db = toDate(b.at)?.getTime() ?? 0;
        return db - da;
    });

    return (
        <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: 800, color: "#69EAE2", mb: 1, textTransform:'uppercase' }}>
                Historial de cambios
            </Typography>

            {/* Info rápida del último cambio */}
            <Box sx={{
                display: "flex", gap: 2, mb: 1, flexWrap: "wrap", fontWeight: 900,
                filter: 'invert(1)'
            }}>
                <Chip
                    variant="outlined"
                    label={
                        "Última modificación: " + formatColombia(toDate(modifiedAt))
                    }
                />
                {lastModifiedBy && (
                    <Chip variant="outlined" label={"Modificado por: " + lastModifiedBy} />
                )}
                <Chip
                    variant="outlined"
                    label={`Eventos registrados: ${items.length}`}
                />
            </Box>

            <Divider sx={{ mb: 1, borderColor: "rgba(105,234,226,0.3)" }} />

            {
                items.length === 0 ? (
                    <Typography sx={{ color: "#B7B7B7" }}>
                        No hay eventos registrados aún.
                    </Typography>
                ) : (
                    items.map((ev, idx) => {
                        const when = toDate(ev.at);
                        return (
                            <Accordion
                                key={idx}
                                disableGutters
                                elevation={0}
                                sx={{
                                    mb: 1,
                                    borderRadius: "12px",
                                    border: "1px solid rgba(105,234,226,0.25)",
                                    background: "#2C3248",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#69EAE2" }} />}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            gap: 1,
                                            alignItems: { sm: "center" },
                                            width: "100%",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 700, color: "#F8F8F8" }}>
                                            {ev.by || "sistema"}
                                        </Typography>
                                        <Typography sx={{ color: "#B7B7B7", fontSize: "0.85rem" }}>
                                            {formatColombia(when)}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={`${ev.changes?.length || 0} cambio(s)`}
                                            sx={{ ml: { sm: "auto" }, filter:'invert(1)' }}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ background: "#23283a" }}>
                                    <List dense disablePadding>
                                        {ev.changes?.map((c, i) => (
                                            <ListItem
                                                key={i}
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: "auto 1fr",
                                                    columnGap: 1,
                                                    alignItems: "center",
                                                    py: 0.5,
                                                }}
                                            >
                                                <FieldChip field={c.field} />
                                                <ListItemText
                                                    primaryTypographyProps={{
                                                        sx: { color: "#EDEDED", fontSize: "0.9rem" },
                                                    }}
                                                    secondaryTypographyProps={{
                                                        sx: { color: "#B7B7B7", fontSize: "0.8rem" },
                                                    }}
                                                    primary={
                                                        // Ej: status: PENDIENTE → CANCELADO
                                                        `${c.from ?? "—"}  →  ${c.to ?? "—"}`
                                                    }
                                                    secondary={
                                                        // para campos cliente.X mostramos pista
                                                        c.field.startsWith("cliente.")
                                                            ? "Dato del cliente"
                                                            : undefined
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })
                )
            }
        </Box >
    );
}
