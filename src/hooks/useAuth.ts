import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useAuthStore } from '@/store/useAppStore';
import { useAsyncOperation } from './useAsyncOperation';
import { useNotification } from './useNotification';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export function useAuth() {
  const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore();
  const { success, error: notifyError, handleAsyncError } = useNotification();
  const router = useRouter();

  // Operaciones de autenticación
  const loginOperation = useAsyncOperation(async ({ email, password }: { email: string; password: string }) => {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  });

  const registerOperation = useAsyncOperation(async ({ email, password }: { email: string; password: string }) => {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const base64String = storedUser.replace(/%3D/g, '=');
          const decodedString = atob(base64String);
          
          if (decodedString) {
            setUser({
              id: decodedString,
              email: '', // Se puede obtener de Firebase Auth si es necesario
              establishmentId: decodedString,
            });
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('user');
      }
    };

    checkAuth();
  }, [setUser]);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const firebaseUser = await loginOperation.execute({ email, password });
      
      // Crear objeto de usuario
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        establishmentId: firebaseUser.uid,
        name: firebaseUser.displayName || undefined,
      };

      // Guardar en store y localStorage
      setUser(userData);
      const encodedUser = btoa(firebaseUser.uid);
      localStorage.setItem('user', encodedUser);

      success('Inicio de sesión exitoso');
      router.push('/home');
      
      return userData;
    } catch (error) {
      handleAsyncError(error as Error, 'Error al iniciar sesión');
      throw error;
    }
  }, [loginOperation, setUser, success, handleAsyncError, router]);

  // Register
  const register = useCallback(async (email: string, password: string) => {
    try {
      const firebaseUser = await registerOperation.execute({ email, password });
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        establishmentId: firebaseUser.uid,
        name: firebaseUser.displayName || undefined,
      };

      setUser(userData);
      const encodedUser = btoa(firebaseUser.uid);
      localStorage.setItem('user', encodedUser);

      success('Registro exitoso');
      router.push('/home');
      
      return userData;
    } catch (error) {
      handleAsyncError(error as Error, 'Error al registrarse');
      throw error;
    }
  }, [registerOperation, setUser, success, handleAsyncError, router]);

  // Logout
  const logout = useCallback(async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      
      logoutStore();
      success('Sesión cerrada exitosamente');
      router.push('/sign_in');
    } catch (error) {
      handleAsyncError(error as Error, 'Error al cerrar sesión');
    }
  }, [logoutStore, success, handleAsyncError, router]);

  // Verificar si el usuario tiene permisos para una acción
  const hasPermission = useCallback((action: string) => {
    if (!isAuthenticated) return false;
    
    // Aquí puedes implementar lógica de permisos más compleja
    // Por ahora, todos los usuarios autenticados tienen todos los permisos
    return true;
  }, [isAuthenticated]);

  // Obtener ID del establecimiento actual
  const getCurrentEstablishmentId = useCallback(() => {
    return user?.establishmentId || null;
  }, [user]);

  // Verificar si necesita redirección
  const checkAuthRedirect = useCallback((currentPath: string) => {
    if (!isAuthenticated && currentPath !== '/sign_in' && currentPath !== '/sign_up') {
      router.push('/sign_in');
      return true;
    }
    
    if (isAuthenticated && (currentPath === '/sign_in' || currentPath === '/sign_up')) {
      router.push('/home');
      return true;
    }
    
    return false;
  }, [isAuthenticated, router]);

  return {
    // Estado
    user,
    isAuthenticated,
    loading: loginOperation.loading || registerOperation.loading,
    error: loginOperation.error || registerOperation.error,
    
    // Operaciones
    login,
    register,
    logout,
    
    // Utilidades
    hasPermission,
    getCurrentEstablishmentId,
    checkAuthRedirect,
    
    // Estados específicos
    loggingIn: loginOperation.loading,
    registering: registerOperation.loading,
  };
}