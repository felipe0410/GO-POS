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
import { useContext } from "react";
import { DevolucionContext } from "./context";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

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
    const { data, setData } = useContext(DevolucionContext) || {};
    const [open, setOpen] = React.useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = React.useState<Product | null>(
      null
    );
    const [quantity, setQuantity] = React.useState<number>(1);
    const [initialQuantity, setInitialQuantity] = React.useState<number>(1); // Guardar el valor inicial
    const [productImages, setProductImages] = React.useState<{
      [key: string]: string;
    }>({});

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
      setQuantity(product.cantidad > 0 ? 1 : 0);
      setInitialQuantity(product.cantidad);
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
      if (newValue < 0) newValue = 0;
      if (newValue > initialQuantity) newValue = initialQuantity;

      setQuantity(newValue);
    };

    const updateCompra = (currentProduct: any, quantity: number) => {
      return data.compra.map((item: any) => {
        if (item.barCode === currentProduct.barCode) {
          const unitPrice =
            item.unitPrice ??
            (item.cantidad > 0 ? item.acc / item.cantidad : 0);
          return {
            ...item,
            cantidad: item.cantidad - quantity,
            acc: item.acc - unitPrice * quantity,
            unitPrice, // lo guardamos siempre, o se mantiene si ya existía
          };
        }
        return item;
      });
    };

    const updateDevolucion = (currentProduct: any, quantity: number) => {
      const unitPrice =
        currentProduct.unitPrice ??
        (currentProduct.cantidad > 0
          ? currentProduct.acc / currentProduct.cantidad
          : 0);

      const existingIndex = data.Devolucion?.findIndex(
        (item: any) => item.barCode === currentProduct.barCode
      );

      if (existingIndex !== -1 && existingIndex !== undefined) {
        return data.Devolucion.map((item: any, index: number) =>
          index === existingIndex
            ? {
              ...item,
              cantidad: item.cantidad + quantity,
              acc: item.acc + quantity * unitPrice,
            }
            : item
        );
      } else {
        const devolucionItem = {
          productName: currentProduct.productName,
          cantidad: quantity,
          barCode: currentProduct.barCode,
          acc: quantity * unitPrice,
          unitPrice,
        };
        return data.Devolucion
          ? [...data.Devolucion, devolucionItem]
          : [devolucionItem];
      }
    };

    const calculateTotals = (quantity: number, currentProduct: any) => {
      const unitPrice =
        currentProduct.cantidad > 0
          ? currentProduct.acc / currentProduct.cantidad
          : 0;

      const totalRestado = unitPrice * quantity;

      console.log("totalRestado:", totalRestado);

      return {
        subtotal: Math.max(0, data.subtotal - totalRestado),
        total: Math.max(0, data.subtotal - totalRestado),
        descuento: 0,
      };
    };

    const handleSaveChanges = (currentProduct: any, quantity: number) => {
      if (!data || !currentProduct) return;
      const updatedCompra = updateCompra(currentProduct, quantity);
      const updatedDevolucion = updateDevolucion(currentProduct, quantity);
      const { subtotal, total, descuento } = calculateTotals(
        quantity,
        currentProduct
      );
      setData({
        ...data,
        compra: updatedCompra,
        Devolucion: updatedDevolucion,
        subtotal,
        total,
        descuento,
      });
      handleCloseModal();
    };

    return (
      <>
        <SnackbarProvider />
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

        <Modal open={open} onClose={handleCloseModal}>
          <StyledModalBox>
            <Typography
              variant="h6"
              sx={{ color: "#69EAE2", textAlign: "center" }}
            >
              {"Ingrese la cantidad a devolver"}
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
              onClick={() => {
                if (quantity === 0) {
                  enqueueSnackbar("No se permite mas devoluciones", {
                    variant: "error",
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "right",
                    },
                  });
                  handleCloseModal();
                } else {
                  handleSaveChanges(currentProduct, quantity);
                }
              }}
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
      </>
    );
  }
);

DevolutionCard.displayName = "DevolutionCard";

export default DevolutionCard;
