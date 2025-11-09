"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { NumericFormat } from "react-number-format";

// Nuestras nuevas herramientas
import { useProducts } from "@/hooks/useProducts";
import { useNotification } from "@/hooks/useNotification";
import { LoadingButton } from "@/components/LoadingStates/LoadingButton";
import { LoadingOverlay } from "@/components/LoadingStates/LoadingOverlay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { validateData, createProductSchema } from "@/schemas/productSchemas";

// Componentes existentes
import { inputs } from "@/data/inputs";
import ImgInput from "./inputIMG";
import Revenue from "@/app/inventory/agregarProductos/modal/revenue";
import GenerateBarCode from "@/app/inventory/agregarProductos/modal/Barcode";
import PresentacionesProducto from "./PresentacionesProducto";
import ModalProveedor from "@/app/inventory/agregarProductos/ModalProveedor";

// Firebase imports existentes
import {
  getAllCategoriesData,
  getAllMeasurementsDataa,
  getAllProveedores,
  getProductData,
} from "@/firebase";

interface ProductFormData {
  productName: string;
  category: string;
  measurement: string;
  price: string;
  barCode: string;
  description: string;
  image: string;
  cantidad: string;
  purchasePrice: string;
  wholesaler: number;
}

const DEFAULT_FORM_DATA: ProductFormData = {
  productName: "",
  category: "",
  measurement: "",
  price: "",
  barCode: "",
  description: "",
  image: "",
  cantidad: "",
  purchasePrice: "0",
  wholesaler: 0,
};

