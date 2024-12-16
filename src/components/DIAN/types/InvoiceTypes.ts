export interface Payment {
  paymentMethodId: number;
  meansPaymentId: number;
  valuePaid: string; // Valor pagado como string para asegurar formato decimal
}

export interface Customer {
  countryId: string;
  cityId: string;
  identityDocumentId: string;
  typeOrganizationId: number;
  taxRegimeId: number;
  taxLevelId: number;
  companyName: string;
  dni: string;
  mobile: string;
  email: string;
  address: string;
  postalCode: string;
}

export interface TaxTotal {
  taxId: string;
  taxAmount: string; // Cambiado a string para manejar decimales
  taxableAmount: string; // Cambiado a string para manejar decimales
  percent: number;
}

export interface Line {
  invoicedQuantity: string;
  quantityUnitsId: string;
  lineExtensionAmount: string; // Cambiado a string para manejar decimales
  freeOfChargeIndicator: boolean;
  description: string;
  code: string;
  typeItemIdentificationsId: string;
  referencePriceId: string;
  priceAmount: string; // Cambiado a string para manejar decimales
  baseQuantity: string;
  taxTotals: TaxTotal[];
}

export interface LegalMonetaryTotals {
  lineExtensionAmount: string;
  taxExclusiveAmount: string;
  taxInclusiveAmount: string;
  payableAmount: string; // Cambiado a string para manejar decimales
}

export interface InvoiceParams {
  resolutionNumber: string;
  prefix: string;
  documentNumber: string;
  operationTypeId: number;
  typeDocumentId: number;
  payments: Payment[];
  customer: Customer;
  lines: Line[];
  legalMonetaryTotals: LegalMonetaryTotals;
}
