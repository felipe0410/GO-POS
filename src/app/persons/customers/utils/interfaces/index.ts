import { TColumnAlign } from "../types";

export interface IFilterCustomersComponentProps {
  searchTerm: string;
  setSearchTerm: any;
  filteredData: any[];
  setFilteredData: any;
  handleAddCustomer: any;
}

export interface ITableCustomerComponentProps {
  filteredData: any[];
  setFilteredData: any;
  handleAddCustomer: any;
}

export interface IColumnCustomers {
  id: string;
  label: string;
  minWidth?: number;
  align: TColumnAlign;
}

export interface IFilteredData {
  id: number;
  clientName: string;
  type: string;
  numberOfPurchases: number;
  country: string;
  actions: string[];
}

export interface IButtonAddCustomersProps {
  handleAddCustomer: any;
}
