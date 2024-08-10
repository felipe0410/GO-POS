import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import CartItems from "@/components/CartItems";
import IncompleteCartItem from "@/components/IncompleteCartItem";

interface ProductListProps {
  selectedItems: any[];
  setSelectedItems: (items: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  selectedItems,
  setSelectedItems,
}) => (
  <Box sx={{ height: "76%", marginTop: "10px" }}>
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
    <IncompleteCartItem setSelectedItems={setSelectedItems} />
    <Divider sx={{ background: "#69EAE2", marginTop: "10px" }} />
    <Box
      id="items-list"
      sx={{
        maxHeight: {xs:'54%',sm:"67%"},
        overflowY: "auto",
        scrollBehavior: "smooth",
        minHeight: {xs:'54%',sm:"67%"},
        display: !(selectedItems?.length === 0) ? "block" : "flex",
        flexDirection: "column",
        justifyContent: "center",
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
