# 🚀 Guía de Migración - GO-POS

## 📋 Introducción

Esta guía te ayudará a migrar componentes existentes de GO-POS para usar las nuevas herramientas y patrones implementados. Sigue estos pasos para aprovechar al máximo las mejoras de performance, manejo de errores y estado global.

## 🎯 Beneficios de la Migración

- ✅ **Manejo automático de errores** con notificaciones
- ✅ **Estados de carga consistentes** en toda la aplicación
- ✅ **Validación automática** de datos con Zod
- ✅ **Estado global** con Zustand para mejor performance
- ✅ **Código más limpio** y mantenible

## 🔧 Herramientas Disponibles

### Hooks Principales
```typescript
// Operaciones asíncronas con manejo de errores
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

// Notificaciones automáticas
import { useNotification } from '@/hooks/useNotification';

// Productos con caché inteligente
import { useProducts } from '@/hooks/useProducts';

// Clientes con validación
import { useClients } from '@/hooks/useClients';

// Carrito de compras
import { useCart } from '@/hooks/useCart';

// Autenticación
import { useAuth } from '@/hooks/useAuth';

// Estado global especializado
import { useAuth, useProducts, useCart, useUI } from '@/store/useAppStore';
```

### Componentes de UI
```typescript
// Estados de carga
import { LoadingButton } from '@/components/LoadingStates/LoadingButton';
import { LoadingOverlay } from '@/components/LoadingStates/LoadingOverlay';

// Manejo de errores
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Layout principal
import { AppLayout } from '@/components/Layout/AppLayout';

// Carrito lateral
import { CartSidebar } from '@/components/Cart/CartSidebar';
```

### Servicios y Validación
```typescript
// Servicios con validación
import { ProductService } from '@/services/productService';
import { ClientService } from '@/services/clientService';

// Schemas de validación
import { validateData, createProductSchema, createClientSchema } from '@/schemas/productSchemas';

// Configuración centralizada
import { UI_CONFIG, CACHE_CONFIG } from '@/config/constants';
```

## 📝 Pasos de Migración

### Paso 1: Preparar el Componente

#### Antes (Patrón Antiguo)
```typescript
"use client";
import React, { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { getAllProductsData, createProduct } from '@/firebase';

export default function OldComponent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllProductsData(setProducts);
  }, []);

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      await createProduct(data.barCode, data);
      enqueueSnackbar('Producto creado', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error al crear producto', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Componente sin layout ni error boundary */}
    </div>
  );
}
```

#### Después (Patrón Nuevo)
```typescript
"use client";
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { LoadingButton } from '@/components/LoadingStates/LoadingButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppLayout } from '@/components/Layout/AppLayout';

export default function NewComponent() {
  const { products, loading, createProduct, creating } = useProducts();

  const handleCreate = async (data) => {
    try {
      await createProduct(data);
      // Notificación automática en el hook
    } catch (error) {
      // Error automáticamente manejado
    }
  };

  return (
    <AppLayout>
      <ErrorBoundary>
        <div>
          <LoadingButton
            loading={creating}
            loadingText="Creando..."
            onClick={() => handleCreate(formData)}
          >
            Crear Producto
          </LoadingButton>
        </div>
      </ErrorBoundary>
    </AppLayout>
  );
}
```

### Paso 2: Migrar Estados y Efectos

#### Reemplazar useState y useEffect
```typescript
// ❌ Antes
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await someApiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

// ✅ Después
const { data, loading, error } = useCustomHook();
```

### Paso 3: Migrar Operaciones Asíncronas

#### Usar useAsyncOperation
```typescript
// ❌ Antes
const [saving, setSaving] = useState(false);

const handleSave = async () => {
  try {
    setSaving(true);
    await saveData();
    enqueueSnackbar('Guardado exitoso', { variant: 'success' });
  } catch (error) {
    enqueueSnackbar('Error al guardar', { variant: 'error' });
  } finally {
    setSaving(false);
  }
};

// ✅ Después
const { execute: saveData, loading: saving } = useAsyncOperation(saveDataFunction);
const { success } = useNotification();

const handleSave = async () => {
  try {
    await saveData();
    success('Guardado exitoso');
  } catch (error) {
    // Error automáticamente manejado
  }
};
```

### Paso 4: Migrar Formularios

