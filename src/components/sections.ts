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
      // {
      //  section: "DIAN",
      //  id: "/vender/Dian",
      //},
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
    id: "/settings/user",
    submenus: [
      {
        section: "USUARIO",
        id: "/settings/user",
      },
      {
        section: "EMPLEADOS",
        id: "/settings/employees",
      },
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
    section: "AJUSTES",
    icon: "/images/settings.svg",
    icon2: "/images/inventarioSelected.svg",
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
