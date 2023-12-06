"use client";
import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { usePathname } from "next/navigation";
import { Button } from "@mui/material";
import Link from "next/link";

const drawerWidth = 196;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc( 104px + 1px)`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState(null);
  const pathname = usePathname();

  const sections = [
    {
      section: "INICIO",
      icon: "/images/home.svg",
      icon2: "/images/homeSelected.svg",
      id: "/home",
    },
    {
      section: "VENDER",
      icon: "/images/vender.svg",
      icon2: "/images/venderSelected.svg",
      id: "/Shipments",
    },
    {
      section: "CAJA",
      icon2: "/images/cajaSelected.svg",
      icon: "/images/caja.svg",
      id: "/TableShipments",
    },
    {
      section: "INVENTARIO",
      icon: "/images/inventario.svg",
      icon2: "/images/inventarioSelected.svg",
      id: "/inventory",
      submenus: [
        {
          section: "PRIMERA RUTA",
          id: "/inventory/productos",
        },
        {
          section: "SEGUNDA RUTA",
          id: "/inventory/agregarProductos",
        },
        {
          section: "TERCERA RUTA",
          id: "/inventory/historial",
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
    return pathname.startsWith(section)
  }
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant='permanent'
        open={open}
        PaperProps={{
          style: {
            background: "transparent",
            border: "none",
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
          <Divider />
          {sections.map((section) => (
            <React.Fragment key={section.id}>
              <Box sx={{
                marginY: "30px",
                background: validation(section.id) ? '#252836' : 'transparent',
                marginLeft: '12px',
                padding: '12px',
                borderRadius: "12px 0 0 12px",
              }} >
                <Link
                  href={section.id}
                  style={{ textDecoration: "none", color: "#1F1D2B" }}
                >
                  <ListItem
                    sx={{
                      width: open ? '100%' : '70%',
                      padding: '5px',
                      marginLeft: "5px",
                      borderRadius: "0.5rem",
                      background: validation(section.id) ? "#69EAE2" : 'auto',
                      boxShadow: validation(section.id) ? '0px 8px 24px 0px rgba(105, 234, 226, 0.34)' : 'auto'
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "0.5rem",
                        padding: '0px',
                        display: 'flex'
                      }}
                      onClick={() => handleSectionClick(section.id)}
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
                            pathname.startsWith(section.id)
                              ? section.icon2
                              : section.icon
                          }
                        />
                      </ListItemIcon>
                    </Box>
                    <ListItemText
                      primary={section.section}
                      primaryTypographyProps={{
                        color: !validation(section.id) ? "#69EAE2" : 'auto',
                        fontFamily: "Nunito",
                        fontSize: "0.875rem",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "normal",
                        marginLeft: '10px'
                      }}
                      sx={{
                        opacity: open ? 1 : 0,
                      }}
                    />
                  </ListItem>
                </Link>
                {(open && section.submenus && selectedSection === section.id) && (
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
                              color: validation(submenu.id) ? '#69EAE2' : "#fff",
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
          <Box
            sx={{
              marginLeft: "15px",
            }}
          >
            <Link
              href={"/"}
              style={{ textDecoration: "none", color: "#1F1D2B" }}
            >
              <Button
                sx={{
                  textAlign: "start",
                  paddingLeft: "23px",
                  mb: "30px",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                  }}
                >
                  <Box component={"img"} src={"/images/settings.svg"} />
                </ListItemIcon>
              </Button>
            </Link>
          </Box>
          <Box sx={{ textAlign: "start", paddingLeft: "25px" }}>
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
          </Box>
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
            </Button>
          </Box>
        </List>
      </Drawer>
    </Box>
  );
}