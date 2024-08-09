import React from "react";
import { Box, Typography } from "@mui/material";

interface EstablishmentInfoProps {
  establishmentData: {
    phone: string;
    NIT_CC: string;
    email: string;
    nameEstablishment: string;
    name: string;
    direction: string;
  };
}

const EstablishmentInfo: React.FC<EstablishmentInfoProps> = ({ establishmentData }) => (
  <Box sx={{ textAlign: "-webkit-center", padding: "10px", marginTop: "1rem" }}>
    <Box sx={{ width: "16.1875rem" }}>
      <Typography
        sx={{
          color: "#000",
          textAlign: "center",
          fontFamily: "Nunito",
          fontSize: "1.5rem",
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "110%",
        }}
      >
        {establishmentData?.nameEstablishment?.toUpperCase() ?? ""}
      </Typography>
    </Box>
    <Typography
      sx={{
        color: "#000",
        fontSize: "0.8rem",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "140%",
      }}
    >
      NIT: {establishmentData.NIT_CC}
    </Typography>
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
      <Typography
        sx={{
          color: "#000",
          fontSize: "0.8rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%",
        }}
      >
        CELULAR: {establishmentData.phone}
      </Typography>
    </Box>
    <Typography
      sx={{
        color: "#000",
        textAlign: "center",
        fontSize: "0.8rem",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "140%",
      }}
    >
      {establishmentData.direction}
    </Typography>
  </Box>
);

export default EstablishmentInfo;
