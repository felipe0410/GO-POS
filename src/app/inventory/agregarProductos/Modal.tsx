'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import NewProductSidebar from './contentModal';


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

export default function ComponentModal() {
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
                    borderRadius: '5px',
                    background: create.category ? '#69EAE2' : 'transparent',
                    boxShadow: create.measurements ? '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' : '',
                    color: create.category ? '#1F1D2B' : '#69EAE2',
                    fontFamily: 'Nunito',
                    fontSize: '8px',
                    fontStyle: 'normal',
                    fontWeight: 800,
                    lineHeight: 'normal',
                }}
            >
                CREAR CATEGORIA
            </Button>
            <Button
                onClick={() => { setCreate({ category: false, measurements: true }); handleOpen() }}
                sx={{
                    borderRadius: '5px',
                    background: create.measurements ? '#69EAE2' : 'transparent',
                    boxShadow: create.measurements ? '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' : '',
                    color: create.measurements ? '#1F1D2B' : '#69EAE2',
                    fontFamily: 'Nunito',
                    fontSize: '8px',
                    fontStyle: 'normal',
                    fontWeight: 800,
                    lineHeight: 'normal',
                }}
            >
                CREAR MEDIDA
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <NewProductSidebar OpenCategory={create.category} setOpen={setOpen} />
                </Box>
            </Modal>
        </div>
    );
}