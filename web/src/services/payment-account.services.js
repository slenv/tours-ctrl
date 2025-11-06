import api from "./api";

export const fetchAllPaymentAccounts = async () => {
  const { data } = await api.get('/payment-accounts/all');
  return data;
}

export const fetchTrashedPaymentAccounts = async () => {
  const { data } = await api.get('/payment-accounts/trashed');
  return data;
}

export const savePaymentAccount = async (payload) => {
  const { data } = await api.post('/payment-accounts', payload);
  return data;
}

export const deletePaymentAccount = async (id) => {
  const { data } = await api.delete(`/payment-accounts/${id}`);
  return data;
}

export const restorePaymentAccounts = async (ids) => {
  const { data } = await api.patch('/payment-accounts/restore', { ids });
  return data;
}

export const togglePaymentAccountStatus = async (id) => {
  const { data } = await api.patch(`/payment-accounts/${id}/toggle-status`);
  return data;
}

export const uploadPaymentAccountQr = async (id, file) => {
  const formData = new FormData();
  formData.append('qr', file);
  const { data } = await api.post(`/payment-accounts/${id}/upload-qr`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

export const deletePaymentAccountQr = async (id) => {
  const { data } = await api.patch(`/payment-accounts/${id}/remove-qr`);
  return data;
}