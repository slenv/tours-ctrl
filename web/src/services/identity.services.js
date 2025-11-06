import api from "./api";

export const byDni = async (dni) => {
  const { data } = await api.get(`identity/dni/${dni}`);
  return data;
}

export const byCe = async (ce) => {
  const { data } = await api.get(`identity/ce/${ce}`);
  return data;
}

export const byRuc = async (ruc) => {
  const { data } = await api.get(`identity/ruc/${ruc}`);
  return data;
}