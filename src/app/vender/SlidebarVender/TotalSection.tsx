import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface TotalSectionProps {
  subtotal: number;
  descuento: number;
  setNextStep: (value: boolean) => void;
}

const TotalSection: React.FC<TotalSectionProps> = ({
  subtotal,
  descuento,
  setNextStep,
}) => (
  <Box
    id="container total section"
    sx={{
      marginTop: "0.6rem",
    }}
  >
    <Box
      sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
    >
      <Typography
        sx={{
          color: "#FFF",
          textAlign: "center",
          fontFamily: "Nunito",
          fontSize: { xs: "14px", sm: "16px" },
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "140%",
        }}
      >
        Total
      </Typography>
      <Typography
        sx={{
          color: "#FFF",
          textAlign: "center",
          fontFamily: "Nunito",
          fontSize: { xs: "14px", sm: "16px" },
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "140%",
        }}
      >
        {`$ ${(subtotal - descuento).toLocaleString("en-US")}`}
      </Typography>
    </Box>

    <Button
      disabled={descuento > subtotal || subtotal === 0}
      onClick={() => setNextStep(true)}
      style={{
        borderRadius: "0.5rem",
        background: descuento > subtotal || subtotal === 0 ? "gray" : "#69EAE2",
        width: "7rem",
        margin: "0 auto",
        display: "flex",
      }}
    >
      <Typography
        sx={{
          color: "#1F1D2B",
          fontFamily: "Nunito",
          fontSize: "0.875rem",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "140%",
        }}
      >
        HECHO
      </Typography>
    </Button>
  </Box>
);

export default TotalSection;
