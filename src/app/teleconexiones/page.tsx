"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import InvoiceTable from "./invoiceTable";
import { getCognitoIdToken } from "@/aws";

const CACHE_KEY = "facturas_teleconexiones";
const CACHE_TTL_MS = 120 * 60 * 1000; // 5 minutos

const FacturasPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        const now = Date.now();

        if (now - timestamp < CACHE_TTL_MS) {
          console.log("✅ Usando datos en cache");
          setData(data);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem(CACHE_KEY); // Expiró
        }
      }

      // Si no hay cache válida, hacemos la petición
      try {
        const token = await getCognitoIdToken();
        if (!token) {
          console.error("❌ No se pudo obtener el token de Cognito");
          return;
        }

        const response = await axios.post(
          "https://8y1hciviel.execute-api.us-east-1.amazonaws.com/prod/facturas/teleconexiones",
          {},
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        const results = response.data.results;

        // Cachear
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: results, timestamp: Date.now() })
        );

        console.log("✅ Datos cargados del API Gateway");
        setData(results);
      } catch (error) {
        console.error("❌ Error al obtener las facturas del API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  if (loading) return <p>Cargando facturas...</p>;

  return <InvoiceTable data={data} isDarkMode={true} />;
};

export default FacturasPage;
