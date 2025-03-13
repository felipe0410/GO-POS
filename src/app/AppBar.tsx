import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { getUltimaCaja, getEstablishmentData } from "@/firebase";
import { usePathname } from "next/navigation";
import { Button, Drawer } from "@mui/material";
import SidebarBox from "./SidebarBox";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { format } from "date-fns";

// Definimos la interfaz para los datos del establecimiento
interface EstablishmentData {
  direction: string;
  NIT_CC: string;
  email: string;
  password: string;
  name: string;
  rol: string;
  descriptionEstablishment: string;
  uid: string;
  Prefijo: string;
  phone: string;
  RangoFin: string;
  nameEstablishment: string;
  Resolucion: string;
  RangoInicio: string;
  img: string;
}

export default function HeaderAppBar() {
  const pathname = usePathname();
  const [establishment, setEstablishment] = useState<EstablishmentData | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cierreCajaActual, setCierreCajaActual] = useState<any | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data: any = await getEstablishmentData();
        setEstablishment(data);
        const cierreCaja = await getUltimaCaja();
        setCierreCajaActual(cierreCaja);
      } catch (error) {
        console.error("Error al obtener datos del establecimiento:", error);
      }
    };
    getData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="absolute"
        sx={{ zIndex: "auto", background: "#1f1d2b" }}
      >
        <Toolbar id="Toolbar" sx={{ display: "flex", paddingX: 2 }}>
          <Box
            sx={{
              margin: "0 auto",
              width: "75%",
            }}
          >
            <Box sx={{ display: "flex", width: "86%" }}>
              {establishment?.img && (
                <Avatar
                  variant="rounded"
                  alt={establishment.nameEstablishment}
                  src={establishment.img}
                  sx={{
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                />
              )}
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {establishment?.nameEstablishment ?? "Cargando..."}
              </Typography>
              <Button
                variant="contained"
                onClick={toggleSidebar}
                startIcon={<PointOfSaleIcon />}
                sx={{
                  background: "#69EAE2",
                  color: "#000",
                  fontWeight: 900,
                  "&:hover": { filter: "grayscale(1)" },
                }}
              >
                {cierreCajaActual ? "Cerrar Caja" : "Abrir Caja"}
              </Button>
            </Box>
          </Box>
          <Drawer anchor="right" open={sidebarOpen} onClose={toggleSidebar}>
            <SidebarBox
              onClose={toggleSidebar}
              isOpeningCaja={!cierreCajaActual}
              establecimiento={undefined}
              cajaData={cierreCajaActual}
            />
          </Drawer>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
