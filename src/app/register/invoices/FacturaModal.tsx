"use client";
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Factura from "./Factura";
import { Typography } from "@mui/material";

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

const FacturaModal = ({ data }: { data: any }) => {
  console.log(data);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>
        <ReceiptIcon sx={{ color: "#69EAE2" }} />
      </Button>
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
          <Box
            sx={{ ...style, maxHeight: "95%", overflowY: "auto" }}
            id='holii'
          >
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
            <Factura data={data} />
            <Box
              sx={{
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              <Button
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
                  IMPRIMIR
                </Typography>
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default FacturaModal;
