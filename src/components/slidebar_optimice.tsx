// Sidebar.tsx
"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    CssBaseline,
    SwipeableDrawer,
    Typography,
    useMediaQuery,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { GlobalContext } from "@/app/globalContex";
import { gastrobarSections, localSections } from "./sections";
import { getDianRecord } from "@/firebase/dian";
import { getModules } from "@/firebase/settingsModules";
import SidebarSectionList from "./components_slidebar/SidebarSectionList";
import SidebarHeader from "./components_slidebar/SidebarHeader";
import SidebarFooter from "./components_slidebar/SidebarFooter";

interface SidebarProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    const [modulesLoaded, setModulesLoaded] = useState(false);
    const { removeCookieUser } = useContext(GlobalContext) || {};
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [dataUser, setDataUser] = useState<any>(null);
    const [sections, setSections] = useState<any[]>([]);
    const pathname = usePathname();
    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

    const permissions = useMemo(() => {
        return dataUser?.status === "admin"
            ? ["Vender", "Inventario", "Caja", "Directorio", "PEDIDOS", "ZONAS", "COCINA", "PAGAR"]
            : dataUser?.jobs ?? [];
    }, [dataUser]);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const handleSectionClick = (sectionId: any) => {
        if (selectedSection === sectionId) {
            setSelectedSection('');
        } else {
            setSelectedSection(sectionId);
        }
    };

    const slice = (rutaCompleta: any) => {
        const primeraBarra = rutaCompleta.indexOf("/");
        const ultimaBarra = rutaCompleta.lastIndexOf("/");
        const rutaRecortada = rutaCompleta.substring(primeraBarra, ultimaBarra);
        return rutaRecortada;
    };

    const validation = (section: string) => {
        return pathname.startsWith(section);
    };
    useEffect(() => {
        setSelectedSection(pathname);
        matchesSM ? setOpen(false) : setOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const loadSections = async () => {
            try {
                let attempts = 0;
                const maxAttempts = 2;
                let userBase64 = "";

                while (attempts < maxAttempts) {
                    userBase64 = localStorage.getItem("user") ?? "";
                    if (userBase64) break;
                    attempts++;
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                if (!userBase64) return;

                const correctedBase64String = userBase64.replace(/%3D/g, "=");
                let dianRecord = JSON.parse(localStorage.getItem("dianRecord") ?? "null");

                if (!dianRecord) {
                    dianRecord = await getDianRecord();
                    if (dianRecord) {
                        localStorage.setItem("dianRecord", JSON.stringify(dianRecord));
                    }
                }

                if (dianRecord) {
                    setSections(prevSections => {
                        const updatedSections = prevSections.map((section) => {
                            if (section.section === "VENDER") {
                                return {
                                    ...section,
                                    submenus: [
                                        ...(section.submenus || []),
                                        { section: "DIAN", id: "/vender/Dian" },
                                    ],
                                };
                            }
                            return section;
                        });
                        return updatedSections;
                    });
                }
            } catch (error) {
                console.error("Error cargando configuración DIAN:", error);
            }
        };

        if (modulesLoaded) {
            //loadSections(); // ✅ solo se ejecuta cuando los módulos ya están cargados
        }
    }, [modulesLoaded]); // ✅ dependencia clara


    useEffect(() => {
        const initSidebar = async () => {
            try {
                const cachedModules = localStorage.getItem("modulesCache");
                const cacheTTL = localStorage.getItem("modulesCacheTTL");
                const isCacheValid = cachedModules && cacheTTL && Date.now() < Number(cacheTTL);

                let modules = null;

                if (isCacheValid) {
                    try {
                        modules = JSON.parse(cachedModules ?? "");
                    } catch (e) {
                        console.warn("Error al parsear el cache de módulos:", e);
                    }
                }

                if (!modules) {
                    modules = await getModules();
                }

                if (!isCacheValid && modules) {
                    localStorage.setItem("modulesCache", JSON.stringify(modules));
                    localStorage.setItem("modulesCacheTTL", String(Date.now() + 5 * 60 * 1000));
                }

                const selectedSections =
                    modules?.solution_restaurant === "true" ? gastrobarSections : localSections;
                setSections(selectedSections);
                setModulesLoaded(true); // ✅ Solo cuando se setean las secciones base
            } catch (error) {
                console.error("Error cargando módulos:", error);
                setSections(localSections);
                setModulesLoaded(true);
            }
        };

        initSidebar();
    }, []);



    useEffect(() => {
        const userData = localStorage?.getItem("dataUser");
        if (userData) setDataUser(JSON.parse(userData));
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Button sx={{ paddingTop: "20px" }} onClick={handleDrawerOpen}>
                <MenuRoundedIcon sx={{ color: "#69EAE2", fontSize: "35px" }} />
            </Button>
            <SwipeableDrawer
                id="Drawer"
                variant={matchesSM ? "persistent" : "permanent"}
                anchor="left"
                open={open}
                onClose={handleDrawerClose}
                onOpen={handleDrawerOpen}
                PaperProps={{
                    style: {
                        background: '#1f1d2b',
                        border: "none",
                        width: !open ? "100px" : "auto",
                        minWidth: open ? "160px" : "auto",
                    },
                }}
            >
                <SidebarHeader open={open} onClose={handleDrawerClose} onOpen={handleDrawerOpen} />
                <SidebarSectionList
                    sections={sections}
                    open={open}
                    selectedSection={selectedSection}
                    pathname={pathname}
                    onSectionClick={handleSectionClick}
                    slice={slice}
                    validation={validation}
                />
                <SidebarFooter
                    open={open}
                    onLogout={async () => {
                        try {
                            await removeCookieUser();
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                />
            </SwipeableDrawer>
        </Box>
    );
};

export default Sidebar;
