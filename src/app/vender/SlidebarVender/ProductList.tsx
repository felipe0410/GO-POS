import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import CartItems from "@/components/CartItems";
import IncompleteCartItem from "@/components/IncompleteCartItem";

interface ProductListProps {
  selectedItems: any[];
  setSelectedItems: (items: any) => void;
  facturaActiva: any;
}

const ProductList: React.FC<ProductListProps> = ({
  selectedItems,
  setSelectedItems,
  facturaActiva,
}) => (
  <Box sx={{ height: "62%", marginTop: "10px" }}>
    <Box sx={{ display: "flex" }}>
      <Typography
        sx={{
          color: "var(--White, #FFF)",
          fontFamily: "Nunito",
          fontSize: { xs: "12px", sm: "16px" },
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "140%",
          width: "60%",
        }}
      >
        Producto
      </Typography>
      <Typography
        sx={{
          color: "var(--White, #FFF)",
          fontFamily: "Nunito",
          fontSize: { xs: "12px", sm: "16px" },
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "140%",
          width: "15%",
          textAlign: "right",
        }}
      >
        Cantidad
      </Typography>
      <Typography
        sx={{
          color: "var(--White, #FFF)",
          fontFamily: "Nunito",
          fontSize: { xs: "12px", sm: "16px" },
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "140%",
          marginRight: "19px",
          width: "25%",
          textAlign: "right",
        }}
      >
        Precio
      </Typography>
    </Box>
    <Divider sx={{ background: "#69EAE2" }} />
    <IncompleteCartItem
      setSelectedItems={setSelectedItems}
      facturaActiva={facturaActiva}
    />
    <Divider sx={{ background: "#69EAE2", marginTop: "10px" }} />
    <Box
      id="items-list"
      sx={{
        maxHeight: { xs: "54%", sm: "57%" },
        overflowY: "auto",
        scrollBehavior: "smooth",
        minHeight: { xs: "54%", sm: "57%" },
        display: !(selectedItems?.length === 0) ? "block" : "flex",
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
          boxShadow: "0px 4px 4px 0px #00000040",
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
            fontFamily: "Nunito",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "140%",
            marginTop: "2rem",
          }}
        >
          AÑADE ITEMS A TU CARRITO
        </Typography>
      ) : (
        <>
          {selectedItems?.map((product: any) => (
            <React.Fragment key={product.barCode}>
              <CartItems
                product={product}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                facturaActiva={facturaActiva}
              />
            </React.Fragment>
          ))}
        </>
      )}
    </Box>
    <Divider sx={{ background: "#69EAE2", marginTop: "1.5rem" }} />
  </Box>
);

export default ProductList;
