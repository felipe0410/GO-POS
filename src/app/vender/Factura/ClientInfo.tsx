import React from "react";
import { Box, Typography } from "@mui/material";

interface ClientInfoProps {
  cliente: {
    name: string;
    identificacion: string;
    direccion: string;
    celular: string;
    email: string;
  };
}

const ClientInfo: React.FC<ClientInfoProps> = ({ cliente }) => (
  <Box>
    <Typography
      sx={{
        color: "#000",
        fontSize: "0.8rem",
        fontStyle: "normal",
        fontWeight: 800,
        lineHeight: "140%",
        marginTop: "8px",
      }}
    >
      CLIENTE:{" "}
      <span
        style={{
          color: "#000",
          fontSize: "0.8rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%",
        }}
      >
        {cliente?.name??''}
      </span>
    </Typography>
    <Typography
      sx={{
        color: "#000",
        fontSize: "0.8rem",
        fontStyle: "normal",
        fontWeight: 800,
        lineHeight: "140%",
        marginTop: "8px",
      }}
    >
      CC/NIT:{" "}
      <span
        style={{
          color: "#000",
          fontSize: "0.8rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%",
        }}
      >
        {cliente?.identificacion??'xxxx'}
      </span>
    </Typography>
    <Typography
      sx={{
        color: "#000",
        fontSize: "0.8rem",
        fontStyle: "normal",
        fontWeight: 800,
        lineHeight: "140%",
        marginTop: "3px",
      }}
    >
      DIRECCION:{" "}
      <span
        style={{
          color: "#000",
          fontSize: "0.8rem",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "140%",
        }}
      >
        {cliente?.direccion??'xxxx'}
      </span>
    </Typography>
    <Typography
      sx={{
        color: "#000",
        fontSize: "0.8rem",
        fontStyle: "normal",
        fontWeight: 800,
        lineHeight: "140%",
        marginTop: "3px",
      }}
    >
      CELULAR:{" "}
      <span
        style={{
          color: "#000",
          fontSize: "0.8rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%",
        }}
      >
        {cliente?.celular??'xxxx'}
      </span>
    </Typography>
    <Typography
      sx={{
        color: "#000",
        fontSize: "0.8rem",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "140%",
        marginTop: "3px",
      }}
    >
      EMAIL:{" "}
      <span
        style={{
          color: "#000",
          fontSize: "0.8rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%",
        }}
      >
        {cliente?.email??'xxxx'}
      </span>
    </Typography>
  </Box>
);

export default ClientInfo;
