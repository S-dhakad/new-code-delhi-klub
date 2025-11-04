import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setToken: (token: string) => void;
  login: (token: string) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      isAuthenticated: false,

      setToken: (token: string) => {
        localStorage.setItem('accessToken', token);
        set({
          accessToken: token,
          isAuthenticated: !!token,
        });
      },

      login: (token: string) => {
        localStorage.setItem('accessToken', token);
        set({
          accessToken: token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        set({
          accessToken: null,
          isAuthenticated: false,
        });
      },

      clearAuth: () => {
        localStorage.clear();
        set({
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
