import { useCallback, useEffect, useState } from "react";

export const useFetchData = (fetchFunction) => {
  const [data, setData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFunction();
      setData(res);
    } catch (err) {
      setError("Error cargando los datos");
      setData([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    // estados
    data,
    initialLoading,
    loading,
    total: data.length,
    error,

    // acciones
    refetch: fetchData,
  };
}
