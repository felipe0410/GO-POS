'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import NewProductSidebar from './contentModal';
import { Typography } from '@mui/material';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'transparent',
    boxShadow: 24,
    p: 4,
};

export default function Revenue() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [create, setCreate] = useState({
        category: false,
        measurements: false
    })

    return (
        <div>
            <Button
                onClick={() => { setCreate({ measurements: false, category: true }); handleOpen() }}
                sx={{
                    width: "100%",
                    height: "2.5rem",
                    borderRadius: "0.625rem",
                    boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    background: "#69EAE2",
                    marginTop: "10px",
                }}
            >
                <Typography
                    sx={{
                        color: "#1F1D2B",
                        textAlign: "center",
                        fontFamily: "Nunito",
                        fontSize: { xs: "0.58rem", sm: "0.875rem" },
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "normal",
                    }}
                >
                    CALCULAR GANACIA
                </Typography>
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{
                        boxShadow: "0px 1px 250px -50px #69EAE2",
                        borderRadius: "30px",
                        background: "#1F1D2B"
                    }}>
                        <Typography
                            sx={{
                                fontFamily: "Nunito",
                                fontSize: { xs: '20px', sm: "32px" },
                                fontWeight: 700,
                                lineHeight: "44px",
                                letterSpacing: "0em",
                                textAlign: "left",
                                color: '#69EAE2'
                            }}
                        >
                            ¿Cual quieres que sea tu ganancia?
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "Nunito",
                                fontSize: { xs: '12px', sm: "20px" },
                                fontWeight: 400,
                                lineHeight: "27px",
                                letterSpacing: "0em",
                                textAlign: "left",
                            }}
                        >
                            Define el porcentaje o valor en pesos  de tu ganancia.
                        </Typography>
                    </Box>
                </Box>
            </Modal>
        </div >
    );
}