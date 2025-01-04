import axios from "axios";
import { enqueueSnackbar } from "notistack";
import {
  transformToDianInvoice,
  transformToDianInvoice2,
} from "@/components/DIAN/transformToDianInvoice";
import { createInvoiceDian, getDianRecord } from "@/firebase/dian";

export const sendInvoiceToDian = async (factura: any, token: string) => {
  try {
    if (!token) {
      enqueueSnackbar("No se encontró el token de autenticación.", {
        variant: "error",
      });
      throw new Error("No se encontró el token de autenticación.");
    }
    const dianRecord = await getDianRecord();
    if (!dianRecord) {
      enqueueSnackbar("No se pudieron obtener los datos del establecimiento.", {
        variant: "error",
      });
      throw new Error("Error al obtener los datos del establecimiento.");
    }
    const invoiceDian = transformToDianInvoice(factura, dianRecord);
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/invoice`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    //const response = await axios.post(apiUrl, invoiceDian, { headers });
    //if (response.status === 200) {
    //  console.log("Factura enviada con éxito:", response.data);
    //  enqueueSnackbar("Factura enviada con éxito.", { variant: "success" });
    //  return response.data;
    //} else {
    //  console.error("Error al enviar la factura:", response);
    // enqueueSnackbar(`Error al enviar la factura: ${response.statusText}`, {
    //    variant: "error",
    //  });
    //  throw new Error(`Error al enviar la factura: ${response.statusText}`);
    //}
  } catch (error: any) {
    if (error.response) {
      console.error("Error en la respuesta del servidor:", error.response);
      enqueueSnackbar(
        `Error del servidor: ${
          error.response.data.message || "Error desconocido"
        }`,
        { variant: "error" }
      );
    } else if (error.request) {
      console.error(
        "Error en la solicitud: No se recibió respuesta del servidor",
        error.request
      );
      enqueueSnackbar(
        "No se recibió respuesta del servidor. Verifica tu conexión a internet.",
        { variant: "warning" }
      );
    } else {
      console.error(
        "Error en la configuración de la solicitud:",
        error.message
      );
      enqueueSnackbar(`Error al enviar la factura: ${error.message}`, {
        variant: "error",
      });
    }
    throw error;
  }
};

export const sendInvoiceToDian2 = async (factura: any, token: string) => {
  try {
    if (!token) {
      enqueueSnackbar("No se encontró el token de autenticación.", {
        variant: "error",
      });
      throw new Error("No se encontró el token de autenticación.");
    }
    const dianRecord = await getDianRecord();
    if (!dianRecord) {
      enqueueSnackbar("No se pudieron obtener los datos del establecimiento.", {
        variant: "error",
      });
      throw new Error("Error al obtener los datos del establecimiento.");
    }
    const invoiceDian = transformToDianInvoice2(factura, dianRecord);
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API}/invoice`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(apiUrl, invoiceDian, { headers });
    if (response.status === 200) {
      enqueueSnackbar("Factura enviada con éxito.", { variant: "success" });
      return response.data;
    } else {
      console.error("Error al enviar la factura:", response);
      enqueueSnackbar(`Error al enviar la factura: ${response.statusText}`, {
        variant: "error",
      });
      throw new Error(`Error al enviar la factura: ${response.statusText}`);
    }
  } catch (error: any) {
    if (error.response) {
      console.error("Error en la respuesta del servidor:", error.response);
      enqueueSnackbar(
        `Error del servidor: ${
          error.response.data.message || "Error desconocido"
        }`,
        { variant: "error" }
      );
    } else if (error.request) {
      console.error(
        "Error en la solicitud: No se recibió respuesta del servidor",
        error.request
      );
      enqueueSnackbar(
        "No se recibió respuesta del servidor. Verifica tu conexión a internet.",
        { variant: "warning" }
      );
    } else {
      console.error(
        "Error en la configuración de la solicitud:",
        error.message
      );
      enqueueSnackbar(`Error al enviar la factura: ${error.message}`, {
        variant: "error",
      });
    }
    throw error;
  }
};
