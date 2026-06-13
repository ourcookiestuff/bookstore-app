import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  email: string | null;
  role: string | null;
  setToken: (token: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      role: null,
      setToken: (token) => set({ token }),
      setEmail: (email) => set({ email }),
      setRole: (role) => set({ role }),
      logout: () => set({ token: null, email: null, role: null }),
    }),
    { name: 'auth-storage' }
  )
);