function NewProductForm() {
  // Estados del formulario
  const [formData, setFormData] = useState<ProductFormData>(DEFAULT_FORM_DATA);
  const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [measurements, setMeasurements] = useState<string[]>([]);
  const [imageBase64, setImageBase64] = useState("");
  
  // Estados de UI
  const [openProveedorModal, setOpenProveedorModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openPresentaciones, setOpenPresentaciones] = useState(true);
  const [isChild, setIsChild] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  
  // Presentaciones
  const [presentaciones, setPresentaciones] = useState([
    { tipo: "", codigoBarra: "", factor: "", precio: "", porcentajeEquivalencia: 0, cantidadEquivalente: 0 },
  ]);

  // Hooks personalizados
  const { createProduct, creating } = useProducts();
  const { success, error: notifyError, handleAsyncError } = useNotification();

  // Validación del formulario
  const validateForm = useCallback(() => {
    try {
      validateData(createProductSchema, {
        ...formData,
        cantidad: parseFloat(formData.cantidad) || 0,
        purchasePrice: formData.purchasePrice,
        salePrice: formData.price,
      });
      return true;
    } catch (error) {
      if (error instanceof Error) {
        notifyError(error.message);
      }
      return false;
    }
  }, [formData, notifyError]);

  // Verificar si el formulario está completo
  const isFormValid = useCallback(() => {
    const requiredFields = ['productName', 'barCode', 'price', 'category'];
    return requiredFields.every(field => 
      formData[field as keyof ProductFormData]?.toString().trim() !== ""
    );
  }, [formData]);

  // Manejar cambios en inputs
  const handleInputChange = useCallback((field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Generar código de barras
  const generateBarCode = useCallback(async () => {
    try {
      const settingsData = localStorage.getItem("settingsData");
      const numDigitos = settingsData ? JSON.parse(settingsData).numberOfDigitsToGenerateCode || 13 : 13;
      
      if (numDigitos < 1) {
        throw new Error("El número de dígitos debe ser al menos 1");
      }
      
      let numeroAleatorio = (Math.floor(Math.random() * 9) + 1).toString();
      for (let i = 1; i < numDigitos; i++) {
        numeroAleatorio += Math.floor(Math.random() * 10).toString();
      }
      
      handleInputChange('barCode', numeroAleatorio);
      return numeroAleatorio;
    } catch (error) {
      handleAsyncError(error as Error, "Error al generar código");
    }
  }, [handleInputChange, handleAsyncError]);

  // Cargar datos del producto por ID
  const loadProductData = useCallback(async () => {
    if (!formData.barCode.trim()) return;
    
    setLoadingProduct(true);
    try {
      const productData:any = await getProductData(formData.barCode);
      
      if (productData) {
        setFormData(productData);
        setImageBase64(productData.image || "");
        
        // Cargar proveedores del producto
        if (Array.isArray(productData.proveedores)) {
          const productProviders = proveedores.filter(p =>
            productData.proveedores.includes(p.nit)
          );
          setProveedoresSeleccionados(productProviders);
        }
        
        // Verificar si es producto hijo
        setIsChild(Array.isArray(productData.parentBarCodes) && productData.parentBarCodes.length > 0);
        
        // Cargar presentaciones si existen
        if (Array.isArray(productData.childBarcodes) && productData.childBarcodes.length > 0) {
          // Aquí iría la lógica para cargar presentaciones recursivas
          // const presentacionesCargadas = await fetchPresentacionesRecursivas(productData.childBarcodes);
          // setPresentaciones(presentacionesCargadas);
        } else {
          setPresentaciones([]);
        }
      } else {
        // Producto no existe, limpiar formulario pero mantener barCode
        setFormData({ ...DEFAULT_FORM_DATA, barCode: formData.barCode });
        setImageBase64("");
        setIsChild(false);
        setPresentaciones([]);
      }
    } catch (error) {
      handleAsyncError(error as Error, "Error al cargar producto");
    } finally {
      setLoadingProduct(false);
    }
  }, [formData.barCode, proveedores, handleAsyncError]);

  // Guardar producto
  const handleSaveProduct = useCallback(async () => {
    if (!validateForm() || !isFormValid()) {
      return;
    }

    try {
      const productData = {
        ...formData,
        image: formData.image || "/images/noImage.svg",
        childBarcodes: presentaciones.length > 0 ? [presentaciones[0].codigoBarra] : [],
        proveedores: proveedoresSeleccionados.map(p => p.nit),
        cantidad: parseFloat(formData.cantidad) || 0,
      };

      await createProduct(productData);
      
      // Limpiar formulario después del éxito
      setFormData(DEFAULT_FORM_DATA);
      setPresentaciones([{ tipo: "", codigoBarra: "", factor: "", precio: "", porcentajeEquivalencia: 0, cantidadEquivalente: 0 }]);
      setImageBase64("");
      setProveedoresSeleccionados([]);
      
    } catch (error) {
      // El error ya se maneja en el hook useProducts
    }
  }, [formData, presentaciones, proveedoresSeleccionados, validateForm, isFormValid, createProduct]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          getAllCategoriesData(setCategories),
          getAllMeasurementsDataa(setMeasurements),
          getAllProveedores().then(setProveedores),
        ]);
      } catch (error) {
        handleAsyncError(error as Error, "Error al cargar datos iniciales");
      }
    };

    loadInitialData();
  }, [handleAsyncError]);

  // Obtener usuario actual
  const getCurrentUser = useCallback(() => {
    try {
      return atob(localStorage?.getItem("user") ?? "");
    } catch {
      return "";
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <LoadingOverlay loading={loadingProduct} message="Cargando producto..." backdrop={false} />
      
      <Paper
        style={{
          borderRadius: "0.625rem",
          background: "#1F1D2B",
          boxShadow: "0px 1px 100px -50px #69EAE2",
        }}
      >
        {/* Selector de proveedores */}
        <Autocomplete
          multiple
          style={{ textAlign: 'center' }}
          options={proveedores}
          getOptionLabel={(option: any) => option.nombre || option.nit}
          value={proveedoresSeleccionados}
          onChange={(event, newValue) => setProveedoresSeleccionados(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.nombre || option.nit}
                {...getTagProps({ index })}
                key={option.nit}
                sx={{ backgroundColor: "#69EAE2", color: "#1F1D2B", fontWeight: 900 }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label="Proveedores del producto"
              placeholder="Seleccionar proveedores"
              InputLabelProps={{ style: { color: "#FFF" } }}
              style={{
                color: '#FFF',
                width: "90%",
                borderRadius: "0.625rem",
                background: "#2C3248",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            />
          )}
          sx={{
            mt: 2,
            "& .MuiFilledInput-root": { backgroundColor: "#2C3248" },
            "& .MuiInputBase-input": { color: "#FFF" },
            "& .MuiSvgIcon-root": { color: "#000" },
            "& .MuiFormLabel-root": { color: "#FFF" },
          }}
        />

        <Box sx={{ padding: { xs: "15px", sm: "2rem 3.8rem 2rem 3.4rem" } }}>
          {/* Campos del formulario */}
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
            {inputs.map((input, index) => {
              const style = {
                width: input.width,
                marginTop: "27px",
                marginLeft: {
                  sm: input.width === "45%" && [3, 6, 8].includes(index)
                    ? index === 8 ? "30%" : "10%"
                    : "0",
                },
              };

              const styleTypography = {
                color: "#FFF",
                fontFamily: "Nunito",
                fontSize: { xs: "10px", sm: "1rem" },
                fontWeight: 700,
                marginBottom: "5px",
              };

              return (
                <FormControl key={index} sx={style} variant="outlined">
                  <Typography sx={{ ...styleTypography, display: "flex", alignItems: "center" }}>
                    {input.name}
                    {index === 0 && <GenerateBarCode />}
                  </Typography>

                  {/* Renderizar diferentes tipos de inputs */}
                  {input.type === "category" ? (
                    <Autocomplete
                      value={formData.category || null}
                      onChange={(event, newValue) => handleInputChange('category', newValue || "")}
                      options={categories}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Categoría"
                          variant="standard"
                          sx={{ filter: "invert(1)", paddingLeft: "15px" }}
                        />
                      )}
                      style={{
                        borderRadius: "0.625rem",
                        background: "#2C3248",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  ) : input.type === "measurement" ? (
                    <Autocomplete
                      value={formData.measurement || null}
                      onChange={(event, newValue) => handleInputChange('measurement', newValue || "")}
                      options={measurements}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Unidades de medida"
                          variant="standard"
                          sx={{ filter: "invert(1)", paddingLeft: "15px" }}
                        />
                      )}
                      style={{
                        borderRadius: "0.625rem",
                        background: "#2C3248",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  ) : input.type === "amount" ? (
                    <NumericFormat
                      value={formData.price}
                      onValueChange={(values) => handleInputChange('price', values.formattedValue)}
                      prefix="$ "
                      thousandSeparator
                      customInput={OutlinedInput}
                      style={{ color: "#FFF" }}
                      sx={{
                        height: "44.9px",
                        borderRadius: "0.625rem",
                        background: "#2C3248",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  ) : input.type === "qrbar" ? (
                    <OutlinedInput
                      value={formData.barCode}
                      onChange={(e) => handleInputChange('barCode', e.target.value)}
                      onBlur={loadProductData}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={generateBarCode}>
                            <Box component="img" src="/images/scan.svg" />
                          </IconButton>
                        </InputAdornment>
                      }
                      sx={{
                        height: "44.9px",
                        borderRadius: "0.625rem",
                        background: "#2C3248",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                      style={{ color: "#FFF" }}
                    />
                  ) : input.type === "img" ? (
                    <Box sx={{ width: { xs: "200%", sm: "150%" }, height: "200px" }}>
                      <ImgInput
                        data={formData}
                        setData={setFormData}
                        folderSaved={getCurrentUser() || "images"}
                        fiel="image"
                        imageBase64={imageBase64}
                        setImageBase64={setImageBase64}
                      />
                    </Box>
                  ) : (
                    <OutlinedInput
                      value={formData[input.field as keyof ProductFormData] || ""}
                      onChange={(e) => handleInputChange(input.field as keyof ProductFormData, e.target.value)}
                      type={input.type}
                      sx={{
                        height: "44.9px",
                        borderRadius: "0.625rem",
                        background: "#2C3248",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                      style={{ color: "#FFF" }}
                    />
                  )}
                </FormControl>
              );
            })}

            {/* Botones de acción */}
            <Box sx={{ width: "100%", mt: 3, display: "flex", gap: 2, justifyContent: "space-between" }}>
              <LoadingButton
                loading={creating}
                loadingText="Guardando..."
                onClick={handleSaveProduct}
                disabled={isChild || !isFormValid()}
                sx={{
                  width: "45%",
                  height: "2.5rem",
                  borderRadius: "0.625rem",
                  background: (isChild || !isFormValid()) ? "gray" : "#69EAE2",
                  color: "#1F1D2B",
                  fontWeight: 700,
                }}
              >
                GUARDAR
              </LoadingButton>

              <Button
                onClick={() => setOpenDrawer(true)}
                sx={{ color: "#69EAE2" }}
              >
                Ver presentaciones
              </Button>

              <Button
                onClick={() => setOpenProveedorModal(true)}
                sx={{ color: "#69EAE2" }}
              >
                Agregar proveedor
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Modales */}
      <PresentacionesProducto
        presentaciones={presentaciones}
        setPresentaciones={setPresentaciones}
        open={openPresentaciones}
        toggleOpen={() => setOpenPresentaciones(!openPresentaciones)}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        cantidad={formData.cantidad}
      />

      <ModalProveedor
        open={openProveedorModal}
        onClose={() => setOpenProveedorModal(false)}
        proveedores={proveedores}
      />
    </Box>
  );
}

// Exportar con Error Boundary
export default function NewProductImproved() {
  return (
    <ErrorBoundary>
      <NewProductForm />
    </ErrorBoundary>
  );
}