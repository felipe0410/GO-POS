import { TColumnAlign } from "../types";

export interface IFilterCustomersComponentProps {
  searchTerm: string;
  setSearchTerm: any;
  filteredData: any[];
  setFilteredData: any;
}

export interface ITableCustomerComponentProps {
  filteredData: any[];
  setFilteredData: any;
}

export interface IColumnCustomers {
  id: string;
  label: string;
  minWidth?: number;
  align: TColumnAlign;
}

export interface IButtonAddCustomersProps {
  setAddCustomer: any;
}
