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

// Componentes originales (temporalmente)
import HeaderImproved from '@/components/HeaderImproved';
import VenderCards from '@/components/VenderCards';
import CarouselCategorias from '@/components/CarouselCategorias';
import ModalSettings from './modal_settings';
import SearchInput from './SearchInput';
import SlidebarVender from './SlidebarVender';

// Firebase
import { getAllProductsDataonSnapshot, fetchAndStoreSettings } from '@/firebase';

// Hooks offline
import { useOfflineInit } from '@/hooks/useOfflineInit';

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

const SalesPage: React.FC = () => {
  // Estados locales (usando el patrón original temporalmente)
  const [data, setData] = useState<undefined | any[]>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [typeInvoice, setTypeInvoice] = useState<string>('quickSale');
  const [load, setLoad] = useState(0);
  const [facturas, setFacturas] = useState<Invoice[]>([
    { id: 'factura-1', name: 'Factura 1', items: [] }
  ]);
  const [facturaActiva, setFacturaActiva] = useState('factura-1');
  const [currentPage, setCurrentPage] = useState(1);
  
  const muiTheme = useTheme();
  const matches = useMediaQuery(muiTheme.breakpoints.up('sm'));

  // Configuración de paginación
  const itemsPerPage = 12;

  // Cargar configuración
  const loadSettings = useCallback(async () => {
    const cachedSettings = localStorage.getItem('settingsData');
    if (cachedSettings) {
      const parsedSettings = JSON.parse(cachedSettings);
      setTypeInvoice(parsedSettings?.defaultTypeInvoice || 'quickSale');
    } else {
      const success: any = await fetchAndStoreSettings();
      if (success) {
        const updatedSettings = localStorage.getItem('settingsData');
        const parsedUpdatedSettings = JSON.parse(updatedSettings || '{}');
        setTypeInvoice(parsedUpdatedSettings?.defaultTypeInvoice || 'quickSale');
      }
    }
  }, []);

  // Filtrar datos
  const filteredData = useCallback(async (
    event: any,
    removeCategoryFilter: boolean = false
  ) => {
    try {
      let value2 = event.trim();
      value2 = value2.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const resolvedData = await data;

      if (removeCategoryFilter) {
        setSelectedCategory(null);
      }

      const filterSearch: any = resolvedData?.filter((item) => {
        if (searchTerm === '') {
          if (!selectedCategory) {
            return true;
          }
          return item.category === selectedCategory;
        } else {
          return Object.values(item).some((value) =>
            String(value).toLowerCase().includes(value2.toLowerCase())
          );
        }
      });

      setFilter(filterSearch);
      const foundProducts = resolvedData?.filter(
        (producto) => producto.barCode === value2
      );

      if (foundProducts?.length === 1) {
        const cleanedPrice = Number(
          foundProducts[0].price.replace(/[$,]/g, '')
        );
        const newItem = {
          ...foundProducts[0],
          acc: cleanedPrice,
          cantidad: 1,
        };

        setFacturas((prevFacturas) =>
          prevFacturas.map((factura) =>
            factura.id === facturaActiva
              ? {
                ...factura,
                items: updateSelectedItems(factura.items, newItem),
              }
              : factura
          )
        );

        setSearchTerm('');
      } else {
        if (searchTerm.length > 0) {
          const audio = new Audio('/error-beep.mp3');
          audio.play();
        }
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }, [data, searchTerm, selectedCategory, facturaActiva]);

  const updateSelectedItems = useCallback((items: any[], newItem: any) => {
    let updatedItems = items.filter((item) => item.barCode !== newItem.barCode);

    const existingItem = items.find((item) => item.barCode === newItem.barCode);

    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        cantidad: existingItem.cantidad + 1,
        acc: existingItem.acc + newItem.acc,
      };
      updatedItems = [updatedItem, ...updatedItems];
    } else {
      updatedItems = [newItem, ...updatedItems];
    }

    return updatedItems;
  }, []);

  // Manejo de categorías
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    filteredData('');
  }, [filteredData]);

  const handleResetFilter = useCallback(() => {
    setSelectedCategory(null);
    setSearchTerm('');
    filteredData('');
  }, [filteredData]);

  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDataPage = filter?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filter?.length / itemsPerPage);

  // Manejo de facturas múltiples
  const addNewInvoice = useCallback(() => {
    const maxNumber = facturas.reduce((max, invoice) => {
      const num = parseInt(invoice.id.replace('factura-', ''), 10);
      return num > max ? num : max;
    }, 0);

    const newNumber = maxNumber + 1;
    const newInvoice = {
      id: `factura-${newNumber}`,
      name: `Factura ${newNumber}`,
      items: [],
    };

    setFacturas([...facturas, newInvoice]);
    setFacturaActiva(newInvoice.id);
  }, [facturas]);

  const changeInvoiceName = useCallback((id: string, newName: string) => {
    setFacturas(prev =>
      prev.map(invoice => 
        invoice.id === id ? { ...invoice, name: newName } : invoice
      )
    );
  }, []);

  const closeInvoice = useCallback((id: string) => {
    if (facturas.length === 1) return;
    
    const newInvoices = facturas.filter(invoice => invoice.id !== id);
    setFacturas(newInvoices);
    
    if (facturaActiva === id) {
      setFacturaActiva(newInvoices[0].id);
    }
  }, [facturas, facturaActiva]);

  // Obtener productos de la factura activa
  const productosFacturaActiva = useMemo(() => {
    return facturas.find((factura) => factura.id === facturaActiva)?.items || [];
  }, [facturas, facturaActiva]);

  // Efectos
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        await getAllProductsDataonSnapshot(setData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getAllProducts();
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    filteredData('');
  }, [data, selectedCategory]);

  useEffect(() => {
    if (facturas.length > 0) {
      localStorage.setItem('facturas', JSON.stringify(facturas));
    }
  }, [facturas]);

  useEffect(() => {
    const cachedFacturas = localStorage.getItem('facturas');
    if (cachedFacturas) {
      setFacturas(JSON.parse(cachedFacturas));
    }
  }, []);

  return (
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
        <HeaderImproved title="VENDER" txt={<ModalSettings />} />

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
            value={facturaActiva}
            onChange={(_, newValue) => setFacturaActiva(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {facturas.map((invoice) => (
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
                        display: facturas.length === 1 ? 'none' : 'block',
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
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    filteredData(e.target[1].value);
                  }}
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
              <VenderCards
                filteredData={currentDataPage}
                setSelectedItems={setFacturas}
                selectedItems={productosFacturaActiva}
                facturaActiva={facturaActiva}
              />
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

      {/* Sidebar del carrito original */}
      <SlidebarVender
        selectedItems={productosFacturaActiva}
        setSelectedItems={setFacturas}
        searchTerm={searchTerm}
        filteredData={filteredData}
        setSearchTerm={setSearchTerm}
        typeInvoice={typeInvoice}
        facturaActiva={facturaActiva}
      />
    </Box>
  );
};

export default SalesPage;
