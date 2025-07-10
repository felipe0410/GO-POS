import {
    Box,
    IconButton,
    SwipeableDrawer,
    Badge,
    BadgeProps,
    styled,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Mark from "mark.js";
import ProductList from "@/app/vender/SlidebarVender/ProductList";
import { createInvoice, getAllInvoicesData, getNextInvoiceNumber } from "@/firebase";
import NoteSection from "@/app/vender/SlidebarVender/NoteSection";
import SearchSection from "@/app/vender/SlidebarVender/SearchSection";
import Header from "@/app/vender/SlidebarVender/Header";
import TotalSectionGastrobar from "./TotalSectionGastrobar";
import Confirmar from "./confirmarpedido";
import OrdenCocina from "./OrdenCocina";

const SlidebarGastrobar = ({
    selectedItems,
    setSelectedItems,
    searchTerm,
    filteredData,
    setSearchTerm,
    typeInvoice,
    facturaActiva,
    mesa
}: {
    selectedItems: any;
    setSelectedItems: any;
    searchTerm: any;
    filteredData: any;
    setSearchTerm: any;
    typeInvoice: string;
    facturaActiva: any;
    mesa: any
}) => {
    const [search, setSearch] = useState<any>("");
    const [open, setOpen] = useState(false);
    const [nextStep, setNextStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reciboPago, setReciboPago] = useState(false);
    const [descuento, setDescuento] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [dataInvoice, setDataInvoice] = useState([]);
    const [nota, setNota] = useState("");
    const [checked, setChecked] = useState<boolean>(false);

    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
    useEffect(() => {
        getAllInvoicesData(setDataInvoice);
        matchesSM ? setChecked(false) : setChecked(true);
    }, [matchesSM]);

    console.log('getNextInvoiceNumber::>', getNextInvoiceNumber())

    useEffect(() => {
        const nuevoSubtotal = (selectedItems ?? []).reduce(
            (total: number, producto: { acc: number }) => total + producto.acc,
            0
        );
        setSubtotal(nuevoSubtotal);
    }, [selectedItems]);

    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        "& .MuiBadge-badge": {
            right: -3,
            top: 13,
            padding: "0 4px",
        },
    }));

    const totalUnidades = useMemo(() => {
        return selectedItems?.reduce(
            (sum: number, item: any) => sum + item.cantidad,
            0
        );
    }, [selectedItems]);

    const generarNumeroFactura = useCallback((): string => {
        const maxInvoiceNumber = dataInvoice.reduce((max: number, item: any) => {
            const currentInvoiceNumber = parseInt(item.invoice, 10);
            return currentInvoiceNumber > max ? currentInvoiceNumber : max;
        }, 0);
        return String(maxInvoiceNumber + 1).padStart(7, "0");
    }, [dataInvoice]);


    const storedContadorFactura = localStorage.getItem("contadorFactura");
    const initialContadorFactura = storedContadorFactura
        ? parseInt(storedContadorFactura, 10)
        : 1;

    const [contadorFactura, setContadorFactura] = useState(
        Math.max(initialContadorFactura, dataInvoice.length + 1)
    );

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = event.target.value;
        const context: any = document.querySelector("#items-list");
        const instance = new Mark(context);
        instance.unmark({
            done: () => {
                instance.mark(keyword);
            },
        });
        setSearch(keyword);
    };

    useEffect(() => {
        createInvoice(generarNumeroFactura(), { ...selectedItems, orden_preparada: false })
    }, [reciboPago])



    return (
        <Box display={"flex"}>
            <IconButton
                sx={{
                    position: "absolute",
                    top: "20px",
                    right: "30px",
                }}
                onClick={() => setOpen(true)}
                aria-label="cart"
            >
                <StyledBadge
                    badgeContent={totalUnidades}
                    sx={{ color: "#fff" }}
                    color="error"
                >
                    <ShoppingCartIcon />
                </StyledBadge>
            </IconButton>
            <SwipeableDrawer
                open={open}
                id="drawer"
                variant={matchesSM ? "persistent" : "permanent"}
                anchor="right"
                PaperProps={{
                    style: {
                        background: "transparent",
                        border: "none",
                        width: !matchesSM ? "510px" : "95%",
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
                        width: { xs: "100%", sm: "50%", lg: "24rem" },
                        borderRadius: "10px 0px 0px 10px",
                    }}
                >
                    <Header
                        setOpen={setOpen}
                        generarNumeroFactura={generarNumeroFactura}
                        totalUnidades={totalUnidades}
                    />
                    <Box
                        id="principal container"
                        padding={3}
                        sx={{
                            height: "92%",
                            width: "100%",
                            overflow: "auto",
                            "&::-webkit-scrollbar": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "#2C3248",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "gray",
                                borderRadius: "10px",
                                boxShadow: "0px 4px 4px 0px #00000040",
                            },
                        }}
                    >
                        {reciboPago ? (
                            <OrdenCocina
                                setNextStep={setNextStep}
                                typeInvoice={typeInvoice}
                                facturaActiva={facturaActiva}
                            />
                        ) : (
                            <>
                                <SearchSection
                                    search={search}
                                    setSearch={setSearch}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    handleSearch={handleSearch}
                                    filteredData={filteredData}
                                    checked={checked}
                                    setChecked={setChecked}
                                    matchesSM={matchesSM}
                                    setNextStep={setNextStep}
                                    nextStep={nextStep}
                                    descuento={descuento}
                                    subtotal={subtotal}
                                />
                                {nextStep ? (
                                    <>
                                        <Box sx={{ height: '135%' }}>
                                            <Confirmar
                                                selectedItems={selectedItems}
                                                setSelectedItems={setSelectedItems}
                                                facturaActiva={facturaActiva}
                                                nota={nota}
                                                mesaNombre={mesa}
                                            />
                                            <TotalSectionGastrobar
                                                subtotal={subtotal}
                                                descuento={descuento}
                                                setNextStep={() => setReciboPago(true)}
                                            />

                                        </Box>
                                    </>

                                ) : (
                                    <>
                                        <Box sx={{ height: '115%' }}>
                                            <ProductList
                                                selectedItems={selectedItems}
                                                setSelectedItems={setSelectedItems}
                                                facturaActiva={facturaActiva}
                                            />
                                            <NoteSection nota={nota} setNota={setNota} />
                                            <TotalSectionGastrobar
                                                subtotal={subtotal}
                                                descuento={0}
                                                setNextStep={setNextStep}
                                            />

                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </SwipeableDrawer>
        </Box>
    );
};

export default SlidebarGastrobar;
