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
    name: "CATEGORÍA",
    type: "category",
    width: "45%",
    field: "category",
  },
  {
    name: "MEDIDA",
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

export const inputsEdit = [
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
    name: "PRECIO",
    type: "amount",
    width: "45%",
    field: "price",
  },
  {
    name: "CANTIDAD",
    type: "qty",
    width: "45%",
    field: "cantidad",
  },
];

export const dataInputs = [
  {
    name: "Nombre Completo",
    type: "text",
    width: "100%",
    field: "name",
  },
  {
    name: "Dirección",
    type: "text",
    width: "100%",
    field: "direccion",
  },
  {
    name: "E-mail",
    type: "mail",
    width: "100%",
    field: "email",
  },
  {
    name: "Cedula/Nit",
    type: "text",
    width: "45%",
    field: "identificacion",
  },
  {
    name: "Celular",
    type: "number",
    width: "45%",
    field: "celular",
  },
];
