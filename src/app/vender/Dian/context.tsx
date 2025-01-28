"use client";
import { getEstablishmentData } from "@/firebase";
import { getDianRecord, getLastInvoice } from "@/firebase/dian";
import { createContext, useState, ReactNode, useEffect } from "react";

export const FacturaProviderContext = createContext<any>({});

type FacturaProviderProps = {
  children: ReactNode;
};

export const FacturaProvider: React.FC<FacturaProviderProps> = ({
  children,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [newClient, setNewClient] = useState({
    name: "",
    identificacion: "",
    telefono: "",
    correo: "",
    direccion: "",
    pais: "",
    departamento: "",
    ciudad: "",
    tipoDocumento: "",
    tipoContribuyente: "",
    regimenFiscal: "",
  });
  const [localData, setLocalData] = useState({
    cliente: {
      tipoDocumento: "",
      numeroDocumento: "",
      telefono: "",
      correo: "",
      nombre: "",
      pais: "",
      departamento: "",
      ciudad: "",
      direccion: "",
    },
    items: [],
    total: 0,
    document_number: 0,
    document_number_complete: "",
  });
  const [isOpen, setIsOpen] = useState("esto es una prueba");
  const [editingValues, setEditingValues] = useState<any>({});
  const [dataEstablishmentData, setDataEstablishmentData] = useState();
  const [dianData, setDianData] = useState({
    Prefijo: "",
    RangoInicio: "",
    RangoFin: "",
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const establishmentData: any = (await getEstablishmentData()) || {};
        const dianData = await getDianRecord();
        const InvoicesDian: any = await getLastInvoice();
        const { Prefijo = "", RangoInicio = 0, RangoFin = 0 } = dianData || {};
        let nextDocumentNumber = RangoInicio;
        if (InvoicesDian) {
          const lastDocumentNumber = Number(
            InvoicesDian?.document_number || RangoInicio
          );
          if (lastDocumentNumber < RangoFin) {
            nextDocumentNumber = lastDocumentNumber + 1;
          } else {
            console.warn("El consecutivo supera el rango permitido por DIAN.");
          }
        }
        const documentNumberComplete = `${Prefijo}-${nextDocumentNumber}`;
        setLocalData((prev) => ({
          ...prev,
          document_number: nextDocumentNumber,
          document_number_complete: documentNumberComplete,
        }));

        setDianData({ Prefijo, RangoInicio, RangoFin });
        setDataEstablishmentData(establishmentData);
      } catch (error) {
        console.error(
          "Error al obtener los datos para el FacturaProvider: ",
          error
        );
      }
    };

    getData();
  }, [activeStep]);

  return (
    <FacturaProviderContext.Provider
      value={{
        isOpen,
        setIsOpen,
        newClient,
        setNewClient,
        editingValues,
        setEditingValues,
        localData,
        setLocalData,
        dataEstablishmentData,
        dianData,
        activeStep,
        setActiveStep,
      }}
    >
      {children}
    </FacturaProviderContext.Provider>
  );
};
