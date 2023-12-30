import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CalculateIcon from '@mui/icons-material/Calculate';
import { Calculator } from 'react-mac-calculator';
import CloseIcon from "@mui/icons-material/Close";



const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Calculatorr() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button sx={{
                width: "100%",
                height: "2.5rem",
                borderRadius: "0.625rem",
                boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                background: "#69EAE2",
                marginTop: "10px",
            }} onClick={handleOpen}>
                <CalculateIcon sx={{ color: "#1F1D2B" }} />
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
                        boxShadow: "0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2",
                        borderColor: 'transparent',
                    }} in={open}>
                    <Box sx={style}>
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
                                <CloseIcon fontSize='large' sx={{ color: "#F8F8F8", fontSize: "20px" }} />
                            </Button>
                        </Box>
                        <Box sx={{ border: "solid 6px #fff" }}>
                            <Calculator />
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}