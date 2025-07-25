import * as React from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

interface Props {
  open: boolean;
  onClose: (mesaDestino: any | null) => void;
  mesas: any[];
  mesaActual: any;
}

const TransferirPedidoDialog: React.FC<Props> = ({
  open,
  onClose,
  mesas,
  mesaActual,
}) => {
  const handleClose = () => {
    onClose(null); // Usuario cerró sin seleccionar
  };

  const handleTransfer = (mesaDestino: any) => {
    onClose(mesaDestino);
  };

  return (
<Dialog
  onClose={handleClose}
  open={open}
  PaperProps={{
    sx: {
      backgroundColor: "#1F1D2B",
      color: "white",
      borderRadius: "12px",
    },
  }}
>
  <DialogTitle sx={{ color: "#69EAE2" }}>
    Transferir pedido desde {mesaActual?.nombre}
  </DialogTitle>

  <Typography sx={{ px: 3, pb: 1, color: "#ccc" }} variant="body2">
    Selecciona la mesa a la cual deseas transferir el pedido:
  </Typography>

  <List>
    {mesas
      .filter((m) => m.id !== mesaActual?.id)
      .map((mesa) => (
        <ListItem disablePadding key={mesa.id}>
          <ListItemButton
            onClick={() => handleTransfer(mesa)}
            sx={{
              "&:hover": {
                backgroundColor: "#2C2A3A",
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{ bgcolor: "#69EAE2", color: "#1F1D2B" }}
              >
                <MeetingRoomIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`Mesa ${mesa.nombre}`}
              primaryTypographyProps={{ sx: { color: "white" } }}
            />
          </ListItemButton>
        </ListItem>
      ))}
  </List>
</Dialog>

  );
};

export default TransferirPedidoDialog;
