import CartItems from "@/components/CartItems";
import DatosVenta from "@/components/DatosVenta";
import Factura from "@/app/vender/Factura";
import IncompleteCartItem from "@/components/IncompleteCartItem";
import { Box, IconButton, SwipeableDrawer, Button, Typography, Divider, InputBase, InputAdornment, Badge, BadgeProps, styled, useMediaQuery, useTheme, Tooltip, TooltipProps, tooltipClasses, Paper } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HelpIcon from "@mui/icons-material/Help";
import Chip from '@mui/material/Chip';


const SlidebarVender = ({ selectedItems, setSelectedItems, searchTerm, filteredData, setSearchTerm }: { selectedItems: any, setSelectedItems: any, searchTerm: any, filteredData: any, setSearchTerm: any }) => {
    const [open, setOpen] = useState(false)
    const [nextStep, setNextStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reciboPago, setReciboPago] = useState(false);
    const [agregarDescuento, setAgregarDescuento] = useState(false);
    const [descuentoON, setDescuentoON] = useState(false);
    const [descuento, setDescuento] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [subtotal, setSubtotal] = useState(0);

    const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#69EAE2",
            color: "#1F1D2B",
            boxShadow: theme.shadows[1],
            fontSize: 11,
            maxWidth: "146px",
        },
    }));

    const theme = useTheme()

    let totalUnidades = 0;
    selectedItems?.forEach((element: any) => {
        totalUnidades += element.cantidad;
    });
    const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
    const generarNumeroFactura = () => {
        return String(contadorFactura).padStart(7, "0");
    };

    const handleVenderClick = () => {
        setContadorFactura((prevContador) => prevContador + 1);
    };

    const storedContadorFactura = localStorage.getItem("contadorFactura");
    const initialContadorFactura = storedContadorFactura
        ? parseInt(storedContadorFactura, 10)
        : 1;
    const [contadorFactura, setContadorFactura] = useState(
        initialContadorFactura
    );
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const calcularTotal = (event: any) => {
        if (inputValue.includes("%")) {
            let valorSinPorcentaje: number;
            const porcentajeComoNumero = Number(inputValue.replace("%", ""));
            valorSinPorcentaje = Math.ceil((porcentajeComoNumero / 100) * subtotal);
            setDescuento(valorSinPorcentaje);
        } else {
            setDescuento(Number(inputValue));
        }
        setDescuentoON(true);
    };

    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            padding: '0 4px',
        },
    }));

    useEffect(() => {
        localStorage.setItem("contadorFactura", contadorFactura.toString());
    }, [contadorFactura]);

    useEffect(() => {
        const nuevoSubtotal: number = (selectedItems ?? []).reduce(
            (total: any, producto: { acc: any; }) => total + producto.acc,
            0
        );
        setSubtotal(nuevoSubtotal);
    }, [selectedItems]);

    return (
        <Box display={'flex'}>
            <IconButton sx={{
                position: "absolute",
                top: "20px",
                right: "30px"
            }} onClick={() => setOpen(true)} aria-label="cart">
                <StyledBadge badgeContent={totalUnidades} sx={{ color: '#fff' }} color="error">
                    <ShoppingCartIcon />
                </StyledBadge>
            </IconButton>
            <SwipeableDrawer
                open={open}
                id='drawer'
                variant={matchesSM ? "persistent" : "permanent"}
                anchor='right'
                PaperProps={{
                    style: {
                        background: "transparent",
                        border: "none",
                        width: !matchesSM ? "100%" : "95%",
                    },
                }}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
            >
                <Box
                    sx={{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        position: "absolute",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        background: "#1F1D2B",
                        height: "100%",
                        overflow: "hidden",
                        top: 0,
                        right: 0,
                        width: { xs: '100%', sm: "25.5625rem" },
                        borderRadius: "10px 0px 0px 10px",
                    }}
                >
                    <Box id='principal container' padding={3} sx={{ height: "100%", width: '100%', overflow: 'auto' }}>
                        {reciboPago ? (
                            <Factura
                                setReciboPago={setReciboPago}
                                setSelectedItems={setSelectedItems as any}
                                setNextStep={setNextStep}
                            />
                        ) : (
                            <>
                                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                    <Button sx={{ float: "right" }} onClick={() => setOpen(false)}>
                                        <CloseIcon sx={{ color: '#fff' }} />
                                    </Button>
                                </Box>
                                {nextStep ? (
                                    <Box>
                                        <IconButton
                                            sx={{ paddingLeft: 0 }}
                                            onClick={() => setNextStep(false)}
                                        >
                                            <Box
                                                component={"img"}
                                                src={"/images/vender.svg"}
                                                sx={{ width: "0.93rem", height: "0.93rem" }}
                                            />
                                            <Typography
                                                sx={{
                                                    color: "#69EAE2",
                                                    fontFamily: "Nunito",
                                                    fontSize: "0.875rem",
                                                    fontStyle: "normal",
                                                    fontWeight: 500,
                                                    lineHeight: "140%",
                                                    marginLeft: "2px",
                                                }}
                                            >
                                                Volver al Carrito
                                            </Typography>
                                        </IconButton>
                                    </Box>
                                ) : null}
                                <Typography
                                    sx={{
                                        color: "#FFF",
                                        fontFamily: "Nunito",
                                        fontSize: { xs: '14px', sm: "1.25rem" },
                                        fontStyle: "normal",
                                        fontWeight: 800,
                                        lineHeight: "140%",
                                        marginTop: "0.5rem",
                                        marginLeft: "1rem",
                                    }}
                                >
                                    VENTA # {generarNumeroFactura()}
                                </Typography>
                                {nextStep ? (
                                    <DatosVenta
                                        total={subtotal - descuento}
                                        selectedItems={selectedItems}
                                        subtotal={subtotal}
                                        descuento={descuento}
                                        setLoading={setLoading}
                                        loading={loading}
                                        setReciboPago={setReciboPago}
                                        reciboPago={reciboPago}
                                        numeroFactura={generarNumeroFactura}
                                        handleVenderClick={handleVenderClick}
                                    />
                                ) : (
                                    <>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-evenly",
                                                width: "100%",
                                                marginTop: "1rem",
                                            }}
                                        >
                                            <Button
                                                style={{ borderRadius: "0.5rem", background: "#69EAE2" }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: "#1F1D2B",
                                                        fontFamily: "Nunito",
                                                        fontSize: { xs: '10px', sm: "0.875rem" },
                                                        fontStyle: "normal",
                                                        fontWeight: 600,
                                                        lineHeight: "140%",
                                                    }}
                                                >
                                                    EN OFICINA
                                                </Typography>
                                            </Button>
                                            <Button
                                                variant='outlined'
                                                style={{ borderRadius: "0.5rem", borderColor: "#69EAE2" }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: "#69EAE2",
                                                        fontFamily: "Nunito",
                                                        fontSize: { xs: '10px', sm: "0.875rem" },
                                                        fontStyle: "normal",
                                                        fontWeight: 600,
                                                        lineHeight: "140%",
                                                    }}
                                                >
                                                    DOMICILIO
                                                </Typography>
                                            </Button>
                                            <>
                                                <Chip
                                                    label={
                                                        <Typography>
                                                            <span >#</span> {totalUnidades}
                                                        </Typography>
                                                    }
                                                    color="error" />
                                            </>
                                        </Box>
                                        <Box sx={{ height: "100%", marginTop: '20px' }}>
                                            <Box display={{ xs: 'flex', sm: "none" }}>
                                                <Paper
                                                    component='form'
                                                    onSubmit={(e: any) => {
                                                        e.preventDefault();
                                                        filteredData(e.target[0].value);
                                                    }}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        color: "#fff",
                                                        width: "25rem",
                                                        height: "2rem",
                                                        borderRadius: "0.3125rem",
                                                        background: "#2C3248",
                                                    }}
                                                >
                                                    <InputBase
                                                        sx={{
                                                            ml: 1,
                                                            flex: 1,
                                                            color: "#fff",
                                                        }}
                                                        placeholder='Buscar'
                                                        value={searchTerm}
                                                        onChange={(e) => {
                                                            setSearchTerm(e.target.value)
                                                        }}
                                                    />
                                                    <IconButton
                                                        sx={{
                                                            marginTop: "2px",
                                                            paddingTop: "0px",
                                                            marginBottom: "4px",
                                                            paddingBottom: "0px",
                                                        }}
                                                    >
                                                        <Box component={"img"} src={"/images/scan.svg"} />
                                                    </IconButton>
                                                </Paper>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    marginTop: "1.88rem",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: "var(--White, #FFF)",
                                                        fontFamily: "Nunito",
                                                        fontSize: { xs: '12px', sm: "1rem" },
                                                        fontStyle: "normal",
                                                        fontWeight: 600,
                                                        lineHeight: "140%",
                                                    }}
                                                >
                                                    Producto
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: "var(--White, #FFF)",
                                                        fontFamily: "Nunito",
                                                        fontSize: { xs: '12px', sm: "1rem" },
                                                        fontStyle: "normal",
                                                        fontWeight: 600,
                                                        lineHeight: "140%",
                                                        marginLeft: "100px",
                                                    }}
                                                >
                                                    Cantidad
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: "var(--White, #FFF)",
                                                        fontFamily: "Nunito",
                                                        fontSize: { xs: '12px', sm: "1rem" },
                                                        fontStyle: "normal",
                                                        fontWeight: 600,
                                                        lineHeight: "140%",
                                                        marginRight: "19px",
                                                    }}
                                                >
                                                    Precio
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ background: "#69EAE2" }} />
                                            <IncompleteCartItem setSelectedItems={setSelectedItems} />
                                            <Divider sx={{ background: "#69EAE2", marginTop: '10px' }} />
                                            <Box
                                                id='items-list'
                                                sx={{ maxHeight: "41%", overflowY: "auto", scrollBehavior: "smooth" }}
                                            >
                                                {selectedItems?.length === 0 ? (
                                                    <Typography
                                                        sx={{
                                                            color: "#69EAE2",
                                                            textAlign: "center",
                                                            fontFamily: "Nunito",
                                                            fontSize: "1rem",
                                                            fontStyle: "normal",
                                                            fontWeight: 500,
                                                            lineHeight: "140%",
                                                            marginTop: "2rem",
                                                        }}
                                                    >
                                                        AÑADE ITEMS A TU CARRITO
                                                    </Typography>
                                                ) : (
                                                    selectedItems?.map((product: any) => (
                                                        <React.Fragment key={product.barCode}>
                                                            <CartItems
                                                                product={product}
                                                                setSelectedItems={setSelectedItems}
                                                                selectedItems={selectedItems}
                                                            />
                                                        </React.Fragment>
                                                    ))
                                                )}
                                            </Box>
                                            <Divider
                                                sx={{ background: "#69EAE2", marginTop: "1.5rem" }}
                                            />
                                            <Box sx={{ marginTop: "0.8rem" }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "0.5rem",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: "#FFF",
                                                            textAlign: "center",
                                                            fontFamily: "Nunito",
                                                            fontSize: { xs: '14px', sm: "1rem" },
                                                            fontStyle: "normal",
                                                            fontWeight: 500,
                                                            lineHeight: "140%",
                                                        }}
                                                    >
                                                        SubTotal
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: "#FFF",
                                                            textAlign: "center",
                                                            fontFamily: "Nunito",
                                                            fontSize: { xs: '14px', sm: "1rem" },
                                                            fontStyle: "normal",
                                                            fontWeight: 500,
                                                            lineHeight: "140%",
                                                        }}
                                                    >
                                                        {`$ ${subtotal.toLocaleString("en-US")}`}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "0.5rem",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: "#FFF",
                                                            textAlign: "center",
                                                            fontFamily: "Nunito",
                                                            fontSize: { xs: '14px', sm: "1rem" },
                                                            fontStyle: "normal",
                                                            fontWeight: 500,
                                                            lineHeight: "140%",
                                                        }}
                                                    >
                                                        Costo de envío
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: "#FFF",
                                                            textAlign: "center",
                                                            fontFamily: "Nunito",
                                                            fontSize: { xs: '14px', sm: "1rem" },
                                                            fontStyle: "normal",
                                                            fontWeight: 500,
                                                            lineHeight: "140%",
                                                        }}
                                                    >
                                                        $ 0
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "0.5rem",
                                                    }}
                                                >
                                                    {agregarDescuento === false ? (
                                                        <Button
                                                            onClick={() => setAgregarDescuento(true)}
                                                            sx={{
                                                                color: "#69EAE2",
                                                                textAlign: "center",
                                                                fontFamily: "Nunito",
                                                                fontSize: { xs: '14px', sm: "1rem" },
                                                                fontStyle: "normal",
                                                                fontWeight: 500,
                                                                lineHeight: "140%",
                                                                textTransform: "none",
                                                            }}
                                                        >
                                                            Ingresar descuento
                                                            <ArrowDropDownIcon sx={{ color: "#69EAE2" }} />
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <Typography
                                                                sx={{
                                                                    color: "#FFF",
                                                                    textAlign: "center",
                                                                    fontFamily: "Nunito",
                                                                    fontSize: { xs: '14px', sm: "1rem" },
                                                                    fontStyle: "normal",
                                                                    fontWeight: 500,
                                                                    lineHeight: "140%",
                                                                }}
                                                            >
                                                                Descuento
                                                                <LightTooltip
                                                                    title='Puede ingresar el valor del descuento en porcentaje o pesos.'
                                                                    arrow
                                                                >
                                                                    <HelpIcon
                                                                        sx={{
                                                                            fontSize: "0.8rem",
                                                                            "&:hover": { color: "#69EAE2" },
                                                                        }}
                                                                    />
                                                                </LightTooltip>
                                                            </Typography>
                                                            {descuentoON ? (
                                                                <Typography
                                                                    sx={{
                                                                        color: "#69EAE2",
                                                                        textAlign: "center",
                                                                        fontFamily: "Nunito",
                                                                        fontSize: { xs: '14px', sm: "1rem" },
                                                                        fontStyle: "normal",
                                                                        fontWeight: 500,
                                                                        lineHeight: "90%",
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        sx={{
                                                                            paddingTop: "2px",
                                                                            paddingRight: "2px",
                                                                        }}
                                                                        onClick={() => {
                                                                            setDescuento(0);
                                                                            setDescuentoON(false);
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            component={"img"}
                                                                            src={"/images/edit.svg"}
                                                                            sx={{ width: "0.9rem", height: "0.9rem" }}
                                                                        />
                                                                    </IconButton>
                                                                    {`$ ${descuento.toLocaleString("en-US")}`}
                                                                </Typography>
                                                            ) : (
                                                                <InputBase
                                                                    autoFocus
                                                                    startAdornment={
                                                                        <InputAdornment position='start'>
                                                                            <IconButton
                                                                                sx={{ paddingRight: "0px" }}
                                                                                onClick={(event) => calcularTotal(event)}
                                                                            >
                                                                                <Typography
                                                                                    sx={{
                                                                                        color: "#69EAE2",
                                                                                        textAlign: "center",
                                                                                        fontFamily: "Nunito",
                                                                                        fontSize: "0.75rem",
                                                                                        fontStyle: "normal",
                                                                                        fontWeight: 500,
                                                                                        lineHeight: "140%",
                                                                                    }}
                                                                                >
                                                                                    APLICAR
                                                                                </Typography>
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    }
                                                                    value={inputValue}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChange(event)}
                                                                    sx={{ width: "9.75rem", height: "2.25rem" }}
                                                                    style={{
                                                                        borderRadius: "0.375rem",
                                                                        border: "1px solid #69EAE2",
                                                                        background: "#1F1D2B",
                                                                        color: "#FFF",
                                                                    }}
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </Box>
                                            </Box>
                                            <Divider
                                                sx={{ background: "#69EAE2", marginTop: "1rem" }}
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    marginTop: "0.6rem",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: "#FFF",
                                                        textAlign: "center",
                                                        fontFamily: "Nunito",
                                                        fontSize: { xs: '14px', sm: "1rem" },
                                                        fontStyle: "normal",
                                                        fontWeight: 500,
                                                        lineHeight: "140%",
                                                    }}
                                                >
                                                    Total
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: "#FFF",
                                                        textAlign: "center",
                                                        fontFamily: "Nunito",
                                                        fontSize: { xs: '14px', sm: "1rem" },
                                                        fontStyle: "normal",
                                                        fontWeight: 500,
                                                        lineHeight: "140%",
                                                    }}
                                                >
                                                    {`$ ${(subtotal - descuento).toLocaleString("en-US")}`}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                                                <Button
                                                    disabled={((descuento > subtotal) || subtotal === 0) ? true : false}
                                                    onClick={() => setNextStep(true)}
                                                    style={{
                                                        borderRadius: "0.5rem",
                                                        background: (descuento > subtotal || subtotal === 0) ? "gray" : "#69EAE2",
                                                        width: "7rem",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: "#1F1D2B",
                                                            fontFamily: "Nunito",
                                                            fontSize: "0.875rem",
                                                            fontStyle: "normal",
                                                            fontWeight: 600,
                                                            lineHeight: "140%",
                                                        }}
                                                    >
                                                        HECHO
                                                    </Typography>
                                                </Button>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </SwipeableDrawer >
        </Box >
    )
}

export default SlidebarVender