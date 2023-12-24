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
                        borderRadius: "50px",
                        background: "#1F1D2B",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        color: "#fff"
                    }}
                    placeholder='Contraseña'
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
            <Box>
                GO
            </Box>
            <Box id='box-second' sx={{ ...styleSign_in.boxSecond }}>
                <SnackbarProvider />
                <>
                    <Typography sx={{
                        color: "#FFF",
                        fontFamily: "Nunito",
                        fontSize: "64px",
                        fontStyle: "normal",
                        fontWeight: 800,
                        lineHeight: "normal",
                    }}>
                        ¡BIENVENIDO!
                    </Typography>
                </>
                <>
                    <Box id='iniciar_sesion' sx={{ ...styleSign_in.containerField1 }}>
                        <Box sx={{ width: { xs: '80%', md: '45%' } }}>
                            <Typography
                                id='label'
                                sx={{
                                    color: "#1F1D2B",
                                    fontFamily: "Nunito",
                                    fontSize: '24px',
                                    fontStyle: "normal",
                                    fontWeight: 700,
                                    lineHeight: 'normal'
                                }}>
                                INICIAR SESION
                            </Typography>
                            <Box>
                                <OutlinedInput
                                    sx={{
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

                        <Button
                            fullWidth
                            onClick={logginUserr}
                            sx={{
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
                            <Link href={'/sign_up'}>
                                REGISTRATE
                            </Link>
                        </Typography>
                    </Box>
                </>
            </Box >
        </Box >
    )
}

export default Loggin