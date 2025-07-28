// SidebarFooter.tsx
"use client";
import React from "react";
import { Box, Button, ListItemIcon, ListItemText } from "@mui/material";

interface SidebarFooterProps {
  open: boolean;
  onLogout: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ open, onLogout }) => {
  return (
    <Box
      sx={{
        marginTop: "100%",
        position: "absolute",
        bottom: "15px",
        marginLeft: "15px",
      }}
    >
      <Button
        sx={{
          textAlign: "start",
          paddingLeft: "20px",
        }}
        onClick={onLogout}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            ml: "5px",
            justifyContent: "center",
          }}
        >
          <Box component="img" src="/images/logout.svg" alt="Salir" />
        </ListItemIcon>
        <ListItemText
          primary="SALIR"
          primaryTypographyProps={{
            color: "#69EAE2",
            fontFamily: "Nunito",
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            marginLeft: "10px",
          }}
          sx={{
            opacity: open ? 1 : 0,
          }}
        />
      </Button>
    </Box>
  );
};

export default SidebarFooter;
