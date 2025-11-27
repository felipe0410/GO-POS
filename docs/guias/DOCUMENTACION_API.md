# 📚 Documentación de API - GO-POS

## 🎯 Hooks Personalizados

### useAsyncOperation

Hook para manejar operaciones asíncronas con estados de loading y error automáticos.

```typescript
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

// Uso básico
const { execute, loading, error, reset } = useAsyncOperation(asyncFunction);

// Ejemplo
const saveProduct = useAsyncOperation(async (productData) => {
  return await ProductService.createProduct(productData);
});

// En el componente
const handleSave = async () => {
  try {
    const result = await saveProduct.execute(formData);
    console.log('Producto guardado:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**Parámetros:**
- `operation: (...args: any[]) => Promise<T>` - Función asíncrona a ejecutar

**Retorna:**
- `execute: (...args: any[]) => Promise<T>` - Función para ejecutar la operación
- `loading: boolean` - Estado de carga
- `error: string | null` - Mensaje de error si ocurre
- `reset: () => void` - Resetear estado

### useNotification

Hook para mostrar notificaciones de manera consistente.

```typescript
import { useNotification } from '@/hooks/useNotification';

const { success, error, warning, info, handleAsyncError } = useNotification();

// Ejemplos de uso
success('Operación exitosa');
error('Algo salió mal');
warning('Advertencia importante');
info('Información relevante');

// Manejo automático de errores async
try {
  await someAsyncOperation();
} catch (err) {
  handleAsyncError(err, 'Contexto del error');
}
```

**Métodos:**
- `success(message: string, persist?: boolean)` - Notificación de éxito
- `error(message: string, persist?: boolean)` - Notificación de error
- `warning(message: string, persist?: boolean)` - Notificación de advertencia
- `info(message: string, persist?: boolean)` - Notificación informativa
- `handleAsyncError(error: Error | string, context?: string)` - Manejo automático de errores

### useProducts

Hook para gestión completa de productos con caché inteligente.

```typescript
import { useProducts } from '@/hooks/useProducts';

const {
  products,
  loading,
  error,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  filterByCategory,
  categories,
  refreshProducts,
  creating,
  updating,
  deleting,
  cacheAge,
  isCacheExpired,
} = useProducts();

// Crear producto
await createProduct({
  productName: 'Producto Nuevo',
  barCode: '123456789',
  price: '$ 10,000',
  // ...
});

// Buscar productos
const filtered = searchProducts('coca cola');

// Filtrar por categoría
const beverages = filterByCategory('Bebidas');
```

**Estado:**
- `products: Product[]` - Lista de productos
- `loading: boolean` - Estado de carga general
- `error: string | null` - Error si ocurre

**Operaciones:**
- `createProduct(data: unknown): Promise<string>` - Crear producto
- `updateProduct(uid: string, data: unknown): Promise<void>` - Actualizar producto
- `deleteProduct(uid: string, imageUrl?: string): Promise<void>` - Eliminar producto
- `refreshProducts(): void` - Forzar actualización del caché

**Utilidades:**
- `searchProducts(term: string): Product[]` - Buscar productos
- `filterByCategory(category: string): Product[]` - Filtrar por categoría
- `categories(): string[]` - Obtener categorías únicas

### useClients

Hook para gestión de clientes con validación automática.

```typescript
import { useClients } from '@/hooks/useClients';

const {
  clients,
  loading,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  validateUniqueNIT,
  validateUniqueEmail,
} = useClients();

// Crear cliente
await createClient({
  name: 'Juan Pérez',
  email: 'juan@email.com',
  phone: '123456789',
  nit: '12345678-9',
});

// Validar NIT único
const isUnique = validateUniqueNIT('12345678-9');
```

### useCart

Hook para gestión del carrito de compras con validaciones.

```typescript
import { useCart } from '@/hooks/useCart';

const {
  cart,
  cartTotal,
  cartSubtotal,
  cartDiscount,
  isEmpty,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyDiscount,
  processInvoice,
  getCartStats,
  validateCartAvailability,
} = useCart();

// Agregar al carrito
addToCart(product, 2); // producto, cantidad

// Procesar venta
await processInvoice(customerData, 'Efectivo');

// Obtener estadísticas
const stats = getCartStats();
console.log(`${stats.itemCount} productos en el carrito`);
```

### useAuth

Hook para autenticación y manejo de sesión.

```typescript
import { useAuth } from '@/hooks/useAuth';

const {
  user,
  isAuthenticated,
  login,
  register,
  logout,
  hasPermission,
  getCurrentEstablishmentId,
  loading,
} = useAuth();

// Login
await login('user@email.com', 'password');

// Verificar permisos
if (hasPermission('create_products')) {
  // Permitir acción
}

// Obtener ID del establecimiento
const establishmentId = getCurrentEstablishmentId();
```

## 🏪 Estado Global (Zustand Store)

### useAppStore

Store principal con estado global de la aplicación.

```typescript
import { useAppStore } from '@/store/useAppStore';

// Usar todo el store (no recomendado)
const store = useAppStore();

// Usar hooks especializados (recomendado)
import { useAuth, useProducts, useCart, useUI } from '@/store/useAppStore';
```

### Hooks Especializados del Store

#### useAuth (Store)
```typescript
import { useAuth } from '@/store/useAppStore';

const { user, isAuthenticated, setUser, logout } = useAuth();
```

#### useProducts (Store)
```typescript
import { useProducts } from '@/store/useAppStore';

const {
  products,
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  getProductByBarCode,
} = useProducts();
```

#### useCart (Store)
```typescript
import { useCart } from '@/store/useAppStore';

