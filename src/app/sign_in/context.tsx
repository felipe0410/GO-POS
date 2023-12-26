"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

type SidebarContextType = {
    isOpen: string;
    setIsOpen: React.Dispatch<React.SetStateAction<string>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    step: number;
};

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

type SidebarProviderProps = {
    children: ReactNode;
};

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState('esto es una prueba');
    const [step, setStep] = useState(0)
    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen, step, setStep }}>
            {children}
        </SidebarContext.Provider>
    );
};