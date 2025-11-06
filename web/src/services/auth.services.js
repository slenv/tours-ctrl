import api from "@/services/api";

export const login = async (payload = { username, password }) => {
  const { data } = await api.post('/auth/login', payload);
  return data.token;
}

export const me = async () => {
  const { data } = await api.get('/auth/me');
  return data;
}

export const refresh = async () => {
  const { data } = await api.get('/auth/refresh');
  return data.token;
}

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (error) {
    return true;
  }
}