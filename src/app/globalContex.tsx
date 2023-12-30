"use client"
import { createContext, useState, ReactNode } from 'react';

type interfaceGlobalContex = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    step: number;
};

export const GlobalContext = createContext<interfaceGlobalContex | undefined>(undefined);

type GlobalContextProviderProps = {
    children: ReactNode;
};

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0)
    return (
        <GlobalContext.Provider value={{ isOpen, setIsOpen, step, setStep }}>
            {children}
        </GlobalContext.Provider>
    );
};