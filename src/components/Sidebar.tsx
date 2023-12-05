"use client";
import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
  // [theme.breakpoints.up("sm")]: {
  //   width: `calc(${theme.spacing(8)} + 1px)`,
  // },
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
  const pathname = usePathname();

  const sections = [
    {
      section: "INICIO",
      icon: "/images/home.svg",
      id: "/",
    },
    {
      section: "VENDER",
      icon: "/images/vender.svg",
      id: "/Shipments",
    },
    {
      section: "CAJA",
      icon: "/images/caja.svg",
      id: "/TableShipments",
    },
    {
      section: "INVENTARIO",
      icon: "/images/inventario.svg",
      id: "/GenerateReport",
    },
  ];
  // style={{
  //   color: pathname.startsWith("/Shipments") ? "#0A0F37" : "#fff",
  // }}

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
          <DrawerHeader></DrawerHeader>
          <Divider />
          {sections.map((section: any) => (
            <Box sx={{ marginY: "30px" }} key={crypto.randomUUID()}>
              <Link
                href={section.id}
                style={{ textDecoration: "none", color: "#1F1D2B" }}
              >
                <ListItem
                  sx={{
                    marginLeft: "15px",
                    background:
                      section.id === "/"
                        ? pathname === "/"
                          ? "#252836"
                          : "transparent"
                        : pathname.startsWith(section.id)
                        ? "#252836"
                        : "transparent",
                    borderRadius:
                      section.id === "/"
                        ? pathname === "/"
                          ? "0.5rem 0 0 0.5rem"
                          : "0"
                        : pathname.startsWith(section.id)
                        ? "0.5rem 0 0 0.5rem"
                        : "0",
                  }}
                >
                  <Box
                    sx={{
                      padding: "5px 3px 5px 5px",
                      borderRadius: "0.5rem",
                      background:
                        section.id === "/"
                          ? pathname === "/"
                            ? "#69EAE2"
                            : "transparent"
                          : pathname.startsWith(section.id)
                          ? "#69EAE2"
                          : "transparent",
                      boxShadow:
                        section.id === "/"
                          ? pathname === "/"
                            ? " 0px 8px 24px 0px rgba(105, 234, 226, 0.34)"
                            : "0"
                          : pathname.startsWith(section.id)
                          ? " 0px 8px 24px 0px rgba(105, 234, 226, 0.34)"
                          : "0",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: section.section === "CAJA" ? "12px" : "20px",
                        justifyContent: "center",
                        paddingLeft: "8px",
                      }}
                    >
                      <Box component={"img"} src={section.icon} />
                    </ListItemIcon>
                  </Box>
                  <ListItemText
                    primary={section.section}
                    primaryTypographyProps={{
                      color: "#69EAE2",
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
            </Box>
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

{
  /* {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{
                  opacity: open ? 1 : 0,
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))} */
}
