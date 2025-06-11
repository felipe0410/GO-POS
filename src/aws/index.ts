import { fetchAuthSession, getCurrentUser, signIn } from "@aws-amplify/auth";

/**
 * Realiza login automático con Cognito y asigna nueva contraseña si es necesaria.
 */
export async function signInWithCognito() {
  try {
    const existingUser = await getCurrentUser();
    if (existingUser) {
      console.log("🟢 Ya hay usuario autenticado:", existingUser.username);
      return { success: true, message: "Ya autenticado", user: existingUser };
    }
  } catch (e) {
    console.log("ℹ️ No hay usuario activo, continuando con login...");
  }

  try {
    const user = await signIn({
      username: "admin@go-pos.com",
      password: process.env.NEXT_PUBLIC_PASSWORD_COGNITO!,
    });

    if (user.nextStep.signInStep === "DONE") {
      return { success: true, message: "Inicio de sesión exitoso", user };
    }

    return {
      success: false,
      message: "Paso adicional requerido",
      nextStep: user.nextStep,
    };
  } catch (error) {
    console.error("❌ Error en login Cognito:", error);
    return { success: false, message: "Error al iniciar sesión", error };
  }
}

/**
 * Verifica si el token actual está expirado.
 */
async function isTokenExpired(idToken: string): Promise<boolean> {
  try {
    const [, payloadBase64] = idToken.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.error("⚠️ Error al verificar expiración del token:", error);
    return true; // Asumimos expirado si falla la verificación
  }
}

/**
 * Obtiene el token ID de Cognito. Si no hay sesión o está expirada, intenta renovarla.
 */
export async function getCognitoIdToken(): Promise<string | null> {
  try {
    const { tokens } = await fetchAuthSession();
    const idToken = tokens?.idToken?.toString();

    if (idToken && !(await isTokenExpired(idToken))) {
      return idToken;
    }

    console.warn("🔄 Token expirado o ausente. Renovando sesión...");
    await signInWithCognito();

    // Reintenta obtener el token después del login
    const session = await fetchAuthSession();
    const newIdToken = session.tokens?.idToken?.toString();

    if (!newIdToken) throw new Error("No se pudo obtener un nuevo token");

    return newIdToken;
  } catch (err) {
    console.error("❌ Error obteniendo o renovando el idToken:", err);
    return null;
  }
}
