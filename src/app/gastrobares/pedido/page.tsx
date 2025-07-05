// app/gastrobar/pedido/page.tsx
"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import SeleccionMesa from "../tomar-pedido/SeleccionMesa";
import VenderGastrobar from "../components/VenderGastrobar";

export default function TomarPedidoGastrobar() {
    const [mesaSeleccionada, setMesaSeleccionada] = useState<any>(null);
    return (
        <Box sx={{ p: 2 }}>
            {!mesaSeleccionada ? (
                <SeleccionMesa onMesaSeleccionada={setMesaSeleccionada} />
            ) : (
                <>
                    <VenderGastrobar mesa={mesaSeleccionada} />
                </>
            )}
        </Box>
    );
}