const {
  cart,
  cartTotal,
  addToCart,
  removeFromCart,
  clearCart,
  isProductInCart,
} = useCart();
```

#### useUI (Store)
```typescript
import { useUI } from '@/store/useAppStore';

const {
  sidebarOpen,
  currentModule,
  toggleSidebar,
  setCurrentModule,
} = useUI();
```

## 🔧 Servicios

### ProductService

Servicio para operaciones de productos con validación automática.

```typescript
import { ProductService } from '@/services/productService';

// Crear producto
const uid = await ProductService.createProduct({
  productName: 'Nuevo Producto',
  barCode: '123456789',
  // ...
});

// Actualizar producto
await ProductService.updateProduct('product-uid', {
  price: '$ 15,000',
});

// Eliminar producto
await ProductService.deleteProduct('product-uid', 'image-url');

// Obtener producto
const product = await ProductService.getProduct('product-uid');
```

### ClientService

Servicio para operaciones de clientes con validación.

```typescript
import { ClientService } from '@/services/clientService';

// Crear cliente
const uid = await ClientService.createClient({
  name: 'Cliente Nuevo',
  email: 'cliente@email.com',
});

// Validar datos
const { isValid, errors } = ClientService.validateClientData(clientData);

// Formatear para mostrar
const formatted = ClientService.formatClientForDisplay(client);

// Buscar clientes
const results = ClientService.searchClients(clients, 'juan');
```

## 🎨 Componentes de UI

### LoadingButton

Botón con estado de carga integrado.

```typescript
import { LoadingButton } from '@/components/LoadingStates/LoadingButton';

<LoadingButton
  loading={saving}
  loadingText="Guardando..."
  onClick={handleSave}
  disabled={!isValid}
  variant="contained"
  sx={{ backgroundColor: '#69EAE2' }}
>
  Guardar
</LoadingButton>
```

**Props:**
- Todas las props de `Button` de Material-UI
- `loading?: boolean` - Estado de carga
- `loadingText?: string` - Texto a mostrar durante carga

### LoadingOverlay

Overlay de carga para operaciones que bloquean la UI.

```typescript
import { LoadingOverlay } from '@/components/LoadingStates/LoadingOverlay';

<LoadingOverlay
  loading={loading}
  message="Cargando productos..."
  backdrop={true}
/>
```

**Props:**
- `loading: boolean` - Si mostrar el overlay
- `message?: string` - Mensaje a mostrar
- `backdrop?: boolean` - Si usar backdrop (por defecto true)

### ErrorBoundary

Componente para capturar errores de React.

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary fallback={<CustomErrorComponent />}>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `children: ReactNode` - Componentes a proteger
- `fallback?: ReactNode` - Componente a mostrar en caso de error

### AppLayout

Layout principal de la aplicación.

```typescript
import { AppLayout } from '@/components/Layout/AppLayout';

export default function Page() {
  return (
    <AppLayout>
      <YourPageContent />
    </AppLayout>
  );
}
```

**Características:**
- AppBar con navegación
- Carrito lateral integrado
- Manejo automático de autenticación
- Error boundaries incluidos

### CartSidebar

Sidebar del carrito de compras.

```typescript
import { CartSidebar } from '@/components/Cart/CartSidebar';

<CartSidebar
  open={cartOpen}
  onClose={() => setCartOpen(false)}
/>
```

## 📝 Schemas de Validación

### Schemas Disponibles

```typescript
import {
  createProductSchema,
  updateProductSchema,
  createInvoiceSchema,
  createClientSchema,
  validateData,
} from '@/schemas/productSchemas';

// Validar datos
try {
  const validData = validateData(createProductSchema, formData);
  // Datos válidos, proceder
} catch (error) {
  // Mostrar errores de validación
  console.error(error.message);
}
```

### Tipos TypeScript

```typescript
import type {
  CreateProductDto,
  UpdateProductDto,
  CreateInvoiceDto,
  CreateClientDto,
  InvoiceItem,
} from '@/schemas/productSchemas';
```

## ⚙️ Configuración

### Constantes Centralizadas

```typescript
import {
  UI_CONFIG,
  FIREBASE_CONFIG,
  CACHE_CONFIG,
  ERROR_MESSAGES,
  FORMAT_CONFIG,
} from '@/config/constants';

// Usar colores del tema
const primaryColor = UI_CONFIG.theme.colors.primary;

// Configuración de caché
const cacheTime = CACHE_CONFIG.products.ttl;

// Mensajes de error
const errorMsg = ERROR_MESSAGES.network;
```

## 🚨 Manejo de Errores

### Patrones de Manejo

```typescript
// 1. Con useAsyncOperation (recomendado)
const { execute, loading, error } = useAsyncOperation(asyncFunction);

// 2. Con useNotification
const { handleAsyncError } = useNotification();
try {
  await someOperation();
} catch (error) {
  handleAsyncError(error, 'Contexto del error');
}

// 3. Con ErrorBoundary para errores de React
<ErrorBoundary>
  <ComponentThatMightFail />
</ErrorBoundary>
```

## 📊 Performance

### Optimizaciones Implementadas

1. **Caché Inteligente**: Los productos se cachean por 5 minutos
2. **Estado Global**: Evita prop drilling y re-renders innecesarios
3. **Lazy Loading**: Componentes se cargan bajo demanda
4. **Memoización**: Cálculos costosos se memorizan

### Mejores Prácticas

```typescript
// Usar hooks especializados del store
const { products } = useProducts(); // ✅
const products = useAppStore(state => state.products); // ❌

// Memoizar cálculos costosos
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Usar callbacks para funciones
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

---

**Documentación actualizada**: Noviembre 2024  
**Versión**: 2.0.0