"use client";
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateTimeComponent from "./DateTimeComponent";

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
  textAlign: "-webkit-center",
};

const DateModal = ({ setSearchTerm }: { setSearchTerm: any }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>
        <CalendarMonthIcon sx={{ color: "#69EAE2" }} />
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
            sx={{
              ...style,
              maxHeight: "90%",
              overflowY: "auto",
            }}
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
            <DateTimeComponent
              setSearchTerm={setSearchTerm}
              handleClose={handleClose}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default DateModal;
