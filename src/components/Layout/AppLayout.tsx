import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Box, AppBar, Toolbar, IconButton, Typography, Badge } from '@mui/material';
import { Menu as MenuIcon, ShoppingCart as CartIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useUI, useCart as useCartStore } from '@/store/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import { CartSidebar } from '@/components/Cart/CartSidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { UI_CONFIG } from '@/config/constants';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setCurrentModule } = useUI();
  const { getCartItemCount } = useCartStore();
  const { isAuthenticated, checkAuthRedirect } = useAuth();
  
  const [cartOpen, setCartOpen] = React.useState(false);
  const cartItemCount = getCartItemCount();

  // Verificar autenticación y redireccionar si es necesario
  useEffect(() => {
    checkAuthRedirect(pathname);
  }, [pathname, checkAuthRedirect]);

  // Actualizar módulo actual basado en la ruta
  useEffect(() => {
    const currentModule = pathname.split('/')[1] || 'home';
    setCurrentModule(currentModule);
  }, [pathname, setCurrentModule]);

  // No mostrar layout en páginas de autenticación
  if (!isAuthenticated && (pathname === '/sign_in' || pathname === '/sign_up')) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  // No mostrar layout si no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            boxShadow: `0px 1px 10px -5px ${UI_CONFIG.theme.colors.primary}`,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleSidebar}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: UI_CONFIG.theme.fonts.primary,
                fontWeight: 700,
                color: UI_CONFIG.theme.colors.primary,
              }}
            >
              GO-POS
            </Typography>

            {/* Botón de carrito */}
            <IconButton
              color="inherit"
              onClick={() => setCartOpen(true)}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <CartIcon />
              </Badge>
            </IconButton>

            {/* Notificaciones */}
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 8, // Espacio para el AppBar
            backgroundColor: UI_CONFIG.theme.colors.secondary,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>

        {/* Sidebar del carrito */}
        <CartSidebar
          open={cartOpen}
          onClose={() => setCartOpen(false)}
        />
      </Box>
    </ErrorBoundary>
  );
};