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
        value_paid: payment.valuePaid // Valor pagado (obligatorio)
      })),
      customer: {
        country_id: customer.countryId, // País del cliente (opcional)
        city_id: customer.cityId, // Ciudad del cliente (opcional)
        identity_document_id: customer.identityDocumentId, // Documento de identidad del cliente (opcional)
        type_organization_id: customer.typeOrganizationId, // Tipo de organización: 1 = Persona Jurídica, 2 = Persona natural (opcional)
        tax_regime_id: customer.taxRegimeId, // Régimen contable del cliente (opcional)
        tax_level_id: customer.taxLevelId, // Régimen fiscal del cliente (opcional)
        company_name: customer.companyName, // Nombre de la empresa/persona natural (obligatorio)
        dni: customer.dni, // Número del documento de identidad del cliente (obligatorio)
        mobile: customer.mobile, // Móvil del cliente (opcional)
        email: customer.email, // Email del cliente (obligatorio para documentos enviados al cliente)
        address: customer.address, // Dirección del cliente (opcional)
        postal_code: customer.postalCode // Código postal del cliente (opcional)
      },
      lines: lines.map((line: Line) => ({
        invoiced_quantity: line.invoicedQuantity, // Cantidad del producto o servicio (obligatorio)
        quantity_units_id: line.quantityUnitsId, // Unidad de medida (obligatorio)
        line_extension_amount: line.lineExtensionAmount, // Valor total de la línea sin impuesto (obligatorio)
        free_of_charge_indicator: line.freeOfChargeIndicator, // Indicador de gratuidad, siempre es false (obligatorio)
        description: line.description, // Descripción del artículo o servicio (obligatorio)
        code: line.code, // Código interno del artículo o servicio (obligatorio)
        type_item_identifications_id: line.typeItemIdentificationsId, // Estándar de identificación del ítem (obligatorio)
        reference_price_id: line.referencePriceId, // Precio de referencia (obligatorio)
        price_amount: line.priceAmount, // Valor del artículo o servicio (obligatorio)
        base_quantity: line.baseQuantity, // Cantidad real sobre la cual el precio aplica (obligatorio)
        um: line.um, // Unidad de medida (obligatorio)
        tax_totals: line.taxTotals.map((tax: TaxTotal) => ({
          tax_id: tax.taxId, // ID del impuesto (obligatorio)
          tax_amount: tax.taxAmount, // Monto o valor total del impuesto (obligatorio)
          taxable_amount: tax.taxableAmount, // Base gravable del impuesto (obligatorio)
          percent: tax.percent // Porcentaje del impuesto (obligatorio)
        }))
      })),
      legal_monetary_totals: {
        line_extension_amount: legalMonetaryTotals.lineExtensionAmount, // Total de líneas antes de IVA (obligatorio)
        tax_exclusive_amount: legalMonetaryTotals.taxExclusiveAmount, // Base gravable de las líneas con impuesto (obligatorio)
        tax_inclusive_amount: legalMonetaryTotals.taxInclusiveAmount, // Total de líneas + Impuestos (obligatorio)
        payable_amount: legalMonetaryTotals.payableAmount // Monto total del documento (obligatorio)
      }
    };
  };
