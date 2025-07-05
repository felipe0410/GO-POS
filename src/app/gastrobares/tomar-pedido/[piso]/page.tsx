"use client";

import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import SeleccionMesa from "../SeleccionMesa";
import VenderGastrobar from "../../components/VenderGastrobar";

export default function TomarPedidoGastrobar() {
    const [mesaSeleccionada, setMesaSeleccionada] = useState<any>(null);

    return (
        <Box sx={{ p: 3 }}>
            {!mesaSeleccionada ? (
                <SeleccionMesa onMesaSeleccionada={setMesaSeleccionada} />
            ) : (
                <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => setMesaSeleccionada(null)}
                            sx={{
                                color: "#69EAE2",
                                borderColor: "#69EAE2",
                                "&:hover": {
                                    borderColor: "#45d0c9",
                                    backgroundColor: "#1F1D2B",
                                },
                            }}
                        >
                            Cambiar mesa
                        </Button>
                    </Box>

                    <VenderGastrobar mesa={mesaSeleccionada} />
                </>
            )}
        </Box>
    );
}
