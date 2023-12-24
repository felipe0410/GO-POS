'use client'
import { VisibilityOff, Visibility } from "@mui/icons-material"
import { Box, Typography, TextField, Button, FormControl, IconButton, InputAdornment, OutlinedInput } from "@mui/material"
import Link from "next/link"
import { SnackbarProvider, enqueueSnackbar } from "notistack"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { styleSign_in } from "./style"
import { loginUser } from "@/firebase"
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



const Loggin = () => {
    const [cookies, setCookie] = useCookies(['user']);
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
        password: '',
        email: ''
    })
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const password = () => {
        return (
            <FormControl fullWidth variant="outlined">
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    startAdornment={
                        <InputAdornment position="end" sx={{ marginRight: '20px' }}>
                            {showPassword ? <LockOpenIcon sx={{ color: '#fff' }} /> : <HttpsRoundedIcon sx={{ color: '#fff' }} />}
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff sx={{ color: '#fff' }} /> : <Visibility sx={{ color: '#fff' }} />}
                            </IconButton>
                        </InputAdornment>
                    }
                    fullWidth
                    sx={{
                        fontFamily: "Nunito",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "normal",
                        borderRadius: "50px",
                        background: "#1F1D2B",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        color: "#fff"
                    }}
                    placeholder='CONTRASEÑA'
                    onChange={(e) => setData({ ...data, 'password': e.target.value })}
                    value={data.password}
                />
            </FormControl>
        )
    }

    const logginUserr = async () => {
        try {
            const loggin: any = await loginUser(data.email, data.password)
            if (loggin?.uid) {
                const oneDay = 24 * 60 * 60 * 1000;
                const expirationDate = new Date(Date.now() + oneDay);
                const encodedUid = btoa(loggin.uid);
                setCookie('user', encodedUid, { expires: expirationDate });
                enqueueSnackbar('Autenticacion exitosa', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                enqueueSnackbar('Credenciales invalidas', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
            }
        } catch (error) {
            enqueueSnackbar('Error en el sistema', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            })
            console.log(error)
        }
    }
    return (
        <Box sx={{ height: '100%' }}>
            <Box id='box-second' sx={{
                ...styleSign_in.boxSecond,
                display: "flex",
                flexDirection: 'row',
                alignItems: "center",
            }}>
                <Box
                    sx={{
                        width: '50%',
                        display: "flex",
                        flexDirection: "column",
                        height: "68%",
                        justifyContent: "flex-start",
                        alignItems: "flex-end"
                    }}>
                    <SnackbarProvider />
                    <Box sx={{
                        width: '70%',
                        height: '85%',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <Box sx={{
                            color: '#FFF',
                            textShadow: "0px 0px 20px #69EAE2",
                            fontFamily: "Nunito",
                            fontSize: "64px",
                            fontStyle: "normal",
                            fontWeight: 800,
                            lineHeight: "normal",
                            marginRight: "auto",
                        }}>
                            GO
                        </Box>
                        <Typography sx={{
                            color: "#FFF",
                            fontFamily: "Nunito",
                            fontSize: "64px",
                            fontStyle: "normal",
                            fontWeight: 800,
                            lineHeight: "normal",
                            textAlign: "right",
                        }}>
                            ¡BIENVENIDO!
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: '50%',
                        height: "90%",
                        display: 'flex',
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                    <Box id='iniciar_sesion' sx={{ ...styleSign_in.containerField1 }}>
                        <Typography
                            id='label'
                            sx={{

                                color: "#1F1D2B",
                                fontFamily: "Nunito",
                                fontSize: '30px',
                                fontStyle: "normal",
                                fontWeight: 800,
                                lineHeight: 'normal'
                            }}>
                            INICIAR SESION
                        </Typography>
                        <Box sx={{ width: { xs: '80%', md: '45%' } }}>
                            <Box>
                                <OutlinedInput
                                    sx={{
                                        fontFamily: "Nunito",
                                        fontStyle: "normal",
                                        fontWeight: 400,
                                        lineHeight: "normal",
                                        width: '100%',
                                        borderRadius: "50px",
                                        background: "#1F1D2B",
                                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                        color: "#fff"
                                    }}
                                    id="user"
                                    type="email"
                                    placeholder='USUARIO'
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, 'email': e.target.value })}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <PersonSharpIcon sx={{ color: "#fff", marginRight: '20px' }} />
                                        </InputAdornment>
                                    }


                                />
                            </Box>
                        </Box>
                        <Box sx={{ width: { xs: '80%', md: '45%' } }}>
                            <Box>
                                {password()}
                            </Box>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "45%",
                        }}>
                            <Box sx={{ display: 'flex', alignItems: "center", }}>
                                <Checkbox
                                    icon={<RadioButtonUncheckedIcon sx={{ color: "#1F1D2B" }} />}
                                    checkedIcon={<CheckCircleIcon sx={{ color: "#1F1D2B" }} />}
                                />
                                <Typography
                                    sx={{
                                        color: "#1F1D2B",
                                        fontFamily: "Nunito",
                                        fontSize: "14px",
                                        fontStyle: "normal",
                                        fontWeight: 600,
                                        lineHeight: "normal",
                                    }}
                                >
                                    Recordar datos
                                </Typography>
                            </Box>
                            <Box>
                                <Typography sx={{
                                    color: "#1F1D2B",
                                    fontFamily: "Nunito",
                                    fontSize: "14px",
                                    fontStyle: "normal",
                                    fontWeight: 600,
                                    lineHeight: "normal"
                                }}>
                                    Olvide mi contraseña
                                </Typography>
                            </Box>
                        </Box>
                        <Button

                            onClick={logginUserr}
                            sx={{
                                width: '45%',
                                background: "#69EAE2",
                                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                color: "#1F1D2B",
                                fontFamily: "Nunito",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 700,
                                lineHeight: "normal",
                            }}>
                            INICIAR SESION
                        </Button>
                    </Box>
                    <Box id="registrate">
                        <Typography sx={{ ...styleSign_in.tyographyRegister }}>
                            ¿No tienes una cuenta?<br />
                            <Link style={{ fontWeight: 700, }} href={'/sign_up'}>
                                REGISTRATE
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box >
        </Box >
    )
}

export default Loggin