import api from "./api";

export const paginateCustomers = async (params = { search, page, per_page }) => {
  const { data } = await api.get('/customers', { params });
  return data;
}

export const fetchTrashedCustomers = async () => {
  const { data } = await api.get('/customers/trashed');
  return data;
}

export const saveCustomer = async (payload) => {
  const { data } = await api.post('/customers', payload);
  return data;
}

export const deleteCustomer = async (id) => {
  const { data } = await api.delete(`/customers/${id}`);
  return data;
}

export const restoreCustomers = async (ids) => {
  const { data } = await api.patch('/customers/restore', { ids });
  return data;
}