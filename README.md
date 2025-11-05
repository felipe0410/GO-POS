# 🏪 GO-POS - Sistema Point of Sale

**GO-POS** es una aplicación completa de Point of Sale (POS) diseñada para establecimientos comerciales en Colombia, con funcionalidades especializadas para diferentes tipos de negocio.

## ✨ Características Principales

- 🛒 **Sistema POS completo** con inventario, ventas y facturación
- 🏢 **Multi-tenant** por establecimientos
- 📄 **Integración DIAN** para facturación electrónica colombiana
- 🍽️ **Módulo Gastrobares** con gestión de mesas y pedidos
- 📊 **Sistema de reportes** con análisis de ventas
- 👥 **Gestión de proveedores** y clientes
- 🚗 **Sistema de parking** para establecimientos con estacionamiento

## 🚀 Tecnologías

### Frontend
- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **Material-UI v5** para componentes de UI
- **Zustand** para estado global
- **Zod** para validación de datos

### Backend
- **Firebase Firestore** (base de datos)
- **Firebase Storage** (archivos)
- **Firebase Auth** (autenticación)
- **Firebase Hosting** (despliegue)

### Herramientas de Desarrollo
- **ESLint** para linting
- **React Scan** para análisis de performance
- **Notistack** para notificaciones

## 🏗️ Arquitectura

### Estructura del Proyecto
```
src/
├── app/                    # Páginas de Next.js (App Router)
│   ├── inventory/         # Gestión de inventario
│   ├── vender/           # Sistema de ventas
│   ├── gastrobares/      # Módulo de restaurantes
│   ├── contacts/         # Clientes y proveedores
│   └── settings/         # Configuración
├── components/           # Componentes reutilizables
│   ├── LoadingStates/   # Estados de carga
│   ├── Cart/            # Carrito de compras
│   └── Layout/          # Layout principal
├── hooks/               # Custom hooks
├── services/            # Capa de servicios
├── schemas/             # Validación con Zod
├── store/               # Estado global (Zustand)
├── config/              # Configuración centralizada
└── firebase/            # Funciones de Firebase
```

### Base de Datos (Firestore)
```
establecimientos/{establishmentId}/
├── productos/              # Inventario
├── invoices/              # Facturas
├── clients/               # Clientes
├── proveedores/           # Proveedores
└── zonas_gastrobares/     # Configuración de mesas
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd go-pos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tu configuración de Firebase:
```env
NEXT_PUBLIC_FIREBASE_APIKEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECTID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APPID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENTID=tu_measurement_id
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
Visita [http://localhost:3000](http://localhost:3000)

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
npm run scan         # Análisis de performance con React Scan
```

## 🎯 Funcionalidades por Módulo

### 📦 Inventario
- **Productos**: Gestión completa de inventario
- **Agregar Productos**: Formulario con validación automática
- **Historial**: Movimientos de inventario
- **Reportes**: Análisis de ventas y productos

### 💰 Ventas
- **POS Normal**: Sistema de ventas estándar
- **DIAN**: Facturación electrónica
- **Devoluciones**: Gestión de devoluciones

### 🍽️ Gastrobares
- **Zonas**: Visualización de mesas
- **Configuración**: Diseño de mesas por piso
- **Pedidos**: Gestión de pedidos por mesa
- **Cocina**: Vista de cocina para preparación

### 👥 Contactos
- **Clientes**: Gestión de clientes
- **Proveedores**: Gestión de proveedores

### ⚙️ Configuración
- **Establecimiento**: Datos del negocio
- **DIAN**: Configuración fiscal
- **Usuarios**: Gestión de empleados

## 🔧 Mejoras Implementadas (2024)

### Sistema de Manejo de Errores
- **Error Boundaries** para capturar errores de React
- **Hooks especializados** para operaciones asíncronas
- **Notificaciones automáticas** de errores

### Estado Global con Zustand
- **Caché inteligente** para productos
- **Carrito de compras** persistente
- **Estado de UI** centralizado

### Validación Automática
- **Schemas con Zod** para validación runtime
- **Mensajes de error** específicos y útiles
- **Validación en tiempo real** en formularios

### Componentes Mejorados
- **LoadingButton** con estados de carga
- **LoadingOverlay** para operaciones que bloquean
- **AppLayout** con navegación integrada

## 📚 Documentación

La documentación completa del proyecto está organizada en la carpeta `/docs`:

- **[📖 Índice de Documentación](docs/README.md)** - Navegación completa de toda la documentación
- **[🔧 Sistemas](docs/sistemas/)** - Documentación de sistemas completos implementados
- **[🛠️ Correcciones](docs/correcciones/)** - Fixes y correcciones implementadas
- **[⚡ Implementaciones](docs/implementaciones/)** - Nuevas funcionalidades agregadas
- **[📖 Guías](docs/guias/)** - Guías de referencia y mejores prácticas

### Documentación de Desarrollo
- **[Contexto del Proyecto](.kiro/steering/go-pos-project-context.md)** - Arquitectura y contexto
- **[Estándares de Desarrollo](.kiro/steering/go-pos-development-standards.md)** - Patrones y convenciones
- **[Mejoras Actuales](.kiro/steering/go-pos-current-improvements.md)** - Estado de implementaciones

## 🎨 Sistema de Diseño

### Colores
- **Primario**: #69EAE2 (Turquesa)
- **Secundario**: #1F1D2B (Fondo oscuro)
- **Background**: #2C3248 (Fondo de componentes)
- **Texto**: #FFF (Blanco)

### Tipografía
- **Primaria**: Nunito (títulos, botones)
- **Secundaria**: Nunito Sans (texto general)

## 🔐 Seguridad

- **Autenticación** con Firebase Auth
- **Validación** de datos en cliente y servidor
- **Permisos** por establecimiento (multi-tenant)
- **Sanitización** de inputs de usuario

## 📊 Performance

- **Caché inteligente** reduce consultas a Firebase en 80%
- **Estado global** optimiza re-renders
- **Lazy loading** de componentes pesados
- **Memoización** de cálculos costosos

## 🚀 Despliegue

### Firebase Hosting

1. **Build del proyecto**
```bash
npm run build
```

2. **Desplegar a Firebase**
```bash
firebase deploy
```

### Variables de Entorno en Producción

Asegúrate de configurar las variables de entorno en tu plataforma de despliegue.

## 🤝 Contribución

### Patrones de Desarrollo

1. **Sigue los estándares** definidos en `.kiro/steering/`
2. **Usa los hooks personalizados** en lugar de lógica manual
3. **Implementa validación** con Zod en todos los formularios
4. **Agrega Error Boundaries** a componentes principales
5. **Usa el estado global** para datos compartidos

### Flujo de Trabajo

1. Crear rama para nueva funcionalidad
2. Seguir patrones establecidos
3. Probar funcionalidad completa
4. Actualizar documentación si es necesario
5. Crear pull request

## 📞 Soporte

Para problemas o preguntas:

1. Revisa la **documentación** en este repositorio
2. Consulta los **steering files** en `.kiro/steering/`
3. Revisa **ejemplos implementados** como `NewProductImproved.tsx`

## 📈 Roadmap

### Próximas Mejoras
- [ ] Testing automatizado con Jest
- [ ] Optimización de bundle size
- [ ] PWA capabilities
- [ ] Modo offline
- [ ] Sincronización en tiempo real mejorada

---

**Versión**: 2.0.0  
**Última actualización**: Noviembre 2024  
**Licencia**: Privada
