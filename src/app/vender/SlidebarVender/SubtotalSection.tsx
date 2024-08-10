import React from "react";
import { Box, Typography } from "@mui/material";

interface SubtotalSectionProps {
  subtotal: number;
  descuento: number;
}

const SubtotalSection: React.FC<SubtotalSectionProps> = ({ subtotal, descuento }) => (
  <Box sx={{ marginTop: "0.8rem" }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.5rem",
      }}
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
        SubTotal
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
        {`$ ${subtotal.toLocaleString("en-US")}`}
      </Typography>
    </Box>
  </Box>
);

export default SubtotalSection;
