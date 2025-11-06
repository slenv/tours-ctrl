import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: btoa('auth-storage'),
      partialize: (state) => ({ tk: state.token }),
      merge: (persistedState, currentState) => ({ ...currentState, token: persistedState.tk }),
    }
  )
);