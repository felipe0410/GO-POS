"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Button, Modal, TextField } from "@mui/material";

interface Product {
  uid: string;
  image: string;
  productName: string;
  price: string;
  barCode: string;
  cantidad: number;
  category?: string;
}

interface DevolutionCardProps {
  filteredData: Product[];
  setSelectedItems: React.Dispatch<React.SetStateAction<Product[]>>;
  selectedItems: Product[];
}

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  "&:last-child": {
    paddingBottom: "5px",
  },
}));

const DevolutionCard: React.FC<DevolutionCardProps> = React.memo(({ filteredData, setSelectedItems, selectedItems }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = React.useState<Product | null>(null);
  const [quantity, setQuantity] = React.useState<number>(1);

  const handleOpenModal = (product: Product) => {
    setCurrentProduct(product);
    setQuantity(product.cantidad);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCurrentProduct(null);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const handleSaveChanges = () => {
    if (!currentProduct) return;

    const cleanedPrice = Number(currentProduct.price.replace(/[$,]/g, ""));
    if (quantity > 0) {
      const updatedItems = selectedItems.map((item) =>
        item.barCode === currentProduct.barCode
          ? { ...item, cantidad: quantity, acc: quantity * cleanedPrice }
          : item
      );
      setSelectedItems(updatedItems);
    } else {
      const updatedItems = selectedItems.filter(
        (item) => item.barCode !== currentProduct.barCode
      );
      setSelectedItems(updatedItems);
    }
    handleCloseModal();
  };

  return (
    <>
      {filteredData?.map((product) => (
        <Card
          key={product.uid}
          sx={{
            width: { xs: "130px", sm: "190px" },
            maxHeight: "17.52rem",
            borderRadius: "0.32rem",
            background: "#2C3248",
            overflow: "visible",
            textAlign: "-webkit-center",
            marginTop: "50px",
            cursor: "pointer",
            "&:hover": {
              border: "1px solid #69EAE2",
            },
          }}
          onClick={() => handleOpenModal(product)}
        >
          <Box
            component="img"
            src={["", null].includes(product.image) ? "images/noImage.svg" : product.image}
            alt={`imagen del producto ${product.productName}`}
            sx={{
              width: "60%",
              height: { xs: "70px", sm: "120px" },
              position: "relative",
              top: { xs: "-10px", sm: "-30px" },
            }}
            loading="lazy"
          />
          <StyledCardContent>
            <Typography sx={{ color: "#69EAE2", textAlign: "center", fontWeight: 700 }}>{product.productName}</Typography>
            <Typography sx={{ color: "#ABBBC2", textAlign: "center" }}>{product.barCode}</Typography>
            <Typography sx={{ color: "#FFF", textAlign: "center", fontWeight: 700 }}>{product.price}</Typography>
            <Typography sx={{ color: "#ABBBC2", textAlign: "center" }}>Existencias: {product.cantidad}</Typography>
          </StyledCardContent>
        </Card>
      ))}

      {/* Modal para editar cantidad */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
          <Typography variant="h6">Editar cantidad</Typography>
          <TextField
            type="number"
            label="Cantidad"
            value={quantity}
            onChange={handleQuantityChange}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Guardar cambios
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
        </Box>
      </Modal>
    </>
  );
});

DevolutionCard.displayName = "DevolutionCard";

export default DevolutionCard;
