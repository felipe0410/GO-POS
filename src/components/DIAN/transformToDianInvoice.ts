const formatDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${year}-${month}-${day}`;
};

const formatExpirationDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  return `${year}-12-31`;
};

export const transformToDianInvoice = (data: any, establishment: any): any => {
  return {
    resolution_number: establishment.Resolucion, // Resolución fija
    prefix: establishment.Prefijo, // Prefijo fijo
    document_number: parseInt(data.invoice, 10) + 50, // Número de la factura actual
    operation_type_id: 1, // Tipo de operación estándar (1)
    type_document_id: 7, // Tipo de documento (7)
    graphic_representation: 1, // Generar representación gráfica
    send_email: 1, // Enviar email al cliente
    date: formatDate(), // Fecha de la factura
    expiration_date: formatExpirationDate(), // Fecha de vencimiento
    notes: "Nota generada automáticamente", // Notas
    currency_id: 272, // ID de la moneda (por ejemplo, COP)
    // Pagos
    payments: [
      {
        payment_method_id: 1, // Método de pago contado
        means_payment_id: 10, // Medio de pago en efectivo
        value_paid: data.total.toFixed(2), // Total pagado
      },
    ],

    // Información del cliente
    customer: {
      country_id: "170", // Código de país por defecto (Colombia)
      city_id: "149", // Código de ciudad por defecto (Bogotá)
      identity_document_id: "1", // Documento de identidad (Cédula de ciudadanía)
      type_organization_id: 2, // Persona natural
      tax_regime_id: 2, // Régimen simplificado
      tax_level_id: 5, // Nivel tributario básico
      company_name: data.cliente.name, // Nombre del cliente
      dni: data.cliente.identificacion, // Identificación del cliente
      mobile: data.cliente.celular, // Teléfono móvil
      email: data.cliente.email, // Email del cliente
      address: data.cliente.direccion, // Dirección del cliente
      postal_code: "661002", // Código postal por defecto
    },

    // Transformación de las líneas de compra
    lines: data.compra.map((item: any) => {
      return {
        invoiced_quantity: item.cantidad.toString(), // Cantidad facturada
        quantity_units_id: "1093", // Unidad de medida estándar
        line_extension_amount: item.acc.toFixed(), // Valor sin impuestos de la línea
        free_of_charge_indicator: false, // Indicador de gratuidad (siempre es false)
        description: item.productName, // Descripción del producto
        code: item.barCode, // Código del producto
        type_item_identifications_id: "4", // Identificación del ítem (recomendado 4)
        reference_price_id: "1", // Precio de referencia (puede ser 1)
        price_amount: item.unitPrice.toFixed(), // Precio del artículo
        base_quantity: item.cantidad.toString(), // Cantidad base sobre la cual aplica el precio
        tax_totals: [
          {
            tax_id: "1", // ID del impuesto (IVA)
            tax_amount: "0", // Valor del impuesto
            taxable_amount: item.acc.toFixed(), // Base gravable
            percent: 0, // Porcentaje del impuesto (modifica si es necesario)
          },
        ],
      };
    }),
    // Totales monetarios
    legal_monetary_totals: {
      line_extension_amount: data.subtotal.toFixed(), // Total antes de impuestos
      tax_exclusive_amount: data.subtotal.toFixed(), // Total sin impuestos
      tax_inclusive_amount: data.total.toFixed(), // Total con impuestos
      payable_amount: data.total.toFixed(), // Monto total a pagar
    },
  };
};

export const transformToDianInvoice2 = (data: any, establishment: any): any => {
  const isCustomerEmpty =
    !data.cliente || Object.values(data.cliente).every((value) => !value);

  return {
    resolution_number: establishment.Resolucion, // Resolución fija
    prefix: establishment.Prefijo, // Prefijo fijo
    document_number: parseInt(data?.document_number ?? 103, 10)+1, // Número de la factura actual
    operation_type_id: 1, // Tipo de operación estándar (1)
    type_document_id: 7, // Tipo de documento (7)
    graphic_representation: 1, // Generar representación gráfica
    send_email: 1, // Enviar email al cliente
    date: formatDate(), // Fecha de la factura
    expiration_date: formatExpirationDate(), // Fecha de vencimiento
    notes: "Nota generada automáticamente", // Notas
    currency_id: 272, // ID de la moneda (por ejemplo, COP)
    // Pagos
    payments: [
      {
        payment_method_id: 1, // Método de pago contado
        means_payment_id: 10, // Medio de pago en efectivo
        value_paid: data.total.toFixed(2), // Total pagado
      },
    ],

    // Información del cliente (solo se incluye si no está vacío)
    ...(isCustomerEmpty
      ? {}
      : {
          customer: {
            country_id: data.cliente.country_id, // Código de país
            city_id: data.cliente.city_id, // Código de ciudad
            identity_document_id: data.cliente.identity_document_id, // Documento de identidad
            type_organization_id: data?.cliente?.tax_regime_id ?? 2, // Tipo de organización
            tax_regime_id: data.cliente.tax_regime_id, // Régimen fiscal
            tax_level_id: data.cliente.tax_level_id, // Nivel tributario
            company_name: data.cliente.name, // Nombre completo del cliente
            dni: data.cliente.identificacion, // Identificación del cliente
            mobile: data.cliente.telefono, // Teléfono móvil
            email: data.cliente.correo, // Email del cliente
            address: data.cliente.direccion, // Dirección del cliente
            postal_code: "661002", // Código postal por defecto (si es necesario)
          },
        }),

    // Transformación de las líneas de compra
    lines: data.items.map((item: any) => {
      return {
        invoiced_quantity: item.cantidad.toString(), // Cantidad facturada
        quantity_units_id: "1093", // Unidad de medida estándar
        line_extension_amount: item.total.toFixed(), // Valor sin impuestos de la línea
        free_of_charge_indicator: false, // Indicador de gratuidad (siempre es false)
        description: item.detalle, // Descripción del producto
        code: item.codigo, // Código del producto
        type_item_identifications_id: "4", // Identificación del ítem (recomendado 4)
        reference_price_id: "1", // Precio de referencia (puede ser 1)
        price_amount: item.precio.toFixed(), // Precio del artículo
        base_quantity: item.cantidad.toString(), // Cantidad base sobre la cual aplica el precio
        tax_totals: [
          {
            tax_id: "1", // ID del impuesto (IVA)
            tax_amount: "0", // Valor del impuesto
            taxable_amount: item.total.toFixed(), // Base gravable
            percent: 0, // Porcentaje del impuesto (modifica si es necesario)
          },
        ],
      };
    }),

    // Totales monetarios
    legal_monetary_totals: {
      line_extension_amount: data.total.toFixed(), // Total antes de impuestos
      tax_exclusive_amount: data.total.toFixed(), // Total sin impuestos
      tax_inclusive_amount: data.total.toFixed(), // Total con impuestos
      payable_amount: data.total.toFixed(), // Monto total a pagar
    },
  };
};
