import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { Box, Paper, IconButton } from "@mui/material";
import { typographyButton, colabsList } from "./profileStyles";
import { deleteColabData } from "@/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

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
    gap: ${!theme.breakpoints.down("sm") ? "8px" : "0"};
    overflow: hidden;
    background-color: #1f1d2b;
    border-radius: 0.625rem;
    padding: ${!theme.breakpoints.down("sm") ? "24px" : "20px"};
    width: ${!theme.breakpoints.down("sm") ? "32.125rem" : "35rem"};
    min-height: 400px;
  `
);

export default function DeleteModalColab({ data }: { data: any }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const handleCancel = () => {
    handleClose();
  };

  const handleDeleteColab = async (colabID: string) => {
    try {
      await deleteColabData(colabID);
      enqueueSnackbar("Colaborador eliminado", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        onExited: handleCancel,
      });
    } catch (error) {
      enqueueSnackbar("Error al eliminar", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  function getStatusLabel(status: string) {
    switch (status) {
      case "salesman":
        return "VENDEDOR";
      case "admin":
        return "ADMINISTRADOR";
      case "editor":
        return "INVENTARIO";
      default:
        return "INVITADO";
    }
  }

  return (
    <Box>
      <SnackbarProvider />
      <IconButton
        sx={{ padding: "8px 3px" }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Box
          component={"img"}
          src={"/images/delete.svg"}
          sx={{ width: "1rem", height: "1rem" }}
        />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <ModalContent
          sx={{
            boxShadow:
              "0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2",
            maxHeight: "180px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{ ...typographyButton, fontSize: "25px", color: "#69EAE2" }}
            >
              ¿Estas seguro de que quieres eliminar este colaborador?
            </Typography>
            <Box sx={{ marginTop: "1rem" }}>
              <img
                alt={`img from colab ${data.name}`}
                src={data.img}
                style={{ width: "145px", height: "145px", borderRadius: "50%" }}
              />
            </Box>
            <Typography
              sx={{
                ...colabsList.typographyName,
                fontSize: "20px",
                color: "#FFF",
                marginTop: "0.5rem",
              }}
            >
              {data.name.toUpperCase()}
            </Typography>
            <Typography
              sx={{
                ...colabsList.typographyButtonList,
                fontSize: "16px",
                marginTop: "0.4rem",
              }}
            >
              {getStatusLabel(data.status)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              onClick={() => handleCancel()}
              sx={{
                width: "8.75rem",
                height: "1.5625rem",
                borderRadius: "0.625rem",
                background: "#69EAE2",
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
                CANCELAR
              </Typography>
            </Button>
            <Button
              onClick={() => handleDeleteColab(data.uid)}
              sx={{
                width: "8.75rem",
                height: "1.5625rem",
                borderRadius: "0.625rem",
                background: "#FF0404",
                boxShadow:
                  "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",

                "&:hover": { backgroundColor: " #FF0404 " },
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
                SÍ, ELIMINAR
              </Typography>
            </Button>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
