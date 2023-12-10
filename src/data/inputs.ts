export const inputs = [
  {
    name: "CODIGO DE BARRAS",
    type: "qrbar",
    width: "100%",
    field: "barCode",
  },
  {
    name: "NOMBRE DEL PRODUCTO",
    type: "text",
    width: "100%",
    field: "productName",
  },
  {
    name: "SELECCIONAR CATEGORÍA",
    type: "category",
    width: "45%",
    field: "category",
  },
  {
    name: "SELECCIONAR MEDIDA",
    type: "measurement",
    width: "45%",
    field: "measurement",
  },
  {
    name: "DESCRIPCIÓN",
    type: "textarea",
    width: "100%",
    field: "description",
  },
  {
    name: "AÑADIR FOTO",
    type: "img",
    width: "25%",
    field: "image",
  },
  {
    name: "PRECIO",
    type: "amount",
    width: "45%",
    field: "price",
  },
];
