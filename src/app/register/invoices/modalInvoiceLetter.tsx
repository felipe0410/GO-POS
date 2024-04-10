"use client";
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useReactToPrint } from "react-to-print";
import { Typography } from "@mui/material";
import jsPDF from "jspdf";
import InvoiceLetter from "./invoiceLetter";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  Height: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalInvoiceLetter = ({ data }: { data: any }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const componentRef: any = React.useRef();

  const handleDescargarPDF = () => {
    const [date, hour] = data.date.split(" ");
    const content = componentRef.current;
    const pdf = new jsPDF({
      unit: "px",
      format: "A4",
      orientation: "portrait",
    });
    pdf.html(content, {
      callback: () => {
        pdf.save(`${data.cliente.name}_${date}`);
      },
    });
  };

  const handlePrint = useReactToPrint({
    content: () => {
      const content = componentRef.current;
      return content;
    },
  });

  return (
    <div>
      <Button onClick={handleOpen}>
        <FileCopyIcon sx={{ color: "#69EAE2" }} />
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
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
                  fontSize="large"
                  sx={{ color: "#F8F8F8", fontSize: "20px" }}
                />
              </Button>
            </Box>
            <Box
              ref={componentRef}
              sx={{
                "@media print": {
                  "@page": {
                    size: `${componentRef?.current?.clientWidth}px ${
                      componentRef?.current?.clientHeight * 1.1
                    }px`,
                  },
                  width: "100%",
                },
              }}
            >
              <InvoiceLetter data={data} />
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
                onClick={handleDescargarPDF}
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
                  DESCARGAR
                </Typography>
              </Button>
              <Button
                onClick={handlePrint}
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

export default ModalInvoiceLetter;
