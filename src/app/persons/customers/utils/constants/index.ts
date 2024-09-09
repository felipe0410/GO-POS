import {
  EColumnCustomerAlign,
  EColumnCustomerId,
  EColumnCustomerLabel,
  EColumnCustomerMinWidth,
} from "../enums";
import { IColumnCustomers } from "../interfaces";

export const CColumnsCustomers: readonly IColumnCustomers[] = [
  {
    id: EColumnCustomerId.Actions,
    label: EColumnCustomerLabel.Actions,
    minWidth: EColumnCustomerMinWidth.min,
    align: EColumnCustomerAlign.Center,
  },
  {
    id: EColumnCustomerId.ClientName,
    label: EColumnCustomerLabel.ClientName,
    minWidth: EColumnCustomerMinWidth.max,
    align: EColumnCustomerAlign.Center,
  },
  {
    id: EColumnCustomerId.Type,
    label: EColumnCustomerLabel.Type,
    minWidth: EColumnCustomerMinWidth.max,
    align: EColumnCustomerAlign.Center,
  },
  {
    id: EColumnCustomerId.NumberOfPurchases,
    label: EColumnCustomerLabel.NumberOfPurchases,
    minWidth: EColumnCustomerMinWidth.max,
    align: EColumnCustomerAlign.Center,
  },
  {
    id: EColumnCustomerId.Country,
    label: EColumnCustomerLabel.Country,
    minWidth: EColumnCustomerMinWidth.max,
    align: EColumnCustomerAlign.Center,
  },
  {
    id: EColumnCustomerId.Details,
    label: EColumnCustomerLabel.Details,
    minWidth: EColumnCustomerMinWidth.min,
    align: EColumnCustomerAlign.Center,
  },
];
