"use client";
import NewProductImproved from "@/components/NewProductImproved";
import NewProductSidebar from "@/components/NewProductSidebar";
import { Box, Typography, Alert, Chip } from "@mui/material";
import ComponentModal from "./Modal";
import Header from "@/components/Header";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSettings } from "@/store/useAppStore";
import { UI_CONFIG } from "@/config/constants";

const Page = () => {
  const { settings } = useSettings();
  const revenueConfig = settings.revenue;

  return (
    <AppLayout>
      <ErrorBoundary>
        <Header title="INVENTARIO" />
        <Box sx={{ marginTop: "2rem", px: 2 }}>
          {/* Header Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                color: UI_CONFIG.theme.colors.text,
                fontFamily: UI_CONFIG.theme.fonts.secondary,
                fontSize: { xs: "16px", sm: "32px" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              AGREGAR NUEVO PRODUCTO
            </Typography>
            
            <Typography
              sx={{
                color: UI_CONFIG.theme.colors.text,
                fontFamily: UI_CONFIG.theme.fonts.primary,
                fontSize: { xs: "12px", sm: "16px" },
                fontWeight: 400,
                mb: 2,
              }}
            >
              Completa los campos para añadir nuevos productos a tu inventario con validación automática.
            </Typography>

            {/* Revenue Configuration Display */}
            {revenueConfig && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <Chip
                  label={`Ganancia configurada: ${revenueConfig.prefix}${revenueConfig.value}`}
                  sx={{
                    backgroundColor: UI_CONFIG.theme.colors.primary,
                    color: UI_CONFIG.theme.colors.secondary,
                    fontWeight: 600,
                  }}
                />
              </Box>
            )}

            {/* Info Alert */}
            <Alert 
              severity="info" 
              sx={{ 
                backgroundColor: UI_CONFIG.theme.colors.background,
                color: UI_CONFIG.theme.colors.text,
                '& .MuiAlert-icon': {
                  color: UI_CONFIG.theme.colors.primary,
                },
                mb: 2,
              }}
            >
              Nuevo: Validación automática, manejo de errores mejorado y notificaciones en tiempo real.
            </Alert>
          </Box>

          {/* Mobile Modal Button */}
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "flex-end",
              width: "100%",
              mb: 2,
            }}
          >
            <ComponentModal />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            {/* Product Form */}
            <Box sx={{ width: { xs: "100%", sm: "65%" } }}>
              <NewProductImproved />
            </Box>

            {/* Sidebar */}
            <Box
              id="NewProductSidebar"
              sx={{
                display: { xs: "none", sm: "block" },
                width: "35%",
                height: "100%",
              }}
            >
              <NewProductSidebar />
            </Box>
          </Box>
        </Box>
      </ErrorBoundary>
    </AppLayout>
  );
};

export default Page;
