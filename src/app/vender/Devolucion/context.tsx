"use client";

import { getAllInvoicesData, getInvoiceData } from "@/firebase";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

// Definición de tipos
interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface CompraItem {
  productName: string;
  acc: number;
  barCode: string;
  cantidad: number;
}

interface Cliente {
  email: string;
  name: string;
  celular: string;
  direccion: string;
  identificacion: string;
}

interface Data {
  id: string;
  subtotal: number;
  typeInvoice: string;
  timestampCreacion: Timestamp;
  status: string;
  user: string;
  uid: string;
  date: string;
  total: number;
  invoice: string;
  timestamp: Timestamp;
  compra: CompraItem[];
  fechaCreacion: string;
}

interface Invoice {
  name: any;
  id: string;
  nota: string;
  paymentMethod: string;
  invoice: string;
  descuento: number;
  timestamp: Timestamp;
  closeInvoice: boolean;
  createBy: string;
  compra: CompraItem[];
  fechaCreacion: string;
  date: string;
  subtotal: number;
  cliente: Cliente;
  user: string;
  vendedor: string;
  uid: string;
  status: string;
  total: number;
  cambio: number;
}

interface DevolucionContextType {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  data: Data | any;
  setData: any;
  invoices: Invoice[];
  setInvoices: Dispatch<SetStateAction<Invoice[]>>;
  selectedInvoice: any;
  setSelectedInvoice: any;
}

interface DevolucionProviderProps {
  children: ReactNode;
}

export const DevolucionContext = createContext<
  DevolucionContextType | undefined
>(undefined);

export const DevolucionProvider: React.FC<DevolucionProviderProps> = ({
  children,
}) => {
  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<Data[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  console.log("data:::>", data);

  useEffect(() => {
    const getData = async () => {
      console.log("Entro aquí");
      await getAllInvoicesData(setInvoices);
    };
    getData();
  }, []);

  useEffect(() => {
    if (selectedInvoice) {
      fetchInvoiceDetails(selectedInvoice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInvoiceDetails = async (uid: string) => {
    setLoading(true);
    const data = await getInvoiceData(uid);
    setInvoiceData(data);
    setLoading(false);
  };

  return (
    <DevolucionContext.Provider
      value={{
        step,
        setStep,
        data,
        setData,
        invoices,
        setInvoices,
        selectedInvoice,
        setSelectedInvoice,
      }}
    >
      {children}
    </DevolucionContext.Provider>
  );
};
