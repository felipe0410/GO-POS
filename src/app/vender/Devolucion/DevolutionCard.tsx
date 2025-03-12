"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { getProductData } from "@/firebase";

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
  facturaActiva: any;
  invoice: any;
}

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  "&:last-child": {
    paddingBottom: "5px",
  },
}));

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  background: "rgb(31, 29, 43)",
  color: "#FFF",
  boxShadow: "rgb(105, 234, 226) 0px 1px 100px -50px",
  borderRadius: "0.625rem",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

const DevolutionCard: React.FC<DevolutionCardProps> = React.memo(
  ({
    filteredData,
    setSelectedItems,
    selectedItems,
    facturaActiva,
    invoice,
  }) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = React.useState<Product | null>(
      null
    );
    const [quantity, setQuantity] = React.useState<number>(1);
    const [initialQuantity, setInitialQuantity] = React.useState<number>(1); // Guardar el valor inicial
    const [productImages, setProductImages] = React.useState<{
      [key: string]: string;
    }>({});
    console.log("invoice:::>", invoice);
    console.log("facturaActiva:::>", facturaActiva);
    // Obtener imágenes de productos si no están disponibles en filteredData
    React.useEffect(() => {
      const fetchProductImages = async () => {
        const newImages: { [key: string]: string } = {};
        await Promise.all(
          filteredData?.map(async (product) => {
            if (!product.image || product.image === "") {
              const productData = await getProductData(product.barCode);
              if (productData?.image) {
                newImages[product.barCode] = productData.image;
              }
            }
          })
        );
        setProductImages((prevImages) => ({ ...prevImages, ...newImages }));
      };

      fetchProductImages();
    }, [filteredData]);

    const handleOpenModal = (product: Product) => {
      setCurrentProduct(product);
      setQuantity(product.cantidad);
      setInitialQuantity(product.cantidad); // Guardamos el valor inicial
      setOpen(true);
    };

    const handleCloseModal = () => {
      setOpen(false);
      setCurrentProduct(null);
    };

    const handleQuantityChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      let newValue = Number(event.target.value);
      if (isNaN(newValue)) return;

      // Asegurar que el valor no sea menor a 0 ni mayor al valor inicial
      if (newValue < 0) newValue = 0;
      if (newValue > initialQuantity) newValue = initialQuantity;

      setQuantity(newValue);
    };

    const handleSaveChanges = () => {
      if (!currentProduct) return;

      const cleanedPrice = Number(currentProduct.price.replace(/[$,]/g, ""));
      if (quantity >= 0 && quantity <= initialQuantity) {
        const updatedItems = selectedItems.map((item) =>
          item.barCode === currentProduct.barCode
            ? { ...item, cantidad: quantity, acc: quantity * cleanedPrice }
            : item
        );
        setSelectedItems(updatedItems);
      } else {
        console.error("Cantidad fuera del rango permitido");
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
              src={productImages[product.barCode] ?? "/images/noImage.svg"}
              alt={`Imagen del producto ${product.productName}`}
              sx={{
                width: "60%",
                height: { xs: "70px", sm: "120px" },
                position: "relative",
                top: { xs: "-10px", sm: "-30px" },
              }}
              loading="lazy"
            />
            <StyledCardContent>
              <Typography
                sx={{ color: "#69EAE2", textAlign: "center", fontWeight: 700 }}
              >
                {product.productName}
              </Typography>
              <Typography sx={{ color: "#ABBBC2", textAlign: "center" }}>
                {product.barCode}
              </Typography>
              <Typography
                sx={{ color: "#FFF", textAlign: "center", fontWeight: 700 }}
              >
                {product.price}
              </Typography>
              <Typography sx={{ color: "#ABBBC2", textAlign: "center" }}>
                Compra: {product.cantidad} UND
              </Typography>
            </StyledCardContent>
          </Card>
        ))}

        {/* Modal para editar cantidad */}
        <Modal open={open} onClose={handleCloseModal}>
          <StyledModalBox>
            <Typography
              variant="h6"
              sx={{ color: "#69EAE2", textAlign: "center" }}
            >
              Editar cantidad
            </Typography>

            {currentProduct && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#FFF",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {currentProduct.productName}
              </Typography>
            )}

            <TextField
              variant="filled"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              fullWidth
              sx={{
                width: "30%",
                borderRadius: "0.4rem",
                input: { color: "#FFF" },
                label: { color: "#69EAE2" },
                background: "#2C3248",
                alignSelf: "center",
                justifyContent: "center",
              }}
              inputProps={{
                min: 0,
                max: initialQuantity,
              }}
              required
            />
            <Button
              variant="contained"
              sx={{
                background: "#69EAE2",
                color: "#1F1D2B",
                "&:hover": { background: "#52D4CB" },
              }}
              onClick={handleSaveChanges}
            >
              Guardar cambios
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "#E54B4B",
                color: "#FFF",
                "&:hover": { background: "#D13A3A" },
              }}
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
          </StyledModalBox>
        </Modal>
        <Button
          sx={{ position: "absolute", bottom: 0 }}
          variant="contained"
          color="primary"
        >
          CONFIRMAR DEVOLUCION
        </Button>
      </>
    );
  }
);

DevolutionCard.displayName = "DevolutionCard";

export default DevolutionCard;
