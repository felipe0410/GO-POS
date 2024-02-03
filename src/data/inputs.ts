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
    name: "PRECIO DE COMPRA",
    type: "purchasePrice",
    width: "45%",
    field: "purchasePrice",
  },
  {
    name: "PRECIO DE VENTA",
    type: "amount",
    width: "45%",
    field: "price",
  },
  {
    name: "AÑADIR FOTO",
    type: "img",
    width: "25%",
    field: "image",
  },
  {
    name: "CANTIDAD",
    type: "cantidad",
    width: "45%",
    field: "cantidad",
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

export const profileInputs = [
  {
    name: "Nombre",
    type: "text",
    width: "100%",
    field: "name",
  },
  {
    name: "Status",
    type: "text",
    width: "100%",
    field: "status",
  },
  {
    name: "Correo",
    type: "mail",
    width: "100%",
    field: "email",
  },
  {
    name: "Celular",
    type: "number",
    width: "100%",
    field: "phone",
  },
  {
    name: "Dirección",
    type: "text",
    width: "100%",
    field: "direction",
  },
];
export const IMG_DEFAULT =
  "https://firebasestorage.googleapis.com/v0/b/go-pos-add98.appspot.com/o/images%2Fimage-not-found-icon%20(1)%20(1).png?alt=media&token=d999eb4c-54a0-4489-9b23-e4a1a0ee65d9";
