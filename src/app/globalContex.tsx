"use client"
import { createContext, useState, ReactNode } from 'react';
import { useCookies } from 'react-cookie';

type interfaceGlobalContex = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    step: number;
    setCookie: any;
    removeCookieUser: any;
    cookies: any;
    updateCookies: any;
};

export const GlobalContext = createContext<interfaceGlobalContex | undefined>(undefined);

type GlobalContextProviderProps = {
    children: ReactNode;
};

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [cookies, setCookie, removeCookie, updateCookies] = useCookies(['user']);
    const [step, setStep] = useState(0)
    const removeCookieUser = async () => {
        await removeCookie('user', { path: '/' })
        window.location.href = "/sign_in"
    }
    return (
        <GlobalContext.Provider value={{ isOpen, setIsOpen, step, setStep, setCookie, removeCookieUser, cookies, updateCookies }}>
            {children}
        </GlobalContext.Provider>
    );
};