#### Agregar Validación con Zod
```typescript
// ❌ Antes
const handleSubmit = async (formData) => {
  if (!formData.name) {
    alert('El nombre es requerido');
    return;
  }
  await createItem(formData);
};

// ✅ Después
import { validateData, createItemSchema } from '@/schemas/itemSchemas';

const handleSubmit = async (formData) => {
  try {
    const validatedData = validateData(createItemSchema, formData);
    await createItem(validatedData);
  } catch (error) {
    // Errores de validación automáticamente mostrados
  }
};
```

### Paso 5: Migrar UI Components

#### Reemplazar Botones y Estados de Carga
```typescript
// ❌ Antes
<Button disabled={loading}>
  {loading ? 'Cargando...' : 'Guardar'}
</Button>

// ✅ Después
<LoadingButton
  loading={loading}
  loadingText="Guardando..."
  onClick={handleSave}
>
  Guardar
</LoadingButton>
```

#### Agregar Error Boundaries
```typescript
// ❌ Antes
export default function Page() {
  return <YourComponent />;
}

// ✅ Después
export default function Page() {
  return (
    <AppLayout>
      <ErrorBoundary>
        <YourComponent />
      </ErrorBoundary>
    </AppLayout>
  );
}
```

## 🎨 Migración de Estilos

### Usar Configuración Centralizada
```typescript
// ❌ Antes
const styles = {
  primaryColor: '#69EAE2',
  backgroundColor: '#1F1D2B',
  // ...
};

// ✅ Después
import { UI_CONFIG } from '@/config/constants';

const styles = {
  primaryColor: UI_CONFIG.theme.colors.primary,
  backgroundColor: UI_CONFIG.theme.colors.secondary,
  // ...
};
```

## 📊 Checklist de Migración

### Para cada componente migrado:

- [ ] **Layout**: Envuelto en `AppLayout`
- [ ] **Error Boundary**: Componente protegido con `ErrorBoundary`
- [ ] **Hooks**: Usa hooks personalizados en lugar de lógica manual
- [ ] **Validación**: Implementa schemas de Zod
- [ ] **Notificaciones**: Usa `useNotification` en lugar de `enqueueSnackbar`
- [ ] **Estados de Carga**: Usa `LoadingButton` y `LoadingOverlay`
- [ ] **Estilos**: Usa `UI_CONFIG` para colores y fuentes
- [ ] **Operaciones Async**: Usa `useAsyncOperation` para manejo de errores
- [ ] **Estado Global**: Migra estado local a Zustand cuando sea apropiado

### Verificación Final:

- [ ] **No hay errores** de TypeScript
- [ ] **No hay warnings** de React
- [ ] **Funcionalidad** mantiene el comportamiento original
- [ ] **Performance** mejorada (menos re-renders)
- [ ] **UX** consistente con el resto de la aplicación

## 🚨 Problemas Comunes y Soluciones

### Error: "Hook no encontrado"
```bash
# Solución: Verificar imports
import { useProducts } from '@/hooks/useProducts'; // ✅
import { useProducts } from './hooks/useProducts'; // ❌
```

### Error: "Property disabled does not exist"
```typescript
// Problema: LoadingButton no acepta disabled
<LoadingButton disabled={true} /> // ❌

// Solución: disabled está incluido en ButtonProps
<LoadingButton disabled={condition} /> // ✅
```

### Error: "Cannot read property of undefined"
```typescript
// Problema: Acceso a propiedades sin verificar
const name = user.name; // ❌

// Solución: Usar optional chaining
const name = user?.name || 'Sin nombre'; // ✅
```

## 📈 Métricas de Éxito

Después de migrar un componente, deberías ver:

- **Reducción de código**: 30-50% menos líneas
- **Menos bugs**: Validación automática previene errores
- **Mejor UX**: Estados de carga y errores consistentes
- **Mantenibilidad**: Código más limpio y reutilizable

## 🎯 Próximos Pasos

1. **Migra componentes críticos** primero (formularios, listas)
2. **Prueba cada migración** antes de continuar
3. **Documenta cambios** específicos si es necesario
4. **Capacita al equipo** en los nuevos patrones

## 📞 Soporte

Si encuentras problemas durante la migración:

1. Revisa los **steering files** en `.kiro/steering/`
2. Consulta **ejemplos implementados** como `NewProductImproved.tsx`
3. Verifica **patrones establecidos** en `go-pos-development-standards.md`

---

**¡Feliz migración! 🚀**