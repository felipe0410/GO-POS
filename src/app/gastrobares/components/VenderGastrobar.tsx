"use client";
import Header from "@/components/Header";
import {
    Autocomplete,
    Box,
    Button,
    Pagination,
    Paper,
    TextField,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
    getAllProductsDataonSnapshot,
} from "@/firebase";
import VenderCards from "@/components/VenderCards";
import SlidebarGastrobar from "./SlidebarGastrobar";
import { updateSelectedItems } from "./utils/facturaHelpers";
import { useFacturas } from "./hooks/useFacturas";
import SearchBar from "./SearchBar";
import TransferirPedidoDialog from "./TransferirPedidoDialog";

interface Props {
    mesa: any;
    todasLasMesas: any[];
    onChangeMesa: (nuevaMesa: any) => void;
}

const VenderGastrobar: any = ({ mesa, todasLasMesas, onChangeMesa }: Props) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [filter, setFilter] = useState<any>();
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogTransferOpen, setDialogTransferOpen] = useState(false);
    const { facturas, setFacturas, facturaActiva, productosFacturaActiva, setFacturaActiva } = useFacturas(mesa);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(filter?.length / itemsPerPage);

    const handleResetFilter = () => {
        setSelectedCategory(null);
        setSearchTerm("");
        filteredData("");
    };

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

            setFilter(filterSearch);
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

                setFacturas((prevFacturas: any[]) =>
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
    useEffect(() => {
        getAllProductsDataonSnapshot(setData);
    }, []);

    useEffect(() => {
        handleFilter("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, selectedCategory]);

    const categories = useMemo(() => {
        return [...new Set(data?.map((item) => item.category) || [])];
    }, [data]);

    const handleFilter = async (term: string, removeCategory = false) => {
        let clean = term.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (removeCategory) setSelectedCategory(null);
        const filtered = data.filter(item =>
            !term
                ? !selectedCategory || item.category === selectedCategory
                : Object.values(item).some(value => String(value).toLowerCase().includes(clean.toLowerCase()))
        );

        setFilter(filtered);

        const exact = data.find(p => p.barCode === clean);
        if (exact) {
            const price = Number(exact.price.replace(/[$,]/g, ""));
            const newItem = { ...exact, acc: price, cantidad: 1 };
            setFacturas((prev: any) =>
                prev.map((f: { id: any; items: any[]; }) =>
                    f.id === facturaActiva
                        ? { ...f, items: updateSelectedItems(f.items, newItem) }
                        : f
                )
            );
            setSearchTerm("");
        }
    };

    const currentDataPage = useMemo(() => {
        const start = (currentPage - 1) * 12;
        return filter?.slice(start, start + 12);
    }, [filter, currentPage]);


    useEffect(() => {
        const transferenciaStr = localStorage.getItem("transferencia_mesa");

        if (transferenciaStr) {
            const transferencia = JSON.parse(transferenciaStr);

            // Solo acepta la transferencia si es para esta mesa
            if (transferencia?.id === mesa.id || transferencia?.mesa === mesa.nombre) {
                setFacturas((prev) => [...prev, transferencia]);
                setFacturaActiva(transferencia.id);

                // 🔁 Guarda correctamente en localStorage para persistencia
                localStorage.setItem(`factura_mesa_${mesa.id}`, JSON.stringify(transferencia));

                // ❌ Borra la transferencia temporal
                localStorage.removeItem("transferencia_mesa");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mesa?.id, mesa?.nombre]);



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
                <Header title={"PEDIDO" + ' ' + (mesa?.nombre ?? 'sin mesa')} txt={
                    <Box sx={{display:'flex'}}>
                        <Box >
                            <Button
                                onClick={() => setDialogTransferOpen(true)}
                                sx={{
                                    padding:'10px',
                                    backgroundColor: "#69EAE2",
                                    color: "#1F1D2B",
                                    ml: 2,
                                    height: "40px",
                                    width:'200px',
                                    borderRadius: "10px",
                                    fontWeight: 700,
                                    "&:hover": { opacity: 0.8, backgroundColor: "#69EAE2" },
                                }}
                            >
                                Transferir pedido
                            </Button>
                        </Box>
                        <Autocomplete
                            options={todasLasMesas || []}
                            getOptionLabel={(option) => option?.nombre || ""}
                            value={mesa}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    onChangeMesa(newValue);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cambiar de mesa"
                                    variant="outlined"
                                    sx={{
                                        marginBottom: 2,
                                        width: '150px',
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
                            sx={{ width: "100%", color: "white", marginLeft: '20px' }}
                        />

                    </Box>
                } />
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
                                <SearchBar
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    onSubmit={(e: any) => {
                                        e.preventDefault();
                                        filteredData(e.target[1].value);
                                    }}
                                />

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
                                setSelectedCategory(newValue ?? null);
                                handleFilter(searchTerm);
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
            <TransferirPedidoDialog
                open={dialogTransferOpen}
                onClose={(mesaDestino) => {
                    setDialogTransferOpen(false);
                    if (!mesaDestino || !facturaActiva) return;

                    const facturaActualStr = localStorage.getItem(`factura-${mesa.nombre}`);
                    const facturaActual = facturaActualStr ? JSON.parse(facturaActualStr) : null;

                    if (!facturaActual) {
                        return;
                    }

                    const nuevaFactura = {
                        ...facturaActual,
                        id: mesaDestino.id,
                        name: mesaDestino.nombre,
                    };

                    // 🔄 Paso 1: Limpiar destino y guardar nueva factura
                    localStorage.removeItem(`factura-${mesaDestino.nombre}`);
                    setTimeout(() => {
                        onChangeMesa(mesaDestino);
                    }, 1000);
                    localStorage.setItem(`factura-${mesaDestino.nombre}`, JSON.stringify(nuevaFactura));
                    // 🔄 Paso 2: Eliminar factura anterior
                    localStorage.removeItem(`factura-${mesa.nombre}`);
                    // 🔄 Paso 3: Actualizar estado en memoria
                    setFacturas((prev) =>
                        [...prev.filter((f) => f.id !== facturaActual.id), nuevaFactura]
                    );
                    // ✅ Paso 4: Esperar antes de cambiar de mesa
                }}
                mesas={todasLasMesas}
                mesaActual={mesa}
            />

        </Box>
    );
};


export default VenderGastrobar;
