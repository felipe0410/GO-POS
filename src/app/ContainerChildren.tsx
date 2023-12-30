'use client'
import { useContext } from "react";
import { GlobalContext } from "./globalContex";
import { Box } from "@mui/material";

const ContainerChildren = ({ childrenn, validationRoutes }: { childrenn: any, validationRoutes: any }) => {
    const { isOpen, setIsOpen } = useContext(GlobalContext) || {};
    return (
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
    )
}

export default ContainerChildren
