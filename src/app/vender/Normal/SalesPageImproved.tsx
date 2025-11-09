"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Paper,
  Tab,
  Tabs,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Hooks mejorados
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useNotification } from '@/hooks/useNotification';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

// Componentes
import Header from '@/components/Header';
import { LoadingOverlay } from '@/components/LoadingStates/LoadingOverlay';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import VenderCardImproved from '@/components/VenderCardImproved';
import CarouselCategorias from '@/components/CarouselCategorias';
import ModalSettings from './modal_settings';
import SearchInput from './SearchInput';
import SlidebarVenderImproved from '@/app/vender/Normal/SlidebarVenderImproved';

// Configuración
import { UI_CONFIG } from '@/config/constants';

const theme = createTheme({
  palette: {
    secondary: {
      main: UI_CONFIG.theme.colors.secondary,
    },
  },
});

const styleButtonInvoice = {
  select: {
    color: UI_CONFIG.theme.colors.secondary,
    background: UI_CONFIG.theme.colors.primary,
    fontWeight: 700,
    borderRadius: '40px',
    transition: 'all 1.3s ease',
  },
  default: {
    color: UI_CONFIG.theme.colors.primary,
    fontWeight: 300,
  },
};

interface Invoice {
  id: string;
  name: string;
  items: any[];
}

