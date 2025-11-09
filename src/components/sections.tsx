import BadgeIcon from '@mui/icons-material/Badge';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CountertopsIcon from '@mui/icons-material/Countertops';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

export const localSections = [
  {
    section: "INICIO",
    icon: "/images/home.svg",
    icon2: "/images/homeSelected.svg",
    id: "/home",
  },
  {
    section: "PERFIL",
    icon: "/images/profile.svg",
    icon2: "/images/profileSelected.svg",
    id: "/profile",
  },
  {
    section: "VENDER",
    icon: "/images/vender.svg",
    icon2: "/images/venderSelected.svg",
    id: "/vender/Normal",
    submenus: [
      {
        section: "DIAN",
        id: "/vender/Dian",
      },
      {
        section: "NORMAL",
        id: "/vender/Normal",
      },
      {
        section: "DEVOLUCION",
        id: "/vender/Devolucion",
      },
    ],
  },
  {
    section: "CAJA",
    icon2: "/images/cajaSelected.svg",
    icon: "/images/caja.svg",
    id: "/register/invoices",
    submenus: [
      {
        section: "FACTURAS",
        id: "/register/invoices",
      },
      {
        section: "ANALITICAS",
        id: "/register/dashboard",
      },
      {
        section: "ITEMS",
        id: "/register/dashboardProductos",
      },
      {
        section: "FACTURAS DIAN",
        id: "/register/invoicesDian",
      },
    ],
  },
  {
    section: "INVENTARIO",
    icon: "/images/inventario.svg",
    icon2: "/images/inventarioSelected.svg",
    id: "/inventory/productos",
    submenus: [
      {
        section: "PRODUCTOS",
        id: "/inventory/productos",
      },
      {
        section: "AGREGAR PRODUCTO",
        id: "/inventory/agregarProductos",
      },
      {
        section: "RESUMEN",
        id: "/inventory/historial",
      },
      {
        section: "REPORTE",
        id: "/inventory/reporte",
      },
    ],
  },
  {
    section: "AJUSTES",
    icon: "/images/settings.svg",
    icon2: "/images/inventarioSelected.svg",
    id: "/settings/establishment",
    submenus: [
      //{
      // section: "USUARIO",
      //id: "/settings/user",
      //},
      //{
      //  section: "EMPLEADOS",
      // id: "/settings/employees",
      //},
      {
        section: "ESTABLECIMIENTO",
        id: "/settings/establishment",
      },
      {
        section: "AJUSTES DIAN",
        id: "/settings/dian",
      },
    ],
  },
  {
    section: "DIRECTORIO",
    icon: <BadgeIcon sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px", margin: 0 }} />,
    icon2: <BadgeIcon sx={{ fontSize: "24px", ml: "10px", margin: 0 }} />,
    id: "/contacts/clientes",
    submenus: [
      {
        section: "PROVEEDORES",
        id: "/contacts/proveedores",
      },
      {
        section: "CLIENTES",
        id: "/contacts/clientes",
      }
    ],
  },
];


export const gastrobarSections = [
  {
    section: "INICIO",
    icon: "/images/home.svg",
    icon2: "/images/homeSelected.svg",
    id: "/home",
  },
  {
    section: "PERFIL",
    icon: "/images/profile.svg",
    icon2: "/images/profileSelected.svg",
    id: "/profile",
  },
  {
    section: "PAGAR",
    icon: (
      <LocalAtmIcon
        sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px", margin: 0 }}
      />
    ),
    icon2: (
      <LocalAtmIcon sx={{ fontSize: "24px", ml: "10px", margin: 0 }} />
    ),
    id: "/gastrobares/pagar",
  },
  {
    section: "PEDIDOS",
    icon: (
      <DeliveryDiningIcon
        sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px", margin: 0 }}
      />
    ),
    icon2: (
      <DeliveryDiningIcon sx={{ fontSize: "24px", ml: "10px", margin: 0 }} />
    ),
    id: "/gastrobares/pedido",
  },
  {
    section: "ZONAS",
    icon: (
      <StorefrontIcon
        sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px", margin: 0 }}
      />
    ),
    icon2: (
      <StorefrontIcon sx={{ fontSize: "24px", ml: "10px", margin: 0 }} />
    ),
    id: "/gastrobares/zonas",
  },
  {
    section: "COCINA",
    icon: (
      <CountertopsIcon
        sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px", margin: 0 }}
      />
    ),
    icon2: (
      <CountertopsIcon sx={{ fontSize: "24px", ml: "10px", margin: 0 }} />
    ),
    id: "/gastrobares/cocina",
  },
  {
    section: "CAJA",
    icon2: "/images/cajaSelected.svg",
    icon: "/images/caja.svg",
    id: "/register/invoices",
    submenus: [
      {
        section: "FACTURAS",
        id: "/register/invoices",
      },
      {
        section: "ANALÍTICAS",
        id: "/register/dashboard",
      },
      {
        section: "ITEMS",
        id: "/register/dashboardProductos",
      },
      {
        section: "FACTURAS DIAN",
        id: "/register/invoicesDian",
      },
    ],
  },
  {
    section: "INVENTARIO",
    icon: "/images/inventario.svg",
    icon2: "/images/inventarioSelected.svg",
    id: "/inventory/productos",
    submenus: [
      {
        section: "PRODUCTOS",
        id: "/inventory/productos",
      },
      {
        section: "AGREGAR PRODUCTO",
        id: "/inventory/agregarProductos",
      },
      {
        section: "RESUMEN",
        id: "/inventory/historial",
      },
    ],
  },
  {
    section: "AJUSTES",
    icon: "/images/settings.svg",
    icon2: "/images/inventarioSelected.svg",
    id: "/settings/establishment",
    submenus: [
      {
        section: "ESTABLECIMIENTO",
        id: "/settings/establishment",
      },
      {
        section: "AJUSTES DIAN",
        id: "/settings/dian",
      },
    ],
  },
  {
    section: "DIRECTORIO",
    icon: (
      <BadgeIcon
        sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px", margin: 0 }}
      />
    ),
    icon2: (
      <BadgeIcon sx={{ fontSize: "24px", ml: "10px", margin: 0 }} />
    ),
    id: "/contacts/clientes",
    submenus: [
      {
        section: "PROVEEDORES",
        id: "/contacts/proveedores",
      },
      {
        section: "CLIENTES",
        id: "/contacts/clientes",
      },
    ],
  },
];

export const permissionMap: any = {
  Vender: ["/vender", "/vender/Dian", "/vender/Normal", "/vender/Devolucion"],
  Inventario: [
    "/inventory/productos",
    "/inventory/agregarProductos",
    "inventory/stock",
  ],
  Caja: [
    "/register/invoices",
    "/register/dashboard",
    "/register/invoicesDian",
    '/register/dashboardProductos',
  ],
  Ajustes: [
    //"/settings/user",
    //"/settings/employees",
    "/settings/establisment",
    "/settings/dian",
  ],
  Directorio: ["/contacts/proveedores", "/contacts/clientes"],
  Contacts: [
    "/contacts/proveedores",
    "/contacts/clientes",
  ],
  //__________________gastrobares______________________
  PEDIDOS: [
    "/gastrobares/pedido",
  ],
  ZONAS: [
    "/gastrobares/zonas",
  ],
  COCINA: [
    "/gastrobares/cocina",
  ],
  PAGAR: [
    '/gastrobares/pagar'
  ]
};