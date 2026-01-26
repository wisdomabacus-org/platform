import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Admin } from '../types/auth.types';

interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  setAdmin: (admin: Admin | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),
      clearAuth: () => set({ admin: null, isAuthenticated: false }),
    }),
    {
      name: 'wisdom-admin-auth',
    }
  )
);
