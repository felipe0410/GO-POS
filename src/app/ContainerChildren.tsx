'use client'
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./globalContex";
import { Box, Typography } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import { useCookies } from "react-cookie"
import { keyframes } from "@emotion/react";



const ContainerChildren = ({ childrenn, validationRoutes }: { childrenn: any, validationRoutes: any }) => {
    const [cookies] = useCookies(['user']);
    const { isOpen, setIsOpen } = useContext(GlobalContext) || {};
    const [validation, setValidation] = useState(false)
    const validationCookie = cookies?.user?.length > 0
    useEffect(() => {
        if (validationCookie) {
            validationRoutes && (window.location.href = "/inventory/productos")
            setTimeout(() => {
                setValidation(true)
            }, 2000);
        } else {
            !validationRoutes && (window.location.href = "/sign_in")
            setTimeout(() => {
                setValidation(true)
            }, 2000);
        }
    }, [])
    const myAnim = keyframes`
    0% {
      transform: scale(0.3);
    }
  
    100% {
      transform: scale(1);
    }
  `;


    return (
        <>
            {validation ?
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
                :
                <Box
                    id="false"
                    sx={{
                        flexDirection: 'column',
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Typography
                        align="center"
                        sx={{
                            color: "#FFF",
                            textShadow: "0px 0px 20px #69EAE2",
                            fontFamily: "Nunito",
                            fontSize: { xs: '8rem', sm: "12.75rem" },
                            fontStyle: "normal",
                            fontWeight: 800,
                            lineHeight: "normal",
                            animation: `${myAnim} 2s ease 0s 1 normal forwards`,
                        }}>
                        GO
                        <Typography
                            align="center"
                            sx={{
                                color: "#69EAE2",
                                fontFamily: "Nunito",
                                fontSize: { xs: '4rem', sm: "8rem" },
                                fontStyle: "normal",
                                fontWeight: 800,
                                lineHeight: "normal",
                                animation: `${myAnim} 2s ease 0s 1 normal forwards`,
                            }}>
                            Bienvenido
                        </Typography>
                    </Typography>

                </Box >
            }
        </>
    )
}

export default ContainerChildren
