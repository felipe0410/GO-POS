"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import InvoiceTable from "./invoiceTable";

const FacturasPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await axios.get(
          "https://wisphub.io/facturas/json/teleconexionesjyjsas/",
          {
            params: {
              desde: "2025-05-01",
              hasta: "2025-05-31",
              tipo_fecha: "fecha_pago",
              estado: 2,
              forma_pago: "",
              cajero: "",
              zona: "",
              estado_fiscal: "",
              pagos_fecha: "05/2025",
              generar_reporte_caja: false,
              _: Date.now(),
            },
            headers: {
              "accept": "application/json, text/javascript, */*; q=0.01",
              "x-requested-with": "XMLHttpRequest",
              "referer": "https://wisphub.io/facturas/?pagos_fecha=05/2025&estado=pagada",
              "user-agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
              "Cookie":
                "csrftoken=dv256HB2FrsUOGZr2jpmhL7bGZEtSfXrzTqeA9a7CTaflzQohwcghS8scfDsutBw; sessionid=0fmn71ic69k8ou4qesfk6q9s9ailvvn6;",
            },
          }
        );

        // Procesamos los datos que vienen en formato HTML
        const clean = (htmlString: string) => {
          const doc = new DOMParser().parseFromString(htmlString, "text/html");
          return doc.body.textContent || htmlString;
        };

        const parsedData = response.data.map((item: any) => ({
          id: item.id_factura,
          cliente: clean(item.cliente),
          date: item.fecha_pago,
          total: parseFloat(item.total),
          document_number: item.referencia,
          document_number_complete: item.cliente__perfilusuario__cedula,
          status: clean(item.estado),
          pdfUrl: `https://wisphub.io/facturas/editar/teleconexionesjyjsas/${item.id_factura}/`,
          qrDian: `https://www.dian.gov.co`, // No viene, así que lo ponemos fijo
          attachedDocument: {
            pathZip: "" // No viene, lo dejamos vacío
          }
        }));

        setData(parsedData);
      } catch (error) {
        console.error("Error al obtener las facturas:", error);
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
