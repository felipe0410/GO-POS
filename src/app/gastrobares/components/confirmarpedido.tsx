import React from "react";
import { Box, Typography, Divider, Chip } from "@mui/material";
import CartItems from "@/components/CartItems";
import IncompleteCartItem from "@/components/IncompleteCartItem";

interface ProductListProps {
  selectedItems: any[];
  setSelectedItems: (items: any) => void;
  facturaActiva: any;
  nota: string;
  mesaNombre?: string;
}

const Confirmar: React.FC<ProductListProps> = ({
  selectedItems,
  setSelectedItems,
  facturaActiva,
  nota,
  mesaNombre,
}) => {
  return (<Box sx={{ height: "62%", marginTop: "10px" }}>
    <Typography
      variant="h6"
      sx={{
        color: "#69EAE2",
        fontWeight: "bold",
        fontSize: { xs: "1rem", sm: "1.25rem" },
        mb: 2,
      }}
    >
      📝 Confirmar pedido
    </Typography>

    {mesaNombre && (
      <Box sx={{ mb: 2 }}>
        <Chip
          label={`🪑 Mesa: ${mesaNombre}`}
          sx={{
            backgroundColor: "#69EAE2",
            color: "#0C1B2A",
            fontWeight: "bold",
            fontSize: "1rem",
            px: 1.5,
            py: 1,
            borderRadius: "8px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          }}
        />
      </Box>
    )}

    <Box
      sx={{
        background: "#2C3248",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "1rem",
        border: "1px solid #69EAE2",
        maxHeight: "120px", // límite visible
        overflowY: "auto",
        whiteSpace: "pre-line", // conserva saltos de línea si los hay
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#69EAE2",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#2C3248",
        },
      }}
    >
      <Typography
        sx={{
          color: "#FFF",
          fontSize: "0.9rem",
          fontWeight: 600,
          mb: 0.5,
        }}
      >
        Nota del pedido:
      </Typography>
      <Typography
        sx={{
          color: "#CCC",
          fontSize: "0.875rem",
          wordBreak: "break-word",
        }}
      >
        {nota?.trim() ? nota : "SIN NOTA"}
      </Typography>
    </Box>


    {/* Encabezados de columna */}
    <Box sx={{ display: "flex" }}>
      <Typography
        sx={{
          color: "#FFF",
          fontSize: { xs: "12px", sm: "16px" },
          fontWeight: 600,
          width: "60%",
        }}
      >
        Producto
      </Typography>
      <Typography
        sx={{
          color: "#FFF",
          fontSize: { xs: "12px", sm: "16px" },
          fontWeight: 600,
          width: "15%",
          textAlign: "right",
        }}
      >
        Cantidad
      </Typography>
      <Typography
        sx={{
          color: "#FFF",
          fontSize: { xs: "12px", sm: "16px" },
          fontWeight: 600,
          width: "25%",
          textAlign: "right",
          marginRight: "19px",
        }}
      >
        Precio
      </Typography>
    </Box>


    <Divider sx={{ background: "#69EAE2", marginTop: "10px" }} />

    <Box
      id="items-list"
      sx={{
        maxHeight: { xs: "54%", sm: "55%" },
        overflowY: "auto",
        scrollBehavior: "smooth",
        minHeight: { xs: "54%", sm: "57%" },
        display: selectedItems?.length === 0 ? "flex" : "block",
        flexDirection: "column",
        justifyContent: "center",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#2C3248",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#69EAE2",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },
      }}
    >
      {selectedItems?.length === 0 ? (
        <Typography
          sx={{
            color: "#69EAE2",
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: 500,
            marginTop: "2rem",
          }}
        >
          AÑADE ITEMS A TU CARRITO
        </Typography>
      ) : (
        selectedItems.map((product: any) => (
          <React.Fragment key={product.barCode}>
            <CartItems
              product={product}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              facturaActiva={facturaActiva}
            />
          </React.Fragment>
        ))
      )}
    </Box>

    <Divider sx={{ background: "#69EAE2", marginTop: "1.5rem" }} />
  </Box>
  );
}


export default Confirmar;
