import {
  EColumnCustomerAlign,
  EColumnCustomerId,
  EColumnCustomerLabel,
  EColumnCustomerMinWidth,
} from "../enums";
import { IColumnCustomers } from "../interfaces";

export const CColumnsCustomers: readonly IColumnCustomers[] = [
  {
    id: EColumnCustomerId.ClientName,
    label: EColumnCustomerLabel.ClientName,
    minWidth: EColumnCustomerMinWidth.max,
    align: EColumnCustomerAlign.Center,
  },
  {
    id: EColumnCustomerId.Type,
    label: EColumnCustomerLabel.Type,
    minWidth: EColumnCustomerMinWidth.min,
    align: EColumnCustomerAlign.Center,
  },
  {
    id: EColumnCustomerId.NumberOfPurchases,
    label: EColumnCustomerLabel.NumberOfPurchases,
    minWidth: EColumnCustomerMinWidth.min,
    align: EColumnCustomerAlign.Center,
  },
  {
    id: EColumnCustomerId.Country,
    label: EColumnCustomerLabel.Country,
    minWidth: EColumnCustomerMinWidth.max,
    align: EColumnCustomerAlign.Center,
  },
  {
    id: EColumnCustomerId.Actions,
    label: EColumnCustomerLabel.Actions,
    minWidth: EColumnCustomerMinWidth.min,
    align: EColumnCustomerAlign.Center,
  },
  // {
  //   id: EColumnCustomerId.Details,
  //   label: EColumnCustomerLabel.Details,
  //   minWidth: EColumnCustomerMinWidth.min,
  //   align: EColumnCustomerAlign.Center,
  // },
];

export const CFakerCustomers = [
  {
    id: 1,
    clientName: "Juan Perez",
    type: "Persona",
    numberOfPurchases: 10,
    country: "Argentina",
    actions: ["View", "Edit", "Delete"],
  },
  {
    id: 2,
    clientName: "Maria Lopez",
    type: "Persona",
    numberOfPurchases: 5,
    country: "Argentina",
    actions: ["View", "Edit", "Delete"],
  },
  {
    id: 3,
    clientName: "Carlos Gomez",
    type: "Persona",
    numberOfPurchases: 3,
    country: "Argentina",
    actions: ["View", "Edit", "Delete"],
  },
  {
    id: 4,
    clientName: "Ana Martinez",
    type: "Persona",
    numberOfPurchases: 2,
    country: "Argentina",
    actions: ["View", "Edit", "Delete"],
  },
  {
    id: 5,
    clientName: "Jose Rodriguez",
    type: "Persona",
    numberOfPurchases: 1,
    country: "Argentina",
    actions: ["View", "Edit", "Delete"],
  },
];
