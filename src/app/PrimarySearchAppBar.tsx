import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Stack,
  Drawer,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import { getEstablishmentDataLoggin } from "@/firebase";
import SidebarBox from "./SidebarBox";

// Definir el tema oscuro con el color base #1F1D2B
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1F1D2B",
      paper: "#282636",
    },
    primary: {
      main: "#1F1D2B",
    },
    secondary: {
      main: "#FFC107",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0BEC5",
    },
    error: {
      main: "#FF5252",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h6: { fontSize: "1.25rem", fontWeight: 500 },
    body2: { fontSize: "0.875rem" },
  },
});

interface UserData {
  name: string;
  direction: string;
  img: string;
  email: string;
}

interface EstablishmentData {
  img: string;
  jobs: string[];
  mail: string;
  name: string;
  status: string;
  uid: string;
  uidEstablishments: string;
}

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [establishmentData, setEstablishmentData] = useState<
    EstablishmentData | any
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = localStorage.getItem("establishmentData");

      if (cachedData) {
        setEstablishmentData(JSON.parse(cachedData));
      } else {
        const encodedUserUID = localStorage.getItem("user");
        if (!encodedUserUID) {
          console.error("No se encontró UID en el localStorage");
          return;
        }

        // Decodificar el UID de Base64
        let userUID: string;
        try {
          userUID = atob(encodedUserUID);
        } catch (error) {
          console.error("Error al decodificar el UID de Base64:", error);
          return;
        }

        const data = await getEstablishmentDataLoggin(userUID);
        if (data) {
          const { password, ...filteredData } = data; // Excluye datos sensibles
          localStorage.setItem(
            "establishmentData",
            JSON.stringify(filteredData)
          );
          setEstablishmentData(filteredData);
        }
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, width: "80%" }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
              {establishmentData?.name ?? "SIN DATA"}
            </IconButton>
            {userData && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={userData.img} alt={userData.name} />
                <Box>
                  <Typography variant="h6" noWrap>
                    {establishmentData.name}
                  </Typography>
                  <Typography variant="body2">{userData.direction}</Typography>
                </Box>
              </Stack>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleSidebar}
              sx={{
                "&:hover": { backgroundColor: "#FFB300" },
              }}
            >
              Abrir Caja
            </Button>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
            <Drawer anchor="right" open={sidebarOpen} onClose={toggleSidebar}>
              <SidebarBox
                onClose={toggleSidebar}
                isOpeningCaja={false}
                establecimiento={undefined}
                cajaData={undefined}
              />
            </Drawer>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
