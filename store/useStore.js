import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      cartId: null,
      trigger: new Date(),
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null,  cartId: null }),
      setCartId: (cartId) => set({ cartId }),

      setTrigger:(date) => set({trigger:date}),

      // Helper to attack token to axios globally
      setupAxios: () => {
        const token = get().token;
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer $token`;
        } else {
          delete axios.defaults.headers.common["Authorization"];
        }
      },

      // Load current user (optional: verify token)
      async loadUser() {
        const token = get().token;
        if (!token) return;
        try {
          const res = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: res.data });
        } catch {
          set({ user: null, token: null });
        }
      },

     
    }),
    {
      name: "ecommerce-store", // localStorage key
      onRehydrateStorage: () => (state) => {
        if (state) state.setupAxios(); // reattach token after reload
      },
    }
  )
);
