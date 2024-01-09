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
import { useContext } from "react";
import { GlobalContext } from "@/app/globalContex";

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
  const pathname = usePathname();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const sections = [
    {
      section: "INICIO",
      icon: "/images/home.svg",
      icon2: "/images/homeSelected.svg",
      id: "/",
    },
    {
      section: "VENDER",
      icon: "/images/vender.svg",
      icon2: "/images/venderSelected.svg",
      id: "/vender",
    },
    {
      section: "CAJA",
      icon2: "/images/cajaSelected.svg",
      icon: "/images/caja.svg",
      id: "/register/invoices",
      submenus: [
        {
          section: "FACTURAS",
          id: "/register/invoices",
        },
        {
          section: "Analiticas",
          id: "/register/dashboard",
        },
      ],
    },
    {
      section: "INVENTARIO",
      icon: "/images/inventario.svg",
      icon2: "/images/inventarioSelected.svg",
      id: "/inventory/productos",
      submenus: [
        {
          section: "PRODUCTOS",
          id: "/inventory/productos",
        },
        {
          section: "AGREGAR PRODUCTO",
          id: "/inventory/agregarProductos",
        },
        {
          section: "HISTORIAL",
          id: "/inventory/historial",
        },
      ],
    },
    {
      section: "AJUSTES",
      icon: "/images/settings.svg",
      icon2: "/images/inventarioSelected.svg",
      id: "/settings/user",
      submenus: [
        {
          section: "USUARIO",
          id: "/settings/user",
        },
        {
          section: "EMPLEADOS",
          id: "/settings/employees",
        },
        {
          section: "ESTABLECIMIENTO",
          id: "/settings/establishment",
        },
      ],
    },
  ];

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
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Button sx={{ paddingTop: "20px" }} onClick={() => setOpen(true)}>
        <MenuRoundedIcon sx={{ color: "#69EAE2", fontSize: "35px" }} />
      </Button>
      <SwipeableDrawer
        id='Drawer'
        variant={matchesSM ? "persistent" : "permanent"}
        anchor='left'
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          style: {
            background: "transparent",
            border: "none",
            width: !open ? "100px" : "auto",
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
              align='center'
              sx={{
                animation: "myAnim 2s ease 0s 1 normal forwards",
                color: "#FFF",
                textShadow: "0px 0px 20px #69EAE2",
                fontFamily: "Nunito",
                fontSize: open ? "3.75rem" : "3rem",
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "normal",
              }}
            >
              GO
            </Typography>
          </Box>
          {sections.map((section) => (
            <React.Fragment key={section.id}>
              <Box
                sx={{
                  marginY: { sm: "30px" },
                  background:
                    selectedSection === section.id
                      ? "#252836"
                      : section?.submenus
                        ? selectedSection?.includes(slice(section.id))
                          ? "#252836"
                          : "transparent"
                        : "transparent",
                  marginLeft: "12px",
                  padding: "12px",
                  borderRadius: "12px 0 0 12px",
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
                        <Box
                          component={"img"}
                          src={
                            selectedSection?.includes(section.id)
                              ? section.icon2
                              : section.icon
                          }
                        />
                      </ListItemIcon>
                    </Box>
                    <ListItemText
                      primary={section.section}
                      primaryTypographyProps={{
                        color: !selectedSection?.includes(section.id)
                          ? "#69EAE2"
                          : "auto",
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
                  </ListItem>
                </Link>

                {open &&
                  section.submenus &&
                  selectedSection?.includes(slice(section.id)) && (
                    <List
                      id='subCategory'
                      sx={{
                        marginLeft: "15px",
                      }}
                    >
                      {section.submenus.map((submenu) => (
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
                                fontSize: "0.875rem",
                                fontStyle: "normal",
                                fontWeight: 700,
                                lineHeight: "normal",
                              }}
                              sx={{
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
              bottom: "5px",
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
