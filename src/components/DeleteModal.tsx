import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { Box, Paper } from "@mui/material";
import { deleteProduct } from "@/firebase";

export interface SimpleDialogProps {
  open: boolean;
  data: any;
  handleClose: () => void;
}

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Paper)(
  ({ theme }) => css`
    font-family: "Nunito";
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: #1f1d2b;
    border-radius: 0.625rem;
    /* box-shadow: 0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2; */
    padding: 24px;
    width: 32.125rem;
    height: 16rem;
  `
);

export default function DeleteModal(props: SimpleDialogProps) {
  const { handleClose, open, data } = props;

  const handleDelete = async (uid: string) => {
    try {
      await deleteProduct(uid);
      handleClose();
    } catch (error) {
      console.error("error al eliminar ", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      slotsProps={{ backdrop: { backgroundColor: "transparent" } }}
    >
      <ModalContent>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              color: "#FFF",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            ¿Estas seguro de que quieres eliminar este producto?
          </Typography>
          <Typography
            sx={{
              color: "#69EAE2",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: "0.875rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {data?.productName}
          </Typography>
          <Box
            component={"img"}
            src={data?.image}
            alt={`imagen del producto ${data?.productName}`}
            sx={{
              marginTop: "8px",
              width: "8rem",
              height: "8rem",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            onClick={() => handleDelete(data?.uid)}
            sx={{
              width: "8.75rem",
              height: "1.5625rem",
              borderRadius: "0.625rem",
              background: "#69eae2ab",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",

              "&:hover": { backgroundColor: "#69EAE2" },
            }}
          >
            <Typography
              sx={{
                color: "#1F1D2B",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "normal",
              }}
            >
              Si, Eliminar
            </Typography>
          </Button>
          <Button
            sx={{
              width: "8.75rem",
              height: "1.5625rem",
              borderRadius: "0.625rem",
              background: "#ff0404c7",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              "&:hover": { backgroundColor: "#FF0404" },
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "normal",
              }}
            >
              Cancelar
            </Typography>
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
}
