import React from "react";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface HeaderProps {
  setOpen: (open: boolean) => void;
  generarNumeroFactura: () => string;
  totalUnidades: number;
}

const Header: React.FC<HeaderProps> = ({
  setOpen,
  generarNumeroFactura,
  totalUnidades,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "10px 20px",
      marginTop:{sm:'10px',xs:'40px'}
    }}
  >
    <Typography
      sx={{
        width: "50%",
        color: "#FFF",
        fontFamily: "Nunito",
        fontSize: { xs: "14px", sm: "18px" },
        fontStyle: "normal",
        fontWeight: 800,
        lineHeight: "140%",
      }}
    >
      VENTA # {generarNumeroFactura()}
    </Typography>
    <Box
      sx={{
        textAlignLast: "end",
        width: "50%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "#69EAE2",
            fontFamily: "Nunito",
            fontSize: { xs: "12px", sm: "0.8125rem" },
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "140%",
            marginRight: "15px",
          }}
        >
          # Productos
        </Typography>
        <Chip
          sx={{
            marginRight: "11px",
            backgroundColor: "#69EAE2",
            filter:
              "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
          }}
          label={
            <Typography
              sx={{
                color: "#2C3248",
                fontFamily: "Nunito",
                fontSize: "1.5rem",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "140%",
              }}
            >
              {totalUnidades}
            </Typography>
          }
        />
      </Box>
    </Box>
    <IconButton
      sx={{
        float: "right",
        display: { xs: "flex", sm: "none" },
        position: "absolute",
        right: "10px",
        top:'3px'
      }}
      onClick={() => setOpen(false)}
    >
      <CloseIcon sx={{ color: "#fff" }} />
    </IconButton>
  </Box>
);

export default Header;
