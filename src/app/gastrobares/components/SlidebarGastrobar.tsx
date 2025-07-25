import {
    Box,
    IconButton,
    SwipeableDrawer,
    Badge,
    BadgeProps,
    styled,
    useMediaQuery,
    useTheme,
    Typography,
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Mark from "mark.js";
import ProductList from "@/app/vender/SlidebarVender/ProductList";
import { createInvoice, getNextInvoiceNumber } from "@/firebase";
import NoteSection from "@/app/vender/SlidebarVender/NoteSection";
import SearchSection from "@/app/vender/SlidebarVender/SearchSection";
import Header from "./Header";
import TotalSectionGastrobar from "./TotalSectionGastrobar";
import Confirmar from "./confirmarpedido";
import OrdenCocina from "./OrdenCocina";
import LinearProgress from "@mui/material/LinearProgress";


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
    const [mostrarOrden, setMostrarOrden] = useState(false)
    const [descuento, setDescuento] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [nota, setNota] = useState("");
    const [checked, setChecked] = useState<boolean>(false);
    const [nextInvoiceNumber, setNextInvoiceNumber] = useState({
        lastNumber: "00001",
        nextNumber: "00002"
    })
    const [numeroFacturaCreada, setNumeroFacturaCreada] = useState<string | null>(null);
    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
    useEffect(() => {
        matchesSM ? setChecked(false) : setChecked(true);
    }, [matchesSM]);

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
        const createInvoiceLocal = async () => {
            try {
                setLoading(true); // 🔥 Activa el progress bar
                if (nextInvoiceNumber?.nextNumber) {
                    await createInvoice(nextInvoiceNumber.nextNumber, {
                        compra: [...selectedItems],
                        orden_preparada: false,
                        mesa: facturaActiva,
                        nota: nota,
                        status: "PENDIENTE",
                        invoice: nextInvoiceNumber.nextNumber,
                        subtotal: subtotal,
                        total: subtotal
                    });
                    setMostrarOrden(true);
                    setSelectedItems([]);
                    setNumeroFacturaCreada(nextInvoiceNumber.nextNumber);
                    localStorage.setItem(`factura-${facturaActiva}`, JSON.stringify([]));
                } else {
                    console.warn("No hay número de factura disponible aún.");
                }
            } catch (error) {
                console.error("Error al crear factura:", error);
            } finally {
                setLoading(false);
            }
        };

        if (reciboPago) {
            createInvoiceLocal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reciboPago]);

    const fetchNextInvoiceNumber = async () => {
        try {
            const data = await getNextInvoiceNumber();
            setNextInvoiceNumber(data);
        } catch (error) {
            console.error("Error al obtener número de factura:", error);
        }
    };
    useEffect(() => {
        fetchNextInvoiceNumber();
    }, [loading]);



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
                        nuemro_factura={String(nextInvoiceNumber?.nextNumber || "0000000")}
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
                        {loading && (
                            <Box sx={{ width: "100%", p: 2 }}>
                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        fontSize: "1.2rem",
                                        fontWeight: 700,
                                        mb: 1,
                                        filter: 'invert(1)'
                                    }}
                                >
                                    Generando factura...
                                </Typography>
                                <LinearProgress variant="buffer" />
                            </Box>
                        )}

                        {mostrarOrden ? (
                            <OrdenCocina
                                setNextStep={() => {
                                    setNextStep(false)
                                    setReciboPago(false)
                                    setMostrarOrden(false)
                                    setNumeroFacturaCreada(null);
                                }}
                                typeInvoice={typeInvoice}
                                facturaActiva={facturaActiva}
                                numeroFactura={(numeroFacturaCreada ?? '1')}
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
