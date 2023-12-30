'use client'
import { useContext } from "react";
import { GlobalContext } from "./globalContex";
import { Box } from "@mui/material";
import Sidebar from "@/components/Sidebar";

const ContainerChildren = ({ childrenn, validationRoutes }: { childrenn: any, validationRoutes: any }) => {
    const { isOpen, setIsOpen } = useContext(GlobalContext) || {};
    return (
        <>
            <Box
                id='Container Sidebar'
                sx={{
                    display: validationRoutes ? "none" : 'block',
                    zIndex: validationRoutes ? "" : '10',
                    position: validationRoutes ? "" : "fixed",
                    top: 0,
                    left: 0,
                    height: "100%",
                }}
            >
                <Sidebar open={isOpen} setOpen={setIsOpen} />
            </Box>
            <Box
                id='container children layout'
                sx={{
                    height: "100%",
                    marginTop: validationRoutes ? "" : "64px",
                    marginLeft: validationRoutes ? "" : { xs: '20px', sm: isOpen ? "284px" : '140px' },
                }}
            >
                {childrenn}
            </Box>
        </>
    )
}

export default ContainerChildren
