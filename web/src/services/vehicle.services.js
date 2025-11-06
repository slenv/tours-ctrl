import api from "./api";

export const fetchAllVehicles = async () => {
  const { data } = await api.get('/vehicles/all');
  return data;
}

export const fetchTrashedVehicles = async () => {
  const { data } = await api.get('/vehicles/trashed');
  return data;
}

export const getVehicleByPlate = async (plate) => {
  const { data } = await api.get(`/vehicles?plate=${plate}`);
  return data;
}

export const saveVehicle = async (payload) => {
  const { data } = await api.post('/vehicles', payload);
  return data;
}