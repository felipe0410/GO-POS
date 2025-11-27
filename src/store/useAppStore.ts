import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Tipos para el estado global
interface User {
  id: string;
  email: string;
  establishmentId: string;
  name?: string;
  role?: string;
}

interface Product {
  uid: string;
  productName: string;
  barCode: string;
  cantidad: string;
  purchasePrice: string;
  price: string;
  wholesalePrice?: string;
  category?: string;
  measurement?: string;
  description?: string;
  image?: string;
  user: string;
  parentBarCodes?: string[];
  childBarcodes?: string[];
  cantidadContenida?: string;
  porcentajeEquivalencia?: number;
  proveedores?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface AppState {
  // Usuario y autenticación
  user: User | null;
  isAuthenticated: boolean;
  
  // Productos y caché
  products: Product[];
  productsLastUpdate: number | null;
  productsLoading: boolean;
  
  // Carrito de compras (POS)
  cart: CartItem[];
  cartTotal: number;
  cartSubtotal: number;
  cartDiscount: number;
  
  // UI State
  sidebarOpen: boolean;
  currentModule: string;
  
  // Configuración
  settings: {
    establishment: any;
    dian: any;
    revenue: any;
  };
}

interface AppActions {
  // Acciones de usuario
  setUser: (user: User | null) => void;
  logout: () => void;
  
  // Acciones de productos
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (uid: string, updates: Partial<Product>) => void;
  removeProduct: (uid: string) => void;
  setProductsLoading: (loading: boolean) => void;
  
  // Acciones de carrito
  addToCart: (product: Product, quantity: number, unitPrice?: number) => void;
  removeFromCart: (productUid: string) => void;
  updateCartItemQuantity: (productUid: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (discount: number) => void;
  
  // Acciones de UI
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentModule: (module: string) => void;
  
  // Acciones de configuración
  setSettings: (settings: Partial<AppState['settings']>) => void;
  
  // Utilidades
  getProductByBarCode: (barCode: string) => Product | undefined;
  isProductInCart: (productUid: string) => boolean;
  getCartItemCount: () => number;
}

type AppStore = AppState & AppActions;

// Función para calcular totales del carrito
const calculateCartTotals = (cart: CartItem[], discount: number = 0) => {
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal - discount;
  return { subtotal, total };
};

// Store principal con persistencia
export const useAppStore = create<AppStore>()(
  persist(
    immer((set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      products: [],
      productsLastUpdate: null,
      productsLoading: false,
      cart: [],
      cartTotal: 0,
      cartSubtotal: 0,
      cartDiscount: 0,
      sidebarOpen: false,
      currentModule: 'home',
      settings: {
        establishment: null,
        dian: null,
        revenue: null,
      },

      // Acciones de usuario
      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
        }),

      logout: () =>
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.cart = [];
          state.cartTotal = 0;
          state.cartSubtotal = 0;
          state.cartDiscount = 0;
          // Limpiar localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
          }
        }),

      // Acciones de productos
      setProducts: (products) =>
        set((state) => {
          state.products = products;
          state.productsLastUpdate = Date.now();
        }),

      addProduct: (product) =>
        set((state) => {
          const existingIndex = state.products.findIndex(p => p.uid === product.uid);
          if (existingIndex >= 0) {
            state.products[existingIndex] = product;
          } else {
            state.products.push(product);
          }
        }),

      updateProduct: (uid, updates) =>
        set((state) => {
          const index = state.products.findIndex(p => p.uid === uid);
          if (index >= 0) {
            Object.assign(state.products[index], updates);
          }
        }),

      removeProduct: (uid) =>
        set((state) => {
          state.products = state.products.filter(p => p.uid !== uid);
          // También remover del carrito si está ahí
          state.cart = state.cart.filter(item => item.product.uid !== uid);
          const { subtotal, total } = calculateCartTotals(state.cart, state.cartDiscount);
          state.cartSubtotal = subtotal;
          state.cartTotal = total;
        }),

      setProductsLoading: (loading) =>
        set((state) => {
          state.productsLoading = loading;
        }),

