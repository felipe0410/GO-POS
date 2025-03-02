import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Typography,
  Drawer,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import InventoryIcon from '@mui/icons-material/Inventory';
import { getAllProductsDataonSnapshot } from "@/firebase";

const ProductSidebar = ({
  onAddProduct,
  items,
}: {
  onAddProduct: (product: any) => void;
  items: any[];
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const observerRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const cacheKey = "products_cache";
    const cachedProducts = localStorage.getItem(cacheKey);
    if (cachedProducts) {
      const parsedProducts = JSON.parse(cachedProducts);
      setProducts(parsedProducts);
      setFilteredProducts(parsedProducts);
      setVisibleProducts(parsedProducts.slice(0, ITEMS_PER_PAGE));
      return;
    }
    const unsubscribe: any = getAllProductsDataonSnapshot((data: any[]) => {
      if (data) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        setProducts(data);
        setFilteredProducts(data);
        setVisibleProducts(data.slice(0, ITEMS_PER_PAGE));
      }
    });

    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  }, []);

  const loadMoreProducts = () => {
    const currentCount = visibleProducts.length;
    if (currentCount >= filteredProducts.length) {
      setHasMore(false);
      return;
    }
    const nextProducts = filteredProducts.slice(
      currentCount,
      currentCount + ITEMS_PER_PAGE
    );
    setVisibleProducts((prev) => [...prev, ...nextProducts]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, filteredProducts, visibleProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(query.toLowerCase()) ||
        product.barCode.includes(query)
    );
    setFilteredProducts(results);
    setVisibleProducts(results.slice(0, ITEMS_PER_PAGE));
    setHasMore(results.length > ITEMS_PER_PAGE);
  };

  return (
    <>
      {isSmallScreen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            backgroundColor: "#69EAE2",
            color: "#1E1E1E",
            zIndex: theme.zIndex.drawer + 2,
          }}
        >
          <InventoryIcon />
        </IconButton>
      )}
      <Drawer
        anchor="right"
        open={isSmallScreen ? isOpen : true}
        onClose={() => setIsOpen(false)}
        variant={isSmallScreen ? "temporary" : "persistent"}
        sx={{
          zIndex: 1600,
          "& .MuiDrawer-paper": {
            width: isSmallScreen ? "80vw" : 300,
            height: "100vh",
            backgroundColor: "#1E1E1E",
            color: "#FFFFFF",
            boxShadow: "-3px 0 5px rgba(0,0,0,0.2)",
            overflowY: "auto",
            p: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#69EAE2" }}
          >
            Productos
          </Typography>
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{ color: "#FFFFFF" }}
          >
            <Close />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          label="Buscar producto"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            input: { color: "#FFFFFF" },
            label: { color: "#B3B3B3" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#69EAE2" },
              "&:hover fieldset": { borderColor: "#69EAE2" },
              "&.Mui-focused fieldset": { borderColor: "#69EAE2" },
            },
            mb: 2,
          }}
        />
        <List>
          {visibleProducts.map((product) => {
            const selectedItem = items.find(
              (item) => item.codigo === product.barCode
            );
            const isSelected = Boolean(selectedItem);

            return (
              <ListItem
                key={product.id}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  backgroundColor: isSelected ? "#2a2a2a" : "transparent",
                  mb: 1,
                  border: isSelected ? "2px solid #69EAE2" : "none",
                }}
              >
                <ListItemText
                  primary={product.productName}
                  secondary={
                    <Typography
                      sx={{ color: "#69EAE2", fontWeight: "bold" }}
                    >{`Precio: ${product.price}`}</Typography>
                  }
                />
                <ListItemSecondaryAction>
                  {isSelected && selectedItem?.cantidad > 0 && (
                    <Badge
                      badgeContent={selectedItem.cantidad}
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 48,
                        backgroundColor: "#69EAE2",
                        color: "#1E1E1E",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  <IconButton
                    onClick={() => onAddProduct(product)}
                    color="primary"
                    sx={{
                      color: "#69EAE2",
                    }}
                  >
                    <Add />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
          {hasMore && (
            <div
              ref={observerRef}
              style={{ height: 20, backgroundColor: "transparent" }}
            />
          )}
        </List>
      </Drawer>
    </>
  );
};

export default ProductSidebar;
