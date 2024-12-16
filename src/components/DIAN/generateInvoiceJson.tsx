import { InvoiceParams, Line, Payment, TaxTotal } from "./types/InvoiceTypes";

export const generateInvoiceJson = ({
  resolutionNumber,
  prefix,
  documentNumber,
  operationTypeId,
  typeDocumentId,
  payments,
  customer,
  lines,
  legalMonetaryTotals
}: InvoiceParams) => {
  return {
    resolution_number: resolutionNumber, // Número de resolución del documento (obligatorio)
    prefix: prefix, // Prefijo de la resolución del documento (obligatorio si hay más de una resolución)
    document_number: documentNumber, // Número consecutivo del documento, sin prefijos (obligatorio)
    operation_type_id: operationTypeId, // Tipo de operación que afecta al documento (obligatorio)
    type_document_id: typeDocumentId, // Tipo de documento enviado a la DIAN (obligatorio)
    payments: payments.map((payment: Payment) => ({
      payment_method_id: payment.paymentMethodId, // Método de pago: 1 = contado, 2 = crédito (obligatorio)
      means_payment_id: payment.meansPaymentId, // Medio de pago (obligatorio)
      value_paid: parseFloat(payment.valuePaid).toFixed(2) // Valor pagado en formato decimal (obligatorio)
    })),
    customer: {
      country_id: customer.countryId || "170", // ID del país, por defecto Colombia
      city_id: customer.cityId || "149", // ID de la ciudad, por defecto Bogotá
      identity_document_id: customer.identityDocumentId, // Documento de identidad del cliente (opcional)
      type_organization_id: customer.typeOrganizationId, // Tipo de organización (1 = Persona Jurídica, 2 = Persona natural) (opcional)
      tax_regime_id: customer.taxRegimeId, // Régimen contable del cliente (opcional)
      tax_level_id: customer.taxLevelId, // Régimen fiscal del cliente (opcional)
      company_name: customer.companyName, // Nombre de la empresa/persona natural (obligatorio)
      dni: customer.dni, // Número del documento de identidad del cliente (obligatorio)
      mobile: customer.mobile || "", // Móvil del cliente (opcional)
      email: customer.email, // Email del cliente (obligatorio)
      address: customer.address || "", // Dirección del cliente (opcional)
      postal_code: customer.postalCode || "661002" // Código postal del cliente (opcional, por defecto)
    },
    lines: lines.map((line: Line) => ({
      invoiced_quantity: line.invoicedQuantity, // Cantidad del producto o servicio (obligatorio)
      quantity_units_id: line.quantityUnitsId, // Unidad de medida (obligatorio)
      line_extension_amount: parseFloat(line.lineExtensionAmount).toFixed(2), // Valor total de la línea sin impuesto (obligatorio)
      free_of_charge_indicator: line.freeOfChargeIndicator, // Indicador de gratuidad, siempre es false (obligatorio)
      description: line.description, // Descripción del artículo o servicio (obligatorio)
      code: line.code, // Código interno del artículo o servicio (obligatorio)
      type_item_identifications_id: line.typeItemIdentificationsId, // Estándar de identificación del ítem (obligatorio)
      reference_price_id: line.referencePriceId, // Precio de referencia (obligatorio)
      price_amount: parseFloat(line.priceAmount).toFixed(2), // Valor del artículo o servicio (obligatorio)
      base_quantity: line.baseQuantity, // Cantidad real sobre la cual el precio aplica (obligatorio)
      tax_totals: line.taxTotals.map((tax: TaxTotal) => ({
        tax_id: tax.taxId, // ID del impuesto (obligatorio)
        tax_amount: parseFloat(tax.taxAmount.toString()).toFixed(2), // Monto o valor total del impuesto (obligatorio)
        taxable_amount: parseFloat(tax.taxableAmount.toString()).toFixed(2), // Base gravable del impuesto (obligatorio)
        percent: tax.percent // Porcentaje del impuesto (obligatorio)
      }))
    })),
    legal_monetary_totals: {
      line_extension_amount: parseFloat(legalMonetaryTotals.lineExtensionAmount).toFixed(2), // Total de líneas antes de IVA (obligatorio)
      tax_exclusive_amount: parseFloat(legalMonetaryTotals.taxExclusiveAmount).toFixed(2), // Base gravable de las líneas con impuesto (obligatorio)
      tax_inclusive_amount: parseFloat(legalMonetaryTotals.taxInclusiveAmount).toFixed(2), // Total de líneas + Impuestos (obligatorio)
      payable_amount: parseFloat(legalMonetaryTotals.payableAmount.toString()).toFixed(2) // Monto total del documento (obligatorio)
    }
  };
};