      // Acciones de carrito
      addToCart: (product, quantity, unitPrice) =>
        set((state) => {
          const price = unitPrice || parseFloat(product.price.replace(/[^0-9.-]+/g, '')) || 0;
          const existingItemIndex = state.cart.findIndex(item => item.product.uid === product.uid);
          
          if (existingItemIndex >= 0) {
            // Actualizar cantidad si ya existe
            const existingItem = state.cart[existingItemIndex];
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
          } else {
            // Agregar nuevo item
            state.cart.push({
              product,
              quantity,
              unitPrice: price,
              subtotal: quantity * price,
            });
          }
          
          // Recalcular totales
          const { subtotal, total } = calculateCartTotals(state.cart, state.cartDiscount);
          state.cartSubtotal = subtotal;
          state.cartTotal = total;
        }),

      removeFromCart: (productUid) =>
        set((state) => {
          state.cart = state.cart.filter(item => item.product.uid !== productUid);
          const { subtotal, total } = calculateCartTotals(state.cart, state.cartDiscount);
          state.cartSubtotal = subtotal;
          state.cartTotal = total;
        }),

      updateCartItemQuantity: (productUid, quantity) =>
        set((state) => {
          const item = state.cart.find(item => item.product.uid === productUid);
          if (item) {
            if (quantity <= 0) {
              state.cart = state.cart.filter(item => item.product.uid !== productUid);
            } else {
              item.quantity = quantity;
              item.subtotal = item.quantity * item.unitPrice;
            }
            const { subtotal, total } = calculateCartTotals(state.cart, state.cartDiscount);
            state.cartSubtotal = subtotal;
            state.cartTotal = total;
          }
        }),

      clearCart: () =>
        set((state) => {
          state.cart = [];
          state.cartTotal = 0;
          state.cartSubtotal = 0;
          state.cartDiscount = 0;
        }),

      applyDiscount: (discount) =>
        set((state) => {
          state.cartDiscount = discount;
          const { total } = calculateCartTotals(state.cart, discount);
          state.cartTotal = total;
        }),

      // Acciones de UI
      toggleSidebar: () =>
        set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        }),

      setSidebarOpen: (open) =>
        set((state) => {
          state.sidebarOpen = open;
        }),

      setCurrentModule: (module) =>
        set((state) => {
          state.currentModule = module;
        }),

      // Acciones de configuración
      setSettings: (settings) =>
        set((state) => {
          Object.assign(state.settings, settings);
        }),

      // Utilidades
      getProductByBarCode: (barCode) => {
        const state = get();
        return state.products.find(p => p.barCode === barCode);
      },

      isProductInCart: (productUid) => {
        const state = get();
        return state.cart.some(item => item.product.uid === productUid);
      },

      getCartItemCount: () => {
        const state = get();
        return state.cart.reduce((count, item) => count + item.quantity, 0);
      },
    })),
    {
      name: 'go-pos-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Solo persistir datos importantes
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        settings: state.settings,
        currentModule: state.currentModule,
        // No persistir productos (se cargan desde Firebase)
        // No persistir carrito (se pierde al cerrar sesión)
      }),
    }
  )
);

// Hooks especializados para diferentes partes del estado
export const useAuth = () => useAppStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  setUser: state.setUser,
  logout: state.logout,
}));

export const useProducts = () => useAppStore((state) => ({
  products: state.products,
  productsLoading: state.productsLoading,
  productsLastUpdate: state.productsLastUpdate,
  setProducts: state.setProducts,
  addProduct: state.addProduct,
  updateProduct: state.updateProduct,
  removeProduct: state.removeProduct,
  setProductsLoading: state.setProductsLoading,
  getProductByBarCode: state.getProductByBarCode,
}));

export const useCart = () => useAppStore((state) => ({
  cart: state.cart,
  cartTotal: state.cartTotal,
  cartSubtotal: state.cartSubtotal,
  cartDiscount: state.cartDiscount,
  addToCart: state.addToCart,
  removeFromCart: state.removeFromCart,
  updateCartItemQuantity: state.updateCartItemQuantity,
  clearCart: state.clearCart,
  applyDiscount: state.applyDiscount,
  isProductInCart: state.isProductInCart,
  getCartItemCount: state.getCartItemCount,
}));

export const useUI = () => useAppStore((state) => ({
  sidebarOpen: state.sidebarOpen,
  currentModule: state.currentModule,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen,
  setCurrentModule: state.setCurrentModule,
}));

export const useSettings = () => useAppStore((state) => ({
  settings: state.settings,
  setSettings: state.setSettings,
}));