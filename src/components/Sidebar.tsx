"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Button,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/app/globalContex";
import { gastrobarSections, localSections } from "./sections";
import { getDianRecord } from "@/firebase/dian";
import { getModules } from "@/firebase/settingsModules";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function Sidebar({
  open,
  setOpen,
}: {
  open: any;
  setOpen: any;
}) {
  const { removeCookieUser } = useContext(GlobalContext) || {};
  const [selectedSection, setSelectedSection] = React.useState<any>("");
  const [sections, setSections] = useState<any[]>([]);
  const pathname = usePathname();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const dataUser = JSON.parse(localStorage?.getItem("dataUser") ?? "{}");
  const permissions =
    dataUser?.status === "admin"
      ? ["Vender", "Inventario", "Caja", "Directorio", 'PEDIDOS', 'ZONAS', 'COCINA', 'PAGAR']
      : dataUser?.jobs ?? [];

  const permissionMap: any = {
    Vender: ["/vender", "/vender/Dian", "/vender/Normal", "/vender/Devolucion"],
    Inventario: [
      "/inventory/productos",
      "/inventory/agregarProductos",
      "inventory/stock",
    ],
    Caja: [
      "/register/invoices",
      "/register/dashboard",
      "/register/invoicesDian",
      '/register/dashboardProductos',
    ],
    Ajustes: [
      //"/settings/user",
      //"/settings/employees",
      "/settings/establisment",
      "/settings/dian",
    ],
    Directorio: ["/contacts/proveedores", "/contacts/clientes"],
    Contacts: [
      "/contacts/proveedores",
      "/contacts/clientes",
    ],
    //__________________gastrobares______________________
    PEDIDOS: [
      "/gastrobares/pedido",
    ],
    ZONAS: [
      "/gastrobares/zonas",
    ],
    COCINA: [
      "/gastrobares/cocina",
    ],
    PAGAR: [
      '/gastrobares/pagar'
    ]
  };

  const filterSectionsByPermissions = (sections: any, permissions: any) => {
    return sections.filter((section: any) => {
      if (section.section === "INICIO" || section.section === "PERFIL") {
        return true;
      }
      if (dataUser?.status === "admin" && section.section === "AJUSTES") {
        return true;
      }
      for (const permission of permissions) {
        if (
          permissionMap[permission] &&
          permissionMap[permission].includes(section.id)
        ) {
          return true;
        }
      }
      if (section.submenus) {
        section.submenus = section.submenus.filter((submenu: any) => {
          for (const permission of permissions) {
            if (
              permissionMap[permission] &&
              permissionMap[permission].includes(submenu.id)
            ) {
              return true;
            }
          }
          return false;
        });
        return section.submenus.length > 0;
      }

      return false;
    });
  };

  const sectionsWithDefaultSubsections = sections.map((section) => {
    if (
      section.section === "CAJA" &&
      section.submenus &&
      dataUser?.status !== "admin"
    ) {
      section.submenus = section.submenus.filter(
        (submenu: { section: string; }) => submenu.section === "FACTURAS"
      );
    }
    return section;
  });

  const filteredSections = filterSectionsByPermissions(
    sectionsWithDefaultSubsections,
    permissions
  );
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSectionClick = (sectionId: any) => {
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    } else {
      setSelectedSection(sectionId);
    }
  };
  const validation = (section: string) => {
    return pathname.startsWith(section);
  };

  React.useEffect(() => {
    setSelectedSection(pathname);
    matchesSM ? setOpen(false) : setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slice = (rutaCompleta: any) => {
    const primeraBarra = rutaCompleta.indexOf("/");
    const ultimaBarra = rutaCompleta.lastIndexOf("/");
    const rutaRecortada = rutaCompleta.substring(primeraBarra, ultimaBarra);
    return rutaRecortada;
  };
  const route = useRouter();

  useEffect(() => {
    const loadSections = async () => {
      try {
        let attempts = 0;
        const maxAttempts = 2;
        let userBase64 = "";

        // Intentar obtener el usuario hasta dos veces.
        while (attempts < maxAttempts) {
          userBase64 = localStorage.getItem("user") ?? "";
          if (userBase64) break; // Si el usuario está disponible, salir del bucle.

          console.warn(`Intento ${attempts + 1}: Usuario no disponible, esperando...`);
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperar 1 segundo entre intentos.
        }

        if (!userBase64) {
          console.error("Usuario no disponible después de varios intentos. Abortando operación.");
          return; // Abortar si el usuario sigue sin estar disponible.
        }

        const correctedBase64String = userBase64.replace(/%3D/g, "=");

        let cachedRecord = localStorage.getItem("dianRecord");
        let dianRecord = cachedRecord ? JSON.parse(cachedRecord) : null;

        // Rectificar si `dianRecord` es `null` después del intento inicial.
        if (!dianRecord) {
          console.warn("Registro DIAN no disponible o nulo. Intentando recuperarlo...");
          dianRecord = await getDianRecord();

          if (dianRecord) {
            console.log("Registro DIAN recuperado y rectificado:", dianRecord);
            localStorage.setItem("dianRecord", JSON.stringify(dianRecord));
          } else {
            console.error("No se pudo recuperar el registro DIAN.");
            return; // Salir si no se puede recuperar el registro DIAN.
          }
        }

        if (dianRecord) {
          const updatedSections = sections.map((section) => {
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
          setSections(updatedSections);
        }
      } catch (error) {
        console.error("Error cargando configuración DIAN:", error);
      }
    };

    loadSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const initSidebar = async () => {
      try {
        // Intentar cargar desde localStorage
        const cachedModules = localStorage.getItem("modulesCache");
        const cacheTTL = localStorage.getItem("modulesCacheTTL");

        const isCacheValid =
          cachedModules && cacheTTL && Date.now() < Number(cacheTTL);

        let modules;

        if (isCacheValid) {
          // 👌 Usar datos cacheados
          modules = JSON.parse(cachedModules);
        } else {
          // 📡 Hacer la petición y actualizar el cache
          modules = await getModules();
          localStorage.setItem("modulesCache", JSON.stringify(modules));

          // Establecer TTL de 5 minutos (puedes cambiarlo)
          const ttl = Date.now() + 5 * 60 * 1000; // 5 minutos
        }

        const selectedSections =
          modules?.solution_restaurant === "true"
            ? gastrobarSections
            : localSections;

        setSections(selectedSections);
      } catch (error) {
        console.error("Error cargando módulos:", error);
        setSections(localSections);
      }
    };

    initSidebar();
  }, []);


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Button sx={{ paddingTop: "20px" }} onClick={() => setOpen(true)}>
        <MenuRoundedIcon sx={{ color: "#69EAE2", fontSize: "35px" }} />
      </Button>
      <SwipeableDrawer
        id="Drawer"
        variant={matchesSM ? "persistent" : "permanent"}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          style: {
            background: "transparent",
            border: "none",
            width: !open ? "100px" : "auto",
            minWidth: open ? "160px" : "auto",
          },
        }}
      >
        <List
          sx={{
            background: "#1F1D2B",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Box>
            <Typography
              align="center"
              sx={{
                animation: "myAnim 2s ease 0s 1 normal forwards",
                color: "#FFF",
                textShadow: "0px 0px 20px #69EAE2",
                fontFamily: "Nunito",
                fontSize: open ? "3rem" : "2rem",
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "normal",
              }}
            >
              GO
            </Typography>
          </Box>
          <Box id="container_section">
            {filteredSections.map((section: any) => (
              <React.Fragment key={section.id}>
                <Box
                  sx={{
                    marginY: { sm: "5px" },
                    background:
                      selectedSection === section.id
                        ? "#252836"
                        : section?.submenus
                          ? selectedSection?.includes(slice(section.id))
                            ? "#252836"
                            : "transparent"
                          : "transparent",
                    marginLeft: "12px",
                    padding: "8px",
                    borderRadius: "12px 0 0 12px",
                    "&:hover": {
                      background: "#69eae214",
                    },
                  }}
                >
                  <Link
                    href={section.id}
                    style={{ textDecoration: "none", color: "#1F1D2B" }}
                  >
                    <ListItem
                      sx={{
                        width: open ? "100%" : "70%",
                        padding: "5px",
                        marginLeft: "5px",
                        borderRadius: "0.5rem",
                        background: selectedSection?.includes(section.id)
                          ? "#69EAE2"
                          : "auto",
                        boxShadow: selectedSection?.includes(section.id)
                          ? "0px 8px 24px 0px rgba(105, 234, 226, 0.34)"
                          : "auto",
                      }}
                      onClick={() => {
                        handleSectionClick(section.id);
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "0.5rem",
                          padding: "0px",
                          display: "flex",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            justifyContent: "center",
                            paddingLeft: "8px",
                          }}
                        >
                          {typeof (selectedSection?.includes(section.id)
                            ? section.icon2
                            : section.icon) === "string" ? (
                            <Box
                              component="img"
                              src={
                                selectedSection?.includes(section.id)
                                  ? section.icon2
                                  : section.icon
                              }
                              alt="icon"
                            />
                          ) : (
                            selectedSection?.includes(section.id)
                              ? section.icon2
                              : section.icon
                          )}
                        </ListItemIcon>
                      </Box>
                      <ListItemText
                        primary={section.section}
                        primaryTypographyProps={{
                          color: !selectedSection?.includes(section.id)
                            ? "#69EAE2"
                            : "auto",
                          fontFamily: "Nunito",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          marginLeft: "10px",
                        }}
                        sx={{
                          opacity: open ? 1 : 0,
                        }}
                      />
                    </ListItem>
                  </Link>

                  {open &&
                    section.submenus &&
                    selectedSection?.includes(slice(section.id)) && (
                      <List
                        id="subCategory"
                        sx={{
                          marginLeft: "15px",
                        }}
                      >
                        {section.submenus.map((submenu: any) => (
                          <Link
                            href={submenu.id}
                            key={submenu.id}
                            style={{ textDecoration: "none", color: "#1F1D2B" }}
                          >
                            <ListItem>
                              <ListItemText
                                primary={submenu.section}
                                primaryTypographyProps={{
                                  color: validation(submenu.id)
                                    ? "#69EAE2"
                                    : "#fff",
                                  fontFamily: "Nunito",
                                  fontSize: "14px",
                                  fontStyle: "normal",
                                  fontWeight: 700,
                                  lineHeight: "normal",
                                }}
                                sx={{
                                  "&:hover": {
                                    opacity: "80%",
                                  },
                                  opacity: open ? 1 : 0,
                                }}
                              />
                            </ListItem>
                          </Link>
                        ))}
                      </List>
                    )}
                </Box>
              </React.Fragment>
            ))}
          </Box>
          <DrawerHeader>
            {open ? (
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon
                  sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px" }}
                />
              </IconButton>
            ) : (
              <IconButton onClick={handleDrawerOpen}>
                <ChevronRightIcon
                  sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px" }}
                />
              </IconButton>
            )}
          </DrawerHeader>
          <Box
            sx={{
              marginTop: "100%",
              position: "absolute",
              bottom: "15px",
              marginLeft: "15px",
            }}
          >
            <Button
              sx={{
                textAlign: "start",
                paddingLeft: "20px",
              }}
              onClick={async () => {
                try {
                  await removeCookieUser("user", "", {
                    expires: new Date(0),
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  ml: "5px",
                  justifyContent: "center",
                }}
              >
                <Box component={"img"} src={"/images/logout.svg"} />
              </ListItemIcon>
              <ListItemText
                primary={"SALIR"}
                primaryTypographyProps={{
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                  marginLeft: "10px",
                }}
                sx={{
                  opacity: open ? 1 : 0,
                }}
              />
            </Button>
          </Box>
        </List>
      </SwipeableDrawer>
    </Box>
  );
}
