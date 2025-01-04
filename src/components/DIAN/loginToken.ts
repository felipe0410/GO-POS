import axios from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL_MATIAS_API + "/auth/login",
      {
        email,
        password,
        remember_me: 0,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};
