import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const DeleteModal = ({
  open,
  onClose,
  onDelete,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: string;
  description: string;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
        <Box sx={{ textAlign: "center", marginTop: "5px" }}>
          <Box
            component={"img"}
            src={"/images/deleteImage.png"}
            sx={{ width: "131px", height: "153px" }}
          />
        </Box>
        <Typography variant="h6" mb={2}>
          {description}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={onDelete}>
            Eliminar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
