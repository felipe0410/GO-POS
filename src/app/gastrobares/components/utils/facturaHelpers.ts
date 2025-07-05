// src/utils/facturaHelpers.ts

export const updateSelectedItems = (items: any[], newItem: any) => {
    let updatedItems = items.filter((item) => item.barCode !== newItem.barCode);

    const existingItem = items.find((item) => item.barCode === newItem.barCode);

    if (existingItem) {
        const updatedItem = {
            ...existingItem,
            cantidad: existingItem.cantidad + 1,
            acc: existingItem.acc + newItem.acc,
        };
        updatedItems = [updatedItem, ...updatedItems];
    } else {
        updatedItems = [newItem, ...updatedItems];
    }

    return updatedItems;
};

export const agregarNuevaFactura = (facturas: any[]) => {
    const maxNumeroFactura = facturas.reduce((max, factura) => {
        const num = parseInt(factura.id.replace("factura-", ""), 10);
        return num > max ? num : max;
    }, 0);

    const nuevoNumero = maxNumeroFactura + 1;

    return {
        id: `factura-${nuevoNumero}`,
        name: `Factura ${nuevoNumero}`,
        items: [],
    };
};

export const saveDataToLocalStorage = (key: string, data: any) => {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    } catch (error) {
        console.error("Error saving data to localStorage:", error);
    }
};

export const getDataFromLocalStorage = (key: string) => {
    try {
        const serializedData = localStorage.getItem(key);
        if (serializedData === null) return null;
        return JSON.parse(serializedData);
    } catch (error) {
        console.error("Error getting data from localStorage:", error);
        return null;
    }
};