const SalesPageImproved: React.FC = () => {
  // Hooks
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartItemCount } = useCart();
  const { success, error: notifyError } = useNotification();
  const muiTheme = useTheme();
  const matches = useMediaQuery(muiTheme.breakpoints.up('sm'));

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [typeInvoice, setTypeInvoice] = useState<string>('quickSale');
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'factura-1', name: 'Factura 1', items: [] }
  ]);
  const [activeInvoice, setActiveInvoice] = useState('factura-1');

  // Configuración de paginación
  const itemsPerPage = 12;

  // Función estable para cargar configuración
  const loadSettingsOperation = useCallback(async () => {
    const cachedSettings = localStorage.getItem('settingsData');
    if (cachedSettings) {
      const parsedSettings = JSON.parse(cachedSettings);
      setTypeInvoice(parsedSettings?.defaultTypeInvoice || 'quickSale');
    }
  }, []);

  // Operación asíncrona para cargar configuración
  const { execute: loadSettings, loading: settingsLoading } = useAsyncOperation(loadSettingsOperation);

  // Función estable para buscar productos por código de barras
  const searchBarcodeOperation = useCallback(async (barcode: string) => {
    const foundProducts = products?.filter(
      (producto) => producto.barCode === barcode
    );

    if (foundProducts?.length === 1) {
      const product = foundProducts[0];
      const cleanedPrice = Number(product.price.replace(/[$,]/g, ''));
      
      addToCart(product, 1, cleanedPrice);
      success('Producto agregado al carrito');
      setSearchTerm('');
    } else if (searchTerm.length > 0) {
      // Reproducir sonido de error
      const audio = new Audio('/error-beep.mp3');
      audio.play();
      notifyError('Producto no encontrado');
    }
  }, [products, addToCart, success, searchTerm, notifyError]);

  // Operación asíncrona para buscar productos por código de barras
  const { execute: searchByBarcode } = useAsyncOperation(searchBarcodeOperation);

  // Datos filtrados
  const filteredData = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const normalizedSearch = searchTerm
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(normalizedSearch.toLowerCase())
        )
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDataPage = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Manejo de búsqueda
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const searchValue = formData.get('search') as string;
    
    if (searchValue.trim()) {
      searchByBarcode(searchValue.trim());
    }
  };

  // Manejo de categorías
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Manejo de facturas múltiples
  const addNewInvoice = () => {
    const maxNumber = invoices.reduce((max, invoice) => {
      const num = parseInt(invoice.id.replace('factura-', ''), 10);
      return num > max ? num : max;
    }, 0);

    const newNumber = maxNumber + 1;
    const newInvoice = {
      id: `factura-${newNumber}`,
      name: `Factura ${newNumber}`,
      items: [],
    };

    setInvoices([...invoices, newInvoice]);
    setActiveInvoice(newInvoice.id);
  };

  const changeInvoiceName = (id: string, newName: string) => {
    setInvoices(prev =>
      prev.map(invoice => 
        invoice.id === id ? { ...invoice, name: newName } : invoice
      )
    );
  };

  const closeInvoice = (id: string) => {
    if (invoices.length === 1) return;
    
    const newInvoices = invoices.filter(invoice => invoice.id !== id);
    setInvoices(newInvoices);
    
    if (activeInvoice === id) {
      setActiveInvoice(newInvoices[0].id);
    }
  };

  // Efectos
  useEffect(() => {
    loadSettings();
  }, []); // Sin dependencias para ejecutar solo una vez

  useEffect(() => {
    // Persistir facturas en localStorage
    if (invoices.length > 0) {
      localStorage.setItem('facturas', JSON.stringify(invoices));
    }
  }, [invoices]);

  useEffect(() => {
    // Cargar facturas desde localStorage
    const cachedInvoices = localStorage.getItem('facturas');
    if (cachedInvoices) {
      setInvoices(JSON.parse(cachedInvoices));
    }
  }, []);

  if (productsError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
        Error al cargar productos: {productsError}
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <LoadingOverlay 
        loading={productsLoading || settingsLoading} 
        message="Cargando datos de ventas..."
      />
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '80%',
          marginLeft: '10px',
        }}
      >
        <Box
          id="container_vender"
          sx={{ width: { xs: '100%', lg: 'calc(100% - 23rem)' } }}
        >
          <Header title="VENDER" txt={<ModalSettings />} />

          {/* Tabs de facturas múltiples */}
          <Paper
            sx={{
              background: UI_CONFIG.theme.colors.secondary,
              boxShadow: `0px 0px 19px -14px ${UI_CONFIG.theme.colors.primary}`,
              display: { xs: 'none', lg: 'block' },
              width: '95%',
              borderRadius: '10px',
            }}
          >
            <Tabs
              value={activeInvoice}
              onChange={(_, newValue) => setActiveInvoice(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {invoices.map((invoice) => (
                <Tab
                  key={invoice.id}
                  value={invoice.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        variant="standard"
                        value={invoice.name}
                        onChange={(e) =>
                          changeInvoiceName(invoice.id, e.target.value)
                        }
                        sx={{
                          width: '100px',
                          marginRight: '8px',
                          color: '#fff',
                          filter: 'invert(1)',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => closeInvoice(invoice.id)}
                        sx={{
                          color: 'red',
                          display: invoices.length === 1 ? 'none' : 'block',
                        }}
                      >
                        ✖
                      </IconButton>
                    </Box>
                  }
                />
              ))}
              <Tab
                label={
                  <Box
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <AddOutlinedIcon
                      sx={{ color: 'green', marginRight: '5px' }}
                    />
                    <Box>Nueva</Box>
                  </Box>
                }
                onClick={addNewInvoice}
              />
            </Tabs>
          </Paper>

          {/* Selector de tipo de factura */}
          <ThemeProvider theme={theme}>
            <Box
              sx={{ marginTop: '15px', textAlignLast: 'center', width: '95%' }}
            >
              <Box
                sx={{
                  background: UI_CONFIG.theme.colors.secondary,
                  boxShadow: `0px 0px 19px -14px ${UI_CONFIG.theme.colors.primary}`,
                  borderRadius: '40px',
                  padding: { xs: '7px 11px', sm: '10px 14px' },
                  width: 'fit-content',
                  margin: '0 auto',
                }}
              >
                <Button
                  onClick={() => setTypeInvoice('invoice')}
                  style={
                    typeInvoice === 'invoice'
                      ? styleButtonInvoice.select
                      : styleButtonInvoice.default
                  }
                  sx={{
                    fontFamily: 'Nunito',
                    fontSize: { xs: '12px', sm: '16px' },
                    lineHeight: '21.82px',
                    textAlign: 'left',
                    height: { xs: '25px', sm: 'auto' },
                  }}
                >
                  FACTURA
                </Button>
                <Button
                  onClick={() => setTypeInvoice('quickSale')}
                  style={
                    typeInvoice === 'quickSale'
                      ? styleButtonInvoice.select
                      : styleButtonInvoice.default
                  }
                  sx={{
                    fontSize: { xs: '12px', sm: '16px' },
                    lineHeight: '21.82px',
                    textAlign: 'left',
                    height: { xs: '25px', sm: 'auto' },
                  }}
                >
                  VENTA RÁPIDA
                </Button>
              </Box>
            </Box>
          </ThemeProvider>

          {/* Área principal de productos */}
          <Paper
            id="paper"
            sx={{ width: '95%', height: '100%', marginTop: '1rem' }}
            style={{
              borderRadius: '0.625rem',
              background: UI_CONFIG.theme.colors.secondary,
              boxShadow: `0px 1px 100px -50px ${UI_CONFIG.theme.colors.primary}`,
            }}
          >
            <Box
              sx={{
                padding: '40px 48px',
                height: { xs: '92%', sm: '99%' },
                textAlign: '-webkit-center',
              }}
            >
              {/* Barra de búsqueda */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  display="flex"
                  sx={{
                    width: '85%',
                  }}
                >
                  <Paper
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#fff',
                      width: '25rem',
                      height: '2rem',
                      borderRadius: '0.3125rem',
                      background: UI_CONFIG.theme.colors.background,
                    }}
                  >
                    <IconButton
                      type="button"
                      sx={{ p: '10px' }}
                      aria-label="search"
                    >
                      <SearchIcon sx={{ color: '#fff' }} />
                    </IconButton>
                    <SearchInput
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                    />
                    <IconButton
                      sx={{
                        marginTop: '2px',
                        paddingTop: '0px',
                        marginBottom: '4px',
                        paddingBottom: '0px',
                      }}
                    >
                      <Box component="img" src="/images/scan.svg" />
                    </IconButton>
                  </Paper>
                </Box>
                <Button
                  onClick={handleResetFilter}
                  sx={{
                    padding: '8px',
                    textAlign: 'center',
                    backgroundColor: UI_CONFIG.theme.colors.primary,
                    color: UI_CONFIG.theme.colors.secondary,
                    border: `1px solid ${UI_CONFIG.theme.colors.primary}`,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 10px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: { xs: '8px', sm: '12px' },
                    '&:hover': {
                      backgroundColor: UI_CONFIG.theme.colors.primary,
                      color: UI_CONFIG.theme.colors.secondary,
                      opacity: '70%',
                    },
                  }}
                >
                  RESTABLECER
                </Button>
              </Box>

              {/* Contenido principal */}
              <Box sx={{ marginTop: { sm: '0' }, height: '70%' }}>
                <CarouselCategorias
                  onCategorySelect={handleCategorySelect}
                  selectedCategory={selectedCategory}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    height: '100%',
                    justifyItems: 'center',
                    marginTop: '1.5rem',
                  }}
                >
                  <VenderCardImproved filteredData={currentDataPage} />
                </Box>
                <Box
                  id="pagination"
                  sx={{
                    filter: 'invert(1)',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                    width: { xs: '115%', sm: '100%' },
                    marginLeft: { xs: '-15px', sm: '0' },
                  }}
                >
                  <Pagination
                    sx={{ color: '#fff' }}
                    onChange={(e, page) => setCurrentPage(page)}
                    count={totalPages}
                    shape="circular"
                    size={matches ? 'large' : 'small'}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Sidebar del carrito mejorado */}
        <SlidebarVenderImproved
          typeInvoice={typeInvoice}
          activeInvoice={activeInvoice}
        />
      </Box>
    </ErrorBoundary>
  );
};

export default SalesPageImproved;