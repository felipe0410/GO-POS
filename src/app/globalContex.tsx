"use client";
import { fetchAndStoreSettings } from "@/firebase";
import { createContext, useState, ReactNode, useEffect } from "react";
import { useCookies } from "react-cookie";

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

export const GlobalContext = createContext<interfaceGlobalContex | undefined>(
  undefined
);

type GlobalContextProviderProps = {
  children: ReactNode;
};

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cookies, setCookie, removeCookie, updateCookies] = useCookies([
    "user",
    "invoice_token",
  ]);
  const [step, setStep] = useState(0);
  const removeCookieUser = async () => {
    await removeCookie("user", { path: "/" });
    await removeCookie("invoice_token", { path: "/" });
    localStorage.removeItem('products_cache')
    localStorage.removeItem('dianRecord')
    localStorage.removeItem('settingsData')
    localStorage.removeItem('modulesCache')
    localStorage.removeItem('modulesCacheTTL')
    window.location.href = "/sign_in";
  };
  useEffect(() => {
    fetchAndStoreSettings();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isOpen,
        setIsOpen,
        step,
        setStep,
        setCookie,
        removeCookieUser,
        cookies,
        updateCookies,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
