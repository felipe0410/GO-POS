"use client";
import {
    Box,
    OutlinedInput,
    Button,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useContext, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";
import { SidebarContext } from "./context";
import StepRegister from "./progress";

const Step_second = () => {
    const { step, setStep, setData, data, inputs_step_second } = useContext(SidebarContext) || {};
    const router = useRouter();
    const validarInputs = () => {
        for (const input of inputs_step_second) {
            if (!input.validation()) {
                return false;
            }
        }
        return true;
    };
    const validateLength = () => {
        const arrayValue = [data?.NIT_CC ?? "", data?.direction ?? "", data?.phone ?? ""];
        const validation = arrayValue.some((valor: any) => valor.length < 2);
        if (validation) {
            return true;
        }
        const validation2 = validarInputs();
        if (!validation2) {
            return true;
        }
        return false;
    };
    useEffect(() => {
        const values = {
            NIT_CC: data.NIT_CC,
            direction: data.direction,
            phone: data.phone
        }
        setData({
            ...data,
            NIT_CC: values.NIT_CC === "default" ? "" : data.NIT_CC,
            direction: values.direction === "default" ? "" : data.direction,
            phone: values.phone === "default" ? "" : data.phone
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            backgroundImage: { xs: 'url("images/loggin_responsive.png")', lg: 'url("images/register.png")' },
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: "center"
        }}>
            <SnackbarProvider />
            <Box sx={{
                display: "flex", flexDirection: "column",
                height: "100%",
                justifyContent: "center",
                margin: { xs: '0 auto', lg: 'auto' }
            }} >
                <Box
                    sx={{
                        borderRadius: "40px",
                        width: { xs: "80%", md: "70%" },
                        margin: "0 auto",
                        padding: "2% 4%",
                        height: { xs: '70%', sm: "90%" },
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
                            align="center"
                            sx={{
                                color: "#69EAE2",
                                fontFamily: "Nunito",
                                fontSize: { xs: "20px", md: "55px" },
                                fontStyle: "normal",
                                fontWeight: { xs: 700, lg: 800 },
                                lineHeight: "60px",
                                textAlignLast: "center",
                                letterSpacing: "0em",

                            }}
                        >
                            Ya estas registrado ¡Bienvenido a GO!
                        </Typography>

                        <Typography
                            align="center"
                            sx={{
                                color: "#FFF",
                                textAlign: "center",
                                fontFamily: "Nunito",
                                fontSize: { xs: '13px', lg: "32px" },
                                fontStyle: "normal",
                                fontWeight: 600,
                                lineHeight: { lg: "30px" }
                            }}>
                            Ahora vamos a crear tu perfil con los datos de tu establecimiento, mas adelante podras editarlo en la seccion de “Ajustes”, estos datos se usaran para generar las facturas de tu establecimiento
                        </Typography>
                        {inputs_step_second.map((input: { type: string | undefined; label: string | undefined; placeHolder: string | undefined; value: unknown; field: any; validation: () => any; msgErrror: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | React.ReactNode | null | undefined; }, index: number) => {
                            return (
                                <Box sx={{ width: { lg: '50%' }, alignSelf: 'center' }} key={index * 98}>
                                    <>
                                        <OutlinedInput
                                            fullWidth
                                            sx={{
                                                borderRadius: "20px",
                                                background: "#FFF",
                                                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                                height: "35px"
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
                                onClick={() => setStep(step + 1)}
                                disabled={validateLength()}
                                sx={{
                                    width: { lg: '20%' },
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
                                SIGUIENTE
                            </Button>
                        </Box>
                        <Box id="StepRegister" sx={{ display: "flex", justifyContent: "center" }}>
                            <StepRegister />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}

export default Step_second