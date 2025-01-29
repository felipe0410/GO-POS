import React from "react";
import { Box, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SidebarProps {
  onClose: () => void;
}

const SidebarBox: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <Box
      sx={{
        width: 250,
        height: "100%",
        backgroundColor: "#1F1D2B",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          borderBottom: "1px solid #444",
        }}
      >
        <Typography variant="h6">Opciones</Typography>
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        <ListItem button>
          <ListItemText primary="Abrir Caja" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Cerrar Caja" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Historial de Ventas" />
        </ListItem>
      </List>
    </Box>
  );
};

export default SidebarBox;
