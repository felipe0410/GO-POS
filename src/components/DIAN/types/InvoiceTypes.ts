export interface Payment {
    paymentMethodId: number;
    meansPaymentId: number;
    valuePaid: string;
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
    taxAmount: number;
    taxableAmount: number;
    percent: number;
  }
  
  export interface Line {
    invoicedQuantity: string;
    quantityUnitsId: string;
    lineExtensionAmount: string;
    freeOfChargeIndicator: boolean;
    description: string;
    code: string;
    typeItemIdentificationsId: string;
    referencePriceId: string;
    priceAmount: string;
    baseQuantity: string;
    um: string;
    taxTotals: TaxTotal[];
  }
  
  export interface LegalMonetaryTotals {
    lineExtensionAmount: string;
    taxExclusiveAmount: string;
    taxInclusiveAmount: string;
    payableAmount: number;
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
  