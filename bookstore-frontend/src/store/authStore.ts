import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  email: string | null;
  setToken: (token: string) => void;
  setEmail: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      setToken: (token) => set({ token }),
      setEmail: (email) => set({ email }),
      logout: () => set({ token: null, email: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);