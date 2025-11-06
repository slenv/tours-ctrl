import { login, logout, me } from "@/services/auth.services";
import { useAuthStore } from "@/store/auth.store";

export const loginAction = async (credentials) => {
  const { setToken, setUser, setLoading, setError } = useAuthStore.getState();
  setLoading(true);
  setError(null);

  try {
    const token = await login(credentials);
    setToken(token);
    const user = await me();
    setUser(user);
  } catch (err) {
    setError(err.response?.data?.message || "Error iniciando sesión");
  } finally {
    setLoading(false);
  }
}

export const bootstrapUserAction = async () => {
  const { token, setUser, setLoading } = useAuthStore.getState();
  if (!token) return;
  setLoading(true);
  try {
    const user = await me();
    setUser(user);
  } catch {
    await logoutAction();
  } finally {
    setLoading(false);
  }
}

export const logoutAction = async () => {
  await logout();
  useAuthStore.getState().reset();
}