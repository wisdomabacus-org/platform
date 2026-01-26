import { create } from 'zustand';

interface UsersUiState {
  registerOpen: boolean;
  openRegister: () => void;
  closeRegister: () => void;
  setRegisterOpen: (open: boolean) => void;
}

export const useUsersUiStore = create<UsersUiState>((set) => ({
  registerOpen: false,
  openRegister: () => set({ registerOpen: true }),
  closeRegister: () => set({ registerOpen: false }),
  setRegisterOpen: (registerOpen) => set({ registerOpen }),
}));
