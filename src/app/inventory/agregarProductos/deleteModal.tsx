import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { Box, Paper, IconButton } from "@mui/material";
import { removeCategory, removeMeasurements } from "@/firebase";
import { enqueueSnackbar } from "notistack";
import CancelIcon from "@mui/icons-material/Cancel";


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
    padding: ${!theme.breakpoints.down("sm") ? "24px" : "13px"};
    width: ${!theme.breakpoints.down("sm") ? "32.125rem" : "20rem"};
    height: 16rem;
  `
);

export default function DeleteModal({ document, tag, category }: { document: string, tag: string, category: string }) {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleDelete = async () => {
        if (document === "categories") {
            if (tag) {
                await removeCategory(tag);
            } else {
                enqueueSnackbar("Error al eliminar la categoria", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });
            }
        } else if (document === "measurements") {
            if (tag) {
                await removeMeasurements(tag);
            } else {
                enqueueSnackbar("Error al eliminar la unidad de medida", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });
            }
        }
    };

    const handleCancel = () => {
        handleClose();
    };

    return (
        <Box >
            <IconButton onClick={() => setOpen(true)}>
                <CancelIcon sx={{ color: "red" }} />
            </IconButton>
            <Modal open={open} onClose={handleClose}>
                <ModalContent
                    sx={{
                        boxShadow: "0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2",
                        maxHeight: '180px',
                        display: 'flex',
                        flexDirection: "column",
                        justifyContent: "space-around"
                    }}>
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
                            ¿Estas seguro de que quieres eliminar esta categoria?
                        </Typography>
                        <Typography
                            sx={{
                                color: "#69EAE2",
                                textAlign: "center",
                                fontFamily: "Nunito",
                                fontSize: "1.2rem",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                            }}
                        >
                            {category}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                        <Button
                            onClick={() => handleDelete()}
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
                                SÍ, ELIMINAR
                            </Typography>
                        </Button>
                        <Button
                            onClick={() => handleCancel()}
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
                                CANCELAR
                            </Typography>
                        </Button>
                    </Box>
                </ModalContent>
            </Modal>
        </Box>
    );
}
