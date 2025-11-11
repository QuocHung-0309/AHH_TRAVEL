// /stores/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  token: { accessToken: string | null; refreshToken: string | null };
  userId: string | null;
  setUserId: (id: string | null) => void;
  setToken: (t: { accessToken: string | null; refreshToken: string | null }) => void; // ✅ thêm
  setTokenPartial: (t: Partial<{ accessToken: string | null; refreshToken: string | null }>) => void;
  resetAuth: () => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      token: { accessToken: null, refreshToken: null },
      userId: null,

      setUserId: (id) => set({ userId: id }),

      setToken: (t) => set({ token: t }), // ✅ full-set

      setTokenPartial: (t) =>
        set({ token: { ...get().token, ...t } }),

      resetAuth: () =>
        set({ token: { accessToken: null, refreshToken: null }, userId: null }),
    }),
    { name: "auth", storage: createJSONStorage(() => localStorage) }
  )
);
