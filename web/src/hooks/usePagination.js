import { useState, useEffect, useCallback, useRef } from "react";

export const usePagination = (fetchFunction, options = {}) => {
  const { initialPerPage = 10, debounceDelay = 500 } = options;

  const [data, setData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState(null);

  const initialized = useRef(false);
  const debounceTimer = useRef(null);
  const lastFetchParams = useRef(null);

  const fetchData = useCallback(
    async (page = 1, search = "", itemsPerPage = perPage) => {
      const currentParams = JSON.stringify({ page, search, itemsPerPage });
      if (lastFetchParams.current === currentParams && loading) {
        return;
      }
      lastFetchParams.current = currentParams;

      setLoading(true);
      setError(null);

      try {
        const params = {
          page,
          per_page: itemsPerPage,
          search: search.trim() || undefined,
        };
        const res = await fetchFunction(params);

        setData(res.data || []);
        setTotalRows(res.total || 0);
        setCurrentPage(page);
      } catch (err) {
        setError("Error cargando los datos");
        setData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [fetchFunction, perPage, loading],
  );

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchData(1, "", perPage);
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setSearchTerm(searchInput);
        setCurrentPage(1);
        fetchData(1, searchInput, perPage);
      }
    }, debounceDelay);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    }
  }, [searchInput, debounceDelay]);

  const handlePageChange = useCallback(
    (page) => {
      if (page !== currentPage && !loading) {
        fetchData(page, searchTerm, perPage);
      }
    },
    [currentPage, searchTerm, perPage, loading],
  );

  const handlePerRowsChange = useCallback(
    (newPerPage, page) => {
      if (newPerPage !== perPage) {
        setPerPage(newPerPage);
        fetchData(page, searchTerm, newPerPage);
      }
    },
    [perPage, searchTerm],
  );

  const handleSearch = useCallback((value) => {
    setSearchInput(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
    fetchData(1, "", perPage);
  }, [perPage]);

  const handleRefresh = useCallback(() => {
    lastFetchParams.current = null;
    fetchData(currentPage, searchTerm, perPage);
  }, [currentPage, searchTerm, perPage]);

  const refetch = useCallback(
    (resetPage = false) => {
      const page = resetPage ? 1 : currentPage;
      if (resetPage) {
        setCurrentPage(1);
      }
      lastFetchParams.current = null;
      fetchData(page, searchTerm, perPage);
    },
    [currentPage, searchTerm, perPage],
  );

  return {
    // estados
    data,
    initialLoading,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    searchInput,
    error,

    // acciones
    handlePageChange,
    handlePerRowsChange,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    refetch
  }
}
