import { useCallback, useState } from "react";

export const useAction = (actionFunction, { onSuccess } = {}) => {
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const handleAction = useCallback(async (...args) => {
    setLoading(true);
    try {
      const { message, ...data } = await actionFunction(...args);
      onSuccess?.(data);
      setSuccessCount(prev => prev + 1);
      return message || 'Acción realizada correctamente';
    } catch (err) {
      setFailedCount(prev => prev + 1);
      throw new Error(err?.response?.data?.message || 'Error procesando la acción');
    } finally {
      setLoading(false);
    }
  }, [actionFunction, onSuccess]);

  return { handleAction, loading, successCount, failedCount };
}
