"use client";
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Factura from "./Factura";
import { IconButton, Typography } from "@mui/material";
import { deleteInvoice } from "@/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DeleteFacturaModal = ({ data }: { data: any }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteInvoiceData = async (uid: string) => {
    try {
      await deleteInvoice(uid);
      enqueueSnackbar("Factura eliminada con éxito", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      enqueueSnackbar("Error al eliminar factura", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.error(error);
    }
  };

  return (
    <div>
      <SnackbarProvider />
      <IconButton sx={{ padding: "8px 3px" }} onClick={() => handleOpen()}>
        <Box
          component={"img"}
          src={"/images/delete.svg"}
          sx={{ width: "1rem", height: "1rem" }}
        />
      </IconButton>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade
          style={{
            borderRadius: "40px",
            background: "#1F1D2B",
            boxShadow:
              "0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2",
            borderColor: "transparent",
          }}
          in={open}
        >
          <Box sx={{ ...style, maxHeight: "95%", overflowY: "auto" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                zIndex: 4,
              }}
            >
              <Button
                sx={{ padding: "8px 3px" }}
                onClick={() => {
                  handleClose();
                }}
              >
                <CloseIcon
                  fontSize='large'
                  sx={{ color: "#F8F8F8", fontSize: "20px" }}
                />
              </Button>
            </Box>
            <Box>
              <Factura data={data} />
            </Box>
            <Box
              sx={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                onClick={() => handleClose()}
                sx={{
                  width: "8.4375rem",
                  height: "2.1875rem",
                }}
                style={{ borderRadius: "0.5rem", background: "#69EAE2" }}
              >
                <Typography
                  sx={{
                    color: "#1F1D2B",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "140%",
                  }}
                >
                  CANCELAR
                </Typography>
              </Button>
              <Button
                onClick={() => deleteInvoiceData(data.uid)}
                sx={{
                  width: "8.4375rem",
                  height: "2.1875rem",
                }}
                style={{ borderRadius: "0.5rem", background: "#FF0404" }}
              >
                <Typography
                  sx={{
                    color: "#FFF",
                    fontFamily: "Nunito",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "140%",
                  }}
                >
                  SÍ, ELIMINAR
                </Typography>
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default DeleteFacturaModal;
