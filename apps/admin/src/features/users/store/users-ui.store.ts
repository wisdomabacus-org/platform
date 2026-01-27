import { create } from 'zustand';

interface UsersUiState {
  registerOpen: boolean;
  importOpen: boolean;
  openRegister: () => void;
  closeRegister: () => void;
  setRegisterOpen: (open: boolean) => void;
  openImport: () => void;
  closeImport: () => void;
  setImportOpen: (open: boolean) => void;
}

export const useUsersUiStore = create<UsersUiState>((set) => ({
  registerOpen: false,
  importOpen: false,
  openRegister: () => set({ registerOpen: true }),
  closeRegister: () => set({ registerOpen: false }),
  setRegisterOpen: (registerOpen) => set({ registerOpen }),
  openImport: () => set({ importOpen: true }),
  closeImport: () => set({ importOpen: false }),
  setImportOpen: (importOpen) => set({ importOpen }),
}));
