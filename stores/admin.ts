import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AdminState = {
  adminToken: string | null;
  profile: { id: string; name: string } | null;
  setAuth: (token: string, profile: { id: string; name: string }) => void;
  signOut: () => void;
};

export const useAdminStore = create(
  persist<AdminState>(
    (set) => ({
      adminToken: null,
      profile: null,
      setAuth: (token, profile) => set({ adminToken: token, profile }),
      signOut: () => set({ adminToken: null, profile: null }),
    }),
    { name: "admin-auth", storage: createJSONStorage(() => localStorage) }
  )
);
