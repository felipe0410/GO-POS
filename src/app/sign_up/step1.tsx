"use client";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    OutlinedInput,
    InputBase,
    Button,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useContext, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";

import { SidebarContext } from "./context";
import StepRegister from "./progress";


const Step_one = () => {
    const { step, setStep, data, setData, inputs, validateLength } = useContext(SidebarContext) || {};
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const router = useRouter();
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => { event.preventDefault(); };

    const password = () => {
        return (
            <FormControl fullWidth variant='outlined'>
                <OutlinedInput
                    id='outlined-adornment-password'
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton
                                aria-label='toggle password visibility'
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge='end'
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    fullWidth
                    sx={{
                        borderRadius: "20px",
                        background: "#FFF",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        height: { xs: '35px', lg: 'auto' }
                    }}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    placeholder='Contraseña'
                />
            </FormControl>
        );
    };



    useEffect(() => {
        const array = ["NIT_CC", "direction", "phone"]
        array.forEach((e) => {
            const value = [data.NIT_CC, data.direction, data.phone]
            data[e] === "" ? setData({ ...data, [e]: "default" }) : null
        })        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <Box sx={{ height: "100%", }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                backgroundImage: { xs: 'url("images/loggin_responsive.png")', lg: 'url("images/loggin.png")' },
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: "center"
            }}>
                <SnackbarProvider />
                <Box sx={{
                    display: "flex",
                    width: { lg: "56%" },
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "center",
                    margin: { xs: '0 auto', lg: 'auto' }
                }} >
                    <Box
                        sx={{
                            borderRadius: "40px",
                            width: { xs: "80%", md: "55%" },
                            margin: "0 auto",
                            padding: "2% 4%",
                            height: '70%'
                        }}
                    >
                        <Button
                            onClick={() => step === 0 ? router.push("/sign_in") : setStep(step - 1)}
                            sx={{
                                background: "rgba(255, 255, 255, 0.77)",
                                minWidth: "auto",
                                borderRadius: "20PX",
                            }}
                        >
                            <ArrowBackIcon
                                sx={{ color: "#0A0F37", fontSize: { xs: "small", md: "auto" } }}
                            />
                        </Button>
                        <Box sx={{
                            height: "90%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}>
                            <Typography
                                sx={{
                                    color: "#69EAE2",
                                    fontFamily: "Nunito",
                                    fontSize: { xs: "20px", md: "35px" },
                                    fontStyle: "normal",
                                    fontWeight: { xs: 700, lg: 800 },
                                    lineHeight: "normal",
                                    textAlignLast: "center",
                                }}
                            >
                                REGISTRATE
                            </Typography>
                            {inputs.map((input: { type: string | undefined; label: string | undefined; placeHolder: string | undefined; value: unknown; field: any; validation: () => any; msgErrror: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }, index: number) => {
                                return (
                                    <Box key={index * 98}>
                                        {input.type === "password" ? (
                                            password()
                                        ) : (
                                            <>
                                                <OutlinedInput
                                                    fullWidth
                                                    sx={{
                                                        borderRadius: "20px",
                                                        background: "#FFF",
                                                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                                        height: { xs: '35px', lg: 'auto' }
                                                    }}
                                                    id={input.label}
                                                    type={input.type}
                                                    placeholder={input.placeHolder}
                                                    value={input.value}
                                                    onChange={(e) =>
                                                        setData({ ...data, [input.field]: e.target.value })
                                                    }
                                                />
                                            </>
                                        )}
                                        <Typography
                                            display={input.validation() ? "none" : "block"}
                                            color='error'
                                        >
                                            {input.msgErrror}
                                        </Typography>
                                    </Box>
                                );
                            })}
                            <Box sx={{ textAlignLast: "center" }}>
                                <Button
                                    fullWidth
                                    onClick={() => setStep(step + 1)}
                                    disabled={validateLength()}
                                    sx={{
                                        padding: "5px 20px",
                                        background: !validateLength() ? "#69EAE2" : "#b4bac2",
                                        boxShadow:
                                            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                        color: "#1F1D2B",
                                        fontFamily: "Nunito",
                                        fontSize: { xs: "15px", md: "20px" },
                                        fontStyle: "normal",
                                        fontWeight: 700,
                                        lineHeight: "normal",
                                        marginTop: "20px",
                                    }}
                                >
                                    CREAR USUARIO
                                </Button>
                            </Box>
                        </Box>
                        <Box id="StepRegister" sx={{ width: { lg: '260%' }, marginTop: '10px' }}>
                            <StepRegister />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ width: '45%', display: { xs: 'none', lg: 'block' } }}>
                    <Typography
                        sx={{
                            color: "#1F1D2B",
                            textAlign: "center",
                            fontFamily: "Nunito",
                            fontSize: "55px",
                            fontStyle: "normal",
                            fontWeight: 800,
                            lineHeight: "60px",
                            width: '75%'
                        }}
                    >
                        ¡Vamos a crear tu cuenta!
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Step_one;
