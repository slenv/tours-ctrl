import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useModalStore = create(
  persist(
    (set, get) => ({
      modals: {},

      getModalStatus: (key) => Boolean(get().modals[key]),

      getModalData: (key) => get().modals[key],

      openModal: (key, data = true) => set((state) => ({
        modals: { ...state.modals, [key]: data },
      })),

      closeModal: (key) => set((state) => {
        const newModals = { ...state.modals };
        delete newModals[key];
        return { modals: newModals };
      }),
    }),
    { name: btoa("modal-storage") }
  )
);
