import { useCallback, useState } from "react";

export const useFetchItem = (fetchFunction) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItem = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFunction(...args);
      setItem(res);
    } catch (err) {
      setError(err.response?.data?.message || "Error cargando el registro");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  return {
    // estados
    item,
    loading,
    error,

    // acciones
    fetchItem
  };
}
