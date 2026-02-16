import { create } from "zustand";
import { MOCK_USERS } from "../constants/mockData";
import { User } from "../types";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      let user: User | null = null;

      if (email === "admin@laundry.com" && password === "admin123") {
        user = MOCK_USERS.admin;
      } else if (email === "client@laundry.com" && password === "client123") {
        user = MOCK_USERS.client;
      } else {
        throw new Error("Email atau password salah");
      }

      set({ user, isLoggedIn: true, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login gagal";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isLoggedIn: false, error: null });
  },

  setUser: (user: User | null) => {
    set({ user, isLoggedIn: user !== null });
  },
}));
