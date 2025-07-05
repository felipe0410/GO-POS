"use client";
import Header from "@/components/Header";
import {
    Autocomplete,
    Box,
    Button,
    IconButton,
    Pagination,
    Paper,
    TextField,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    getAllProductsDataonSnapshot,
} from "@/firebase";
import VenderCards from "@/components/VenderCards";
import SearchInput from "@/app/vender/Normal/SearchInput";
import SlidebarGastrobar from "./SlidebarGastrobar";
import { agregarNuevaFactura, getDataFromLocalStorage, saveDataToLocalStorage, updateSelectedItems } from "./utils/facturaHelpers";
import { isEqual } from "lodash";

interface Props {
    mesa: any;
}

const VenderGastrobar: any = ({ mesa }: Props) => {
    const [data, setData] = useState<undefined | any[]>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setfilter] = useState<any>();
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [load, setLoad] = useState(0);
    const [facturas, setFacturas] = useState<
        { id: string; name: string; items: any[] }[]
    >([{ id: mesa?.nombre || "mesa-desconocida", name: mesa?.nombre || "Mesa sin nombre", items: [] }]);
    console.log('facturas:::>', facturas,)
    const [facturaActiva, setFacturaActiva] = useState(mesa?.nombre || "mesa-desconocida");
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const facturaKey = `${mesa?.nombre}`;


    const categories = useMemo(() => {
        const allCategories = data?.map((item) => item.category) || [];
        const unique = [...new Set(allCategories)];
        return unique;
    }, [data]);

    const filteredData = async (
        event: any,
        removeCategoryFilter: boolean = false
    ) => {
        try {
            let value2 = event.trim();
            value2 = value2.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const resolvedData = await data;

            if (removeCategoryFilter) {
                setSelectedCategory(null);
            }

            const filterSearch: any = resolvedData?.filter((item) => {
                if (searchTerm === "") {
                    if (!selectedCategory) {
                        return true;
                    }
                    return item.category === selectedCategory;
                } else {
                    return Object.values(item).some((value) =>
                        String(value).toLowerCase().includes(value2.toLowerCase())
                    );
                }
            });

            setfilter(filterSearch);
            const foundProducts = resolvedData?.filter(
                (producto) => producto.barCode === value2
            );

            if (foundProducts?.length === 1) {
                const cleanedPrice = Number(
                    foundProducts[0].price.replace(/[$,]/g, "")
                );
                const newItem = {
                    ...foundProducts[0],
                    acc: cleanedPrice,
                    cantidad: 1,
                };

                setFacturas((prevFacturas) =>
                    prevFacturas.map((factura) =>
                        factura.id === facturaActiva
                            ? {
                                ...factura,
                                items: updateSelectedItems(factura.items, newItem),
                            }
                            : factura
                    )
                );

                setSearchTerm("");
            } else {
                if (searchTerm.length > 0) {
                    const audio = new Audio("/error-beep.mp3");
                    audio.play();
                }
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        filteredData("");
    };

    const handleResetFilter = () => {
        setSelectedCategory(null);
        setSearchTerm("");
        filteredData("");
    };

    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDataPage = filter?.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filter?.length / itemsPerPage);


    useEffect(() => {
        filteredData("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, selectedCategory]);
    useEffect(() => {
        const getAllProducts = async () => {
            try {
                await getAllProductsDataonSnapshot(setData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getAllProducts();
    }, []);
    useEffect(() => {
        if (selectedItems?.length > 0) {
            saveDataToLocalStorage("selectedItems", selectedItems);
        }
    }, [selectedItems]);

    useEffect(() => {
        const localStorageSelectedItems = getDataFromLocalStorage("selectedItems");
        if (localStorageSelectedItems?.length > 0) {
            setSelectedItems(localStorageSelectedItems);
        }
    }, []);

    useEffect(() => {
        filteredData("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                await getAllProductsDataonSnapshot(setData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getAllProducts();
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const productosFacturaActiva =
        facturas.find((factura) => factura.id === facturaActiva)?.items || [];


    useEffect(() => {
        setLoad((prev) => prev + 1);
        //if (load > 0) {
        //   localStorage.setItem("facturas", JSON.stringify(facturas));
        //}
        if (facturas.length === 0) {
            agregarNuevaFactura(facturas);
        }
        const facturaExiste = facturas.some(
            (factura) => factura.id === facturaActiva
        );
        if (!facturaExiste) {
            setFacturaActiva(facturas[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const cachedFacturas = localStorage.getItem(facturaKey);
        if (cachedFacturas) {
            setFacturas(JSON.parse(cachedFacturas));
        }
    }, [facturaKey]);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const cachedFacturaStr = localStorage.getItem(`factura-${facturaActiva}`);
        const facturaMesa = facturas.find(f => f.id === facturaActiva);

        if (!facturaMesa) return;

        if (isFirstRender.current) {
            isFirstRender.current = false;

            if (cachedFacturaStr) {
                const cachedFactura = JSON.parse(cachedFacturaStr);

                if (cachedFactura?.items && Array.isArray(cachedFactura.items)) {
                    // En el primer render, si hay factura en cache, la usamos
                    console.log("Seteando factura desde cache");
                    setFacturas(prev =>
                        prev.map(f =>
                            f.id === facturaActiva ? { ...f, items: cachedFactura.items } : f
                        )
                    );
                }
            }

            return;
        }

        // A partir del segundo render: si los items cambiaron, actualizamos el cache
        const cachedFactura = cachedFacturaStr ? JSON.parse(cachedFacturaStr) : null;

        if (!isEqual(facturaMesa.items, cachedFactura?.items)) {
            console.log("Actualizando cache...");
            localStorage.setItem(`factura-${facturaActiva}`, JSON.stringify(facturaMesa));
        }
    }, [facturas, facturaActiva]);


    useEffect(() => {
        const cachedFacturas = localStorage.getItem(facturaKey);
        if (cachedFacturas) {
            setFacturas(JSON.parse(cachedFacturas));
        }
        setFacturaActiva(facturaKey);
    }, [facturaKey, mesa?.nombre]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                height: "80%",
                marginLeft: "10px",
            }}
        >
            <Box
                id="conainer_vender"
                sx={{ width: { xs: "100%", lg: "calc(100% - 23rem)" } }}
            >
                <Header title={"TOMA DE PEDIDO" + ' ' + (mesa?.nombre ?? 'sin mesa')} />
                <Paper
                    id={"paper"}
                    sx={{ width: "95%", height: "100%", marginTop: "1rem" }}
                    style={{
                        borderRadius: "0.625rem",
                        background: "#1F1D2B",
                        boxShadow: "0px 1px 100px -50px #69EAE2",
                    }}
                >
                    <Box
                        sx={{
                            padding: "40px 48px",
                            height: { xs: "92%", sm: "99%" },
                            textAlign: "-webkit-center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box
                                display={"flex"}
                                sx={{
                                    width: "85%",
                                }}
                            >
                                <Paper
                                    component="form"
                                    onSubmit={(e: any) => {
                                        e.preventDefault();
                                        filteredData(e.target[1].value);
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
                                    <IconButton
                                        type="button"
                                        sx={{ p: "10px" }}
                                        aria-label="search"
                                    >
                                        <SearchIcon sx={{ color: "#fff" }} />
                                    </IconButton>
                                    <SearchInput
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
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
                            <Box>

                            </Box>
                            <Button
                                onClick={handleResetFilter}
                                sx={{
                                    padding: "8px",
                                    textAlign: "center",
                                    backgroundColor: "#69EAE2",
                                    color: "#1F1D2B",
                                    border: "1px solid #69EAE2",
                                    borderRadius: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 10px",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                    fontSize: { xs: "8px", sm: "12px" },
                                    "&:hover": {
                                        backgroundColor: "#69EAE2",
                                        color: "#1F1D2B",
                                        opacity: "70%",
                                    },
                                }}
                            >
                                RESTABLECER
                            </Button>
                        </Box>
                        <Autocomplete
                            options={categories}
                            value={selectedCategory}
                            onChange={(event, newValue) => {
                                handleCategorySelect(newValue ?? "");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Selecciona una categoría"
                                    variant="outlined"
                                    sx={{
                                        marginTop: 2,
                                        marginBottom: 2,
                                        input: { color: "white" },
                                        label: { color: "#69EAE2" },
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#69EAE2",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#69EAE2",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#69EAE2",
                                            },
                                        },
                                    }}
                                />
                            )}
                            sx={{ width: "100%", color: "white" }}
                        />
                        <Box sx={{ marginTop: { sm: "0" }, height: "70%" }}>


                            <VenderCards
                                filteredData={currentDataPage}
                                setSelectedItems={setFacturas}
                                selectedItems={productosFacturaActiva}
                                facturaActiva={facturaActiva}
                            />
                            <Box
                                id="pagination"
                                sx={{
                                    filter: "invert(1)",
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                    width: { xs: "115%", sm: "100%" },
                                    marginLeft: { xs: "-15px", sm: "0" },
                                }}
                            >
                                <Pagination
                                    sx={{ color: "#fff" }}
                                    onChange={(e, page) => setCurrentPage(page)}
                                    count={totalPages}
                                    shape="circular"
                                    size={matches ? "large" : "small"}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <SlidebarGastrobar
                selectedItems={productosFacturaActiva}
                setSelectedItems={setFacturas}
                searchTerm={searchTerm}
                filteredData={filteredData}
                setSearchTerm={setSearchTerm}
                typeInvoice={'invoice'}
                facturaActiva={facturaActiva}
                mesa={mesa?.nombre}
            />
        </Box>
    );
};

export default VenderGastrobar;
