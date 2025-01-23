"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import JsBarcode from "jsbarcode";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import { getEstablishmentData } from "@/firebase";

interface EstablishmentData {
  img: string;
  nameEstablishment: string;
  direction: string;
  phone: string;
  Resolucion: string;
  Prefijo: string;
}

interface ParkingTicketProps {
  licensePlate: string;
  ownerPhone: string;
  note: string;
}

export const ParkingTicket: React.FC<ParkingTicketProps> = ({
  licensePlate,
  ownerPhone,
  note,
}) => {
  const [dataEstableciment, setEstableciment] =
    useState<EstablishmentData | null>(null);
  const currentDate = new Date().toLocaleDateString();
  const barcodeRef = useRef<SVGSVGElement | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  // Generar código de barras
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, licensePlate, {
        format: "CODE128",
        displayValue: false,
        lineColor: "#000",
        width: 2,
        height: 50,
        margin: 0,
      });
    }
  }, [licensePlate]);

  // Obtener datos del establecimiento
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getEstablishmentData();
        setEstableciment(data);
        console.log("Establecimiento:::>", data);
      } catch (error) {
        console.error("Error fetching establishment data:", error);
      }
    };
    fetchData();
  }, []);

  // Imprimir el ticket
  const handlePrint = useReactToPrint({
    content: () => ticketRef.current,
  });

  // Descargar el ticket como PDF
  const handleDescargarPDF = () => {
    const pdf = new jsPDF({
      unit: "px",
      format: "A4",
      orientation: "portrait",
    });

    if (ticketRef.current) {
      pdf.html(ticketRef.current, {
        callback: () => {
          pdf.save(`Ticket_${licensePlate}_${currentDate.replace(/\//g, "-")}.pdf`);
        },
      });
    }
  };

  if (!dataEstableciment) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      ref={ticketRef}
      sx={{
        width: 300,
        padding: 2,
        border: "1px solid black",
        borderRadius: "8px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            border: "1px solid black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 2,
            backgroundImage: `url(${dataEstableciment.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box>
          <Typography
            variant="body1"
            sx={{ textTransform: "uppercase", fontWeight: 600 }}
          >
            {dataEstableciment.nameEstablishment || "Nombre del establecimiento"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ textTransform: "uppercase", fontWeight: 600 }}
          >
            {dataEstableciment.direction || "Dirección"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ marginY: 2 }} />

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        ENTRADA PARQUEADERO
      </Typography>
      <Typography variant="body2">Fecha de emisión: {currentDate}</Typography>

      <Divider sx={{ marginY: 2 }} />

      <Box sx={{ textAlign: "left" }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Placa del vehículo: {licensePlate}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Celular propietario: {ownerPhone}
        </Typography>
      </Box>

      <Divider sx={{ marginY: 2 }} />

      <Box sx={{ textAlign: "left" }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Hora de ingreso: 10:50 am
        </Typography>
      </Box>

      <Divider sx={{ marginY: 2 }} />

      <Box sx={{ marginTop: 2, textAlign: "center" }}>
        <svg ref={barcodeRef}></svg>
      </Box>

      <Divider sx={{ marginY: 2 }} />
      <Typography variant="h6">Datos adicionales</Typography>
      <Divider />
      <Box sx={{ textAlign: "left", background: "gray" }}>
        {note ?? "sin detalles"}
      </Box>

      <Box
        sx={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          onClick={handleDescargarPDF}
          sx={{
            width: "8.4375rem",
            height: "2.1875rem",
          }}
          style={{ borderRadius: "0.5rem", background: "#69EAE2" }}
        >
          <Typography
            sx={{
              color: "#1F1D2B",
              fontFamily: "Nunito",
              fontSize: "0.75rem",
              fontWeight: 800,
            }}
          >
            DESCARGAR
          </Typography>
        </Button>
        <Button
          onClick={handlePrint}
          sx={{
            width: "8.4375rem",
            height: "2.1875rem",
          }}
          style={{ borderRadius: "0.5rem", background: "#69EAE2" }}
        >
          <Typography
            sx={{
              color: "#1F1D2B",
              fontFamily: "Nunito",
              fontSize: "0.75rem",
              fontWeight: 800,
            }}
          >
            IMPRIMIR
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};
