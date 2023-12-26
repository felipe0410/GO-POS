"use client"
import { createContext, useContext, useState, ReactNode } from 'react';
import { creteUser, saveDataUser } from "@/firebase";
import { enqueueSnackbar } from "notistack";

type SidebarContextType = {
    isOpen: string;
    setIsOpen: React.Dispatch<React.SetStateAction<string>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    step: number;
    data: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
};

export const SidebarContext = createContext<any>({});

type SidebarProviderProps = {
    children: ReactNode;
};

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState('esto es una prueba');
    const [step, setStep] = useState(0)
    const [data, setData] = useState<any>({
        rol: "admin",
        name: "",
        email: "",
        password: "",
        nameEstablishment: "",
        descriptionEstablishment: "",
        NIT_CC: "default",
        direction: "default",
        phone: "default",
    });
    console.log('data::>', data)
    const inputs = [
        {
            type: "text",
            label: "Nombre",
            placeHolder: "nombre + apellido",
            validation: () => data.name.length > 4 || data.name.length < 2,
            msgErrror: "Ingresa un nombre valido",
            field: "name",
            value: data.name,
        },
        {
            type: "email",
            label: "Usuario (Correo electronico)",
            placeHolder: "ejemplo@gmail.com",
            validation: () =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length < 2,
            msgErrror: "Ingrese un correo valido",
            field: "email",
            value: data.email,
        },
        {
            type: "text",
            label: "Nombre de tu establecimiento",
            placeHolder: "Nombre de tu establecimiento",
            validation: () => data.nameEstablishment.length > 4 || data.nameEstablishment.length < 2,
            msgErrror: "Ingresa un nombre valido",
            field: "nameEstablishment",
            value: data.nameEstablishment,
        },
        {
            type: "text",
            label: "¿A que se dedica tu negocio?",
            placeHolder: "¿A que se dedica tu negocio?",
            validation: () => data.descriptionEstablishment.length > 4 || data.descriptionEstablishment.length < 2,
            msgErrror: "Ingresa un nombre valido",
            field: "descriptionEstablishment",
            value: data.descriptionEstablishment,
        },
        {
            type: "password",
            label: "Contraseña",
            placeHolder: "Contraseña",
            validation: () =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                    data.password
                ) || data.password.length < 2,
            msgErrror:
                'La contraseña debe contener una letra mayuscula, una minuscula , un simbolo "%$&..." y debe tener una longitud de 8 caracteres',
            field: "password",
            value: data.password,
        },
    ];
    const inputs_step_second = [
        {
            type: "text",
            label: "NIT/CC",
            placeHolder: "NIT/CC",
            validation: () => data.NIT_CC.length > 4 || data.NIT_CC.length < 2,
            msgErrror: "Ingresa un nombre valido",
            field: "NIT_CC",
            value: data.NIT_CC,
        },
        {
            type: "text",
            label: "direccion",
            placeHolder: "direccion",
            validation: () => data.direction.length > 4 || data.direction.length < 2,
            msgErrror: "Ingresa un nombre valido",
            field: "direction",
            value: data.direction,
        },
        {
            type: "text",
            label: "Telefono/celular",
            placeHolder: "Telefono/celular",
            validation: () => data.phone.length > 4 || data.phone.length < 2,
            msgErrror: "Ingresa un nombre valido",
            field: "phone",
            value: data.phone,
        }
    ];
    const validarInputs = () => {
        for (const input of inputs) {
            if (!input.validation()) {
                return false;
            }
        }
        return true;
    }; data
    const validateLength = () => {
        const arrayValue = Object.values(data);
        const validation = arrayValue.some((valor: any) => valor.length < 2);
        if (validation) {
            return true;
        }
        const validation2 = validarInputs();
        if (!validation2) {
            return true;
        }
        return false;
    };
    const createUser = async () => {
        if (!validateLength()) {
            const creation: any = await creteUser(data.email, data.password);
            saveDataUser(creation.uid, data);
            if (creation?.errorCode === "auth/email-already-in-use") {
                enqueueSnackbar("El correo ya esta en uso", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });
            } else {
                enqueueSnackbar("Usuario creado con exito", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });
                // setTimeout(() => {
                //     router.push("/sign_in");
                // }, 3000);
            }
        } else {
            enqueueSnackbar("Completa los campos", {
                variant: "error",
                anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                },
            });
        }
    };
    return (
        <SidebarContext.Provider value={{
            isOpen, setIsOpen, step, setStep, data, setData, inputs, inputs_step_second, validateLength
            , createUser
        }}>
            {children}
        </SidebarContext.Provider>
    );
};