// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'GO-POS',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
} as const;

// Configuración de Firebase
export const FIREBASE_CONFIG = {
  collections: {
    establishments: 'establecimientos',
    products: 'productos',
    invoices: 'invoices',
    clients: 'clients',
    providers: 'proveedores',
    categories: 'categorias',
    measurements: 'medidas',
  },
  storage: {
    images: 'images',
    documents: 'documents',
  },
} as const;

// Configuración de UI
export const UI_CONFIG = {
  theme: {
    colors: {
      primary: '#69EAE2',
      secondary: '#1F1D2B',
      background: '#2C3248',
      text: '#FFF',
      error: '#ff6b6b',
      success: '#51cf66',
      warning: '#ffd43b',
    },
    fonts: {
      primary: 'Nunito',
      secondary: 'Nunito Sans',
    },
  },
  notifications: {
    autoHideDuration: 4000,
    maxSnack: 3,
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
  },
} as const;

// Configuración de validación
export const VALIDATION_CONFIG = {
  product: {
    nameMinLength: 1,
    nameMaxLength: 100,
    barcodeMinLength: 1,
    barcodeMaxLength: 50,
    priceMin: 0,
    quantityMin: 0,
  },
  invoice: {
    itemsMinCount: 1,
    itemsMaxCount: 100,
  },
  client: {
    nameMinLength: 1,
    nameMaxLength: 100,
  },
} as const;

// Configuración de caché
export const CACHE_CONFIG = {
  products: {
    key: 'products_cache',
    ttl: 5 * 60 * 1000, // 5 minutos
  },
  categories: {
    key: 'categories_cache',
    ttl: 30 * 60 * 1000, // 30 minutos
  },
  providers: {
    key: 'providers_cache',
    ttl: 15 * 60 * 1000, // 15 minutos
  },
} as const;

// Configuración del store
export const STORE_CONFIG = {
  persistKey: 'go-pos-store',
  version: 1,
  blacklist: ['products', 'cart'], // No persistir estos datos
  whitelist: ['user', 'settings', 'currentModule'], // Solo persistir estos
} as const;

// Configuración de errores
export const ERROR_MESSAGES = {
  network: 'Error de conexión. Verifica tu internet',
  permission: 'No tienes permisos para realizar esta acción',
  notFound: 'El recurso solicitado no fue encontrado',
  validation: 'Los datos ingresados no son válidos',
  unknown: 'Ha ocurrido un error inesperado',
  timeout: 'La operación ha tardado demasiado tiempo',
} as const;

// Configuración de formatos
export const FORMAT_CONFIG = {
  currency: {
    locale: 'es-CO',
    currency: 'COP',
    prefix: '$ ',
  },
  date: {
    locale: 'es-CO',
    format: 'dd/MM/yyyy',
    formatWithTime: 'dd/MM/yyyy HH:mm',
  },
} as const;